import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { BeneficioApiService } from '../../core/services/beneficio-api.service';
import { BeneficioListState } from '../../store/beneficio-list.store';
import { BeneficioListStore } from '../../store/beneficio-list.store';
import { TransferenciaHistoryService } from '../../core/services/transferencia-history.service';
import { NotificationService } from '../../shared/services/notification.service';
import { DashboardTab } from '../../core/enums/dashboard-tab.enum';
import { Beneficio } from '../../core/models/beneficio.model';
import { FeedbackType } from '../../shared/enums/feedback-type.enum';
import { DASHBOARD_UI_MESSAGES } from './constants/dashboard-ui-messages.constants';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  const state$ = new BehaviorSubject<BeneficioListState>({
    items: [],
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0,
    loading: false
  });
  const api = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    transfer: jest.fn()
  };
  const listStore = {
    state$: state$.asObservable(),
    load: jest.fn(),
    invalidate: jest.fn()
  };
  const history = {
    list: jest.fn().mockReturnValue([]),
    add: jest.fn()
  };
  const notification = {
    show: jest.fn()
  };
  const dialogOpen = jest.fn();

  const sampleA: Beneficio = {
    id: 1,
    nome: 'Origem',
    descricao: '',
    valor: 100,
    ativo: true,
    version: 0
  };
  const sampleB: Beneficio = {
    id: 2,
    nome: 'Destino',
    descricao: '',
    valor: 50,
    ativo: true,
    version: 0
  };

  function pushBeneficios(items: Beneficio[]) {
    state$.next({
      items,
      page: 0,
      size: 5,
      totalPages: 1,
      totalElements: items.length,
      loading: false
    });
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    dialogOpen.mockReset();
    dialogOpen.mockImplementation(() => ({ afterClosed: () => of(undefined) }));
    state$.next({
      items: [],
      page: 0,
      size: 5,
      totalPages: 0,
      totalElements: 0,
      loading: false
    });
    TestBed.configureTestingModule({
      imports: [DashboardComponent, NoopAnimationsModule],
      providers: [
        { provide: BeneficioApiService, useValue: api },
        { provide: BeneficioListStore, useValue: listStore },
        { provide: TransferenciaHistoryService, useValue: history },
        { provide: NotificationService, useValue: notification },
        { provide: MatDialog, useValue: { open: dialogOpen } }
      ]
    });
    TestBed.overrideProvider(MatDialog, { useValue: { open: dialogOpen } });
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ngOnInit chama load e history.list', () => {
    expect(listStore.load).toHaveBeenCalled();
    expect(history.list).toHaveBeenCalled();
  });

  it('submitBeneficio sem payload não chama api', () => {
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of(undefined) });
    component.submitBeneficio();
    expect(api.create).not.toHaveBeenCalled();
  });

  it('submitBeneficio com payload chama create', () => {
    dialogOpen.mockReturnValueOnce({
      afterClosed: () => of({ nome: 'N', descricao: '', valor: 10, ativo: true })
    });
    api.create.mockReturnValueOnce(of(sampleA));
    component.submitBeneficio();
    expect(api.create).toHaveBeenCalled();
  });

  it('submitBeneficio erro mostra mensagem', () => {
    dialogOpen.mockReturnValueOnce({
      afterClosed: () => of({ nome: 'N', descricao: '', valor: 10, ativo: true })
    });
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
    dialogOpen.mockReturnValueOnce({
      afterClosed: () => of({ nome: 'N', descricao: '', valor: 10, ativo: true })
    });
    api.update.mockReturnValueOnce(of(sampleA));
    component.edit(sampleA);
    expect(api.update).toHaveBeenCalledWith(1, expect.any(Object));
  });

  it('edit com erro na api mostra mensagem', () => {
    dialogOpen.mockReturnValueOnce({
      afterClosed: () => of({ nome: 'N', descricao: '', valor: 10, ativo: true })
    });
    api.update.mockReturnValueOnce(throwError(() => new Error('x')));
    component.edit(sampleA);
    expect(notification.show).toHaveBeenCalledWith(expect.any(String), FeedbackType.Error);
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

  it('view abre dialog', () => {
    component.view(sampleA);
    expect(dialogOpen).toHaveBeenCalled();
  });

  it('transferir sem canTransfer avisa', () => {
    component.transferir();
    expect(notification.show).toHaveBeenCalledWith(expect.any(String), FeedbackType.Warning);
  });

  it('transferir sem endpoints válidos', () => {
    pushBeneficios([sampleA]);
    fixture.detectChanges();
    component.transferenciaForm.setValue({ fromId: 1, toId: 2, amount: 10 });
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of(true) });
    component.transferir();
    expect(notification.show).toHaveBeenCalledWith(expect.any(String), FeedbackType.Error);
  });

  it('transferir com sucesso', () => {
    pushBeneficios([sampleA, sampleB]);
    fixture.detectChanges();
    component.transferenciaForm.setValue({ fromId: 1, toId: 2, amount: 10 });
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of(true) });
    api.transfer.mockReturnValueOnce(of(undefined));
    component.transferir();
    expect(api.transfer).toHaveBeenCalled();
    expect(history.add).toHaveBeenCalled();
    expect(component.selectedTab).toBe(DashboardTab.Historico);
  });

  it('transferir cancelado no confirm', () => {
    pushBeneficios([sampleA, sampleB]);
    fixture.detectChanges();
    component.transferenciaForm.setValue({ fromId: 1, toId: 2, amount: 10 });
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of(false) });
    component.transferir();
    expect(api.transfer).not.toHaveBeenCalled();
  });

  it('transferir erro', () => {
    pushBeneficios([sampleA, sampleB]);
    fixture.detectChanges();
    component.transferenciaForm.setValue({ fromId: 1, toId: 2, amount: 10 });
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of(true) });
    api.transfer.mockReturnValueOnce(throwError(() => ({ error: { message: 'falha' } })));
    component.transferir();
    expect(notification.show).toHaveBeenCalledWith('falha', FeedbackType.Error);
  });

  it('transferir erro sem message no body usa fallback', () => {
    pushBeneficios([sampleA, sampleB]);
    fixture.detectChanges();
    component.transferenciaForm.setValue({ fromId: 1, toId: 2, amount: 10 });
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of(true) });
    api.transfer.mockReturnValueOnce(throwError(() => ({ error: {} })));
    component.transferir();
    expect(notification.show).toHaveBeenCalledWith(
      DASHBOARD_UI_MESSAGES.transferencia.error,
      FeedbackType.Error
    );
  });

  it('formatDate e displayBeneficio e formatCurrency', () => {
    expect(component.formatDate(new Date().toISOString()).length).toBeGreaterThan(0);
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

  it('onTransferAmountInput só # e blur', () => {
    component.onTransferAmountInput('###');
    expect(component.transferenciaForm.controls.amount.value).toBe(0);
    component.onTransferAmountBlur();
    expect(component.transferAmountDisplay).toBeTruthy();
  });

  it('onTransferAmountInput com dígitos', () => {
    component.onTransferAmountInput('1099');
    expect(component.transferenciaForm.controls.amount.value).toBe(10.99);
  });

  it('formatCurrency delega para utilitário', () => {
    expect(component.formatCurrency(42)).toMatch(/42/);
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

  it('getters de opções e canTransfer', () => {
    pushBeneficios([sampleA, sampleB]);
    fixture.detectChanges();
    component.transferenciaForm.setValue({ fromId: 1, toId: 2, amount: 50 });
    expect(component.origemOptions.length).toBeGreaterThan(0);
    expect(component.destinoOptions.length).toBeGreaterThan(0);
    expect(component.fromBeneficio?.id).toBe(1);
    expect(component.maxTransferAmount).toBe(100);
    expect(component.canTransfer).toBe(true);
  });

  it('origemOptions exclui saldo zero', () => {
    const zeroSaldo: Beneficio = { ...sampleA, id: 5, valor: 0 };
    pushBeneficios([zeroSaldo, sampleB]);
    fixture.detectChanges();
    component.transferenciaForm.setValue({ fromId: 2, toId: 5, amount: 1 });
    expect(component.origemOptions.find((b) => b.id === 5)).toBeUndefined();
  });

  it('canTransfer false quando valor igual ao máximo', () => {
    pushBeneficios([sampleA, sampleB]);
    fixture.detectChanges();
    component.transferenciaForm.setValue({ fromId: 1, toId: 2, amount: 100 });
    expect(component.canTransfer).toBe(false);
  });

  it('canTransfer false quando amount zero', () => {
    pushBeneficios([sampleA, sampleB]);
    fixture.detectChanges();
    component.transferenciaForm.setValue({ fromId: 1, toId: 2, amount: 0 });
    expect(component.canTransfer).toBe(false);
  });

  it('maxTransferAmount zero sem origem selecionada', () => {
    pushBeneficios([sampleA]);
    fixture.detectChanges();
    component.transferenciaForm.setValue({ fromId: 0, toId: 1, amount: 1 });
    expect(component.maxTransferAmount).toBe(0);
  });

  it('hasActiveFilters com sort diferente', () => {
    component.search = '';
    component.statusFilter = 'all';
    component.sort = 'valor';
    component.dir = 'asc';
    expect(component.hasActiveFilters).toBe(true);
  });

  it('hasActiveFilters com mesmo nome mas dir desc', () => {
    component.search = '';
    component.statusFilter = 'all';
    component.sort = 'nome';
    component.dir = 'desc';
    expect(component.hasActiveFilters).toBe(true);
  });

  it('hasActiveFilters', () => {
    component.sort = 'nome';
    component.dir = 'asc';
    expect(component.hasActiveFilters).toBe(false);
    component.search = 'a';
    expect(component.hasActiveFilters).toBe(true);
    component.search = '';
    component.statusFilter = 'inactive';
    expect(component.hasActiveFilters).toBe(true);
  });

  it('load delega ao store', () => {
    component.load();
    expect(listStore.load).toHaveBeenCalled();
  });

  it('valueChanges reseta toId quando igual a fromId', () => {
    pushBeneficios([sampleA, sampleB]);
    fixture.detectChanges();
    component.transferenciaForm.setValue({ fromId: 1, toId: 1, amount: 1 });
    expect(component.transferenciaForm.getRawValue().toId).toBe(0);
  });
});
