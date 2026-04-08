import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard.page';
import { BENEFICIOS, PAGED_RESPONSE, HISTORICO } from '../fixtures/beneficios.fixture';

test.describe('Transferências - formulário', () => {
  let dashboard: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboard = new DashboardPage(page);
    await dashboard.mockBeneficiosList();
    await dashboard.goto();
    await dashboard.waitForTable();
    await dashboard.clickTab('Transferências');
  });

  test('exibe título e descrição da seção', async ({ page }) => {
    await expect(page.getByText('Transferência entre benefícios')).toBeVisible();
    await expect(page.getByText('Origem', { exact: true })).toBeVisible();
    await expect(page.getByText('Destino', { exact: true })).toBeVisible();
  });

  test('botão Transferir está desabilitado com formulário inicial vazio', async () => {
    await expect(dashboard.btnTransferir).toBeDisabled();
  });

  test('box explicativo de "Como funciona" é visível', async ({ page }) => {
    await expect(page.locator('.logic-box')).toContainText('Como funciona');
  });

  test('selects de Origem e Destino contêm opções dos benefícios ativos', async ({ page }) => {
    const origemSelect = page.locator('[formcontrolname="fromId"]');
    await expect(origemSelect).toBeVisible();
    for (const b of BENEFICIOS.filter((b) => b.ativo)) {
      await expect(origemSelect).toContainText(b.nome);
    }
  });

  test('selects de Destino não inclui a Origem selecionada', async ({ page }) => {
    const origemSelect = page.locator('[formcontrolname="fromId"]');
    await origemSelect.selectOption({ index: 1 });
    const destinoSelect = page.locator('[formcontrolname="toId"]');
    const options = await destinoSelect.locator('option').allTextContents();
    const includesOrigem = options.some((o) => o.includes('Vale Alimentação'));
    expect(includesOrigem).toBe(false);
  });

  test('transferência bem sucedida exibe snackbar de sucesso', async ({ page }) => {
    await dashboard.mockTransferencia(200);

    const origemSelect = page.locator('[formcontrolname="fromId"]');
    await origemSelect.selectOption({ index: 1 });
    const destinoSelect = page.locator('[formcontrolname="toId"]');
    await destinoSelect.selectOption({ index: 1 });

    const amountInput = page.locator('.tool-field input[inputmode="decimal"]').last();
    await amountInput.fill('5000');
    await amountInput.blur();

    const postRequest = page.waitForRequest((req) =>
      req.url().includes('/transferencias') && req.method() === 'POST'
    );

    await dashboard.btnTransferir.click();
    await page.getByRole('button', { name: 'Confirmar' }).click();
    await postRequest;

    await expect(page.locator('simple-snack-bar, mat-snack-bar-container').first()).toContainText('Transferência realizada com sucesso');
  });
});

test.describe('Histórico de transferências', () => {
  let dashboard: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboard = new DashboardPage(page);
    await dashboard.mockBeneficiosList();
    await dashboard.goto();
    await dashboard.waitForTable();
    await dashboard.clickTab('Histórico');
  });

  test('exibe estado vazio quando não há histórico', async ({ page }) => {
    await expect(page.locator('.empty-state').last()).toContainText('Ainda não há transferências');
  });

  test('após transferência bem sucedida o histórico é atualizado', async ({ page }) => {
    await dashboard.mockTransferencia(200);
    await dashboard.clickTab('Transferências');

    const origemSelect = page.locator('[formcontrolname="fromId"]');
    await origemSelect.selectOption({ index: 1 });
    const destinoSelect = page.locator('[formcontrolname="toId"]');
    await destinoSelect.selectOption({ index: 1 });

    const amountInput = page.locator('.tool-field input[inputmode="decimal"]').last();
    await amountInput.fill('10000');
    await amountInput.blur();

    await dashboard.btnTransferir.click();
    await page.getByRole('button', { name: 'Confirmar' }).click();
    await page.waitForTimeout(500);

    await dashboard.clickTab('Histórico');
    const rows = page.locator('mat-tab-body').last().locator('tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('colunas da tabela de histórico estão presentes', async ({ page }) => {
    await expect(page.locator('mat-tab-body').last()).toContainText('Data/hora');
    await expect(page.locator('mat-tab-body').last()).toContainText('Origem');
    await expect(page.locator('mat-tab-body').last()).toContainText('Destino');
    await expect(page.locator('mat-tab-body').last()).toContainText('Valor');
    await expect(page.locator('mat-tab-body').last()).toContainText('Status');
  });
});
