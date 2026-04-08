import { Page, Locator } from '@playwright/test';
import { PagedResponse } from '../../src/app/core/models/beneficio.model';
import { PAGED_RESPONSE, EMPTY_PAGED_RESPONSE } from '../fixtures/beneficios.fixture';

const API = 'http://localhost:8080/api/v1';

export class DashboardPage {
  readonly toolbar: Locator;
  readonly tabBeneficios: Locator;
  readonly tabTransferencias: Locator;
  readonly tabHistorico: Locator;
  readonly btnCriarBeneficio: Locator;
  readonly inputBusca: Locator;
  readonly btnBuscar: Locator;
  readonly btnLimpar: Locator;
  readonly selectStatus: Locator;
  readonly emptyState: Locator;
  readonly tabelaBeneficios: Locator;
  readonly paginacaoMeta: Locator;
  readonly btnAnterior: Locator;
  readonly btnProxima: Locator;
  readonly btnTransferir: Locator;
  readonly selectOrigem: Locator;
  readonly selectDestino: Locator;
  readonly inputValorTransferencia: Locator;
  readonly emptyHistorico: Locator;

  constructor(private readonly page: Page) {
    this.toolbar = page.locator('mat-toolbar');
    this.tabBeneficios = page.getByRole('tab', { name: 'Benefícios' });
    this.tabTransferencias = page.getByRole('tab', { name: 'Transferências' });
    this.tabHistorico = page.getByRole('tab', { name: 'Histórico' });
    this.btnCriarBeneficio = page.getByRole('button', { name: /Criar novo benefício/ });
    this.inputBusca = page.getByPlaceholder('Buscar benefício');
    this.btnBuscar = page.getByRole('button', { name: 'Buscar' });
    this.btnLimpar = page.getByRole('button', { name: 'Limpar' });
    this.selectStatus = page.locator('select.form-select').first();
    this.emptyState = page.locator('.empty-state').first();
    this.tabelaBeneficios = page.locator('table.desktop-table').first();
    this.paginacaoMeta = page.locator('.pagination-meta');
    this.btnAnterior = page.getByRole('button', { name: 'Anterior' });
    this.btnProxima = page.getByRole('button', { name: 'Próxima' });
    this.btnTransferir = page.getByRole('button', { name: 'Transferir' });
    this.selectOrigem = page.locator('[formcontrolname="fromId"]');
    this.selectDestino = page.locator('[formcontrolname="toId"]');
    this.inputValorTransferencia = page.locator('[formcontrolname]').filter({ hasText: '' }).last();
    this.emptyHistorico = page.locator('.empty-state').last();
  }

  async goto() {
    await this.page.goto('/');
  }

  async mockBeneficiosList(response: PagedResponse<any> = PAGED_RESPONSE) {
    await this.page.route(`${API}/beneficios**`, (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(response) });
      } else {
        route.continue();
      }
    });
  }

  async mockEmptyList() {
    await this.mockBeneficiosList(EMPTY_PAGED_RESPONSE);
  }

  async mockCreateBeneficio(created: object) {
    await this.page.route(`${API}/beneficios`, (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(created) });
      } else {
        route.continue();
      }
    });
  }

  async mockUpdateBeneficio(id: number, updated: object) {
    await this.page.route(`${API}/beneficios/${id}`, (route) => {
      if (route.request().method() === 'PUT') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(updated) });
      } else {
        route.continue();
      }
    });
  }

  async mockDeleteBeneficio(id: number) {
    await this.page.route(`${API}/beneficios/${id}`, (route) => {
      if (route.request().method() === 'DELETE') {
        route.fulfill({ status: 204, body: '' });
      } else {
        route.continue();
      }
    });
  }

  async mockHistorico(response?: object) {
    const empty = { content: [], page: 0, size: 20, totalElements: 0, totalPages: 0, sort: 'createdAt', dir: 'desc', query: null };
    await this.page.route(`${API}/beneficios/transferencias/historico*`, (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(response ?? empty) });
      } else {
        route.continue();
      }
    });
  }

  async mockTransferencia(status = 200) {
    await this.page.route(`${API}/beneficios/transferencias`, (route) => {
      if (status === 200) {
        route.fulfill({ status: 200, body: '' });
      } else {
        route.fulfill({
          status,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Saldo insuficiente' }),
        });
      }
    });
  }

  rowByName(nome: string) {
    return this.page.locator('tr').filter({ hasText: nome });
  }

  btnViewInRow(nome: string) {
    return this.rowByName(nome).getByRole('button', { name: 'Visualizar benefício' });
  }

  btnEditInRow(nome: string) {
    return this.rowByName(nome).getByRole('button', { name: 'Editar benefício' });
  }

  btnDeleteInRow(nome: string) {
    return this.rowByName(nome).getByRole('button', { name: 'Excluir benefício' });
  }

  async waitForTable() {
    await this.tabelaBeneficios.waitFor({ state: 'visible' });
  }

  async clickTab(tab: 'Benefícios' | 'Transferências' | 'Histórico') {
    await this.page.getByRole('tab', { name: tab }).click();
    await this.page.waitForTimeout(300);
  }
}
