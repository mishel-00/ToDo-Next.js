import { obtenerTareasOrdenadasPorProyecto, obtenerTodasTareas } from "@/backend/actions/taskActions";
import ProjectTasks from "../Components/ProyectTask/proyectTask";


export default async function ProyectosPage() {
  const { data: projectStats } = await obtenerTareasOrdenadasPorProyecto();
  const { data: allTasksRaw } = await obtenerTodasTareas();

  return (
    <div className="container mx-auto p-4 space-y-8 dark:bg-gray-900 dark:text-white">
    {projectStats?.map((project) => (
      <ProjectTasks
        key={project.id}
        project={project}
        tasks={allTasksRaw.filter((task) => task.projectId === project.id)}
      />
    ))}
  </div>
  );
}

