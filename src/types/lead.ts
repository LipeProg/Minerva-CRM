export type LeadStage = 'Novo lead' | 'Primeiro contato' | 'Proposta enviada' | 'Em negociação' | 'Fechado' | 'Perdido';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  stage: LeadStage;
  estimatedValue: number;
  responsible: string;
  createdAt: Date;
  lastInteractionAt: Date;
  notes: string;
}
