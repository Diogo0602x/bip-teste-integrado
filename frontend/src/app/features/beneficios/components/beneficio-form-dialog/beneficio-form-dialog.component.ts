import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Beneficio, BeneficioPayload } from '../../../../core/models/beneficio.model';

export interface BeneficioFormDialogData {
  mode: 'create' | 'edit';
  beneficio?: Beneficio;
}

@Component({
  selector: 'app-beneficio-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './beneficio-form-dialog.component.html',
  styleUrl: './beneficio-form-dialog.component.css'
})
export class BeneficioFormDialogComponent {
  valorDisplay = this.formatCurrencyInput(0);

  readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    descricao: [''],
    valor: [0, [Validators.required, Validators.min(0)]],
    ativo: [true]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<BeneficioFormDialogComponent, BeneficioPayload>,
    @Inject(MAT_DIALOG_DATA) public readonly data: BeneficioFormDialogData
  ) {
    if (data.beneficio) {
      this.form.patchValue({
        nome: data.beneficio.nome,
        descricao: data.beneficio.descricao,
        valor: data.beneficio.valor,
        ativo: data.beneficio.ativo
      });
      this.valorDisplay = this.formatCurrencyInput(data.beneficio.valor);
    }
  }

  onValorInput(rawValue: string): void {
    const digitsOnly = rawValue.replace(/\D/g, '');
    const normalizedDigits = digitsOnly === '' ? '0' : digitsOnly;
    const numericValue = Number(normalizedDigits) / 100;
    this.form.controls.valor.setValue(numericValue);
    this.valorDisplay = this.formatCurrencyInput(numericValue);
  }

  onValorBlur(): void {
    this.valorDisplay = this.formatCurrencyInput(this.form.controls.valor.value);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }

  get canSave(): boolean {
    return this.form.valid && this.form.controls.valor.value > 0;
  }

  private formatCurrencyInput(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number.isFinite(value) ? value : 0);
  }
}
