'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import FunnelColumn from '@/components/crm/FunnelColumn';
import Card from '@/components/ui/Card';
import { Lead, LeadStage } from '@/types/lead';
import { mockLeads } from '@/data/mockLeads';
import { formatCurrency } from '@/utils/formatCurrency';
import { leadStages, storageKeys } from '@/constants/crm';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { reviveDateFields } from '@/utils/dateReviver';

export default function FunnelPage() {
  const [leads, setLeads] = useLocalStorageState<Lead[]>(
    storageKeys.leads,
    mockLeads,
    (value) => reviveDateFields<Lead[]>(value, ['createdAt', 'lastInteractionAt'])
  );
  const [feedback, setFeedback] = useState('');

  const getLeadsByStage = (stage: LeadStage) => leads.filter((lead) => lead.stage === stage);

  const getStageTotal = (stage: LeadStage) => {
    return getLeadsByStage(stage).reduce((sum, lead) => sum + lead.estimatedValue, 0);
  };

  const handleChangeStage = (leadId: string, newStage: LeadStage) => {
    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId ? { ...lead, stage: newStage, lastInteractionAt: new Date() } : lead
      )
    );
    setFeedback('Lead movido no funil.');
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads((currentLeads) => currentLeads.filter((lead) => lead.id !== leadId));
    setFeedback('Lead removido do funil.');
  };

  const openValue = leads
    .filter((lead) => lead.stage !== 'Fechado' && lead.stage !== 'Perdido')
    .reduce((sum, lead) => sum + lead.estimatedValue, 0);

  return (
    <div>
      <Header title="Funil de Vendas" subtitle="Visualize o pipeline por etapa e mova leads conforme a negociação evolui." />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-slate-500">Leads no funil</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{leads.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Valor em aberto</p>
          <p className="mt-1 text-2xl font-bold text-amber-700">{formatCurrency(openValue)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Atualização</p>
          <p className="mt-1 text-sm font-medium text-blue-700">{feedback || 'Use o seletor nos cards para mudar etapas.'}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
        {leadStages.map((stage) => {
          const stageLeads = getLeadsByStage(stage);

          return (
            <FunnelColumn
              key={stage}
              stage={stage}
              leads={stageLeads}
              totalValue={getStageTotal(stage)}
              onStageChange={handleChangeStage}
              onDelete={handleDeleteLead}
            />
          );
        })}
      </div>
    </div>
  );
}
