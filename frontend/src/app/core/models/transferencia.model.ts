export interface TransferenciaRequest {
  fromId: number;
  toId: number;
  amount: number;
}

export interface TransferenciaHistorico {
  id: string;
  fromId: number;
  toId: number;
  fromNome: string;
  toNome: string;
  amount: number;
  createdAtIso: string;
  status: 'SUCESSO' | 'FALHA';
  detalhe: string;
}
