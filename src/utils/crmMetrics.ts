import { Client } from '@/types/client';
import { Lead, LeadStage } from '@/types/lead';
import { Task } from '@/types/task';
import { Interaction } from '@/types/interaction';
import { leadStages } from '@/constants/crm';

export interface CRMMetrics {
  totalClients: number;
  totalLeads: number;
  activeClients: number;
  leadsByStage: Record<LeadStage, number>;
  openOpportunities: number;
  wonOpportunities: number;
  lostOpportunities: number;
  conversionRate: number;
  estimatedValueInNegotiation: number;
  totalValueWon: number;
  pendingTasks: number;
  overdueTasks: number;
  recentInteractions: Interaction[];
}

export function calculateCRMMetrics(
  clients: Client[],
  leads: Lead[],
  tasks: Task[],
  interactions: Interaction[]
): CRMMetrics {
  const totalClients = clients.length;
  const activeClients = clients.filter((client) => client.status === 'Ativo').length;
  const totalLeads = leads.length;

  const leadsByStage = leadStages.reduce<Record<LeadStage, number>>((acc, stage) => {
    acc[stage] = 0;
    return acc;
  }, {} as Record<LeadStage, number>);

  leads.forEach((lead) => {
    leadsByStage[lead.stage]++;
  });

  const openOpportunities = leads.filter(
    (lead) => lead.stage !== 'Fechado' && lead.stage !== 'Perdido'
  ).length;

  const wonOpportunities = leads.filter((lead) => lead.stage === 'Fechado').length;
  const lostOpportunities = leads.filter((lead) => lead.stage === 'Perdido').length;
  const conversionRate = totalLeads > 0 ? (wonOpportunities / totalLeads) * 100 : 0;

  const estimatedValueInNegotiation = leads
    .filter((lead) => lead.stage !== 'Fechado' && lead.stage !== 'Perdido')
    .reduce((sum, lead) => sum + lead.estimatedValue, 0);

  const totalValueWon = leads
    .filter((lead) => lead.stage === 'Fechado')
    .reduce((sum, lead) => sum + lead.estimatedValue, 0);

  const now = new Date();
  const pendingTasks = tasks.filter((task) => task.status !== 'Concluída').length;
  const overdueTasks = tasks.filter((task) => {
    return task.status !== 'Concluída' && new Date(task.dueDate) < now;
  }).length;

  const recentInteractions = interactions
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return {
    totalClients,
    totalLeads,
    activeClients,
    leadsByStage,
    openOpportunities,
    wonOpportunities,
    lostOpportunities,
    conversionRate,
    estimatedValueInNegotiation,
    totalValueWon,
    pendingTasks,
    overdueTasks,
    recentInteractions,
  };
}
