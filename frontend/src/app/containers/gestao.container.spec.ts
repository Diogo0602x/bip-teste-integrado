import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GestaoContainer } from './gestao.container';

describe('GestaoContainer', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestaoContainer, NoopAnimationsModule],
      providers: [provideHttpClient()]
    }).compileComponents();
  });

  it('renderiza app-gestao', () => {
    const fixture = TestBed.createComponent(GestaoContainer);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-gestao')).toBeTruthy();
  });
});
