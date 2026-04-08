import { HttpResponse } from '@angular/common/http';
import { HttpCacheStore } from './http-cache.store';

describe('HttpCacheStore', () => {
  let store: HttpCacheStore;

  beforeEach(() => {
    store = new HttpCacheStore();
  });

  it('get/set devolve a mesma instância armazenada', () => {
    const r = new HttpResponse({ body: { x: 1 }, status: 200 });
    store.set('k', r);
    expect(store.get('k')).toBe(r);
  });

  it('clear remove entradas', () => {
    store.set('a', new HttpResponse({ body: 1 }));
    store.clear();
    expect(store.get('a')).toBeUndefined();
  });
});
