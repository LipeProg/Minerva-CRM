import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Task, TaskStatus } from '@/types/task';
import { formatDate } from '@/utils/formatDate';
import { getTaskPriorityVariant, getTaskStatusVariant } from '@/utils/crmPresentation';

interface TaskCardProps {
  task: Task;
  status: TaskStatus;
  relatedName: string;
}

export default function TaskCard({ task, status, relatedName }: TaskCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-950">{task.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{relatedName}</p>
        </div>
        <Badge variant={getTaskPriorityVariant(task.priority)}>{task.priority}</Badge>
      </div>
      <p className="mt-3 text-sm text-slate-700">{task.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant={getTaskStatusVariant(status)}>{status}</Badge>
        <span className="text-sm text-slate-500">Vence em {formatDate(task.dueDate)}</span>
      </div>
    </Card>
  );
}
