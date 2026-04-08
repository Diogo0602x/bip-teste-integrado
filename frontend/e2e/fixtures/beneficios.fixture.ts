import { Beneficio, PagedResponse } from '../../src/app/core/models/beneficio.model';
import { TransferenciaHistorico } from '../../src/app/core/models/transferencia.model';

export const BENEFICIOS: Beneficio[] = [
  { id: 1, nome: 'Vale Alimentação', descricao: 'Benefício de alimentação', valor: 500, ativo: true, version: 0 },
  { id: 2, nome: 'Vale Transporte', descricao: 'Benefício de transporte', valor: 200, ativo: true, version: 0 },
  { id: 3, nome: 'Plano de Saúde', descricao: 'Plano de saúde empresarial', valor: 350, ativo: false, version: 0 },
];

export const PAGED_RESPONSE: PagedResponse<Beneficio> = {
  content: BENEFICIOS,
  page: 0,
  size: 5,
  totalElements: 3,
  totalPages: 1,
  sort: 'nome',
  dir: 'asc',
  query: '',
};

export const EMPTY_PAGED_RESPONSE: PagedResponse<Beneficio> = {
  content: [],
  page: 0,
  size: 5,
  totalElements: 0,
  totalPages: 0,
  sort: 'nome',
  dir: 'asc',
  query: '',
};

export const HISTORICO: TransferenciaHistorico[] = [
  {
    id: 1,
    fromId: 1,
    toId: 2,
    fromNome: 'Vale Alimentação',
    toNome: 'Vale Transporte',
    amount: 100,
    createdAtIso: '2026-04-08T10:00:00Z',
    status: 'SUCESSO',
    detalhe: 'Transferência realizada com sucesso',
  },
];

export const HISTORICO_PAGED_RESPONSE: PagedResponse<TransferenciaHistorico> = {
  content: HISTORICO,
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1,
  sort: 'createdAt',
  dir: 'desc',
  query: null as unknown as string,
};

export const EMPTY_HISTORICO_PAGED_RESPONSE: PagedResponse<TransferenciaHistorico> = {
  content: [],
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
  sort: 'createdAt',
  dir: 'desc',
  query: null as unknown as string,
};
