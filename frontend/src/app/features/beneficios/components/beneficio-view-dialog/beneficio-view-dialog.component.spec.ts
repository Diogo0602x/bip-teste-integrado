import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TestBed } from '@angular/core/testing';
import { BeneficioViewDialogComponent } from './beneficio-view-dialog.component';

describe('BeneficioViewDialogComponent', () => {
  it('formattedValor usa valor da data', () => {
    TestBed.configureTestingModule({
      imports: [BeneficioViewDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { id: 1, nome: 'N', descricao: '', valor: 99.5, ativo: true, version: 1 }
        }
      ]
    });
    const fixture = TestBed.createComponent(BeneficioViewDialogComponent);
    expect(fixture.componentInstance.formattedValor).toMatch(/99/);
  });

  it('formattedValor trata valor indefinido', () => {
    TestBed.configureTestingModule({
      imports: [BeneficioViewDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { id: 1, nome: 'N', descricao: '', valor: undefined as unknown as number, ativo: true, version: 1 }
        }
      ]
    });
    const fixture = TestBed.createComponent(BeneficioViewDialogComponent);
    expect(fixture.componentInstance.formattedValor).toBeTruthy();
  });
});
