import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal-confirmacion',
  imports: [],
  templateUrl: './modal-confirmacion.html',
})
export class ModalConfirmacion { 
  abierto = input.required<boolean>();
  titulo = input<string>('Confirmar acción');
  mensaje = input<string>('¿Estás seguro?');

  confirmado = output<void>();
  cancelado = output<void>();

  confirmar() {
    this.confirmado.emit();
  }

  cancelar() {
    this.cancelado.emit();
  }
}
