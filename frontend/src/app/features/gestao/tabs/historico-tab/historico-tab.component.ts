import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { TransferenciaHistorico } from '../../../../core/models/transferencia.model';
import { BeneficioApiService } from '../../../../core/services/beneficio-api.service';
import { HISTORICO_TABLE_COLUMNS } from '../../constants/gestao-table.constants';
import { formatCurrencyBRL, formatDateTimeBR } from '../../../../shared/utils/formatters.util';

@Component({
  selector: 'app-historico-tab',
  standalone: true,
  imports: [MatCardModule, MatTableModule],
  templateUrl: './historico-tab.component.html',
  styleUrl: './historico-tab.component.css'
})
export class HistoricoTabComponent {
  private readonly service = inject(BeneficioApiService);

  historico: TransferenciaHistorico[] = [];
  historicoColumns: string[] = [...HISTORICO_TABLE_COLUMNS];

  constructor() {
    this.reload();
  }

  reload(): void {
    this.service.getHistorico(0, 20).subscribe({
      next: (res) => { this.historico = res.content; }
    });
  }

  formatDate(iso: string): string {
    return formatDateTimeBR(iso);
  }

  formatCurrency(value: number): string {
    return formatCurrencyBRL(value);
  }
}
