import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard.page';
import { BeneficioFormDialog, BeneficioViewDialog, ConfirmDialog } from '../pages/dialogs.page';
import { BENEFICIOS, PAGED_RESPONSE } from '../fixtures/beneficios.fixture';

test.describe('Benefícios - criar', () => {
  let dashboard: DashboardPage;
  let formDialog: BeneficioFormDialog;

  test.beforeEach(async ({ page }) => {
    dashboard = new DashboardPage(page);
    formDialog = new BeneficioFormDialog(page);
    await dashboard.mockBeneficiosList();
    await dashboard.goto();
    await dashboard.waitForTable();
  });

  test('clique em "Criar novo benefício" abre o dialog de criação', async () => {
    await dashboard.btnCriarBeneficio.click();
    await formDialog.waitForOpen();
    await expect(formDialog.title).toContainText('Criar novo benefício');
  });

  test('dialog de criação exibe os campos do formulário', async () => {
    await dashboard.btnCriarBeneficio.click();
    await formDialog.waitForOpen();
    await expect(formDialog.inputNome).toBeVisible();
    await expect(formDialog.inputDescricao).toBeVisible();
    await expect(formDialog.inputValor).toBeVisible();
    await expect(formDialog.selectAtivo).toBeVisible();
  });

  test('botão Salvar está desabilitado com formulário vazio', async () => {
    await dashboard.btnCriarBeneficio.click();
    await formDialog.waitForOpen();
    await expect(formDialog.btnSalvar).toBeDisabled();
  });

  test('cancelar fecha o dialog sem fazer requisição', async ({ page }) => {
    let postCalled = false;
    await page.route('**/beneficios', (route) => {
      if (route.request().method() === 'POST') postCalled = true;
      route.continue();
    });
    await dashboard.btnCriarBeneficio.click();
    await formDialog.waitForOpen();
    await formDialog.cancel();
    await expect(formDialog.dialog).toBeHidden();
    expect(postCalled).toBe(false);
  });

  test('preencher formulário habilita o botão Salvar', async ({ page }) => {
    await dashboard.btnCriarBeneficio.click();
    await formDialog.waitForOpen();
    await formDialog.fill('Novo Benefício', 'Descrição do benefício', '1000');
    await formDialog.selectStatus(true);
    await expect(formDialog.btnSalvar).not.toBeDisabled();
  });

  test('salvar envia POST para a API e fecha o dialog', async ({ page }) => {
    const newBeneficio = { id: 99, nome: 'Novo Benefício', descricao: 'Desc', valor: 1000, ativo: true, version: 0 };
    await dashboard.mockCreateBeneficio(newBeneficio);

    const postRequest = page.waitForRequest((req) =>
      req.url().includes('/beneficios') && req.method() === 'POST'
    );

    await dashboard.btnCriarBeneficio.click();
    await formDialog.waitForOpen();
    await formDialog.fill('Novo Benefício', 'Desc', '1000');
    await formDialog.selectStatus(true);
    await formDialog.save();

    const req = await postRequest;
    const body = req.postDataJSON();
    expect(body.nome).toBe('Novo Benefício');
    expect(body.ativo).toBe(true);
  });
});

test.describe('Benefícios - editar', () => {
  let dashboard: DashboardPage;
  let formDialog: BeneficioFormDialog;

  test.beforeEach(async ({ page }) => {
    dashboard = new DashboardPage(page);
    formDialog = new BeneficioFormDialog(page);
    await dashboard.mockBeneficiosList();
    await dashboard.goto();
    await dashboard.waitForTable();
  });

  test('clique em editar abre o dialog com título "Editar benefício"', async () => {
    await dashboard.btnEditInRow('Vale Alimentação').click();
    await formDialog.waitForOpen();
    await expect(formDialog.title).toContainText('Editar benefício');
  });

  test('dialog de edição pré-preenche os campos com os valores do benefício', async ({ page }) => {
    await dashboard.btnEditInRow('Vale Alimentação').click();
    await formDialog.waitForOpen();
    await expect(formDialog.inputNome).toHaveValue('Vale Alimentação');
  });

  test('salvar edição envia PUT para a API com ID correto', async ({ page }) => {
    const updated = { ...BENEFICIOS[0], nome: 'Vale Alimentação Atualizado' };
    await dashboard.mockUpdateBeneficio(1, updated);

    const putRequest = page.waitForRequest((req) =>
      req.url().includes('/beneficios/1') && req.method() === 'PUT'
    );

    await dashboard.btnEditInRow('Vale Alimentação').click();
    await formDialog.waitForOpen();
    await formDialog.inputNome.fill('Vale Alimentação Atualizado');
    await formDialog.save();

    await putRequest;
  });
});

