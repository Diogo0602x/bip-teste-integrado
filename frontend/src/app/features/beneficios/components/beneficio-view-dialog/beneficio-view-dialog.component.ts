import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Beneficio } from '../../../../core/models/beneficio.model';
import { formatCurrencyBRL } from '../../../../shared/utils/formatters.util';

@Component({
  selector: 'app-beneficio-view-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './beneficio-view-dialog.component.html',
  styleUrl: './beneficio-view-dialog.component.css'
})
export class BeneficioViewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public readonly data: Beneficio) {}

  get formattedValor(): string {
    return formatCurrencyBRL(Number(this.data.valor ?? 0));
  }
}
