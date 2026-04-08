import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';
import { FeedbackType } from '../enums/feedback-type.enum';

describe('NotificationService', () => {
  let snack: { open: jest.Mock };
  let service: NotificationService;

  beforeEach(() => {
    snack = { open: jest.fn() };
    TestBed.configureTestingModule({
      providers: [NotificationService, { provide: MatSnackBar, useValue: snack }]
    });
    service = TestBed.inject(NotificationService);
  });

  it('show abre snackbar com painel por tipo', () => {
    service.show('msg', FeedbackType.Success);
    expect(snack.open).toHaveBeenCalledWith(
      'msg',
      'Fechar',
      expect.objectContaining({
        duration: 2800,
        panelClass: ['snackbar-success']
      })
    );
  });
});
