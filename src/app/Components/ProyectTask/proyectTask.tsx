"use client"

import { useState, useEffect, useCallback, type ChangeEvent, type FormEvent } from "react"
import { DndContext, type DragEndEvent, closestCorners } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSensors, useSensor, PointerSensor } from "@dnd-kit/core"
import { agregarTarea, eliminarTarea, modificarStatusTarea, eliminarProyecto, agregarProyecto } from "@/backend/actions/taskActions"
import { X } from "lucide-react"
import { Input } from "../ui/input"
import Textarea from "../ui/textarea"
import Select from "../ui/select"
import { Button } from "../ui/button"
import toast from "react-hot-toast"
import SortableItem from "../SortableItem/sortableItem"
import type { Task, Project } from "../types"
import { Card } from "../ui/card"

type Priority = "Baja" | "Media" | "Alta"
type Status = "Pendiente" | "En progreso" | "Terminado"

interface NewTask {
  title: string
  description: string
  status: Status
  priority: Priority
  dueDate: string
}

const PRIORITY_OPTIONS = {
  BAJA: "Baja",
  MEDIA: "Media",
  ALTA: "Alta",
} as const

const STATUS_OPTIONS = {
  PENDIENTE: "Pendiente",
  EN_PROGRESO: "En progreso",
  TERMINADO: "Terminado",
} as const

function arrayMove<T>(array: T[], from: number, to: number) {
  const newArray = array.slice()
  newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0])
  return newArray
}

