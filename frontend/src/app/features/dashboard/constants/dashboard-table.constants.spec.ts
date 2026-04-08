import { BENEFICIO_TABLE_COLUMNS, HISTORICO_TABLE_COLUMNS } from './dashboard-table.constants';

describe('dashboard-table.constants', () => {
  it('exporta colunas', () => {
    expect(BENEFICIO_TABLE_COLUMNS.length).toBeGreaterThan(0);
    expect(HISTORICO_TABLE_COLUMNS.length).toBeGreaterThan(0);
  });
});
