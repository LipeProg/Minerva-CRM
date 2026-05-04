import { BadgeVariant } from '@/components/ui/Badge';
import { Client } from '@/types/client';
import { ClientStatus } from '@/types/client';
import { InteractionType } from '@/types/interaction';
import { Lead, LeadStage } from '@/types/lead';
import { TaskPriority, TaskStatus } from '@/types/task';

export function getClientStatusVariant(status: ClientStatus): BadgeVariant {
  const variants: Record<ClientStatus, BadgeVariant> = {
    Ativo: 'success',
    Inativo: 'secondary',
    'Em negociação': 'warning',
    'Cliente potencial': 'primary',
  };

  return variants[status];
}

export function getLeadStageVariant(stage: LeadStage): BadgeVariant {
  const variants: Record<LeadStage, BadgeVariant> = {
    'Novo lead': 'primary',
    'Primeiro contato': 'secondary',
    'Proposta enviada': 'warning',
    'Em negociação': 'warning',
    Fechado: 'success',
    Perdido: 'danger',
  };

  return variants[stage];
}

export function getTaskPriorityVariant(priority: TaskPriority): BadgeVariant {
  const variants: Record<TaskPriority, BadgeVariant> = {
    Baixa: 'secondary',
    Média: 'warning',
    Alta: 'danger',
  };

  return variants[priority];
}

export function getTaskStatusVariant(status: TaskStatus): BadgeVariant {
  const variants: Record<TaskStatus, BadgeVariant> = {
    Pendente: 'secondary',
    'Em andamento': 'primary',
    Concluída: 'success',
    Atrasada: 'danger',
  };

  return variants[status];
}

export function getInteractionTypeVariant(type: InteractionType): BadgeVariant {
  const variants: Record<InteractionType, BadgeVariant> = {
    Ligação: 'primary',
    WhatsApp: 'success',
    'E-mail': 'secondary',
    Reunião: 'warning',
    'Observação interna': 'secondary',
  };

  return variants[type];
}

export function resolveRelatedName(
  relatedTo: string,
  clients: Client[],
  leads: Lead[]
): string {
  if (!relatedTo) {
    return 'Sem vínculo';
  }

  const client = clients.find((item) => item.id === relatedTo);
  if (client) {
    return `${client.name} - ${client.company}`;
  }

  const lead = leads.find((item) => item.id === relatedTo);
  if (lead) {
    return `${lead.name} - ${lead.company}`;
  }

  return relatedTo;
}
