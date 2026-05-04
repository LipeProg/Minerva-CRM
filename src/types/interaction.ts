export type InteractionType = 'Ligação' | 'WhatsApp' | 'E-mail' | 'Reunião' | 'Observação interna';

export interface Interaction {
  id: string;
  relatedTo: string; // Client or Lead ID
  type: InteractionType;
  description: string;
  date: Date;
  responsible: string;
  nextStep: string;
}
