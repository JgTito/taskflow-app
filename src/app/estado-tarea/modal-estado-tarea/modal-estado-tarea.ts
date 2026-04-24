import { Component, HostListener, inject, input, output, signal, SimpleChanges } from '@angular/core';
import { EstadoTareaDto } from '../estado-tarea';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstadoTareaService } from '../estado-tarea.service';

@Component({
  selector: 'app-modal-estado-tarea',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-estado-tarea.html',
})
export class ModalEstadoTarea {

  private fb = inject(FormBuilder);
  private estadoTareaService = inject(EstadoTareaService);

  abierto = input.required<boolean>();
  modo = input.required<'crear' | 'editar'>();
  estado = input<EstadoTareaDto | null>(null);

  cerrado = output<void>();
  guardado = output<void>();

  errores = signal<string[]>([]);

  form = this.fb.group({
    nombre: ['', Validators.required]
  });

  get titulo(): string {
    return this.modo() === 'crear' ? 'Crear estado de tarea' : 'Editar estado de tarea';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['estado'] || changes['modo']) {
      this.cargarFormulario();
    }
  }

  cargarFormulario(): void {
    if (this.modo() === 'crear' || !this.estado()) {
      this.form.reset({
        nombre: ''
      });
      this.errores.set([]);
      return;
    }

    this.form.patchValue({
      nombre: this.estado()!.nombre
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

    const dto: EstadoTareaDto = {
      idEstadoTarea: this.estado()?.idEstadoTarea ?? 0,
      nombre: this.form.value.nombre!
    };

    if (this.modo() === 'crear') {
      this.estadoTareaService.crear(dto).subscribe({
        next: () => this.guardado.emit(),
        error: err => this.manejarError(err)
      });
      return;
    }

    this.estadoTareaService.editar(dto.idEstadoTarea, dto).subscribe({
      next: () => this.guardado.emit(),
      error: err => this.manejarError(err)
    });
  }

  manejarError(err: any): void {
    console.error(err);
    const errores = err?.error;
    this.errores.set(Array.isArray(errores) ? errores : ['Ocurrió un error al guardar el estado de tarea.']);
  }

  @HostListener('document:keydown.escape')
  cerrarConEscape(): void {
    if (this.abierto()) {
      this.cerrar();
    }
  }

 }
