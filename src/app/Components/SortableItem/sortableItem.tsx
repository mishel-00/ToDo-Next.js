import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, BadgeVariant } from '../ui/badge';


interface Task {
  id: number;
  title: string;
  description?: string;
  priority?: string | null;
  tags?: string;
  startDate?: Date | null;
  dueDate?: Date | null;
}

interface SortableItemProps {
  id: number;
  task: Task;
}

function SortableItem({ id, task }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityVariant = (priority: string | null | undefined): BadgeVariant => {
    switch (priority?.toLowerCase()) {
      case 'alta': return 'destructive';
      case 'media': return 'warning';
      case 'baja': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="mb-3"
    >
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {task.description && (
          <p className="text-sm text-muted-foreground">
            {task.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2">
        <Badge variant={getPriorityVariant(task.priority)}>
           <span>{task.priority ? task.priority : "Sin prioridad"}</span>
        </Badge>


          {task.tags && (
            <div className="flex flex-wrap gap-1">
              {task.tags.split(',').map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {task.startDate && (
            <span>
              Inicio: {formatDate(task.startDate)}
            </span>
          )}
          {task.dueDate && (
            <span>
              Fin: {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default SortableItem;

