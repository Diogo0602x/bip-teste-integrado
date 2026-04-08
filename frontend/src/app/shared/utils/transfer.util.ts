import { Beneficio } from '../../core/models/beneficio.model';
import { TransferenciaHistorico, TransferenciaRequest } from '../../core/models/transferencia.model';

export function buildTransferHistory(
  payload: TransferenciaRequest,
  from: Beneficio,
  to: Beneficio,
  status: 'SUCESSO' | 'FALHA',
  detalhe: string
): TransferenciaHistorico {
  return {
    id: crypto.randomUUID(),
    fromId: from.id,
    toId: to.id,
    fromNome: from.nome,
    toNome: to.nome,
    amount: payload.amount,
    createdAtIso: new Date().toISOString(),
    status,
    detalhe
  };
}
