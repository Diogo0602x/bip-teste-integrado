import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpCacheStore } from '../services/http-cache.store';

export function httpCacheInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const cache = inject(HttpCacheStore);
  const isGet = req.method === 'GET';

  if (!isGet) {
    cache.clear();
    return next(req);
  }

  const cachedResponse = cache.get(req.urlWithParams);
  if (cachedResponse) {
    return of(cachedResponse.clone());
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cache.set(req.urlWithParams, event);
      }
    })
  );
}
