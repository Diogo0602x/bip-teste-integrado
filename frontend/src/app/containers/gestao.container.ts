import { Component } from '@angular/core';
import { GestaoComponent } from '../features/gestao/gestao.component';

@Component({
  selector: 'app-gestao-container',
  standalone: true,
  imports: [GestaoComponent],
  template: '<app-gestao></app-gestao>'
})
export class GestaoContainer {}
