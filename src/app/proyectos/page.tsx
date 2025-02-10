import Image from "next/image";
import { Suspense } from "react";
import { obtenerTareasOrdenadasPorProyecto, obtenerTodasTareas } from "@/backend/actions/taskActions";

import { Badge } from "../Components/ui/badge";

import { DeleteButton } from "../Components/DeleteButton/deleteButton";
import ProjectTasks from "../Components/ProyectTask/proyectTask";


export default async function ProyectosPage() {
  const { data: projectStats } = await obtenerTareasOrdenadasPorProyecto();
  const { data: allTasksRaw } = await obtenerTodasTareas();

  const normalizedTasks = (allTasksRaw ?? []).map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description || "",
    status: task.status || "Pendiente",
    priority: task.priority || "baja",
    startDate: task.startDate ? new Date(task.startDate).toLocaleDateString() : "No definida",
    dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No definida",
    projectId: task.projectId ?? 0,
    attachments: task.attachments || [],
  }));

  return (
    <div className="container mx-auto p-4 space-y-8 dark:bg-gray-900 dark:text-white">
      {projectStats?.map((project) => (
        <div key={project.id} className="space-y-4 p-4 border rounded-lg shadow-lg relative dark:border-gray-700">
          <DeleteButton projectId={project.id} />
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {project.name}
          </h2>

          {normalizedTasks.some(
            (task) => task.projectId === project.id && task.attachments.length > 0
          ) && (
            <div className="w-full flex justify-center">
              <Image
                src={
                  normalizedTasks.find(
                    (task) =>
                      task.projectId === project.id && task.attachments.length > 0
                  )?.attachments[0].fileUrl || ""
                }
                alt="Imagen del proyecto"
                width={400}
                height={200}
                className="rounded-lg shadow-md object-cover"
                priority
              />
            </div>
          )}

          <div className="flex gap-2">
            <Badge variant="secondary">
              Pendientes: {
                normalizedTasks.filter(
                  (task) =>
                    task.projectId === project.id && task.status === "Pendiente"
                ).length
              }
            </Badge>
            <Badge variant="default">
              Completadas: {
                normalizedTasks.filter(
                  (task) =>
                    task.projectId === project.id && task.status === "Terminado"
                ).length
              }
            </Badge>
          </div>

          <Suspense fallback={<div>Cargando tareas...</div>}>
            <ProjectTasks
              projectId={project.id}
              tasks={normalizedTasks.filter(
                (task) => task.projectId === project.id
              )}
            />
          </Suspense>
        </div>
      ))}
    </div>
  );
}