import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Beneficio, BeneficioPayload, BeneficioQueryParams, PagedResponse } from '../models/beneficio.model';
import { TransferenciaHistorico, TransferenciaRequest } from '../models/transferencia.model';

@Injectable({ providedIn: 'root' })
export class BeneficioApiService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiBaseUrl}/beneficios`;

  list(params: BeneficioQueryParams): Observable<PagedResponse<Beneficio>> {
    let httpParams = new HttpParams()
      .set('q', params.q)
      .set('page', params.page)
      .set('size', params.size)
      .set('sort', params.sort)
      .set('dir', params.dir);
    if (params.ativo !== null) {
      httpParams = httpParams.set('ativo', params.ativo);
    }
    return this.http.get<PagedResponse<Beneficio>>(this.api, { params: httpParams });
  }

  create(payload: BeneficioPayload): Observable<Beneficio> {
    return this.http.post<Beneficio>(this.api, payload);
  }

  update(id: number, payload: BeneficioPayload): Observable<Beneficio> {
    return this.http.put<Beneficio>(`${this.api}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  transfer(payload: TransferenciaRequest): Observable<void> {
    return this.http.post<void>(`${this.api}/transferencias`, payload);
  }

  getHistorico(page = 0, size = 20): Observable<PagedResponse<TransferenciaHistorico>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PagedResponse<TransferenciaHistorico>>(`${this.api}/transferencias/historico`, { params });
  }
}
