import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { TransferenciasTabComponent } from './transferencias-tab.component';
import { BeneficioApiService } from '../../../../core/services/beneficio-api.service';
import { BeneficioListStore, BeneficioListState } from '../../../../store/beneficio-list.store';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Beneficio } from '../../../../core/models/beneficio.model';
import { FeedbackType } from '../../../../shared/enums/feedback-type.enum';
import { GESTAO_UI_MESSAGES } from '../../constants/gestao-ui-messages.constants';

describe('TransferenciasTabComponent', () => {
  let fixture: ComponentFixture<TransferenciasTabComponent>;
  let component: TransferenciasTabComponent;

  const state$ = new BehaviorSubject<BeneficioListState>({
    items: [], page: 0, size: 5, totalPages: 0, totalElements: 0, loading: false
  });
  const api = { transfer: jest.fn() };
  const listStore = { state$: state$.asObservable(), load: jest.fn(), invalidate: jest.fn() };
  const notification = { show: jest.fn() };
  const dialogOpen = jest.fn();

  const sampleA: Beneficio = { id: 1, nome: 'Origem', descricao: '', valor: 100, ativo: true, version: 0 };
  const sampleB: Beneficio = { id: 2, nome: 'Destino', descricao: '', valor: 50, ativo: true, version: 0 };

  function pushBeneficios(items: Beneficio[]) {
    state$.next({ items, page: 0, size: 5, totalPages: 1, totalElements: items.length, loading: false });
  }

  beforeEach(async () => {
    jest.resetAllMocks();
    dialogOpen.mockImplementation(() => ({ afterClosed: () => of(undefined) }));
    api.transfer.mockReturnValue(of(undefined));
    state$.next({ items: [], page: 0, size: 5, totalPages: 0, totalElements: 0, loading: false });
    await TestBed.configureTestingModule({
      imports: [TransferenciasTabComponent, NoopAnimationsModule],
      providers: [
        { provide: BeneficioApiService, useValue: api },
        { provide: BeneficioListStore, useValue: listStore },
        { provide: NotificationService, useValue: notification },
        { provide: MatDialog, useValue: { open: dialogOpen } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TransferenciasTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it('transferir com sucesso emite transferido', () => {
    pushBeneficios([sampleA, sampleB]);
    fixture.detectChanges();
    component.transferenciaForm.setValue({ fromId: 1, toId: 2, amount: 10 });
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of(true) });
    const emitted = jest.fn();
    component.transferido.subscribe(emitted);
    component.transferir();
    expect(api.transfer).toHaveBeenCalledWith({ fromId: 1, toId: 2, amount: 10 });
    expect(emitted).toHaveBeenCalled();
  });

  it('transferir cancelado não chama api', () => {
    pushBeneficios([sampleA, sampleB]);
    fixture.detectChanges();
    component.transferenciaForm.setValue({ fromId: 1, toId: 2, amount: 10 });
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of(false) });
    component.transferir();
    expect(api.transfer).not.toHaveBeenCalled();
  });

  it('transferir erro mostra mensagem do servidor', () => {
    pushBeneficios([sampleA, sampleB]);
    fixture.detectChanges();
    component.transferenciaForm.setValue({ fromId: 1, toId: 2, amount: 10 });
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of(true) });
    api.transfer.mockReturnValueOnce(throwError(() => ({ error: { message: 'falha' } })));
    component.transferir();
    expect(notification.show).toHaveBeenCalledWith('falha', FeedbackType.Error);
  });

  it('transferir erro sem message usa fallback', () => {
    pushBeneficios([sampleA, sampleB]);
    fixture.detectChanges();
    component.transferenciaForm.setValue({ fromId: 1, toId: 2, amount: 10 });
    dialogOpen.mockReturnValueOnce({ afterClosed: () => of(true) });
    api.transfer.mockReturnValueOnce(throwError(() => ({ error: {} })));
    component.transferir();
    expect(notification.show).toHaveBeenCalledWith(GESTAO_UI_MESSAGES.transferencia.error, FeedbackType.Error);
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

  it('displayBeneficio e formatCurrency', () => {
    expect(component.displayBeneficio(sampleA)).toContain('Origem');
    expect(component.formatCurrency(1)).toContain('1');
  });

  it('valueChanges reseta toId quando igual a fromId', () => {
    pushBeneficios([sampleA, sampleB]);
    fixture.detectChanges();
    component.transferenciaForm.setValue({ fromId: 1, toId: 1, amount: 1 });
    expect(component.transferenciaForm.getRawValue().toId).toBe(0);
  });
});
