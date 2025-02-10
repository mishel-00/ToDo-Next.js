'use client';

import { useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSensors, useSensor, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { modificarStatusTarea, eliminarTarea, agregarTarea } from "@/backend/actions/taskActions";
import { Task } from "../types";
import { Input } from "../ui/input";
import Textarea from "../ui/textarea";
import Select from "../ui/select";
import { Button } from "../ui/button";
import SortableItem from "../SortableItem/sortableItem";


interface ProjectTasksProps {
  tasks: Task[];
  projectId: number;
}

export default function ProjectTasks({ tasks: initialTasks, projectId }: ProjectTasksProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "baja",
    startDate: new Date().toISOString().split("T")[0], // Fecha actual por defecto
    dueDate: "",
    image: null as File | null,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewTask((prev) => ({ ...prev, image: file }));
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const formData = new FormData();
    formData.append("title", newTask.title);
    formData.append("description", newTask.description);
    formData.append("priority", newTask.priority);
    formData.append("startDate", newTask.startDate);
    formData.append("dueDate", newTask.dueDate);
    formData.append("projectId", projectId.toString());
    if (newTask.image) {
      formData.append("image", newTask.image);
    }

    const savedTask = await agregarTarea(formData);
    if (savedTask.success && savedTask.data) {
      setTasks((prev) => [...prev, savedTask.data as Task]);
      setNewTask({ title: "", description: "", priority: "baja", startDate: new Date().toISOString().split("T")[0], dueDate: "", image: null });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = Number(active.id);
    const overId = String(over.id);

    setTasks((prev) => {
      return prev.map((task) => (task.id === activeId ? { ...task, status: overId } : task));
    });

    await modificarStatusTarea(activeId, overId);
  };

  const handleDeleteTask = async (taskId: number) => {
    const response = await eliminarTarea(taskId);
    if (response.success) {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } else {
      console.error("Error eliminando tarea", response.error);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md dark:border-gray-700">
      {/* Formulario para agregar tarea */}
      <form onSubmit={handleAddTask} className="mb-4 flex flex-col gap-2">
        <Input
          type="text"
          name="title"
          placeholder="Título de la tarea"
          value={newTask.title}
          onChange={handleInputChange}
        />
        <Textarea
          name="description"
          placeholder="Descripción"
          value={newTask.description}
          onChange={handleInputChange}
        />
        <Select name="priority" value={newTask.priority} onChange={handleInputChange}>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </Select>
        <Input type="date" name="startDate" value={newTask.startDate} onChange={handleInputChange} readOnly />
        <Input type="date" name="dueDate" placeholder="Fecha de vencimiento" value={newTask.dueDate} onChange={handleInputChange} />
        <Input type="file" onChange={handleFileChange} />
        <Button type="submit">Añadir</Button>
      </form>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h2 className="text-lg font-bold">Pendiente</h2>
              {tasks.filter(task => task.status === "Pendiente").map(task => (
                <SortableItem key={task.id} id={task.id} task={task} containerId={task.status} onDelete={handleDeleteTask} />
              ))}
            </div>
            <div>
              <h2 className="text-lg font-bold">En progreso</h2>
              {tasks.filter(task => task.status === "En progreso").map(task => (
                <SortableItem key={task.id} id={task.id} task={task} containerId={task.status} onDelete={handleDeleteTask} />
              ))}
            </div>
            <div>
              <h2 className="text-lg font-bold">Terminado</h2>
              {tasks.filter(task => task.status === "Terminado").map(task => (
                <SortableItem key={task.id} id={task.id} task={task} containerId={task.status} onDelete={handleDeleteTask} />
              ))}
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}