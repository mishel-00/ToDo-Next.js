
export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority?: string | null;
    tags?: string;
    startDate?: Date | null;
    dueDate?: Date | null;
    projectId: number;
    attachments?: Array<{ fileUrl: string }>;
  }
export interface Project {
    id: number;
    name: string;
  }
  