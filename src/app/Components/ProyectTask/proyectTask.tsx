'use client'

import { modificarStatusTarea } from '@/backend/actions/taskActions';
import React, { useState } from 'react'

export default function proyectTask({projectId, tasks: initialTasks }) {
    function SortableItem(props) {
        const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id })
      
        const style = {
          transform: CSS.Transform.toString(transform),
          transition,
        }
      
        return (
          <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TableCell>{props.task.title}</TableCell>
          </TableRow>
        )
      }
      
      export default function ProjectTasks({ projectId, tasks: initialTasks }) {
        const [tasks, setTasks] = useState(initialTasks)
      
        const sensors = useSensors(
          useSensor(PointerSensor),
          useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
          }),
        )
      
        const handleDragEnd = async (event) => {
          const { active, over } = event
      
          if (active.id !== over.id) {
            setTasks((items) => {
              const oldIndex = items.findIndex((item) => item.id === active.id)
              const newIndex = items.findIndex((item) => item.id === over.id)
      
              const newItems = arrayMove(items, oldIndex, newIndex)
      
              // Update task status if moved to a different column
              const movedTask = newItems[newIndex]
              const newStatus = over.data.current.sortable.containerId
      
              if (movedTask.status !== newStatus) {
                const formData = new FormData()
                formData.append("taskId", movedTask.id.toString())
                formData.append("status", newStatus)
                modificarStatusTarea(formData)
      
                // Update the status in our local state
                newItems[newIndex] = { ...movedTask, status: newStatus }
              }
      
              return newItems
            })
          }
        }
      
        return (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <h2 className="text-2xl font-semibold mb-4">Project {projectId}</h2>
            <div className="grid grid-cols-3 gap-4">
              {["Pendiente", "En progreso", "Terminado"].map((status) => (
                <div key={status}>
                  <h3 className="text-xl font-semibold mb-2">{status}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <SortableContext
                        items={tasks.filter((task) => task.status === status).map((task) => task.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {tasks
                          .filter((task) => task.status === status)
                          .map((task) => (
                            <SortableItem key={task.id} id={task.id} task={task} />
                          ))}
                      </SortableContext>
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          </DndContext>
        )
      }  
}

