import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./containers/gestao.container').then((m) => m.GestaoContainer)
  }
];
