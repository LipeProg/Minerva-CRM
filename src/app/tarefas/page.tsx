'use client';

import { useMemo, useState } from 'react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Table, { TableColumn } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { Client } from '@/types/client';
import { Lead } from '@/types/lead';
import { mockTasks } from '@/data/mockTasks';
import { mockClients } from '@/data/mockClients';
import { mockLeads } from '@/data/mockLeads';
import { formatDate } from '@/utils/formatDate';
import { taskPriorities, taskStatuses, storageKeys } from '@/constants/crm';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { reviveDateFields } from '@/utils/dateReviver';
import {
  getTaskPriorityVariant,
  getTaskStatusVariant,
  resolveRelatedName,
} from '@/utils/crmPresentation';

type TaskFormData = Omit<Task, 'id' | 'dueDate'> & {
  dueDate: string;
};

const emptyForm: TaskFormData = {
  title: '',
  description: '',
  relatedTo: '',
  dueDate: '',
  priority: 'Média',
  status: 'Pendente',
  responsible: '',
};

const priorityOptions = taskPriorities.map((priority) => ({ value: priority, label: priority }));
const statusOptions = taskStatuses.map((status) => ({ value: status, label: status }));

function toDateInputValue(date: Date) {
  return new Date(date).toISOString().split('T')[0];
}

function getEffectiveTaskStatus(task: Task): TaskStatus {
  const isOverdue = task.status !== 'Concluída' && new Date(task.dueDate) < new Date();
  return isOverdue ? 'Atrasada' : task.status;
}

