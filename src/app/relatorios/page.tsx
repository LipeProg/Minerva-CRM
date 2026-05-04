'use client';

import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import MetricCard from '@/components/crm/MetricCard';
import Badge from '@/components/ui/Badge';
import { mockClients } from '@/data/mockClients';
import { mockLeads } from '@/data/mockLeads';
import { mockTasks } from '@/data/mockTasks';
import { mockInteractions } from '@/data/mockInteractions';
import { calculateCRMMetrics } from '@/utils/crmMetrics';
import { formatCurrency } from '@/utils/formatCurrency';
import { storageKeys } from '@/constants/crm';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { reviveDateFields } from '@/utils/dateReviver';
import { Client } from '@/types/client';
import { Interaction } from '@/types/interaction';
import { Lead } from '@/types/lead';
import { Task } from '@/types/task';
import { formatDate } from '@/utils/formatDate';

export default function ReportsPage() {
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
  const [tasks] = useLocalStorageState<Task[]>(
    storageKeys.tasks,
    mockTasks,
    (value) => reviveDateFields<Task[]>(value, ['dueDate'])
  );
  const [interactions] = useLocalStorageState<Interaction[]>(
    storageKeys.interactions,
    mockInteractions,
    (value) => reviveDateFields<Interaction[]>(value, ['date'])
  );

  const metrics = calculateCRMMetrics(clients, leads, tasks, interactions);

  // Leads by source
  const leadsBySource: Record<string, number> = {};
  leads.forEach((lead) => {
    leadsBySource[lead.source] = (leadsBySource[lead.source] || 0) + 1;
  });

  // Clients by status
  const clientsByStatus: Record<string, number> = {};
  clients.forEach((client) => {
    clientsByStatus[client.status] = (clientsByStatus[client.status] || 0) + 1;
  });

  // Top leads by value
  const topLeads = leads
    .slice()
    .sort((a, b) => b.estimatedValue - a.estimatedValue)
    .slice(0, 5);

  // Average value by stage
  const avgValueByStage: Record<string, number> = {};
  const countByStage: Record<string, number> = {};
  leads.forEach((lead) => {
    avgValueByStage[lead.stage] = (avgValueByStage[lead.stage] || 0) + lead.estimatedValue;
    countByStage[lead.stage] = (countByStage[lead.stage] || 0) + 1;
  });

  const recentClosedLeads = leads.filter((lead) => lead.stage === 'Fechado').slice(0, 4);
  const totalEstimatedValue = leads.reduce((sum, lead) => sum + lead.estimatedValue, 0);

  return (
    <div>
      <Header title="Relatórios" subtitle="Análise de dados e indicadores comerciais" />

      {/* Key Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Taxa de Conversão"
          value={`${metrics.conversionRate.toFixed(1)}%`}
          variant="success"
          icon="%"
        />
        <MetricCard
          title="Valor Médio por Lead"
          value={formatCurrency(
            leads.length > 0
              ? totalEstimatedValue / leads.length
              : 0
          )}
          variant="primary"
          icon="R$"
        />
        <MetricCard
          title="Taxa de Sucesso (Fechado/Total)"
          value={`${(metrics.totalLeads ? (metrics.wonOpportunities / metrics.totalLeads) * 100 : 0).toFixed(1)}%`}
          variant="success"
          icon="OK"
        />
        <MetricCard
          title="Tarefas Concluídas"
          value={tasks.filter((t) => t.status === 'Concluída').length}
          variant="success"
          icon="TF"
        />
      </div>

      {/* Distribution Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Leads by Stage */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Leads por Etapa</h2>
          <div className="space-y-3">
            {Object.entries(metrics.leadsByStage).map(([stage, count]) => (
              <div key={stage} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{stage}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${metrics.totalLeads ? (count / metrics.totalLeads) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="ml-4 font-semibold text-gray-900 w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Leads by Source */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Leads por Origem</h2>
          <div className="space-y-3">
            {Object.entries(leadsBySource).map(([source, count]) => (
              <div key={source} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-600">
                    {source.slice(0, 2).toUpperCase()}
                  </span>
                  <p className="font-medium text-gray-900">{source}</p>
                </div>
                <Badge variant="primary">{count}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Client Status Distribution */}
      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Clientes por Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(clientsByStatus).map(([status, count]) => (
            <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{count}</p>
              <p className="text-sm text-gray-600 mt-1">{status}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Valor Total em Negociação</h3>
          <p className="text-2xl font-bold text-orange-600">
            {formatCurrency(metrics.estimatedValueInNegotiation)}
          </p>
          <p className="text-xs text-gray-500 mt-2">{metrics.openOpportunities} oportunidades</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Valor Total Fechado</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(metrics.totalValueWon)}
          </p>
          <p className="text-xs text-gray-500 mt-2">{metrics.wonOpportunities} contratos</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Faturamento Potencial</h3>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(metrics.estimatedValueInNegotiation + metrics.totalValueWon)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Negociação + Fechado</p>
        </Card>
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Desempenho por Período</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Leads criados no período</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{leads.length}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Interações registradas</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{interactions.length}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Clientes ativos</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{metrics.activeClients}</p>
          </div>
        </div>
      </Card>

      {/* Top Leads */}
      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Top 5 Leads por Valor</h2>
        <div className="space-y-3">
          {topLeads.map((lead, index) => (
            <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                <div>
                  <p className="font-medium text-gray-900">{lead.name}</p>
                  <p className="text-sm text-gray-600">{lead.company}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(lead.estimatedValue)}</p>
                <Badge variant="primary">{lead.stage}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Average Value by Stage */}
      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Valor Médio por Etapa</h2>
        <div className="space-y-3">
          {Object.entries(avgValueByStage).map(([stage]) => {
            const avg = avgValueByStage[stage] / countByStage[stage];
            return (
              <div key={stage} className="flex items-center justify-between">
                <p className="font-medium text-gray-900">{stage}</p>
                <p className="font-semibold text-gray-900">{formatCurrency(avg)}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Últimas Oportunidades Fechadas</h2>
        <div className="space-y-3">
          {recentClosedLeads.length > 0 ? (
            recentClosedLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between rounded-lg bg-emerald-50 p-3">
                <div>
                  <p className="font-medium text-slate-950">{lead.company}</p>
                  <p className="text-sm text-slate-600">Criada em {formatDate(lead.createdAt)}</p>
                </div>
                <p className="font-semibold text-emerald-700">{formatCurrency(lead.estimatedValue)}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">Ainda não há oportunidades fechadas.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
