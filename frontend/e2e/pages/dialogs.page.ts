import { Page, Locator } from '@playwright/test';

export class BeneficioFormDialog {
  readonly dialog: Locator;
  readonly inputNome: Locator;
  readonly inputDescricao: Locator;
  readonly inputValor: Locator;
  readonly selectAtivo: Locator;
  readonly btnSalvar: Locator;
  readonly btnCancelar: Locator;
  readonly title: Locator;

  constructor(private readonly page: Page) {
    this.dialog = page.locator('mat-dialog-container');
    this.inputNome = page.locator('input[formcontrolname="nome"]');
    this.inputDescricao = page.locator('textarea[formcontrolname="descricao"]');
    this.inputValor = page.locator('mat-dialog-content input[type="text"][inputmode="decimal"]');
    this.selectAtivo = page.locator('mat-select[formcontrolname="ativo"]');
    this.btnSalvar = page.getByRole('button', { name: 'Salvar' });
    this.btnCancelar = page.getByRole('button', { name: 'Cancelar' });
    this.title = page.locator('h2[mat-dialog-title]');
  }

  async waitForOpen() {
    await this.dialog.waitFor({ state: 'visible' });
  }

  async fill(nome: string, descricao: string, valor: string) {
    await this.inputNome.fill(nome);
    await this.inputDescricao.fill(descricao);
    await this.inputValor.clear();
    await this.inputValor.fill(valor);
    await this.inputValor.blur();
  }

  async selectStatus(ativo: boolean) {
    await this.selectAtivo.click();
    const panel = this.page.locator('mat-option');
    await panel.filter({ hasText: new RegExp(`^${ativo ? 'Ativo' : 'Inativo'}$`) }).click();
  }

  async save() {
    await this.btnSalvar.click();
    await this.dialog.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
  }

  async cancel() {
    await this.btnCancelar.click();
    await this.dialog.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
  }
}

export class BeneficioViewDialog {
  readonly dialog: Locator;
  readonly btnFechar: Locator;

  constructor(private readonly page: Page) {
    this.dialog = page.locator('mat-dialog-container');
    this.btnFechar = page.getByRole('button', { name: 'Fechar' });
  }

  async waitForOpen() {
    await this.dialog.waitFor({ state: 'visible' });
  }

  async close() {
    await this.btnFechar.click();
    await this.dialog.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
  }
}

export class ConfirmDialog {
  readonly dialog: Locator;
  readonly btnConfirmar: Locator;
  readonly btnCancelar: Locator;

  constructor(private readonly page: Page) {
    this.dialog = page.locator('mat-dialog-container');
    this.btnConfirmar = page.getByRole('button', { name: /Excluir|Confirmar/ });
    this.btnCancelar = page.getByRole('button', { name: /Cancelar/ });
  }

  async waitForOpen() {
    await this.dialog.waitFor({ state: 'visible' });
  }

  async confirm() {
    await this.btnConfirmar.click();
    await this.dialog.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
  }

  async cancel() {
    await this.btnCancelar.click();
    await this.dialog.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
  }
}
