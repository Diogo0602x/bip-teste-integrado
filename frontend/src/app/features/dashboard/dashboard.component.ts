import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Beneficio, BeneficioPayload, BeneficioQueryParams } from '../../core/models/beneficio.model';
import { TransferenciaHistorico, TransferenciaRequest } from '../../core/models/transferencia.model';
import { BeneficioApiService } from '../../core/services/beneficio-api.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DashboardTab } from '../../core/enums/dashboard-tab.enum';
import { formatCurrencyBRL, formatDateTimeBR } from '../../shared/utils/formatters.util';
import { NotificationService } from '../../shared/services/notification.service';
import { FeedbackType } from '../../shared/enums/feedback-type.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BeneficioViewDialogComponent } from '../beneficios/components/beneficio-view-dialog/beneficio-view-dialog.component';
import { BeneficioFormDialogComponent } from '../beneficios/components/beneficio-form-dialog/beneficio-form-dialog.component';
import { DASHBOARD_UI_MESSAGES } from './constants/dashboard-ui-messages.constants';
import { BENEFICIO_TABLE_COLUMNS, HISTORICO_TABLE_COLUMNS } from './constants/dashboard-table.constants';
import { BeneficioListStore } from '../../store/beneficio-list.store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly service = inject(BeneficioApiService);
  private readonly listStore = inject(BeneficioListStore);
  private readonly notification = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);
  readonly tabs = DashboardTab;
  selectedTab = DashboardTab.Beneficios;
  beneficios: Beneficio[] = [];
  historico: TransferenciaHistorico[] = [];
  beneficioColumns: string[] = [...BENEFICIO_TABLE_COLUMNS];
  historicoColumns: string[] = [...HISTORICO_TABLE_COLUMNS];
  search = '';
  page = 0;
  size = 5;
  totalPages = 0;
  totalElements = 0;
  isLoading = false;
  skeletonRows = Array.from({ length: 5 });
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  sort: BeneficioQueryParams['sort'] = 'nome';
  dir: BeneficioQueryParams['dir'] = 'asc';
  transferAmountDisplay = this.formatCurrency(0);

  readonly transferenciaForm = this.fb.nonNullable.group({
    fromId: [0, [Validators.required, Validators.min(1)]],
    toId: [0, [Validators.required, Validators.min(1)]],
    amount: [0, [Validators.required, Validators.min(0.01)]]
  });

  ngOnInit(): void {
    this.listStore.state$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        this.beneficios = state.items;
        this.page = state.page;
        this.size = state.size;
        this.totalPages = state.totalPages;
        this.totalElements = state.totalElements;
        this.isLoading = state.loading;
      });

    this.load();
    this.loadHistorico();
    this.transferenciaForm.valueChanges.subscribe((value) => {
      if (value.fromId && value.toId && value.fromId === value.toId) {
        this.transferenciaForm.patchValue({ toId: 0 }, { emitEvent: false });
      }
    });
  }

  load(): void {
    this.listStore.load(this.buildQueryParams());
  }

  submitBeneficio(): void {
    const ref = this.dialog.open(BeneficioFormDialogComponent, {
      width: '760px',
      maxWidth: '95vw',
      panelClass: 'beneficio-dialog',
      data: { mode: 'create' }
    });
    ref.afterClosed().subscribe((payload: BeneficioPayload | undefined) => {
      if (!payload) return;
      this.service.create(payload).subscribe({
        next: () => {
          this.listStore.invalidate();
          this.showMessage(DASHBOARD_UI_MESSAGES.beneficio.saveSuccess, FeedbackType.Success);
          this.load();
        },
        error: () => this.showMessage(DASHBOARD_UI_MESSAGES.beneficio.saveError, FeedbackType.Error)
      });
    });
  }

  edit(item: Beneficio): void {
    const ref = this.dialog.open(BeneficioFormDialogComponent, {
      width: '760px',
      maxWidth: '95vw',
      panelClass: 'beneficio-dialog',
      data: { mode: 'edit', beneficio: item }
    });
    ref.afterClosed().subscribe((payload: BeneficioPayload | undefined) => {
      if (!payload) return;
      this.service.update(item.id, payload).subscribe({
        next: () => {
          this.listStore.invalidate();
          this.showMessage(DASHBOARD_UI_MESSAGES.beneficio.saveSuccess, FeedbackType.Success);
          this.load();
        },
        error: () => this.showMessage(DASHBOARD_UI_MESSAGES.beneficio.saveError, FeedbackType.Error)
      });
    });
  }

  view(item: Beneficio): void {
    this.dialog.open(BeneficioViewDialogComponent, {
      width: '640px',
      maxWidth: '95vw',
      panelClass: 'beneficio-dialog',
      data: item
    });
  }

  remove(item: Beneficio): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      maxWidth: '95vw',
      data: {
        title: 'Confirmar exclusão',
        message: `Deseja excluir ${item.nome}? Regra: apenas benefícios inativos e com saldo zerado podem ser excluídos.`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });
    ref.afterClosed().subscribe((ok: boolean | undefined) => {
      if (!ok) return;
      this.service.delete(item.id).subscribe({
        next: () => {
          this.listStore.invalidate();
          this.showMessage(DASHBOARD_UI_MESSAGES.beneficio.deleteSuccess, FeedbackType.Success);
          this.load();
        },
        error: (err) => this.showMessage(err?.error?.message ?? DASHBOARD_UI_MESSAGES.beneficio.deleteError, FeedbackType.Error)
      });
    });
  }

  transferir(): void {
    if (!this.canTransfer) {
      this.showMessage(DASHBOARD_UI_MESSAGES.transferencia.invalidForm, FeedbackType.Warning);
      return;
    }
    const payload: TransferenciaRequest = this.transferenciaForm.getRawValue();
    const from = this.beneficios.find((b) => b.id === payload.fromId);
    const to = this.beneficios.find((b) => b.id === payload.toId);
    if (!from || !to) {
      this.showMessage(DASHBOARD_UI_MESSAGES.transferencia.invalidEndpoints, FeedbackType.Error);
      return;
    }
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      maxWidth: '95vw',
      data: {
        title: 'Confirmar transferência',
        message: `Transferir ${this.formatCurrency(payload.amount)} de ${from.nome} para ${to.nome}?`,
        confirmText: 'Confirmar',
        cancelText: 'Voltar'
      }
    });
    ref.afterClosed().subscribe((ok: boolean | undefined) => {
      if (!ok) return;
      this.service.transfer(payload).subscribe({
        next: () => {
          this.listStore.invalidate();
          this.loadHistorico();
          this.selectedTab = DashboardTab.Historico;
          this.showMessage(DASHBOARD_UI_MESSAGES.transferencia.success, FeedbackType.Success);
          this.load();
        },
        error: (err) => {
          this.showMessage(err?.error?.message ?? DASHBOARD_UI_MESSAGES.transferencia.error, FeedbackType.Error);
        }
      });
    });
  }

  formatDate(iso: string): string {
    return formatDateTimeBR(iso);
  }

  private loadHistorico(): void {
    this.service.getHistorico(0, 20).subscribe({
      next: (res) => { this.historico = res.content; }
    });
  }

  displayBeneficio(item: Beneficio): string {
    return `${item.nome} - ${this.formatCurrency(item.valor)}`;
  }

  formatCurrency(value: number): string {
    return formatCurrencyBRL(value);
  }

  onSearch(): void {
    this.page = 0;
    this.load();
  }

  onTransferAmountInput(raw: string): void {
    const digitsOnly = raw.replace(/\D/g, '');
    const normalizedDigits = digitsOnly === '' ? '0' : digitsOnly;
    const numericValue = Number(normalizedDigits) / 100;
    this.transferenciaForm.controls.amount.setValue(numericValue);
    this.transferAmountDisplay = this.formatCurrency(numericValue);
  }

  onTransferAmountBlur(): void {
    this.transferAmountDisplay = this.formatCurrency(this.transferenciaForm.controls.amount.value);
  }

  clearSearch(): void {
    this.search = '';
    this.statusFilter = 'all';
    this.sort = 'nome';
    this.dir = 'asc';
    this.page = 0;
    this.load();
  }

  toggleSort(field: 'nome' | 'valor'): void {
    if (this.sort === field) {
      this.dir = this.dir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sort = field;
      this.dir = 'asc';
    }
    this.page = 0;
    this.load();
  }

  onSizeChange(value: number): void {
    this.size = Number(value);
    this.page = 0;
    this.load();
  }

  onStatusFilterChange(value: 'all' | 'active' | 'inactive'): void {
    this.statusFilter = value;
    this.page = 0;
    this.load();
  }

  prevPage(): void {
    if (this.page <= 0) return;
    this.page -= 1;
    this.load();
  }

  nextPage(): void {
    if (this.page + 1 >= this.totalPages) return;
    this.page += 1;
    this.load();
  }

  get origemOptions(): Beneficio[] {
    const destino = this.transferenciaForm.getRawValue().toId;
    return this.beneficios.filter((item) => item.id !== destino && item.ativo && item.valor > 0);
  }

  get destinoOptions(): Beneficio[] {
    const origem = this.transferenciaForm.getRawValue().fromId;
    return this.beneficios.filter((item) => item.id !== origem && item.ativo);
  }

  get fromBeneficio(): Beneficio | undefined {
    const fromId = this.transferenciaForm.getRawValue().fromId;
    return this.beneficios.find((item) => item.id === fromId);
  }

  get maxTransferAmount(): number {
    return this.fromBeneficio?.valor ?? 0;
  }

  get canTransfer(): boolean {
    const value = this.transferenciaForm.getRawValue();
    if (!value.fromId || !value.toId || value.fromId === value.toId) return false;
    if (value.amount <= 0) return false;
    return value.amount < this.maxTransferAmount;
  }

  get hasActiveFilters(): boolean {
    const hasSearch = this.search.trim().length > 0;
    const hasStatus = this.statusFilter !== 'all';
    const hasSortOverride = this.sort !== 'nome' || this.dir !== 'asc';
    return hasSearch || hasStatus || hasSortOverride;
  }

  private showMessage(message: string, type: FeedbackType): void {
    this.notification.show(message, type);
  }

  private buildQueryParams(): BeneficioQueryParams {
    return {
      q: this.search.trim(),
      ativo: this.statusFilter === 'all' ? null : this.statusFilter === 'active',
      page: this.page,
      size: this.size,
      sort: this.sort,
      dir: this.dir
    };
  }
}
