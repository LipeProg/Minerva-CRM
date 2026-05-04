import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Client } from '@/types/client';
import { formatDate } from '@/utils/formatDate';
import { getClientStatusVariant } from '@/utils/crmPresentation';

interface ClientCardProps {
  client: Client;
}

export default function ClientCard({ client }: ClientCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-950">{client.name}</h3>
          <p className="text-sm text-slate-600">{client.company}</p>
        </div>
        <Badge variant={getClientStatusVariant(client.status)}>{client.status}</Badge>
      </div>
      <dl className="mt-4 space-y-2 text-sm text-slate-700">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">E-mail</dt>
          <dd className="text-right">{client.email}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Cidade</dt>
          <dd>{client.city}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Cadastro</dt>
          <dd>{formatDate(client.createdAt)}</dd>
        </div>
      </dl>
    </Card>
  );
}
