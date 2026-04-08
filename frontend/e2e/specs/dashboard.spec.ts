import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard.page';
import { PAGED_RESPONSE } from '../fixtures/beneficios.fixture';

test.describe('Dashboard - estrutura e navegação', () => {
  let dashboard: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboard = new DashboardPage(page);
    await dashboard.mockBeneficiosList();
    await dashboard.goto();
    await dashboard.waitForTable();
  });

  test('exibe a toolbar com o nome da aplicação', async () => {
    await expect(dashboard.toolbar).toContainText('BIP Benefícios');
  });

  test('exibe as três abas: Benefícios, Transferências, Histórico', async () => {
    await expect(dashboard.tabBeneficios).toBeVisible();
    await expect(dashboard.tabTransferencias).toBeVisible();
    await expect(dashboard.tabHistorico).toBeVisible();
  });

  test('aba Benefícios está selecionada por padrão', async ({ page }) => {
    const tab = page.getByRole('tab', { name: 'Benefícios' });
    await expect(tab).toHaveAttribute('aria-selected', 'true');
  });

  test('navegar para aba Transferências exibe o formulário de transferência', async ({ page }) => {
    await dashboard.clickTab('Transferências');
    await expect(page.getByText('Transferência entre benefícios')).toBeVisible();
    await expect(page.getByText('Origem', { exact: true })).toBeVisible();
    await expect(page.getByText('Destino', { exact: true })).toBeVisible();
  });

  test('navegar para aba Histórico exibe a tabela de histórico', async ({ page }) => {
    await dashboard.clickTab('Histórico');
    await expect(page.getByText('Histórico de transferências')).toBeVisible();
  });

  test('exibe rodapé com texto de segurança', async ({ page }) => {
    const footer = page.locator('.footer');
    await expect(footer).toContainText('segurança');
  });
});

test.describe('Dashboard - lista de benefícios', () => {
  let dashboard: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboard = new DashboardPage(page);
    await dashboard.mockBeneficiosList();
    await dashboard.goto();
    await dashboard.waitForTable();
  });

  test('exibe os benefícios da API na tabela', async ({ page }) => {
    for (const b of PAGED_RESPONSE.content) {
      await expect(page.locator('table').first()).toContainText(b.nome);
    }
  });

  test('exibe informações de paginação', async () => {
    await expect(dashboard.paginacaoMeta).toContainText('Página 1 de 1');
    await expect(dashboard.paginacaoMeta).toContainText('3 itens');
  });

  test('exibe status pill "Ativo" e "Inativo" corretamente', async ({ page }) => {
    const activeRows = page.locator('.status-pill.is-active');
    const inactiveRows = page.locator('.status-pill.is-inactive');
    await expect(activeRows.first()).toBeVisible();
    await expect(inactiveRows.first()).toBeVisible();
  });

  test('exibe estado vazio quando a API retorna lista vazia', async ({ page }) => {
    await dashboard.mockEmptyList();
    await page.reload();
    await expect(page.locator('.empty-state').first()).toContainText('Nenhum benefício encontrado');
  });

  test('botão "Criar novo benefício" está visível', async () => {
    await expect(dashboard.btnCriarBeneficio).toBeVisible();
  });
});

test.describe('Dashboard - busca e filtros', () => {
  let dashboard: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboard = new DashboardPage(page);
    await dashboard.mockBeneficiosList();
    await dashboard.goto();
    await dashboard.waitForTable();
  });

  test('campo de busca aceita texto e botão Buscar faz nova requisição', async ({ page }) => {
    const searchRequest = page.waitForRequest((req) =>
      req.url().includes('/beneficios') && req.url().includes('q=Vale')
    );
    await dashboard.inputBusca.fill('Vale');
    await dashboard.btnBuscar.click();
    await searchRequest;
  });

  test('pressionar Enter no campo de busca dispara a busca', async ({ page }) => {
    const searchRequest = page.waitForRequest((req) =>
      req.url().includes('/beneficios') && req.url().includes('q=Plano')
    );
    await dashboard.inputBusca.fill('Plano');
    await dashboard.inputBusca.press('Enter');
    await searchRequest;
  });

  test('filtro de status envia parâmetro correto na requisição', async ({ page }) => {
    const activeRequest = page.waitForRequest((req) =>
      req.url().includes('/beneficios') && req.url().includes('ativo=true')
    );
    await dashboard.selectStatus.selectOption('active');
    await activeRequest;
  });

  test('botão Limpar é habilitado após filtro e dispara busca sem filtros', async ({ page }) => {
    await dashboard.inputBusca.fill('teste');
    await dashboard.btnBuscar.click();
    await expect(dashboard.btnLimpar).not.toBeDisabled();
    await dashboard.btnLimpar.click();
    await expect(dashboard.inputBusca).toHaveValue('');
  });

  test('ordenar por nome faz requisição com sort=nome e alterna dir', async ({ page }) => {
    const sortRequest = page.waitForRequest((req) =>
      req.url().includes('sort=nome') && req.url().includes('dir=desc')
    );
    const nomeHeader = page.getByRole('button', { name: /Nome/ }).first();
    await nomeHeader.click();
    await sortRequest;
  });
});
