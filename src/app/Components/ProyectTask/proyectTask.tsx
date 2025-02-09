"use client";

import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { modificarStatusTarea } from "@/backend/actions/taskActions";
import SortableItem from "../SortableItem/sortableItem";


interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority?: string | null;
  tags?: string;
  startDate?: Date | null;
  dueDate?: Date | null;
  projectid: number;
}

interface ProjectTasksProps {
  projectId: number;
  tasks: Task[];
}

export default function ProjectTasks({ projectId, tasks: initialTasks }: ProjectTasksProps) {
  const [tasks, setTasks] = useState(initialTasks);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setTasks((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      const movedTask = newItems[newIndex];
      const newStatus = over.data.current?.sortable?.containerId || movedTask.status;

      if (movedTask.status !== newStatus) {
        const formData = new FormData();
        formData.append("taskId", movedTask.id.toString());
        formData.append("status", newStatus);
        modificarStatusTarea(formData);

        newItems[newIndex] = { ...movedTask, status: newStatus };
      }

      return newItems;
    });
  };

  const statusColumns = ["Pendiente", "En progreso", "Terminado"];

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statusColumns.map((status) => (
          <div 
            key={status} 
            className="p-4 border rounded-lg dark:bg-gray-800/50 space-y-4"
          >
            <h3 className="text-lg font-semibold">{status}</h3>
            <SortableContext
              items={tasks.filter((task) => task.status === status).map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <SortableItem key={task.id} id={task.id} task={task} />
                  ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
}