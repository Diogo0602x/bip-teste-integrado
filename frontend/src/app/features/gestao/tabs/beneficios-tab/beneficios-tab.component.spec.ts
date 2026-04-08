import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { BeneficiosTabComponent } from './beneficios-tab.component';
import { BeneficioApiService } from '../../../../core/services/beneficio-api.service';
import { BeneficioListStore, BeneficioListState } from '../../../../store/beneficio-list.store';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Beneficio } from '../../../../core/models/beneficio.model';
import { FeedbackType } from '../../../../shared/enums/feedback-type.enum';
import { GESTAO_UI_MESSAGES } from '../../constants/gestao-ui-messages.constants';

describe('BeneficiosTabComponent', () => {
  let fixture: ComponentFixture<BeneficiosTabComponent>;
  let component: BeneficiosTabComponent;

  const state$ = new BehaviorSubject<BeneficioListState>({
    items: [], page: 0, size: 5, totalPages: 0, totalElements: 0, loading: false
  });
  const api = { create: jest.fn(), update: jest.fn(), delete: jest.fn() };
  const listStore = { state$: state$.asObservable(), load: jest.fn(), invalidate: jest.fn() };
  const notification = { show: jest.fn() };
  const dialogOpen = jest.fn();

  const sampleA: Beneficio = { id: 1, nome: 'Origem', descricao: '', valor: 100, ativo: true, version: 0 };
  const sampleB: Beneficio = { id: 2, nome: 'Destino', descricao: '', valor: 50, ativo: true, version: 0 };

  function pushBeneficios(items: Beneficio[]) {
    state$.next({ items, page: 0, size: 5, totalPages: 1, totalElements: items.length, loading: false });
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    dialogOpen.mockImplementation(() => ({ afterClosed: () => of(undefined) }));
    state$.next({ items: [], page: 0, size: 5, totalPages: 0, totalElements: 0, loading: false });
    await TestBed.configureTestingModule({
      imports: [BeneficiosTabComponent, NoopAnimationsModule],
      providers: [
        { provide: BeneficioApiService, useValue: api },
        { provide: BeneficioListStore, useValue: listStore },
        { provide: NotificationService, useValue: notification },
        { provide: MatDialog, useValue: { open: dialogOpen } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(BeneficiosTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('construtor chama reload', () => {
    expect(listStore.invalidate).toHaveBeenCalled();
    expect(listStore.load).toHaveBeenCalled();
  });

  it('reload invalida e carrega', () => {
    jest.clearAllMocks();
    component.reload();
    expect(listStore.invalidate).toHaveBeenCalled();
    expect(listStore.load).toHaveBeenCalled();
  });

  it('submitBeneficio sem payload não chama api', () => {
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of(undefined) });
    component.submitBeneficio();
    expect(api.create).not.toHaveBeenCalled();
  });

  it('submitBeneficio com payload chama create', () => {
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of({ nome: 'N', descricao: '', valor: 10, ativo: true }) });
    api.create.mockReturnValueOnce(of(sampleA));
    component.submitBeneficio();
    expect(api.create).toHaveBeenCalled();
  });

  it('submitBeneficio erro mostra mensagem', () => {
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of({ nome: 'N', descricao: '', valor: 10, ativo: true }) });
    api.create.mockReturnValueOnce(throwError(() => new Error('x')));
    component.submitBeneficio();
    expect(notification.show).toHaveBeenCalledWith(expect.any(String), FeedbackType.Error);
  });

  it('edit sem payload não chama update', () => {
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of(undefined) });
    component.edit(sampleA);
    expect(api.update).not.toHaveBeenCalled();
  });

  it('edit com sucesso chama update', () => {
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of({ nome: 'N', descricao: '', valor: 10, ativo: true }) });
    api.update.mockReturnValueOnce(of(sampleA));
    component.edit(sampleA);
    expect(api.update).toHaveBeenCalledWith(1, expect.any(Object));
  });

  it('edit com erro mostra mensagem', () => {
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of({ nome: 'N', descricao: '', valor: 10, ativo: true }) });
    api.update.mockReturnValueOnce(throwError(() => new Error('x')));
    component.edit(sampleA);
    expect(notification.show).toHaveBeenCalledWith(expect.any(String), FeedbackType.Error);
  });

  it('view abre dialog', () => {
    component.view(sampleA);
    expect(dialogOpen).toHaveBeenCalled();
  });

  it('remove cancelado não apaga', () => {
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of(false) });
    component.remove(sampleA);
    expect(api.delete).not.toHaveBeenCalled();
  });

  it('remove confirma e apaga', () => {
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of(true) });
    api.delete.mockReturnValueOnce(of(undefined));
    component.remove(sampleA);
    expect(api.delete).toHaveBeenCalledWith(1);
  });

  it('remove erro mostra mensagem do servidor', () => {
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of(true) });
    api.delete.mockReturnValueOnce(throwError(() => ({ error: { message: 'E' } })));
    component.remove(sampleA);
    expect(notification.show).toHaveBeenCalledWith('E', FeedbackType.Error);
  });

  it('remove erro sem message usa fallback', () => {
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of(true) });
    api.delete.mockReturnValueOnce(throwError(() => ({ error: {} })));
    component.remove(sampleA);
    expect(notification.show).toHaveBeenCalledWith(expect.any(String), FeedbackType.Error);
  });

  it('displayBeneficio e formatCurrency', () => {
    expect(component.displayBeneficio(sampleA)).toContain('Origem');
    expect(component.formatCurrency(1)).toContain('1');
  });

  it('onSearch e clearSearch', () => {
    component.search = 'x';
    component.onSearch();
    expect(component.page).toBe(0);
    component.clearSearch();
    expect(component.search).toBe('');
  });

  it('toggleSort alterna direção e campo', () => {
    component.sort = 'nome';
    component.dir = 'asc';
    component.toggleSort('nome');
    expect(component.dir).toBe('desc');
    component.toggleSort('nome');
    expect(component.dir).toBe('asc');
    component.toggleSort('valor');
    expect(component.sort).toBe('valor');
  });

  it('onSizeChange e onStatusFilterChange', () => {
    component.onSizeChange(10);
    expect(component.size).toBe(10);
    component.onStatusFilterChange('active');
    expect(component.statusFilter).toBe('active');
  });

  it('prevPage e nextPage', () => {
    component.totalPages = 2;
    component.page = 1;
    component.prevPage();
    expect(component.page).toBe(0);
    component.nextPage();
    expect(component.page).toBe(1);
    component.page = 1;
    component.nextPage();
    expect(component.page).toBe(1);
    component.page = 0;
    component.prevPage();
    expect(component.page).toBe(0);
  });

  it('hasActiveFilters com filtros', () => {
    component.sort = 'nome';
    component.dir = 'asc';
    expect(component.hasActiveFilters).toBe(false);
    component.search = 'a';
    expect(component.hasActiveFilters).toBe(true);
    component.search = '';
    component.statusFilter = 'inactive';
    expect(component.hasActiveFilters).toBe(true);
    component.statusFilter = 'all';
    component.sort = 'valor';
    expect(component.hasActiveFilters).toBe(true);
    component.sort = 'nome';
    component.dir = 'desc';
    expect(component.hasActiveFilters).toBe(true);
  });

  it('load delega ao store', () => {
    jest.clearAllMocks();
    component.load();
    expect(listStore.load).toHaveBeenCalled();
  });
});
