import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'T',
            message: 'M',
            confirmText: 'OK',
            cancelText: 'N'
          }
        }
      ]
    }).compileComponents();
  });

  it('cancel fecha com false', () => {
    const ref = TestBed.inject(MatDialogRef) as { close: jest.Mock };
    const fixture = TestBed.createComponent(ConfirmDialogComponent);
    fixture.componentInstance.cancel();
    expect(ref.close).toHaveBeenCalledWith(false);
  });

  it('confirm fecha com true', () => {
    const ref = TestBed.inject(MatDialogRef) as { close: jest.Mock };
    const fixture = TestBed.createComponent(ConfirmDialogComponent);
    fixture.componentInstance.confirm();
    expect(ref.close).toHaveBeenCalledWith(true);
  });
});
