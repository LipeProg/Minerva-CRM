export type ClientStatus = 'Ativo' | 'Inativo' | 'Em negociação' | 'Cliente potencial';

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  status: ClientStatus;
  source: string;
  createdAt: Date;
  notes: string;
}
