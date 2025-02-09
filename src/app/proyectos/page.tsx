
import { obtenerTareasOrdenadasPorProyecto, obtenerTodasTareas } from "@/backend/actions/taskActions";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { Badge } from "../Components/ui/badge";
import { Suspense } from "react";
import ProjectTasks from "../Components/ProyectTask/proyectTask";

export default async function proyectosPage() {
    const { data: projectStats } = await obtenerTareasOrdenadasPorProyecto();
    const { data: allTasks } = await obtenerTodasTareas();
  
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectStats?.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>
                  {project.name}
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      Pendientes: {project.pending}
                    </Badge>
                    <Badge variant="default">
                      Completadas: {project.completed}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Cargando tareas...</div>}>
                  <ProjectTasks 
                    projectId={project.id} 
                    tasks={allTasks?.filter(task => task.projectid === project.id) || []}
                  />
                </Suspense>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
