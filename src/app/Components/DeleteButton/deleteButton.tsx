'use client';
import { eliminarProyecto } from "@/backend/actions/taskActions";
import { X } from "lucide-react";
import { useTransition } from "react";
interface DeleteButtonProps {
    projectId: number;
  }

export function DeleteButton({ projectId }: DeleteButtonProps) {
    const [isPending, startTransition] = useTransition();
  
    const handleDelete = () => {
      if (confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
        startTransition(async () => {
          const result = await eliminarProyecto(projectId);
          if (result.success) {
            // Opcional: puedes recargar la página o actualizar el estado
            window.location.reload();
          }
        });
      }
    };
  
    return (
      <button
        className="absolute top-2 right-2 text-red-500 hover:bg-red-100 p-2 rounded-full transition-colors"
        onClick={handleDelete}
        disabled={isPending}
        aria-label="Eliminar proyecto"
      >
        <X className="h-4 w-4" />
      </button>
    );
  }