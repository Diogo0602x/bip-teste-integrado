import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./containers/dashboard.container').then((m) => m.DashboardContainer)
  }
];
