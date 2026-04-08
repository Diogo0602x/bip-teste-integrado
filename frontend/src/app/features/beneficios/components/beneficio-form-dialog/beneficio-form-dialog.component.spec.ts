import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BeneficioFormDialogComponent } from './beneficio-form-dialog.component';

describe('BeneficioFormDialogComponent', () => {
  const close = jest.fn();

  it('modo create inicia vazio', () => {
    TestBed.configureTestingModule({
      imports: [BeneficioFormDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'create' as const } }
      ]
    });
    const fixture = TestBed.createComponent(BeneficioFormDialogComponent);
    expect(fixture.componentInstance.form.controls.nome.value).toBe('');
  });

  it('modo edit preenche form', () => {
    TestBed.configureTestingModule({
      imports: [BeneficioFormDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            mode: 'edit' as const,
            beneficio: {
              id: 1,
              nome: 'Nome',
              descricao: 'D',
              valor: 12.34,
              ativo: false,
              version: 1
            }
          }
        }
      ]
    });
    const fixture = TestBed.createComponent(BeneficioFormDialogComponent);
    expect(fixture.componentInstance.form.controls.nome.value).toBe('Nome');
  });

  it('onValorBlur atualiza display', () => {
    TestBed.configureTestingModule({
      imports: [BeneficioFormDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'create' as const } }
      ]
    });
    const c = TestBed.createComponent(BeneficioFormDialogComponent).componentInstance;
    c.form.patchValue({ nome: 'abc', descricao: '', valor: 5, ativo: true });
    c.onValorBlur();
    expect(c.valorDisplay).toBeTruthy();
  });

  it('onValorInput com só # normaliza', () => {
    TestBed.configureTestingModule({
      imports: [BeneficioFormDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'create' as const } }
      ]
    });
    const c = TestBed.createComponent(BeneficioFormDialogComponent).componentInstance;
    c.onValorInput('###');
    expect(c.form.controls.valor.value).toBe(0);
  });

  it('save inválido marca touched e não fecha', () => {
    TestBed.configureTestingModule({
      imports: [BeneficioFormDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'create' as const } }
      ]
    });
    const c = TestBed.createComponent(BeneficioFormDialogComponent).componentInstance;
    c.save();
    expect(close).not.toHaveBeenCalled();
  });

  it('save válido fecha com payload', () => {
    TestBed.configureTestingModule({
      imports: [BeneficioFormDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'create' as const } }
      ]
    });
    const c = TestBed.createComponent(BeneficioFormDialogComponent).componentInstance;
    c.form.patchValue({ nome: 'Nome ok', descricao: '', valor: 10, ativo: true });
    c.save();
    expect(close).toHaveBeenCalled();
  });

  it('canSave exige valor > 0', () => {
    TestBed.configureTestingModule({
      imports: [BeneficioFormDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'create' as const } }
      ]
    });
    const c = TestBed.createComponent(BeneficioFormDialogComponent).componentInstance;
    c.form.patchValue({ nome: 'abc', descricao: '', valor: 0, ativo: true });
    expect(c.canSave).toBe(false);
  });

  it('onValorInput com dígitos atualiza valor', () => {
    TestBed.configureTestingModule({
      imports: [BeneficioFormDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'create' as const } }
      ]
    });
    const c = TestBed.createComponent(BeneficioFormDialogComponent).componentInstance;
    c.onValorInput('1234');
    expect(c.form.controls.valor.value).toBe(12.34);
  });

  it('onValorBlur com NaN usa zero no formato', () => {
    TestBed.configureTestingModule({
      imports: [BeneficioFormDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'create' as const } }
      ]
    });
    const c = TestBed.createComponent(BeneficioFormDialogComponent).componentInstance;
    c.form.controls.valor.setValue(Number.NaN);
    c.onValorBlur();
    expect(c.valorDisplay).toContain('0,00');
  });

  it('onValorKeydown impede entrada de letra', () => {
    TestBed.configureTestingModule({
      imports: [BeneficioFormDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'create' as const } }
      ]
    });
    const c = TestBed.createComponent(BeneficioFormDialogComponent).componentInstance;
    const event = { key: 'x', ctrlKey: false, metaKey: false, preventDefault: jest.fn() } as unknown as KeyboardEvent;
    c.onValorKeydown(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('onValorKeydown permite dígito sem bloquear', () => {
    TestBed.configureTestingModule({
      imports: [BeneficioFormDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'create' as const } }
      ]
    });
    const c = TestBed.createComponent(BeneficioFormDialogComponent).componentInstance;
    const event = { key: '1', ctrlKey: false, metaKey: false, preventDefault: jest.fn() } as unknown as KeyboardEvent;
    c.onValorKeydown(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
