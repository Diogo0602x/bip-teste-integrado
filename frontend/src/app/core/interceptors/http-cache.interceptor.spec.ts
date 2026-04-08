import { HttpRequest, HttpResponse } from '@angular/common/http';
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { httpCacheInterceptor } from './http-cache.interceptor';
import { HttpCacheStore } from '../services/http-cache.store';

describe('httpCacheInterceptor', () => {
  let injector: EnvironmentInjector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpCacheStore]
    });
    injector = TestBed.inject(EnvironmentInjector);
  });

  it('em POST limpa cache e delega', (done) => {
    const store = TestBed.inject(HttpCacheStore);
    const clear = jest.spyOn(store, 'clear');
    const next = jest.fn().mockReturnValue(of(new HttpResponse({ status: 204 })));
    runInInjectionContext(injector, () => {
      httpCacheInterceptor(new HttpRequest('POST', '/api'), next).subscribe(() => {
        expect(clear).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        done();
      });
    });
  });

  it('em GET sem cache chama next e armazena resposta', (done) => {
    const store = TestBed.inject(HttpCacheStore);
    const body = { ok: true };
    const resp = new HttpResponse({ body, status: 200 });
    const next = jest.fn().mockReturnValue(of(resp));
    const req = new HttpRequest('GET', 'http://localhost/x');
    runInInjectionContext(injector, () => {
      httpCacheInterceptor(req, next).subscribe((ev) => {
        expect(ev).toBe(resp);
        expect(store.get(req.urlWithParams)?.body).toEqual(body);
        done();
      });
    });
  });

  it('em GET com cache devolve clone sem chamar next de novo', (done) => {
    const resp = new HttpResponse({ body: { v: 2 }, status: 200 });
    const next = jest.fn().mockReturnValue(of(resp));
    const req = new HttpRequest('GET', 'http://localhost/cached');
    runInInjectionContext(injector, () => {
      httpCacheInterceptor(req, next).subscribe(() => {
        httpCacheInterceptor(req, next).subscribe((second) => {
          expect(next).toHaveBeenCalledTimes(1);
          expect(second).toBeInstanceOf(HttpResponse);
          done();
        });
      });
    });
  });
});
