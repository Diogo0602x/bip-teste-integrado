import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { GestaoComponent } from './gestao.component';
import { BeneficioApiService } from '../../core/services/beneficio-api.service';
import { BeneficioListStore, BeneficioListState } from '../../store/beneficio-list.store';
import { NotificationService } from '../../shared/services/notification.service';
import { DashboardTab } from '../../core/enums/dashboard-tab.enum';

describe('GestaoComponent', () => {
  let fixture: ComponentFixture<GestaoComponent>;
  let component: GestaoComponent;

  const state$ = new BehaviorSubject<BeneficioListState>({
    items: [], page: 0, size: 5, totalPages: 0, totalElements: 0, loading: false
  });
  const api = {
    list: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    transfer: jest.fn(),
    getHistorico: jest.fn()
  };
  const listStore = { state$: state$.asObservable(), load: jest.fn(), invalidate: jest.fn() };
  const notification = { show: jest.fn() };
  const dialogOpen = jest.fn().mockImplementation(() => ({ afterClosed: () => of(undefined) }));

  beforeEach(async () => {
    jest.clearAllMocks();
    dialogOpen.mockImplementation(() => ({ afterClosed: () => of(undefined) }));
    api.getHistorico.mockReturnValue(of({ content: [], page: 0, size: 20, totalElements: 0, totalPages: 0, sort: 'createdAt', dir: 'desc', query: null }));
    await TestBed.configureTestingModule({
      imports: [GestaoComponent, NoopAnimationsModule],
      providers: [
        { provide: BeneficioApiService, useValue: api },
        { provide: BeneficioListStore, useValue: listStore },
        { provide: NotificationService, useValue: notification },
        { provide: MatDialog, useValue: { open: dialogOpen } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(GestaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('selectedTab inicial é Beneficios', () => {
    expect(component.selectedTab).toBe(DashboardTab.Beneficios);
  });

  it('onTransferido muda para aba Historico', () => {
    const benefReload = jest.spyOn(component.beneficiosTab, 'reload');
    const histReload = jest.spyOn(component.historicoTab, 'reload');
    component.onTransferido();
    expect(benefReload).toHaveBeenCalled();
    expect(histReload).toHaveBeenCalled();
    expect(component.selectedTab).toBe(DashboardTab.Historico);
  });

  it('tabs expõe enum DashboardTab', () => {
    expect(component.tabs).toBe(DashboardTab);
  });
});
