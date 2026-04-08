import { BENEFICIO_TABLE_COLUMNS, HISTORICO_TABLE_COLUMNS } from './gestao-table.constants';

describe('gestao-table.constants', () => {
  it('exporta colunas', () => {
    expect(BENEFICIO_TABLE_COLUMNS.length).toBeGreaterThan(0);
    expect(HISTORICO_TABLE_COLUMNS.length).toBeGreaterThan(0);
  });
});
