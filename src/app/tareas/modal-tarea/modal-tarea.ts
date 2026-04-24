import { Component, HostListener, inject, input, output, signal, SimpleChanges } from '@angular/core';
import { TareaCreateDto, TareaEditDto, TareaInfoDto, TareaPadreInfoDto } from '../tarea';
import { EstadoTareaService } from '../../estado-tarea/estado-tarea.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstadoTareaDto } from '../../estado-tarea/estado-tarea';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { TareasService } from '../tareas.service';
import { PrioridadTareaService } from '../../prioridad-tarea/prioridad-tarea.service';
import { PrioridadTareaDto } from '../../prioridad-tarea/prioridad-tarea';

@Component({
  selector: 'app-modal-tarea',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-tarea.html',
})
export class ModalTarea {
 private tareaService = inject(TareasService);
  private estadoTareaService = inject(EstadoTareaService);
  private prioridadTareaService = inject(PrioridadTareaService);
  private fb = inject(FormBuilder);

  abierto = input.required<boolean>();
  modo = input.required<'crear' | 'editar'>();
  tarea = input<TareaInfoDto | null>(null);

  cerrado = output<void>();
  tareaGuardada = output<void>();

  estados = signal<EstadoTareaDto[]>([]);
  prioridades = signal<PrioridadTareaDto[]>([]);
  tareasPadreSugeridas = signal<TareaPadreInfoDto[]>([]);
  errores = signal<string[]>([]);

  form = this.fb.group({
    idTareaPadre: [null as number | null],
    tareaPadreTexto: [''],
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    fechaLimite: ['', Validators.required],
    fechaTerminoReal: [''],
    idEstadoTarea: ['' as string | null, Validators.required],
    idPrioridadTarea: ['' as string | null, Validators.required],
  });

  ngOnInit(): void {
    this.cargarCatalogos();
    this.configurarBusquedaTareaPadre();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tarea'] || changes['modo']) {
      this.cargarFormularioDesdeInput();
    }
  }

  get titulo(): string {
    return this.modo() === 'crear' ? 'Crear tarea' : 'Editar tarea';
  }

  cargarCatalogos(): void {
    this.estadoTareaService.obtenerTodos().subscribe({
      next: resp => this.estados.set(resp),
      error: err => console.error(err)
    });

    this.prioridadTareaService.obtenerTodas().subscribe({
      next: resp => this.prioridades.set(resp),
      error: err => console.error(err)
    });
  }

  configurarBusquedaTareaPadre(): void {
    this.form.controls.tareaPadreTexto.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(valor => {
          const texto = valor?.trim() ?? '';

          if (!texto) {
            this.tareasPadreSugeridas.set([]);
            if (this.modo() === 'crear') {
              this.form.controls.idTareaPadre.setValue(null);
            }
            return of([]);
          }

          return this.tareaService.obtenerTareasPadre(texto);
        })
      )
      .subscribe({
        next: resp => this.tareasPadreSugeridas.set(resp),
        error: err => console.error(err)
      });
  }

  cargarFormularioDesdeInput(): void {
    const tarea = this.tarea();

    if (this.modo() === 'crear' || !tarea) {
      this.form.reset({
        idTareaPadre: null,
        tareaPadreTexto: '',
        nombre: '',
        descripcion: '',
        fechaLimite: '',
        fechaTerminoReal: '',
        idEstadoTarea: '',
        idPrioridadTarea: '',
      });
      this.errores.set([]);
      return;
    }

    this.form.patchValue({
      idTareaPadre: tarea.idTareaPadre ?? null,
      tareaPadreTexto: tarea.tareaPadre?.nombre ?? '',
      nombre: tarea.nombre,
      descripcion: tarea.descripcion,
      fechaLimite: tarea.fechaLimite,
      fechaTerminoReal: tarea.fechaTerminoReal ?? '',
      idEstadoTarea: String(tarea.idEstadoTarea),
      idPrioridadTarea: String(tarea.idPrioridadTarea),
    });

    this.errores.set([]);
  }

  seleccionarTareaPadre(tarea: TareaPadreInfoDto): void {
    this.form.controls.idTareaPadre.setValue(tarea.idTarea);
    this.form.controls.tareaPadreTexto.setValue(tarea.nombre, { emitEvent: false });
    this.tareasPadreSugeridas.set([]);
  }

  cerrar(): void {
    this.cerrado.emit();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.modo() === 'crear') {
      const dto: TareaCreateDto = {
        idTareaPadre: this.form.value.idTareaPadre ?? null,
        nombre: this.form.value.nombre!,
        descripcion: this.form.value.descripcion!,
        fechaLimite: this.form.value.fechaLimite!,
        fechaTerminoReal: this.form.value.fechaTerminoReal || null,
        idEstadoTarea: Number(this.form.value.idEstadoTarea),
        idPrioridadTarea: Number(this.form.value.idPrioridadTarea),
      };

      this.tareaService.crear(dto).subscribe({
        next: () => this.tareaGuardada.emit(),
        error: err => this.manejarError(err)
      });

      return;
    }

    const tareaActual = this.tarea();
    if (!tareaActual) {
      return;
    }

    const dtoEditar: TareaEditDto = {
      idTarea: tareaActual.idTarea,
      idTareaPadre: this.form.value.idTareaPadre ?? null,
      nombre: this.form.value.nombre!,
      descripcion: this.form.value.descripcion!,
      fechaLimite: this.form.value.fechaLimite!,
      fechaTerminoReal: this.form.value.fechaTerminoReal || null,
      idEstadoTarea: Number(this.form.value.idEstadoTarea),
      idPrioridadTarea: Number(this.form.value.idPrioridadTarea),
      userId: tareaActual.userId ?? null,
    };

      this.tareaService.editar(tareaActual.idTarea, dtoEditar).subscribe({
        next: () => this.tareaGuardada.emit(),
        error: err => this.manejarError(err)
      });
  }

  manejarError(err: any): void {
    console.error(err);
    const errores = err?.error;
    this.errores.set(Array.isArray(errores) ? errores : ['Ocurrió un error al guardar la tarea.']);
  }
}
