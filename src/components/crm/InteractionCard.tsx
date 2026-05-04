import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Interaction } from '@/types/interaction';
import { formatDateTime, getRelativeTime } from '@/utils/formatDate';
import { getInteractionTypeVariant } from '@/utils/crmPresentation';

interface InteractionCardProps {
  interaction: Interaction;
  relatedName: string;
}

export default function InteractionCard({ interaction, relatedName }: InteractionCardProps) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant={getInteractionTypeVariant(interaction.type)}>{interaction.type}</Badge>
        <span className="text-xs text-slate-500">{getRelativeTime(new Date(interaction.date))}</span>
      </div>
      <p className="text-slate-950">{interaction.description}</p>
      <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
        <div>
          <p className="text-slate-500">Relacionado a</p>
          <p className="font-medium text-slate-900">{relatedName}</p>
        </div>
        <div>
          <p className="text-slate-500">Responsável</p>
          <p className="font-medium text-slate-900">{interaction.responsible}</p>
        </div>
        <div>
          <p className="text-slate-500">Data</p>
          <p className="font-medium text-slate-900">{formatDateTime(new Date(interaction.date))}</p>
        </div>
      </div>
    </Card>
  );
}