export default function ProjectTasks({
  project,
  tasks: initialTasks,
}: {
  project: Project
  tasks: Task[]
}) {
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
});
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
    priority: PRIORITY_OPTIONS.BAJA,
    status: STATUS_OPTIONS.PENDIENTE,
    dueDate: "",
  })
  const [isLoading, setIsLoading] = useState({
    adding: false,
    deleting: null as number | null,
    deletingProject: false,
  })

  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )
  const handleProjectInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewProject((prev) => ({ ...prev, [name]: value }));
    },
    []
);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setNewTask((prev) => ({ ...prev, [name]: value }))
    },
    [],
  )

  const handleAddProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) {
        toast.error("El nombre del proyecto es requerido");
        return;
    }

    setIsLoading((prev) => ({ ...prev, addingProject: true }));
    try {
        const formData = new FormData();
        formData.append("name", newProject.name);
        formData.append("description", newProject.description);

        const savedProject = await agregarProyecto(formData);
        if (savedProject.success && savedProject.data) {
            setNewProject({ name: "", description: "" });
            toast.success("Proyecto creado correctamente");
        }
    } catch (error) {
        console.error("Error al crear el proyecto:", error);
        toast.error("No se pudo crear el proyecto");
    } finally {
        setIsLoading((prev) => ({ ...prev, addingProject: false }));
    }
};

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) {
      toast.error("El título es requerido")
      return
    }

    setIsLoading((prev) => ({ ...prev, adding: true }))
    try {
      const formData = new FormData()
      formData.append("title", newTask.title)
      formData.append("description", newTask.description)
      formData.append("priority", newTask.priority)
      formData.append("dueDate", newTask.dueDate)
      formData.append("projectId", project.id.toString())

      const savedTask = await agregarTarea(formData)
      if (savedTask.success && savedTask.data) {
        setTasks((prev) => [...prev, savedTask.data as Task])
        setNewTask({
          title: "",
          description: "",
          priority: PRIORITY_OPTIONS.BAJA,
          status: STATUS_OPTIONS.PENDIENTE,
          dueDate: "",
        })
        toast.success("Tarea añadida correctamente")
      }
    } catch (error) {
      console.error("Error al añadir tarea:", error)
      toast.error("No se pudo añadir la tarea")
    } finally {
      setIsLoading((prev) => ({ ...prev, adding: false }))
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    console.log("Drag ended:", { active, over })
    if (!over) return

    const activeTask = tasks.find((task) => task.id === active.id)
    const overTask = tasks.find((task) => task.id === over.id)
    console.log("Tasks:", { activeTask, overTask })

    if (!activeTask || !overTask) return

    if (activeTask.status !== overTask.status) {
      console.log("Updating task status:", { from: activeTask.status, to: overTask.status })
      setTasks((tasks) =>
        tasks.map((task) => (task.id === activeTask.id ? { ...task, status: overTask.status } : task)),
      )

      // Create a FormData object with the correct data
      const formData = new FormData()
      formData.append("taskId", activeTask.id.toString())
      formData.append("status", overTask.status || "")

      // Call modificarStatusTarea with the FormData object
      modificarStatusTarea(formData).then((result) => {
        console.log("Status update result:", result)
      })
    }

    setTasks((tasks) => {
      const oldIndex = tasks.findIndex((task) => task.id === active.id)
      const newIndex = tasks.findIndex((task) => task.id === over.id)
      return arrayMove(tasks, oldIndex, newIndex)
    })
  }

  const handleDeleteTask = useCallback(async (taskId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      return
    }

    setIsLoading((prev) => ({ ...prev, deleting: taskId }))
    try {
      const response = await eliminarTarea(taskId)
      if (response.success) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId))
        toast.success("Tarea eliminada correctamente")
      }
    } catch (error) {
      toast.error("Error al eliminar la tarea")
    } finally {
      setIsLoading((prev) => ({ ...prev, deleting: null }))
    }
  }, [])

  const handleDeleteProject = useCallback(async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
      return
    }

    setIsLoading((prev) => ({ ...prev, deletingProject: true }))
    try {
      const response = await eliminarProyecto(project.id)
      if (response.success) {
        setTasks([])
        toast.success("Proyecto eliminado correctamente")
      }
    } catch (error) {
      toast.error("Error al eliminar el proyecto")
    } finally {
      setIsLoading((prev) => ({ ...prev, deletingProject: false }))
    }
  }, [project.id])

  return (
    <div className="p-4 border rounded-lg shadow-lg relative dark:border-gray-700">
     
        <Card > 
        <div className="p-4 border rounded-lg shadow-md flex flex-col gap-4 bg-gray-100 dark:bg-gray-800">
                <h3 className="text-lg font-bold">Crear Nuevo Proyecto</h3>
                <form onSubmit={handleAddProject} className="flex flex-col gap-2">
                    <Input
                        type="text"
                        name="name"
                        placeholder="Nombre del proyecto"
                        value={newProject.name}
                        onChange={handleProjectInputChange}
                        required
                    />
                    <Textarea
                        name="description"
                        placeholder="Descripción"
                        value={newProject.description}
                        onChange={handleProjectInputChange}
                    />
                    <button type="submit" disabled={isLoading.addingProject}>
                        {isLoading.addingProject ? "Creando..." : "Crear Proyecto"}
                    </button>
                </form>
            </div>
        </Card>
      
      <button
        className="absolute top-2 right-2 text-red-500 disabled:opacity-50"
        onClick={handleDeleteProject}
        disabled={isLoading.deletingProject}
      >
        <X />
      </button>

      <h2 className="text-2xl font-bold">{project.name}</h2>

     

      <form
        onSubmit={handleAddTask}
        className="p-4 border rounded-lg shadow-md flex flex-col gap-4 dark:border-gray-700"
      >
        <Input
          type="text"
          name="title"
          placeholder="Título de la tarea"
          value={newTask.title}
          onChange={handleInputChange}
          required
          disabled={isLoading.adding}
        />
        <Textarea
          name="description"
          placeholder="Descripción"
          value={newTask.description}
          onChange={handleInputChange}
          disabled={isLoading.adding}
        />
        <Select name="priority" value={newTask.priority} onChange={handleInputChange} disabled={isLoading.adding}>
          <option value={PRIORITY_OPTIONS.BAJA}>Baja</option>
          <option value={PRIORITY_OPTIONS.MEDIA}>Media</option>
          <option value={PRIORITY_OPTIONS.ALTA}>Alta</option>
        </Select>
        <Select 
  name="status" 
  value={newTask.status} 
  onChange={handleInputChange} 
  disabled={isLoading.adding}
>
  {Object.values(STATUS_OPTIONS).map((status) => (
    <option key={status} value={status}>
      {status}
    </option>
  ))}
</Select>
        <Input
          type="date"
          name="dueDate"
          value={newTask.dueDate}
          onChange={handleInputChange}
          required
          disabled={isLoading.adding}
        />
        <Button type="submit" disabled={isLoading.adding}>
          {isLoading.adding ? "Añadiendo..." : "Añadir"}
        </Button>
      </form>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {Object.values(STATUS_OPTIONS).map((status) => (
            <div key={status} id={status} className="border rounded-lg p-4 shadow-md dark:border-gray-700">
              <h2 className="text-lg font-bold">{status}</h2>
              <SortableContext
                items={tasks.filter((task) => task.status === status).map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task) => (
                      <SortableItem key={task.id} id={task.id} task={task} onDelete={handleDeleteTask} />
                    ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  )
}

