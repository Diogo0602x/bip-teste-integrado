import { DashboardTab } from './dashboard-tab.enum';

describe('DashboardTab', () => {
  it('define abas', () => {
    expect(DashboardTab.Beneficios).toBe(0);
    expect(DashboardTab.Transferencias).toBe(1);
    expect(DashboardTab.Historico).toBe(2);
  });
});
