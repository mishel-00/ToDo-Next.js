'use client';

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "../types";
import { X, Calendar } from "lucide-react";

interface SortableItemProps {
  id: number;
  task: Task;
  containerId: string;
  onDelete: (id: number) => void;
}

export default function SortableItem({ id, task, containerId, onDelete }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: { sortable: { containerId } },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="p-3 border rounded-lg shadow bg-gray-100 relative dark:bg-gray-800 dark:border-gray-600"
    >
      {/* Botón de eliminar */}
      <button
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        onClick={() => onDelete(id)}
      >
        <X size={16} />
      </button>

      <h4 className="font-bold dark:text-white">{task.title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>

      
      <span
        className={`text-xs px-2 py-1 rounded text-white ${
          task.priority === "alta"
            ? "bg-red-500"
            : task.priority === "media"
            ? "bg-yellow-500"
            : "bg-green-500"
        }`}
      >
        {task.priority}
      </span>

      {/* Fechas */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
        <Calendar size={14} />
        {task.startDate} - {task.dueDate}
      </div>
    </div>
  );
}

