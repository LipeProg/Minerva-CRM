'use client';

import { useMemo, useState } from 'react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import { Interaction, InteractionType } from '@/types/interaction';
import { Client } from '@/types/client';
import { Lead } from '@/types/lead';
import { mockInteractions } from '@/data/mockInteractions';
import { mockClients } from '@/data/mockClients';
import { mockLeads } from '@/data/mockLeads';
import { formatDateTime, getRelativeTime } from '@/utils/formatDate';
import { interactionTypes, storageKeys } from '@/constants/crm';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { reviveDateFields } from '@/utils/dateReviver';
import {
  getInteractionTypeVariant,
  resolveRelatedName,
} from '@/utils/crmPresentation';

type InteractionFormData = Omit<Interaction, 'id' | 'date'>;

const emptyForm: InteractionFormData = {
  relatedTo: '',
  type: 'E-mail',
  description: '',
  responsible: '',
  nextStep: '',
};

const typeOptions = interactionTypes.map((type) => ({ value: type, label: type }));

export default function InteractionsPage() {
  const [interactions, setInteractions] = useLocalStorageState<Interaction[]>(
    storageKeys.interactions,
    mockInteractions,
    (value) => reviveDateFields<Interaction[]>(value, ['date'])
  );
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<InteractionType | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<InteractionFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const filteredInteractions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return interactions
      .filter((interaction) => {
        const relatedName = resolveRelatedName(interaction.relatedTo, clients, leads).toLowerCase();
        const matchesSearch =
          !normalizedSearch ||
          interaction.description.toLowerCase().includes(normalizedSearch) ||
          interaction.nextStep.toLowerCase().includes(normalizedSearch) ||
          relatedName.includes(normalizedSearch);

        const matchesType = !filterType || interaction.type === filterType;

        return matchesSearch && matchesType;
      })
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [clients, filterType, interactions, leads, searchTerm]);

  const openCreateModal = () => {
    setEditingId(null);
    setFeedback('');
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleSaveInteraction = () => {
    if (!formData.description.trim() || !formData.responsible.trim()) {
      setFeedback('Preencha descrição e responsável para salvar a interação.');
      return;
    }

    if (editingId) {
      setInteractions((currentInteractions) =>
        currentInteractions.map((interaction) =>
          interaction.id === editingId ? { ...interaction, ...formData } : interaction
        )
      );
      setFeedback('Interação atualizada com sucesso.');
    } else {
      const newInteraction: Interaction = {
        id: `int-${Date.now()}`,
        ...formData,
        date: new Date(),
      };

      setInteractions((currentInteractions) => [newInteraction, ...currentInteractions]);
      setFeedback('Interação registrada com sucesso.');
    }

    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(false);
  };

  const handleEditInteraction = (interaction: Interaction) => {
    setFormData({
      relatedTo: interaction.relatedTo,
      type: interaction.type,
      description: interaction.description,
      responsible: interaction.responsible,
      nextStep: interaction.nextStep,
    });
    setEditingId(interaction.id);
    setFeedback('');
    setIsModalOpen(true);
  };

  const handleDeleteInteraction = (id: string) => {
    setInteractions((currentInteractions) =>
      currentInteractions.filter((interaction) => interaction.id !== id)
    );
    setFeedback('Interação removida.');
  };

  return (
    <div>
      <Header title="Interações" subtitle="Histórico de contatos, próximos passos e responsáveis." />

      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_auto] lg:items-end">
          <Input
            label="Busca"
            placeholder="Cliente, lead, descrição ou próximo passo"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <Select
            label="Tipo"
            value={filterType}
            onChange={(event) => setFilterType(event.target.value as InteractionType | '')}
            options={[{ value: '', label: 'Todos os tipos' }, ...typeOptions]}
          />
          <Button variant="primary" onClick={openCreateModal}>
            Nova Interação
          </Button>
        </div>
        <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>{filteredInteractions.length} interação(ões) encontrada(s)</span>
          {feedback && <span className="font-medium text-blue-700">{feedback}</span>}
        </div>
      </Card>

      <div className="space-y-3">
        {filteredInteractions.map((interaction) => {
          const relatedName = resolveRelatedName(interaction.relatedTo, clients, leads);

          return (
            <Card key={interaction.id} className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant={getInteractionTypeVariant(interaction.type)}>
                      {interaction.type}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {getRelativeTime(new Date(interaction.date))}
                    </span>
                  </div>

                  <p className="text-slate-950">{interaction.description}</p>

                  <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-slate-500">Responsável</p>
                      <p className="font-medium text-slate-900">{interaction.responsible}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Relacionado a</p>
                      <p className="font-medium text-slate-900">{relatedName}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Data</p>
                      <p className="font-medium text-slate-900">
                        {formatDateTime(new Date(interaction.date))}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Próximo passo</p>
                      <p className="font-medium text-slate-900">{interaction.nextStep || 'A definir'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 lg:ml-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditInteraction(interaction)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteInteraction(interaction.id)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredInteractions.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-slate-500">Nenhuma interação encontrada.</p>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Interação' : 'Nova Interação'}
        onConfirm={handleSaveInteraction}
        confirmText={editingId ? 'Atualizar' : 'Criar'}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Tipo"
            value={formData.type}
            onChange={(event) =>
              setFormData({ ...formData, type: event.target.value as InteractionType })
            }
            options={typeOptions}
          />
          <Input
            label="Relacionado a"
            value={formData.relatedTo}
            onChange={(event) => setFormData({ ...formData, relatedTo: event.target.value })}
            placeholder="ID do cliente ou lead"
          />
          <Input
            label="Responsável"
            value={formData.responsible}
            onChange={(event) => setFormData({ ...formData, responsible: event.target.value })}
            placeholder="Nome do responsável"
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Descrição"
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              placeholder="Resumo da ligação, reunião ou mensagem"
              rows={4}
            />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              label="Próximo passo"
              value={formData.nextStep}
              onChange={(event) => setFormData({ ...formData, nextStep: event.target.value })}
              placeholder="Próxima ação recomendada"
              rows={2}
            />
          </div>
          {feedback && <p className="text-sm font-medium text-rose-600 sm:col-span-2">{feedback}</p>}
        </div>
      </Modal>
    </div>
  );
}
