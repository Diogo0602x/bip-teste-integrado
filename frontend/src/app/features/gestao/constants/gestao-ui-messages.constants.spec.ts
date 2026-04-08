import { GESTAO_UI_MESSAGES } from './gestao-ui-messages.constants';

describe('GESTAO_UI_MESSAGES', () => {
  it('define mensagens', () => {
    expect(GESTAO_UI_MESSAGES.beneficio.saveSuccess).toBeTruthy();
    expect(GESTAO_UI_MESSAGES.transferencia.success).toBeTruthy();
  });
});
