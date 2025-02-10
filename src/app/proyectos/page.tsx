import { obtenerTareasOrdenadasPorProyecto, obtenerTodasTareas } from "@/backend/actions/taskActions";
import { DeleteButton } from "../Components/DeleteButton/deleteButton";
import { Badge } from "../Components/ui/badge";
import { Suspense } from "react";
import ProjectTasks from "../Components/ProyectTask/proyectTask";


export default async function ProyectosPage() {
  // Obtener proyectos y tareas desde el backend
  const { data: projectStats } = await obtenerTareasOrdenadasPorProyecto();
  const { data: allTasksRaw } = await obtenerTodasTareas();

  // Normalizar los datos de las tareas
  const normalizedTasks = (allTasksRaw ?? []).map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description || "",
    status: task.status || "Pendiente",
    priority: task.priority || "baja",
    startDate: task.startDate ? new Date(task.startDate).toISOString() : null,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
    projectId: task.projectId ?? 0,
    attachments: task.attachments || [],
  }));

  return (
    <div className="container mx-auto p-4 space-y-8 dark:bg-gray-900 dark:text-white">
      {projectStats?.map((project) => (
        <div key={project.id} className="space-y-4 p-4 border rounded-lg shadow-lg relative dark:border-gray-700">
          {/* Botón para eliminar el proyecto */}
          <DeleteButton projectId={project.id} />

          {/* Título del proyecto */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {project.name}
          </h2>

          {/* Mostrar estadísticas del Proyecto */}
          <div className="flex gap-2">
            <Badge variant="secondary">
              Pendientes: {normalizedTasks.filter(task => task.projectId === project.id && task.status === "Pendiente").length}
            </Badge>
            <Badge variant="default">
              Completadas: {normalizedTasks.filter(task => task.projectId === project.id && task.status === "Terminado").length}
            </Badge>
          </div>

          {/* Lista de tareas del proyecto */}
          <Suspense fallback={<div>Cargando tareas...</div>}>
            <ProjectTasks
              projectId={project.id}
              tasks={normalizedTasks.filter(task => task.projectId === project.id)}
            />
          </Suspense>
        </div>
      ))}
    </div>
  );
}
