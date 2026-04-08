import { appRoutes } from './app.routes';

describe('appRoutes', () => {
  it('define rota vazia com lazy load do dashboard', async () => {
    expect(appRoutes.length).toBe(1);
    expect(appRoutes[0].path).toBe('');
    const load = appRoutes[0].loadComponent;
    expect(load).toBeDefined();
    const mod = await load!();
    expect(mod).toBeTruthy();
  });
});
