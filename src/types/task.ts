export type TaskPriority = 'Baixa' | 'Média' | 'Alta';
export type TaskStatus = 'Pendente' | 'Em andamento' | 'Concluída' | 'Atrasada';

export interface Task {
  id: string;
  title: string;
  description: string;
  relatedTo: string; // Client or Lead ID
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  responsible: string;
}
