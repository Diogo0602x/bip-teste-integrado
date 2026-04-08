import { Component, DestroyRef, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Beneficio } from '../../../../core/models/beneficio.model';
import { TransferenciaRequest } from '../../../../core/models/transferencia.model';
import { BeneficioApiService } from '../../../../core/services/beneficio-api.service';
import { BeneficioListStore } from '../../../../store/beneficio-list.store';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FeedbackType } from '../../../../shared/enums/feedback-type.enum';
import { GESTAO_UI_MESSAGES } from '../../constants/gestao-ui-messages.constants';
import { formatCurrencyBRL } from '../../../../shared/utils/formatters.util';

@Component({
  selector: 'app-transferencias-tab',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule],
  templateUrl: './transferencias-tab.component.html',
  styleUrl: './transferencias-tab.component.css'
})
export class TransferenciasTabComponent {
  @Output() transferido = new EventEmitter<void>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly service = inject(BeneficioApiService);
  private readonly listStore = inject(BeneficioListStore);
  private readonly notification = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  beneficios: Beneficio[] = [];
  transferAmountDisplay = this.formatCurrency(0);

  readonly transferenciaForm = this.fb.nonNullable.group({
    fromId: [0, [Validators.required, Validators.min(1)]],
    toId: [0, [Validators.required, Validators.min(1)]],
    amount: [0, [Validators.required, Validators.min(0.01)]]
  });

  constructor() {
    this.listStore.state$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => { this.beneficios = state.items; });

    this.transferenciaForm.valueChanges.subscribe((value) => {
      if (value.fromId && value.toId && value.fromId === value.toId) {
        this.transferenciaForm.patchValue({ toId: 0 }, { emitEvent: false });
      }
    });
  }

  transferir(): void {
    if (!this.canTransfer) {
      this.showMessage(GESTAO_UI_MESSAGES.transferencia.invalidForm, FeedbackType.Warning);
      return;
    }
    const payload: TransferenciaRequest = this.transferenciaForm.getRawValue();
    const from = this.beneficios.find((b) => b.id === payload.fromId);
    const to = this.beneficios.find((b) => b.id === payload.toId);
    if (!from || !to) {
      this.showMessage(GESTAO_UI_MESSAGES.transferencia.invalidEndpoints, FeedbackType.Error);
      return;
    }
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px', maxWidth: '95vw',
      data: { title: 'Confirmar transferência', message: `Transferir ${this.formatCurrency(payload.amount)} de ${from.nome} para ${to.nome}?`, confirmText: 'Confirmar', cancelText: 'Voltar' }
    });
    ref.afterClosed().subscribe((ok: boolean | undefined) => {
      if (!ok) return;
      this.service.transfer(payload).subscribe({
        next: () => {
          this.listStore.invalidate();
          this.transferido.emit();
          this.showMessage(GESTAO_UI_MESSAGES.transferencia.success, FeedbackType.Success);
        },
        error: (err) => {
          this.showMessage(err?.error?.message ?? GESTAO_UI_MESSAGES.transferencia.error, FeedbackType.Error);
        }
      });
    });
  }

  displayBeneficio(item: Beneficio): string {
    return `${item.nome} - ${this.formatCurrency(item.valor)}`;
  }

  formatCurrency(value: number): string {
    return formatCurrencyBRL(value);
  }

  onTransferAmountInput(raw: string): void {
    const digitsOnly = raw.replace(/\D/g, '');
    const numericValue = Number(digitsOnly === '' ? '0' : digitsOnly) / 100;
    this.transferenciaForm.controls.amount.setValue(numericValue);
    this.transferAmountDisplay = this.formatCurrency(numericValue);
  }

  onTransferAmountBlur(): void {
    this.transferAmountDisplay = this.formatCurrency(this.transferenciaForm.controls.amount.value);
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
    return this.beneficios.find((item) => item.id === this.transferenciaForm.getRawValue().fromId);
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

  private showMessage(message: string, type: FeedbackType): void {
    this.notification.show(message, type);
  }
}
