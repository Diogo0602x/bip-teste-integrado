import { DASHBOARD_UI_MESSAGES } from './dashboard-ui-messages.constants';

describe('DASHBOARD_UI_MESSAGES', () => {
  it('define mensagens', () => {
    expect(DASHBOARD_UI_MESSAGES.beneficio.saveSuccess).toBeTruthy();
    expect(DASHBOARD_UI_MESSAGES.transferencia.success).toBeTruthy();
  });
});
