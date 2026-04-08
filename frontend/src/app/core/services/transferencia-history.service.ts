import { Injectable } from '@angular/core';
import { TransferenciaHistorico } from '../models/transferencia.model';

@Injectable({ providedIn: 'root' })
export class TransferenciaHistoryService {
  private readonly storageKey = 'bip-transferencias-historico';

  list(): TransferenciaHistorico[] {
    const value = localStorage.getItem(this.storageKey);
    if (!value) {
      return [];
    }
    return JSON.parse(value) as TransferenciaHistorico[];
  }

  add(item: TransferenciaHistorico): void {
    const current = this.list();
    current.unshift(item);
    localStorage.setItem(this.storageKey, JSON.stringify(current.slice(0, 100)));
  }
}
