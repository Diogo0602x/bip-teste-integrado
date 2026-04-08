import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpCacheStore {
  private readonly cache = new Map<string, HttpResponse<unknown>>();

  get(key: string): HttpResponse<unknown> | undefined {
    return this.cache.get(key);
  }

  set(key: string, response: HttpResponse<unknown>): void {
    this.cache.set(key, response);
  }

  clear(): void {
    this.cache.clear();
  }
}
