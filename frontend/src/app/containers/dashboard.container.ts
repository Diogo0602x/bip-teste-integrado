import { Component } from '@angular/core';
import { DashboardComponent } from '../features/dashboard/dashboard.component';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [DashboardComponent],
  template: '<app-dashboard></app-dashboard>'
})
export class DashboardContainer {}
