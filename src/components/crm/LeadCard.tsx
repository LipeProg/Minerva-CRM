import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { leadStages } from '@/constants/crm';
import { Lead, LeadStage } from '@/types/lead';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

interface LeadCardProps {
  lead: Lead;
  onStageChange?: (leadId: string, stage: LeadStage) => void;
  onDelete?: (leadId: string) => void;
}

export default function LeadCard({ lead, onStageChange, onDelete }: LeadCardProps) {
  return (
    <Card className="p-4 transition-shadow hover:shadow-md">
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-slate-950">{lead.name}</h4>
          <p className="text-sm text-slate-600">{lead.company}</p>
        </div>

        <dl className="space-y-1 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Valor</dt>
            <dd className="font-medium text-slate-900">{formatCurrency(lead.estimatedValue)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Origem</dt>
            <dd className="text-slate-900">{lead.source}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Responsável</dt>
            <dd className="text-right text-slate-900">{lead.responsible}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Última interação</dt>
            <dd className="text-slate-900">{formatDate(lead.lastInteractionAt)}</dd>
          </div>
        </dl>

        {(onStageChange || onDelete) && (
          <div className="space-y-2 border-t border-slate-100 pt-3">
            {onStageChange && (
              <Select
                value={lead.stage}
                onChange={(event) => onStageChange(lead.id, event.target.value as LeadStage)}
                options={leadStages.map((stage) => ({ value: stage, label: stage }))}
              />
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(lead.id)}
                className="w-full"
              >
                Remover
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
