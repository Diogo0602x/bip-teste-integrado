export interface Beneficio {
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  ativo: boolean;
  version: number;
}

export interface BeneficioPayload {
  nome: string;
  descricao: string;
  valor: number;
  ativo: boolean;
}

export interface BeneficioQueryParams {
  q: string;
  ativo: boolean | null;
  page: number;
  size: number;
  sort: 'nome' | 'valor' | 'ativo' | 'id';
  dir: 'asc' | 'desc';
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sort: string;
  dir: string;
  query: string;
}
