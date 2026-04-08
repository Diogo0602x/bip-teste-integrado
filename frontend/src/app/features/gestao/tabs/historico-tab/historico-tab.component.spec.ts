import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { HistoricoTabComponent } from './historico-tab.component';
import { BeneficioApiService } from '../../../../core/services/beneficio-api.service';
import { TransferenciaHistorico } from '../../../../core/models/transferencia.model';

describe('HistoricoTabComponent', () => {
  let fixture: ComponentFixture<HistoricoTabComponent>;
  let component: HistoricoTabComponent;

  const item: TransferenciaHistorico = {
    id: 1, fromId: 1, toId: 2, fromNome: 'A', toNome: 'B',
    amount: 50, createdAtIso: '2026-04-08T10:00:00Z', status: 'SUCESSO', detalhe: 'ok'
  };
  const pagedEmpty = { content: [], page: 0, size: 20, totalElements: 0, totalPages: 0, sort: 'createdAt', dir: 'desc', query: null };
  const pagedWithItem = { ...pagedEmpty, content: [item], totalElements: 1 };

  const api = { getHistorico: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    api.getHistorico.mockReturnValue(of(pagedEmpty));
    await TestBed.configureTestingModule({
      imports: [HistoricoTabComponent, NoopAnimationsModule],
      providers: [{ provide: BeneficioApiService, useValue: api }]
    }).compileComponents();
    fixture = TestBed.createComponent(HistoricoTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('construtor chama reload e historico inicia vazio', () => {
    expect(api.getHistorico).toHaveBeenCalled();
    expect(component.historico).toEqual([]);
  });

  it('reload atualiza historico com itens', () => {
    api.getHistorico.mockReturnValueOnce(of(pagedWithItem));
    component.reload();
    expect(component.historico.length).toBe(1);
    expect(component.historico[0].fromNome).toBe('A');
  });

  it('formatDate retorna string não vazia', () => {
    expect(component.formatDate(item.createdAtIso).length).toBeGreaterThan(0);
  });

  it('formatCurrency retorna string com número', () => {
    expect(component.formatCurrency(50)).toContain('50');
  });
});
