import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Beneficio, BeneficioPayload, BeneficioQueryParams } from '../../../../core/models/beneficio.model';
import { BeneficioApiService } from '../../../../core/services/beneficio-api.service';
import { BeneficioListStore } from '../../../../store/beneficio-list.store';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { BeneficioViewDialogComponent } from '../../../beneficios/components/beneficio-view-dialog/beneficio-view-dialog.component';
import { BeneficioFormDialogComponent } from '../../../beneficios/components/beneficio-form-dialog/beneficio-form-dialog.component';
import { FeedbackType } from '../../../../shared/enums/feedback-type.enum';
import { GESTAO_UI_MESSAGES } from '../../constants/gestao-ui-messages.constants';
import { BENEFICIO_TABLE_COLUMNS } from '../../constants/gestao-table.constants';
import { formatCurrencyBRL } from '../../../../shared/utils/formatters.util';

@Component({
  selector: 'app-beneficios-tab',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatCardModule, MatTableModule],
  templateUrl: './beneficios-tab.component.html',
  styleUrl: './beneficios-tab.component.css'
})
export class BeneficiosTabComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly service = inject(BeneficioApiService);
  private readonly listStore = inject(BeneficioListStore);
  private readonly notification = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  beneficios: Beneficio[] = [];
  beneficioColumns: string[] = [...BENEFICIO_TABLE_COLUMNS];
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

  constructor() {
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
    this.reload();
  }

  reload(): void {
    this.listStore.invalidate();
    this.listStore.load(this.buildQueryParams());
  }

  submitBeneficio(): void {
    const ref = this.dialog.open(BeneficioFormDialogComponent, {
      width: '760px', maxWidth: '95vw', panelClass: 'beneficio-dialog', data: { mode: 'create' }
    });
    ref.afterClosed().subscribe((payload: BeneficioPayload | undefined) => {
      if (!payload) return;
      this.service.create(payload).subscribe({
        next: () => { this.listStore.invalidate(); this.showMessage(GESTAO_UI_MESSAGES.beneficio.saveSuccess, FeedbackType.Success); this.load(); },
        error: () => this.showMessage(GESTAO_UI_MESSAGES.beneficio.saveError, FeedbackType.Error)
      });
    });
  }

  edit(item: Beneficio): void {
    const ref = this.dialog.open(BeneficioFormDialogComponent, {
      width: '760px', maxWidth: '95vw', panelClass: 'beneficio-dialog', data: { mode: 'edit', beneficio: item }
    });
    ref.afterClosed().subscribe((payload: BeneficioPayload | undefined) => {
      if (!payload) return;
      this.service.update(item.id, payload).subscribe({
        next: () => { this.listStore.invalidate(); this.showMessage(GESTAO_UI_MESSAGES.beneficio.saveSuccess, FeedbackType.Success); this.load(); },
        error: () => this.showMessage(GESTAO_UI_MESSAGES.beneficio.saveError, FeedbackType.Error)
      });
    });
  }

  view(item: Beneficio): void {
    this.dialog.open(BeneficioViewDialogComponent, { width: '640px', maxWidth: '95vw', panelClass: 'beneficio-dialog', data: item });
  }

  remove(item: Beneficio): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px', maxWidth: '95vw',
      data: { title: 'Confirmar exclusão', message: `Deseja excluir ${item.nome}? Regra: apenas benefícios inativos e com saldo zerado podem ser excluídos.`, confirmText: 'Excluir', cancelText: 'Cancelar' }
    });
    ref.afterClosed().subscribe((ok: boolean | undefined) => {
      if (!ok) return;
      this.service.delete(item.id).subscribe({
        next: () => { this.listStore.invalidate(); this.showMessage(GESTAO_UI_MESSAGES.beneficio.deleteSuccess, FeedbackType.Success); this.load(); },
        error: (err) => this.showMessage(err?.error?.message ?? GESTAO_UI_MESSAGES.beneficio.deleteError, FeedbackType.Error)
      });
    });
  }

  load(): void {
    this.listStore.load(this.buildQueryParams());
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

  get hasActiveFilters(): boolean {
    return this.search.trim().length > 0 || this.statusFilter !== 'all' || this.sort !== 'nome' || this.dir !== 'asc';
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
