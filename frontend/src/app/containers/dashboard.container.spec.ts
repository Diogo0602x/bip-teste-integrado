import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardContainer } from './dashboard.container';

describe('DashboardContainer', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardContainer, NoopAnimationsModule],
      providers: [provideHttpClient()]
    }).compileComponents();
  });

  it('renderiza app-dashboard', () => {
    const fixture = TestBed.createComponent(DashboardContainer);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-dashboard')).toBeTruthy();
  });
});
