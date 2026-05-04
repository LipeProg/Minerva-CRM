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
import { Lead, LeadStage } from '@/types/lead';
import { mockLeads } from '@/data/mockLeads';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import { leadStages, storageKeys } from '@/constants/crm';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { reviveDateFields } from '@/utils/dateReviver';
import { getLeadStageVariant } from '@/utils/crmPresentation';

type LeadFormData = Omit<Lead, 'id' | 'createdAt' | 'lastInteractionAt'>;

const emptyForm: LeadFormData = {
  name: '',
  company: '',
  email: '',
  phone: '',
  source: '',
  stage: 'Novo lead',
  estimatedValue: 0,
  responsible: '',
  notes: '',
};

const stageOptions = leadStages.map((stage) => ({ value: stage, label: stage }));

export default function LeadsPage() {
  const [leads, setLeads] = useLocalStorageState<Lead[]>(
    storageKeys.leads,
    mockLeads,
    (value) => reviveDateFields<Lead[]>(value, ['createdAt', 'lastInteractionAt'])
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState<LeadStage | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<LeadFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const filteredLeads = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !normalizedSearch ||
        lead.name.toLowerCase().includes(normalizedSearch) ||
        lead.company.toLowerCase().includes(normalizedSearch) ||
        lead.email.toLowerCase().includes(normalizedSearch);

      const matchesStage = !filterStage || lead.stage === filterStage;

      return matchesSearch && matchesStage;
    });
  }, [leads, searchTerm, filterStage]);

  const totalFilteredValue = filteredLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0);

  const openCreateModal = () => {
    setEditingId(null);
    setFeedback('');
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleSaveLead = () => {
    if (!formData.name.trim() || !formData.company.trim() || !formData.email.trim()) {
      setFeedback('Preencha nome, empresa e e-mail para salvar o lead.');
      return;
    }

    const sanitizedFormData = {
      ...formData,
      estimatedValue: Number(formData.estimatedValue) || 0,
    };

    if (editingId) {
      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead.id === editingId
            ? { ...lead, ...sanitizedFormData, lastInteractionAt: new Date() }
            : lead
        )
      );
      setFeedback('Lead atualizado com sucesso.');
    } else {
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        ...sanitizedFormData,
        createdAt: new Date(),
        lastInteractionAt: new Date(),
      };

      setLeads((currentLeads) => [newLead, ...currentLeads]);
      setFeedback('Lead criado com sucesso.');
    }

    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(false);
  };

  const handleEditLead = (lead: Lead) => {
    setFormData({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      stage: lead.stage,
      estimatedValue: lead.estimatedValue,
      responsible: lead.responsible,
      notes: lead.notes,
    });
    setEditingId(lead.id);
    setFeedback('');
    setIsModalOpen(true);
  };

  const handleDeleteLead = (id: string) => {
    setLeads((currentLeads) => currentLeads.filter((lead) => lead.id !== id));
    setFeedback('Lead removido.');
  };

  const handleChangeStage = (id: string, newStage: LeadStage) => {
    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === id ? { ...lead, stage: newStage, lastInteractionAt: new Date() } : lead
      )
    );
    setFeedback('Etapa do lead atualizada.');
  };

  const columns: TableColumn<Lead>[] = [
    {
      key: 'name',
      label: 'Lead',
      render: (_, lead) => (
        <div>
          <p className="font-medium text-slate-950">{lead.name}</p>
          <p className="text-xs text-slate-500">{lead.company}</p>
        </div>
      ),
    },
    { key: 'email', label: 'E-mail' },
    {
      key: 'estimatedValue',
      label: 'Valor',
      render: (value) => formatCurrency(Number(value)),
    },
    {
      key: 'stage',
      label: 'Etapa',
      render: (_, lead) => (
        <Select
          value={lead.stage}
          onChange={(event) => handleChangeStage(lead.id, event.target.value as LeadStage)}
          options={stageOptions}
          className="min-w-44"
        />
      ),
    },
    { key: 'responsible', label: 'Responsável' },
    {
      key: 'lastInteractionAt',
      label: 'Última interação',
      render: (date) => formatDate(date as Date),
    },
    {
      key: 'actions',
      label: 'Ações',
      className: 'text-right',
      render: (_, lead) => (
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setSelectedLead(lead)}>
            Ver
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleEditLead(lead)}>
            Editar
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDeleteLead(lead.id)}>
            Remover
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header title="Leads" subtitle="Acompanhe oportunidades, valores estimados e avanço comercial." />

      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_230px_auto] lg:items-end">
          <Input
            label="Busca"
            placeholder="Nome, empresa ou e-mail"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <Select
            label="Etapa"
            value={filterStage}
            onChange={(event) => setFilterStage(event.target.value as LeadStage | '')}
            options={[{ value: '', label: 'Todas as etapas' }, ...stageOptions]}
          />
          <Button variant="primary" onClick={openCreateModal}>
            Novo Lead
          </Button>
        </div>
        <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {filteredLeads.length} lead(s) encontrado(s) · {formatCurrency(totalFilteredValue)} em oportunidades
          </span>
          {feedback && <span className="font-medium text-blue-700">{feedback}</span>}
        </div>
      </Card>

      <Card>
        <Table columns={columns} data={filteredLeads} getRowKey={(lead) => lead.id} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Lead' : 'Novo Lead'}
        onConfirm={handleSaveLead}
        confirmText={editingId ? 'Atualizar' : 'Criar'}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nome"
            value={formData.name}
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
            placeholder="Nome do contato"
          />
          <Input
            label="Empresa"
            value={formData.company}
            onChange={(event) => setFormData({ ...formData, company: event.target.value })}
            placeholder="Empresa do lead"
          />
          <Input
            label="E-mail"
            type="email"
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            placeholder="lead@empresa.com.br"
          />
          <Input
            label="Telefone"
            value={formData.phone}
            onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
            placeholder="(11) 98765-4321"
          />
          <Input
            label="Origem"
            value={formData.source}
            onChange={(event) => setFormData({ ...formData, source: event.target.value })}
            placeholder="Website, LinkedIn, Indicação"
          />
          <Select
            label="Etapa"
            value={formData.stage}
            onChange={(event) => setFormData({ ...formData, stage: event.target.value as LeadStage })}
            options={stageOptions}
          />
          <Input
            label="Valor estimado"
            type="number"
            min="0"
            value={formData.estimatedValue}
            onChange={(event) =>
              setFormData({ ...formData, estimatedValue: Number(event.target.value) })
            }
            placeholder="0"
          />
          <Input
            label="Responsável"
            value={formData.responsible}
            onChange={(event) => setFormData({ ...formData, responsible: event.target.value })}
            placeholder="Nome do responsável"
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Observações"
              value={formData.notes}
              onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
              placeholder="Contexto comercial e próximos riscos"
              rows={3}
            />
          </div>
          {feedback && <p className="text-sm font-medium text-rose-600 sm:col-span-2">{feedback}</p>}
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        title="Detalhes do Lead"
      >
        {selectedLead && (
          <div className="space-y-4 text-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-slate-500">Lead</p>
                <p className="font-semibold text-slate-950">{selectedLead.name}</p>
                <p className="text-slate-600">{selectedLead.company}</p>
              </div>
              <Badge variant={getLeadStageVariant(selectedLead.stage)}>{selectedLead.stage}</Badge>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-slate-500">Valor estimado</p>
                <p className="font-medium text-slate-900">{formatCurrency(selectedLead.estimatedValue)}</p>
              </div>
              <div>
                <p className="text-slate-500">Responsável</p>
                <p className="font-medium text-slate-900">{selectedLead.responsible}</p>
              </div>
              <div>
                <p className="text-slate-500">Origem</p>
                <p className="font-medium text-slate-900">{selectedLead.source}</p>
              </div>
              <div>
                <p className="text-slate-500">Última interação</p>
                <p className="font-medium text-slate-900">{formatDate(selectedLead.lastInteractionAt)}</p>
              </div>
            </div>
            <div>
              <p className="text-slate-500">Observações</p>
              <p className="mt-1 rounded-lg bg-slate-50 p-3 text-slate-700">{selectedLead.notes}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
