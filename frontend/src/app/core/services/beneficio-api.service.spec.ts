import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { BeneficioApiService } from './beneficio-api.service';

describe('BeneficioApiService', () => {
  let service: BeneficioApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), BeneficioApiService]
    });
    service = TestBed.inject(BeneficioApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('list monta params com ativo', () => {
    service
      .list({
        q: 'a',
        ativo: true,
        page: 0,
        size: 10,
        sort: 'nome',
        dir: 'asc'
      })
      .subscribe();
    const req = httpMock.expectOne((r) => r.url.includes('/api/v1/beneficios'));
    expect(req.request.params.get('ativo')).toBe('true');
    req.flush({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0, sort: 'nome', dir: 'asc', query: 'a' });
  });

  it('list sem ativo não envia param ativo', () => {
    service
      .list({
        q: '',
        ativo: null,
        page: 0,
        size: 5,
        sort: 'id',
        dir: 'desc'
      })
      .subscribe();
    const req = httpMock.expectOne((r) => r.url.includes('/api/v1/beneficios'));
    expect(req.request.params.has('ativo')).toBe(false);
    req.flush({ content: [], page: 0, size: 5, totalElements: 0, totalPages: 0, sort: 'id', dir: 'desc', query: '' });
  });

  it('create, update, delete e transfer', () => {
    service.create({ nome: 'n', descricao: 'd', valor: 1, ativo: true }).subscribe();
    httpMock.expectOne((r) => r.method === 'POST').flush({} as never);

    service.update(1, { nome: 'n', descricao: 'd', valor: 1, ativo: true }).subscribe();
    httpMock.expectOne((r) => r.method === 'PUT').flush({} as never);

    service.delete(2).subscribe();
    httpMock.expectOne((r) => r.method === 'DELETE').flush(null, { status: 204, statusText: 'No Content' });

    service.transfer({ fromId: 1, toId: 2, amount: 10 }).subscribe();
    httpMock
      .expectOne((r) => r.url.endsWith('/transferencias'))
      .flush(null, { status: 204, statusText: 'No Content' });
  });
});