export default function TasksPage() {
  const [tasks, setTasks] = useLocalStorageState<Task[]>(
    storageKeys.tasks,
    mockTasks,
    (value) => reviveDateFields<Task[]>(value, ['dueDate'])
  );
  const [clients] = useLocalStorageState<Client[]>(
    storageKeys.clients,
    mockClients,
    (value) => reviveDateFields<Client[]>(value, ['createdAt'])
  );
  const [leads] = useLocalStorageState<Lead[]>(
    storageKeys.leads,
    mockLeads,
    (value) => reviveDateFields<Lead[]>(value, ['createdAt', 'lastInteractionAt'])
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | ''>('');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return tasks.filter((task) => {
      const relatedName = resolveRelatedName(task.relatedTo, clients, leads).toLowerCase();
      const effectiveStatus = getEffectiveTaskStatus(task);
      const matchesSearch =
        !normalizedSearch ||
        task.title.toLowerCase().includes(normalizedSearch) ||
        task.description.toLowerCase().includes(normalizedSearch) ||
        relatedName.includes(normalizedSearch);

      const matchesStatus = !filterStatus || effectiveStatus === filterStatus;
      const matchesPriority = !filterPriority || task.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [clients, filterPriority, filterStatus, leads, searchTerm, tasks]);

  const overdueTasks = tasks.filter((task) => getEffectiveTaskStatus(task) === 'Atrasada');

  const openCreateModal = () => {
    setEditingId(null);
    setFeedback('');
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!formData.title.trim() || !formData.dueDate || !formData.responsible.trim()) {
      setFeedback('Preencha título, vencimento e responsável para salvar a tarefa.');
      return;
    }

    if (editingId) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingId ? { ...task, ...formData, dueDate: new Date(formData.dueDate) } : task
        )
      );
      setFeedback('Tarefa atualizada com sucesso.');
    } else {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        ...formData,
        dueDate: new Date(formData.dueDate),
      };

      setTasks((currentTasks) => [newTask, ...currentTasks]);
      setFeedback('Tarefa criada com sucesso.');
    }

    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description,
      relatedTo: task.relatedTo,
      dueDate: toDateInputValue(task.dueDate),
      priority: task.priority,
      status: task.status,
      responsible: task.responsible,
    });
    setEditingId(task.id);
    setFeedback('');
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    setFeedback('Tarefa removida.');
  };

  const handleCompleteTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === id ? { ...task, status: 'Concluída' } : task))
    );
    setFeedback('Tarefa marcada como concluída.');
  };

  const columns: TableColumn<Task>[] = [
    {
      key: 'title',
      label: 'Tarefa',
      render: (_, task) => (
        <div>
          <p className="font-medium text-slate-950">{task.title}</p>
          <p className="line-clamp-1 text-xs text-slate-500">{task.description}</p>
        </div>
      ),
    },
    {
      key: 'relatedTo',
      label: 'Relacionado',
      render: (_, task) => resolveRelatedName(task.relatedTo, clients, leads),
    },
    {
      key: 'priority',
      label: 'Prioridade',
      render: (priority) => (
        <Badge variant={getTaskPriorityVariant(priority as TaskPriority)}>{String(priority)}</Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, task) => {
        const effectiveStatus = getEffectiveTaskStatus(task);
        return <Badge variant={getTaskStatusVariant(effectiveStatus)}>{effectiveStatus}</Badge>;
      },
    },
    {
      key: 'dueDate',
      label: 'Vencimento',
      render: (_, task) => {
        const isOverdue = getEffectiveTaskStatus(task) === 'Atrasada';
        return (
          <span className={isOverdue ? 'font-semibold text-rose-700' : ''}>
            {formatDate(task.dueDate)}
          </span>
        );
      },
    },
    { key: 'responsible', label: 'Responsável' },
    {
      key: 'actions',
      label: 'Ações',
      className: 'text-right',
      render: (_, task) => (
        <div className="flex justify-end gap-2">
          {task.status !== 'Concluída' && (
            <Button variant="success" size="sm" onClick={() => handleCompleteTask(task.id)}>
              Concluir
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => handleEditTask(task)}>
            Editar
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDeleteTask(task.id)}>
            Remover
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header title="Tarefas" subtitle="Controle follow-ups, vencimentos e responsáveis." />

      {overdueTasks.length > 0 && (
        <Card className="mb-6 border-rose-200 bg-rose-50 p-4">
          <p className="font-semibold text-rose-800">
            Existem {overdueTasks.length} tarefa(s) atrasada(s) aguardando atenção.
          </p>
        </Card>
      )}

      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_190px_190px_auto] xl:items-end">
          <Input
            label="Busca"
            placeholder="Título, descrição ou contato relacionado"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <Select
            label="Status"
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value as TaskStatus | '')}
            options={[{ value: '', label: 'Todos os status' }, ...statusOptions]}
          />
          <Select
            label="Prioridade"
            value={filterPriority}
            onChange={(event) => setFilterPriority(event.target.value as TaskPriority | '')}
            options={[{ value: '', label: 'Todas as prioridades' }, ...priorityOptions]}
          />
          <Button variant="primary" onClick={openCreateModal}>
            Nova Tarefa
          </Button>
        </div>
        <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>{filteredTasks.length} tarefa(s) encontrada(s)</span>
          {feedback && <span className="font-medium text-blue-700">{feedback}</span>}
        </div>
      </Card>

      <Card>
        <Table columns={columns} data={filteredTasks} getRowKey={(task) => task.id} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Tarefa' : 'Nova Tarefa'}
        onConfirm={handleSaveTask}
        confirmText={editingId ? 'Atualizar' : 'Criar'}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Título"
            value={formData.title}
            onChange={(event) => setFormData({ ...formData, title: event.target.value })}
            placeholder="Follow-up comercial"
          />
          <Input
            label="Responsável"
            value={formData.responsible}
            onChange={(event) => setFormData({ ...formData, responsible: event.target.value })}
            placeholder="Nome do responsável"
          />
          <Input
            label="Data de vencimento"
            type="date"
            value={formData.dueDate}
            onChange={(event) => setFormData({ ...formData, dueDate: event.target.value })}
          />
          <Select
            label="Prioridade"
            value={formData.priority}
            onChange={(event) =>
              setFormData({ ...formData, priority: event.target.value as TaskPriority })
            }
            options={priorityOptions}
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(event) => setFormData({ ...formData, status: event.target.value as TaskStatus })}
            options={statusOptions}
          />
          <Input
            label="Relacionado a"
            value={formData.relatedTo}
            onChange={(event) => setFormData({ ...formData, relatedTo: event.target.value })}
            placeholder="ID do cliente ou lead"
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Descrição"
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              placeholder="Detalhes do follow-up"
              rows={3}
            />
          </div>
          {feedback && <p className="text-sm font-medium text-rose-600 sm:col-span-2">{feedback}</p>}
        </div>
      </Modal>
    </div>
  );
}
