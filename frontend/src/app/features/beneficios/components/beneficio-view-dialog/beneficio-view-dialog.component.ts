import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Beneficio } from '../../../../core/models/beneficio.model';
import { formatCurrencyBRL } from '../../../../shared/utils/formatters.util';

@Component({
  selector: 'app-beneficio-view-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './beneficio-view-dialog.component.html',
  styleUrl: './beneficio-view-dialog.component.css'
})
export class BeneficioViewDialogComponent {
  readonly data = inject<Beneficio>(MAT_DIALOG_DATA);

  get formattedValor(): string {
    return formatCurrencyBRL(Number(this.data.valor ?? 0));
  }
}
