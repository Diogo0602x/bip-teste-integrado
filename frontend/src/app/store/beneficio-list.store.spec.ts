import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { BeneficioApiService } from '../core/services/beneficio-api.service';
import { BeneficioListStore } from './beneficio-list.store';
import { PagedResponse, Beneficio } from '../core/models/beneficio.model';

describe('BeneficioListStore', () => {
  const baseParams = {
    q: '',
    ativo: null as boolean | null,
    page: 0,
    size: 5,
    sort: 'nome' as const,
    dir: 'asc' as const
  };

  const emptyPage: PagedResponse<Beneficio> = {
    content: [],
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
    sort: 'nome',
    dir: 'asc',
    query: ''
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), BeneficioApiService, BeneficioListStore]
    });
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('load preenche estado e mesma query usa cache', () => {
    const http = TestBed.inject(HttpTestingController);
    const store = TestBed.inject(BeneficioListStore);
    store.load(baseParams);
    http.expectOne((r) => r.url.includes('beneficios')).flush(emptyPage);
    store.load(baseParams);
    http.expectNone((req) => req.url.includes('beneficios'));
  });

  it('load com force ignora cache', () => {
    const http = TestBed.inject(HttpTestingController);
    const store = TestBed.inject(BeneficioListStore);
    store.load(baseParams);
    http.expectOne(() => true).flush(emptyPage);
    store.load(baseParams, true);
    http.expectOne(() => true).flush(emptyPage);
  });

  it('load em erro define loading false', () => {
    const http = TestBed.inject(HttpTestingController);
    const store = TestBed.inject(BeneficioListStore);
    store.load(baseParams);
    http.expectOne(() => true).error(new ProgressEvent('network'));
    const internal = store as unknown as { stateSubject: { value: { loading: boolean } } };
    expect(internal.stateSubject.value.loading).toBe(false);
  });

  it('invalidate limpa cache', () => {
    const http = TestBed.inject(HttpTestingController);
    const store = TestBed.inject(BeneficioListStore);
    store.load(baseParams);
    http.expectOne(() => true).flush(emptyPage);
    store.invalidate();
    store.load(baseParams);
    http.expectOne(() => true).flush(emptyPage);
  });
});
