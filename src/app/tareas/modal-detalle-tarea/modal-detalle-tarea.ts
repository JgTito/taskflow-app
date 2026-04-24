import { Component, HostListener, input, output } from '@angular/core';
import { TareaInfoDto } from '../tarea';

@Component({
  selector: 'app-modal-detalle-tarea',
  imports: [],
  templateUrl: './modal-detalle-tarea.html',
})
export class ModalDetalleTarea {
  abierto = input.required<boolean>();
  tarea = input<TareaInfoDto | null>(null);

  cerrado = output<void>();

  cerrar(): void {
    this.cerrado.emit();
  }

  @HostListener('document:keydown.escape')
  cerrarConEscape(): void {
    if (this.abierto()) {
      this.cerrar();
    }
  }
}
