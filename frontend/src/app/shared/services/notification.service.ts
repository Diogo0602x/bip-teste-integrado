import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeedbackType } from '../enums/feedback-type.enum';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  show(message: string, type: FeedbackType, duration = 2800): void {
    this.snackBar.open(message, 'Fechar', {
      duration,
      panelClass: [`snackbar-${type}`]
    });
  }
}
