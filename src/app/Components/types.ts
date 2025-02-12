
export interface Attachment {
    id: number;
    fileUrl: string;
    fileName: string;
    taskId: number;
  }
  
  export interface Task {
    id: number;
    title: string;
    description: string | null;
    status: string | null;
    priority: string | null;
    tags: string | null;
    startDate: Date | null;
    dueDate: Date | null;
    projectId: number;
    attachments?: Attachment[];
  }
  
  export interface Project {
    id: number;
    name: string;
  }