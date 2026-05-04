'use client';

import { useMemo, useState } from 'react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Table, { TableColumn } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import { Client, ClientStatus } from '@/types/client';
import { mockClients } from '@/data/mockClients';
import { formatDate } from '@/utils/formatDate';
import { clientStatuses, storageKeys } from '@/constants/crm';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { reviveDateFields } from '@/utils/dateReviver';
import { getClientStatusVariant } from '@/utils/crmPresentation';

type ClientFormData = Omit<Client, 'id' | 'createdAt'>;

const emptyForm: ClientFormData = {
  name: '',
  company: '',
  email: '',
  phone: '',
  city: '',
  status: 'Ativo',
  source: '',
  notes: '',
};

const statusOptions = clientStatuses.map((status) => ({ value: status, label: status }));

export default function ClientsPage() {
  const [clients, setClients] = useLocalStorageState<Client[]>(
    storageKeys.clients,
    mockClients,
    (value) => reviveDateFields<Client[]>(value, ['createdAt'])
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ClientStatus | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const filteredClients = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return clients.filter((client) => {
      const matchesSearch =
        !normalizedSearch ||
        client.name.toLowerCase().includes(normalizedSearch) ||
        client.company.toLowerCase().includes(normalizedSearch) ||
        client.email.toLowerCase().includes(normalizedSearch);

      const matchesStatus = !filterStatus || client.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, filterStatus]);

  const openCreateModal = () => {
    setEditingId(null);
    setFeedback('');
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleSaveClient = () => {
    if (!formData.name.trim() || !formData.company.trim() || !formData.email.trim()) {
      setFeedback('Preencha nome, empresa e e-mail para salvar o cliente.');
      return;
    }

    if (editingId) {
      setClients((currentClients) =>
        currentClients.map((client) =>
          client.id === editingId ? { ...client, ...formData } : client
        )
      );
      setFeedback('Cliente atualizado com sucesso.');
    } else {
      const newClient: Client = {
        id: `client-${Date.now()}`,
        ...formData,
        createdAt: new Date(),
      };

      setClients((currentClients) => [newClient, ...currentClients]);
      setFeedback('Cliente criado com sucesso.');
    }

    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(false);
  };

  const handleEditClient = (client: Client) => {
    setFormData({
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      city: client.city,
      status: client.status,
      source: client.source,
      notes: client.notes,
    });
    setEditingId(client.id);
    setFeedback('');
    setIsModalOpen(true);
  };

  const handleDeleteClient = (id: string) => {
    setClients((currentClients) => currentClients.filter((client) => client.id !== id));
    setFeedback('Cliente removido.');
  };

  const columns: TableColumn<Client>[] = [
    {
      key: 'name',
      label: 'Cliente',
      render: (_, client) => (
        <div>
          <p className="font-medium text-slate-950">{client.name}</p>
          <p className="text-xs text-slate-500">{client.company}</p>
        </div>
      ),
    },
    { key: 'email', label: 'E-mail' },
    { key: 'phone', label: 'Telefone' },
    { key: 'city', label: 'Cidade' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <Badge variant={getClientStatusVariant(status as ClientStatus)}>
          {String(status)}
        </Badge>
      ),
    },
    { key: 'source', label: 'Origem' },
    {
      key: 'createdAt',
      label: 'Cadastro',
      render: (date) => formatDate(date as Date),
    },
    {
      key: 'actions',
      label: 'Ações',
      className: 'text-right',
      render: (_, client) => (
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setSelectedClient(client)}>
            Ver
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleEditClient(client)}>
            Editar
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDeleteClient(client.id)}>
            Remover
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header title="Clientes" subtitle="Organize contatos, empresas e status de relacionamento." />

      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_auto] lg:items-end">
          <Input
            label="Busca"
            placeholder="Nome, empresa ou e-mail"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <Select
            label="Status"
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value as ClientStatus | '')}
            options={[{ value: '', label: 'Todos os status' }, ...statusOptions]}
          />
          <Button variant="primary" onClick={openCreateModal}>
            Novo Cliente
          </Button>
        </div>
        <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>{filteredClients.length} cliente(s) encontrado(s)</span>
          {feedback && <span className="font-medium text-blue-700">{feedback}</span>}
        </div>
      </Card>

      <Card>
        <Table columns={columns} data={filteredClients} getRowKey={(client) => client.id} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Cliente' : 'Novo Cliente'}
        onConfirm={handleSaveClient}
        confirmText={editingId ? 'Atualizar' : 'Criar'}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nome"
            value={formData.name}
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
            placeholder="Nome completo"
          />
          <Input
            label="Empresa"
            value={formData.company}
            onChange={(event) => setFormData({ ...formData, company: event.target.value })}
            placeholder="Nome da empresa"
          />
          <Input
            label="E-mail"
            type="email"
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            placeholder="cliente@empresa.com.br"
          />
          <Input
            label="Telefone"
            value={formData.phone}
            onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
            placeholder="(11) 98765-4321"
          />
          <Input
            label="Cidade"
            value={formData.city}
            onChange={(event) => setFormData({ ...formData, city: event.target.value })}
            placeholder="Cidade"
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(event) =>
              setFormData({ ...formData, status: event.target.value as ClientStatus })
            }
            options={statusOptions}
          />
          <Input
            label="Origem"
            value={formData.source}
            onChange={(event) => setFormData({ ...formData, source: event.target.value })}
            placeholder="Indicação, Website, Evento"
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Observações"
              value={formData.notes}
              onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
              placeholder="Informações importantes sobre o relacionamento"
              rows={3}
            />
          </div>
          {feedback && <p className="text-sm font-medium text-rose-600 sm:col-span-2">{feedback}</p>}
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(selectedClient)}
        onClose={() => setSelectedClient(null)}
        title="Detalhes do Cliente"
      >
        {selectedClient && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-slate-500">Cliente</p>
              <p className="font-semibold text-slate-950">{selectedClient.name}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-slate-500">Empresa</p>
                <p className="font-medium text-slate-900">{selectedClient.company}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <Badge variant={getClientStatusVariant(selectedClient.status)}>
                  {selectedClient.status}
                </Badge>
              </div>
              <div>
                <p className="text-slate-500">E-mail</p>
                <p className="font-medium text-slate-900">{selectedClient.email}</p>
              </div>
              <div>
                <p className="text-slate-500">Telefone</p>
                <p className="font-medium text-slate-900">{selectedClient.phone}</p>
              </div>
              <div>
                <p className="text-slate-500">Cidade</p>
                <p className="font-medium text-slate-900">{selectedClient.city}</p>
              </div>
              <div>
                <p className="text-slate-500">Cadastro</p>
                <p className="font-medium text-slate-900">{formatDate(selectedClient.createdAt)}</p>
              </div>
            </div>
            <div>
              <p className="text-slate-500">Observações</p>
              <p className="mt-1 rounded-lg bg-slate-50 p-3 text-slate-700">{selectedClient.notes}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
