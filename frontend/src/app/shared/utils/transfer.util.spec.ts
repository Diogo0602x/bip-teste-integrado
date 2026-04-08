import { buildTransferHistory } from './transfer.util';

describe('transfer.util', () => {
  it('buildTransferHistory monta registo', () => {
    const h = buildTransferHistory(
      { fromId: 1, toId: 2, amount: 5 },
      { id: 1, nome: 'A', descricao: '', valor: 100, ativo: true, version: 0 },
      { id: 2, nome: 'B', descricao: '', valor: 0, ativo: true, version: 0 },
      'SUCESSO',
      'ok'
    );
    expect(h.fromNome).toBe('A');
    expect(h.toNome).toBe('B');
    expect(h.amount).toBe(5);
    expect(h.status).toBe('SUCESSO');
    expect(h.id).toBeTruthy();
  });
});
