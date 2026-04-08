import { TransferenciaHistoryService } from './transferencia-history.service';
import { TransferenciaHistorico } from '../models/transferencia.model';

describe('TransferenciaHistoryService', () => {
  const key = 'bip-transferencias-historico';

  beforeEach(() => {
    localStorage.removeItem(key);
  });

  it('list retorna vazio sem dados', () => {
    const s = new TransferenciaHistoryService();
    expect(s.list()).toEqual([]);
  });

  it('add persiste e list lê', () => {
    const s = new TransferenciaHistoryService();
    const item: TransferenciaHistorico = {
      id: '1',
      fromId: 1,
      toId: 2,
      fromNome: 'A',
      toNome: 'B',
      amount: 10,
      createdAtIso: new Date().toISOString(),
      status: 'SUCESSO',
      detalhe: 'ok'
    };
    s.add(item);
    expect(s.list()[0].id).toBe('1');
  });

  it('add limita a 100 entradas', () => {
    const s = new TransferenciaHistoryService();
    for (let i = 0; i < 105; i++) {
      s.add({
        id: String(i),
        fromId: 1,
        toId: 2,
        fromNome: 'A',
        toNome: 'B',
        amount: 1,
        createdAtIso: '',
        status: 'SUCESSO',
        detalhe: ''
      });
    }
    expect(s.list().length).toBe(100);
  });
});
