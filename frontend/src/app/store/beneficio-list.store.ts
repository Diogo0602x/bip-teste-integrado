import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Beneficio, BeneficioQueryParams } from '../core/models/beneficio.model';
import { BeneficioApiService } from '../core/services/beneficio-api.service';

export interface BeneficioListState {
  items: Beneficio[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  loading: boolean;
}

const INITIAL_STATE: BeneficioListState = {
  items: [],
  page: 0,
  size: 5,
  totalPages: 0,
  totalElements: 0,
  loading: false
};

@Injectable({ providedIn: 'root' })
export class BeneficioListStore {
  private readonly stateSubject = new BehaviorSubject<BeneficioListState>(INITIAL_STATE);
  readonly state$ = this.stateSubject.asObservable();
  private readonly queryCache = new Map<string, BeneficioListState>();

  constructor(private readonly api: BeneficioApiService) {}

  load(params: BeneficioQueryParams, force = false): void {
    const key = JSON.stringify(params);
    const cached = this.queryCache.get(key);
    if (cached && !force) {
      this.stateSubject.next({ ...cached, loading: false });
      return;
    }

    this.patch({ loading: true });
    this.api.list(params).subscribe({
      next: (response) => {
        const nextState: BeneficioListState = {
          items: response.content,
          page: response.page,
          size: response.size,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          loading: false
        };
        this.queryCache.set(key, nextState);
        this.stateSubject.next(nextState);
      },
      error: () => this.patch({ loading: false })
    });
  }

  invalidate(): void {
    this.queryCache.clear();
  }

  private patch(patch: Partial<BeneficioListState>): void {
    this.stateSubject.next({ ...this.stateSubject.value, ...patch });
  }
}
