"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Task } from "../types"
import { X } from "lucide-react"

interface SortableItemProps {
  id: number
  task: Task
  onDelete: (id: number) => void
}

export default function SortableItem({ id, task, onDelete }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    data: { type: "Task", status: task.status },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const fecha = task.dueDate
  ? new Date(task.dueDate).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
  : "Sin fecha";
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="p-3 border rounded-lg shadow bg-white dark:bg-gray-800"
    >
      <div className="flex justify-between">
        <h4>{task.title}</h4>
        <button onClick={() => onDelete(id)} className="text-red-500">
          <X />
        </button>
      </div>
      <p className="text-sm text-gray-600">{task.description}</p>
      <p className="text-sm text-gray-600"> Fecha de vencimiento: {fecha}</p>
      <span
        className={`text-xs px-2 py-1 rounded text-white ${
          task.priority === "Alta" 
          ? "bg-red-500" 
          : task.priority === "Media" 
          ? "bg-yellow-500" 
          : "bg-green-500"
        }`}
      >
        {task.priority}
      </span>
    </div>
  )
}




