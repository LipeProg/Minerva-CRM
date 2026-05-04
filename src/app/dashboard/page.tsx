'use client';

import Header from '@/components/layout/Header';
import MetricCard from '@/components/crm/MetricCard';
import Card from '@/components/ui/Card';
import { mockClients } from '@/data/mockClients';
import { mockLeads } from '@/data/mockLeads';
import { mockTasks } from '@/data/mockTasks';
import { mockInteractions } from '@/data/mockInteractions';
import { calculateCRMMetrics } from '@/utils/crmMetrics';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate, getRelativeTime } from '@/utils/formatDate';
import Badge from '@/components/ui/Badge';
import { storageKeys } from '@/constants/crm';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { reviveDateFields } from '@/utils/dateReviver';
import { Client } from '@/types/client';
import { Interaction } from '@/types/interaction';
import { Lead } from '@/types/lead';
import { Task } from '@/types/task';
import { getTaskPriorityVariant } from '@/utils/crmPresentation';

export default function Dashboard() {
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

  return (
    <div>
      <Header title="Dashboard" subtitle="Bem-vindo ao Minerva CRM" />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Total de Clientes"
          value={metrics.totalClients}
          variant="primary"
          icon="CL"
        />
        <MetricCard
          title="Total de Leads"
          value={metrics.totalLeads}
          variant="primary"
          icon="LD"
        />
        <MetricCard
          title="Oportunidades Abertas"
          value={metrics.openOpportunities}
          variant="warning"
          icon="OP"
        />
        <MetricCard
          title="Taxa de Conversão"
          value={`${metrics.conversionRate.toFixed(1)}%`}
          variant="success"
          icon="%"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Clientes Ativos"
          value={metrics.activeClients}
          variant="success"
          icon="AT"
        />
        <MetricCard
          title="Oportunidades Ganhas"
          value={metrics.wonOpportunities}
          variant="success"
          icon="OK"
        />
        <MetricCard
          title="Oportunidades Perdidas"
          value={metrics.lostOpportunities}
          variant="danger"
          icon="PD"
        />
        <MetricCard
          title="Tarefas Atrasadas"
          value={metrics.overdueTasks}
          variant="danger"
          icon="AT"
        />
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <MetricCard
          title="Valor em Negociação"
          value={formatCurrency(metrics.estimatedValueInNegotiation)}
          variant="warning"
          icon="💰"
        />
        <MetricCard
          title="Valor Total Ganho"
          value={formatCurrency(metrics.totalValueWon)}
          variant="success"
          icon="💵"
        />
      </div>

      {/* Leads by Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Leads por Etapa do Funil</h2>
          <div className="space-y-3">
            {Object.entries(metrics.leadsByStage).map(([stage, count]) => (
              <div key={stage} className="flex items-center justify-between">
                <span className="text-gray-700">{stage}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${metrics.totalLeads ? (count / metrics.totalLeads) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Tasks */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Tarefas Próximas</h2>
          <div className="space-y-3">
            {tasks
              .filter((task) => task.status !== 'Concluída')
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .slice(0, 5)
              .map((task) => (
                <div key={task.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500 mt-1">Vence: {formatDate(task.dueDate)}</p>
                  </div>
                  <Badge variant={getTaskPriorityVariant(task.priority)}>{task.priority}</Badge>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Recent Interactions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Últimas Interações</h2>
        <div className="space-y-4">
          {metrics.recentInteractions.slice(0, 6).map((interaction) => (
            <div
              key={interaction.id}
              className="flex items-start gap-4 p-3 border-b border-gray-200 last:border-b-0"
            >
              <div className="mt-1">
                <Badge variant="primary">{interaction.type}</Badge>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{interaction.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Responsável: {interaction.responsible}</span>
                  <span>{getRelativeTime(new Date(interaction.date))}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
