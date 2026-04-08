import { Component, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DashboardTab } from '../../core/enums/dashboard-tab.enum';
import { BeneficiosTabComponent } from './tabs/beneficios-tab/beneficios-tab.component';
import { TransferenciasTabComponent } from './tabs/transferencias-tab/transferencias-tab.component';
import { HistoricoTabComponent } from './tabs/historico-tab/historico-tab.component';

@Component({
  selector: 'app-gestao',
  standalone: true,
  imports: [MatToolbarModule, MatTabsModule, BeneficiosTabComponent, TransferenciasTabComponent, HistoricoTabComponent],
  templateUrl: './gestao.component.html',
  styleUrl: './gestao.component.css'
})
export class GestaoComponent {
  @ViewChild(BeneficiosTabComponent) beneficiosTab!: BeneficiosTabComponent;
  @ViewChild(HistoricoTabComponent) historicoTab!: HistoricoTabComponent;

  readonly tabs = DashboardTab;
  selectedTab = DashboardTab.Beneficios;

  onTransferido(): void {
    this.beneficiosTab?.reload();
    this.historicoTab?.reload();
    this.selectedTab = DashboardTab.Historico;
  }
}