test.describe('Benefícios - visualizar', () => {
  let dashboard: DashboardPage;
  let viewDialog: BeneficioViewDialog;

  test.beforeEach(async ({ page }) => {
    dashboard = new DashboardPage(page);
    viewDialog = new BeneficioViewDialog(page);
    await dashboard.mockBeneficiosList();
    await dashboard.goto();
    await dashboard.waitForTable();
  });

  test('clique em visualizar abre o dialog de visualização', async () => {
    await dashboard.btnViewInRow('Vale Alimentação').click();
    await viewDialog.waitForOpen();
    await expect(viewDialog.dialog).toBeVisible();
  });

  test('dialog de visualização exibe o nome do benefício', async ({ page }) => {
    await dashboard.btnViewInRow('Vale Alimentação').click();
    await viewDialog.waitForOpen();
    await expect(viewDialog.dialog).toContainText('Vale Alimentação');
  });

  test('botão Fechar fecha o dialog de visualização', async () => {
    await dashboard.btnViewInRow('Vale Alimentação').click();
    await viewDialog.waitForOpen();
    await viewDialog.close();
    await expect(viewDialog.dialog).toBeHidden();
  });
});

test.describe('Benefícios - excluir', () => {
  let dashboard: DashboardPage;
  let confirmDialog: ConfirmDialog;

  test.beforeEach(async ({ page }) => {
    dashboard = new DashboardPage(page);
    confirmDialog = new ConfirmDialog(page);
    await dashboard.mockBeneficiosList();
    await dashboard.goto();
    await dashboard.waitForTable();
  });

  test('clique em excluir abre dialog de confirmação', async () => {
    await dashboard.btnDeleteInRow('Vale Alimentação').click();
    await confirmDialog.waitForOpen();
    await expect(confirmDialog.dialog).toBeVisible();
  });

  test('cancelar exclusão fecha o dialog sem DELETE na API', async ({ page }) => {
    let deleteCalled = false;
    await page.route('**/beneficios/1', (route) => {
      if (route.request().method() === 'DELETE') deleteCalled = true;
      route.continue();
    });
    await dashboard.btnDeleteInRow('Vale Alimentação').click();
    await confirmDialog.waitForOpen();
    await confirmDialog.cancel();
    await expect(confirmDialog.dialog).toBeHidden();
    expect(deleteCalled).toBe(false);
  });

  test('confirmar exclusão envia DELETE para a API', async ({ page }) => {
    await dashboard.mockDeleteBeneficio(1);
    const deleteRequest = page.waitForRequest((req) =>
      req.url().includes('/beneficios/1') && req.method() === 'DELETE'
    );
    await dashboard.btnDeleteInRow('Vale Alimentação').click();
    await confirmDialog.waitForOpen();
    await confirmDialog.confirm();
    await deleteRequest;
  });
});

test.describe('Benefícios - paginação', () => {
  test.beforeEach(async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.mockBeneficiosList();
    await dashboard.goto();
    await dashboard.waitForTable();
  });

  test('botão Anterior está desabilitado na primeira página', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await expect(dashboard.btnAnterior).toBeDisabled();
  });

  test('botão Próxima está desabilitado quando há apenas 1 página', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await expect(dashboard.btnProxima).toBeDisabled();
  });

  test('alterar tamanho de página envia nova requisição com size correto', async ({ page }) => {
    const sizeRequest = page.waitForRequest((req) =>
      req.url().includes('size=10')
    );
    const pageSizeSelect = page.locator('.page-size-control select');
    await pageSizeSelect.selectOption('10');
    await sizeRequest;
  });
});
