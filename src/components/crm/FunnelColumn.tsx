import Badge from '@/components/ui/Badge';
import LeadCard from '@/components/crm/LeadCard';
import { Lead, LeadStage } from '@/types/lead';
import { formatCurrency } from '@/utils/formatCurrency';
import { getLeadStageVariant } from '@/utils/crmPresentation';

interface FunnelColumnProps {
  stage: LeadStage;
  leads: Lead[];
  totalValue: number;
  onStageChange: (leadId: string, stage: LeadStage) => void;
  onDelete: (leadId: string) => void;
}

export default function FunnelColumn({
  stage,
  leads,
  totalValue,
  onStageChange,
  onDelete,
}: FunnelColumnProps) {
  return (
    <section className="flex min-h-[260px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 border-b border-slate-200 pb-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-950">{stage}</h3>
          <Badge variant={getLeadStageVariant(stage)}>{leads.length}</Badge>
        </div>
        <p className="text-sm text-slate-600">Soma: {formatCurrency(totalValue)}</p>
      </div>

      <div className="space-y-3">
        {leads.length > 0 ? (
          leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onStageChange={onStageChange}
              onDelete={onDelete}
            />
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 py-8 text-center text-sm text-slate-500">
            Nenhum lead nesta etapa
          </p>
        )}
      </div>
    </section>
  );
}
