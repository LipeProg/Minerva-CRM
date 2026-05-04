import type { ClientStatus } from '@/types/client';
import type { InteractionType } from '@/types/interaction';
import type { LeadStage } from '@/types/lead';
import type { TaskPriority, TaskStatus } from '@/types/task';

export const clientStatuses: ClientStatus[] = [
  'Ativo',
  'Inativo',
  'Em negociação',
  'Cliente potencial',
];

export const leadStages: LeadStage[] = [
  'Novo lead',
  'Primeiro contato',
  'Proposta enviada',
  'Em negociação',
  'Fechado',
  'Perdido',
];

export const taskPriorities: TaskPriority[] = ['Baixa', 'Média', 'Alta'];

export const taskStatuses: TaskStatus[] = [
  'Pendente',
  'Em andamento',
  'Concluída',
  'Atrasada',
];

export const interactionTypes: InteractionType[] = [
  'Ligação',
  'WhatsApp',
  'E-mail',
  'Reunião',
  'Observação interna',
];

export const storageKeys = {
  clients: 'minerva-crm:clients',
  leads: 'minerva-crm:leads',
  tasks: 'minerva-crm:tasks',
  interactions: 'minerva-crm:interactions',
} as const;
