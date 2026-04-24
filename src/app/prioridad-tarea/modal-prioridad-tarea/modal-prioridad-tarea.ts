import { Component, HostListener, OnChanges, SimpleChanges, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrioridadTareaDto } from '../prioridad-tarea';
import { PrioridadTareaService } from '../prioridad-tarea.service';

@Component({
  selector: 'app-modal-prioridad-tarea',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-prioridad-tarea.html',
})
export class ModalPrioridadTarea implements OnChanges {
  private fb = inject(FormBuilder);
  private prioridadTareaService = inject(PrioridadTareaService);

  abierto = input.required<boolean>();
  modo = input.required<'crear' | 'editar'>();
  prioridad = input<PrioridadTareaDto | null>(null);

  cerrado = output<void>();
  guardado = output<void>();

  errores = signal<string[]>([]);

  form = this.fb.group({
    nombre: ['', Validators.required]
  });

  get titulo(): string {
    return this.modo() === 'crear' ? 'Crear prioridad de tarea' : 'Editar prioridad de tarea';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['prioridad'] || changes['modo']) {
      this.cargarFormulario();
    }
  }

  cargarFormulario(): void {
    if (this.modo() === 'crear' || !this.prioridad()) {
      this.form.reset({
        nombre: ''
      });
      this.errores.set([]);
      return;
    }

    this.form.patchValue({
      nombre: this.prioridad()!.nombre
    });

    this.errores.set([]);
  }

  cerrar(): void {
    this.cerrado.emit();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto: PrioridadTareaDto = {
      idPrioridadTarea: this.prioridad()?.idPrioridadTarea ?? 0,
      nombre: this.form.value.nombre!
    };

    if (this.modo() === 'crear') {
      this.prioridadTareaService.crear(dto).subscribe({
        next: () => this.guardado.emit(),
        error: err => this.manejarError(err)
      });
      return;
    }

    this.prioridadTareaService.editar(dto.idPrioridadTarea, dto).subscribe({
      next: () => this.guardado.emit(),
      error: err => this.manejarError(err)
    });
  }

  manejarError(err: any): void {
    console.error(err);
    const errores = err?.error;
    this.errores.set(Array.isArray(errores) ? errores : ['Ocurrió un error al guardar la prioridad de tarea.']);
  }

  @HostListener('document:keydown.escape')
  cerrarConEscape(): void {
    if (this.abierto()) {
      this.cerrar();
    }
  }
}