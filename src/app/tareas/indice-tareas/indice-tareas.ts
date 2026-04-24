import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PaginacionDTO } from '../../compartidos/modelos/PaginacionDTO';
import { TareaInfoDto, TareaFiltroDto, OrdenarPorDto, DireccionOrdenDto } from '../tarea';
import { TareasService } from '../tareas.service';
import { ModalTarea } from "../modal-tarea/modal-tarea";
import { ModalConfirmacion } from "../../compartidos/componentes/modal-confirmacion/modal-confirmacion";
import { ModalDetalleTarea } from "../modal-detalle-tarea/modal-detalle-tarea";
import { EstadoTareaDto } from '../../estado-tarea/estado-tarea';
import { PrioridadTareaDto } from '../../prioridad-tarea/prioridad-tarea';
import { EstadoTareaService } from '../../estado-tarea/estado-tarea.service';
import { PrioridadTareaService } from '../../prioridad-tarea/prioridad-tarea.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-indice-tareas',
  standalone: true,
  imports: [MatPaginatorModule, ModalTarea, ModalConfirmacion, ModalDetalleTarea],
  templateUrl: './indice-tareas.html',
})
export class IndiceTareas implements OnInit {
  private tareaService = inject(TareasService);

  private estadoTareaService = inject(EstadoTareaService);
  private prioridadTareaService = inject(PrioridadTareaService);


  estados = signal<EstadoTareaDto[]>([]);
  prioridades = signal<PrioridadTareaDto[]>([]);
  ordenarPor = signal<OrdenarPorDto[]>([
    { campoNombre: 'Nombre', valor: 'Nombre' },
    { campoNombre: 'Fecha límite', valor: 'FechaLimite' },
    { campoNombre: 'Estado', valor: 'IdEstadoTarea' },
    { campoNombre: 'Prioridad', valor: 'IdPrioridadTarea' }
  ]);

  direccionOrden = signal<DireccionOrdenDto[]>([
    { campoNombre: 'Ascendente', valor: 'asc' },
    { campoNombre: 'Descendente', valor: 'desc' }
  ]);

  mostrarModalDetalle = signal(false);
  tareaDetalleSeleccionada = signal<TareaInfoDto | null>(null);

  mostrarConfirmacion = signal(false);
  tareaAEliminar = signal<number | null>(null);

  paginacion: PaginacionDTO = { pagina: 1, recordsPorPagina: 6 };

  filtro = signal<TareaFiltroDto>({idEstadoTarea:null, idPrioridadTarea:null, nombre:"",direccionOrden:"",ordenarPor:""});

  tareas = signal<TareaInfoDto[]>([]);
  cantidadTotalRegistros = 0;

  mostrarModal = signal(false);
  modoModal = signal<'crear' | 'editar'>('crear');
  tareaSeleccionada = signal<TareaInfoDto | null>(null);

  ngOnInit(): void {
    this.cargarCatalogos();
    this.cargarRegistros();
  }

  actualizarPaginacion(datos: PageEvent): void {
    this.paginacion = {
      pagina: datos.pageIndex + 1,
      recordsPorPagina: datos.pageSize
    };

    this.cargarRegistros();
  }

  cargarRegistros(): void {
    this.tareaService.obtenerPaginado(this.paginacion,this.filtro()).pipe(
      debounceTime(300)
    )
      .subscribe({
        next: (respuesta: HttpResponse<TareaInfoDto[]>) => {
          this.tareas.set(respuesta.body ?? []);
          const cabecera = respuesta.headers.get('cantidad-total-registros');
          this.cantidadTotalRegistros = cabecera ? parseInt(cabecera, 10) : 0;
        },
        error: (error) => {
          console.error('Error al cargar tareas', error);
          this.tareas.set([]);
          this.cantidadTotalRegistros = 0;
        }
      });
  }

  abrirModalCrear(): void {
    this.modoModal.set('crear');
    this.tareaSeleccionada.set(null);
    this.mostrarModal.set(true);
  }

  abrirModalEditar(tarea: TareaInfoDto): void {
    this.modoModal.set('editar');
    this.tareaSeleccionada.set(tarea);
    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.tareaSeleccionada.set(null);
  }

  tareaGuardada(): void {
    this.mostrarModal.set(false);
    this.tareaSeleccionada.set(null);
    this.cargarRegistros();
  }
  confirmarEliminar(id: number) {
    this.tareaAEliminar.set(id);
    this.mostrarConfirmacion.set(true);
  }

  cancelarEliminar() {
    this.mostrarConfirmacion.set(false);
    this.tareaAEliminar.set(null);
  }

  eliminarConfirmado() {
    const id = this.tareaAEliminar();

    if (!id) return;

    this.tareaService.borrar(id).subscribe({
      next: () => {
        this.cancelarEliminar();
        this.cargarRegistros();
      },
      error: err => console.error(err)
    });
  }

  abrirDetalle(tarea: TareaInfoDto): void {
    this.tareaDetalleSeleccionada.set(tarea);
    this.mostrarModalDetalle.set(true);
  }

  cerrarDetalle(): void {
    this.mostrarModalDetalle.set(false);
    this.tareaDetalleSeleccionada.set(null);
  }

  cambiarNombre(nombre:string){

    this.filtro.update(actual => ({
      ...actual,
      nombre: nombre
    }));

    this.cargarRegistros();
  }

   cambiarEstado(idEstado:number){

    this.filtro.update(actual => ({
      ...actual,
      idEstadoTarea: idEstado
    }));

    this.cargarRegistros();
  }

   cambiarPrioridad(idPrioridad:number){

    this.filtro.update(actual => ({
      ...actual,
      idPrioridadTarea: idPrioridad
    }));

    this.cargarRegistros();
  }


   cambiarOrdenarPor(ordenar:string){

    this.filtro.update(actual => ({
      ...actual,
      ordenarPor: ordenar
    }));

    this.cargarRegistros();
  }

  
    cambiarDireccionOrden(direccion:string){

    this.filtro.update(actual => ({
      ...actual,
      direccionOrden: direccion
    }));

    this.cargarRegistros();
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

limpiarFiltros(
  inputNombre: HTMLInputElement,
  selectEstado: HTMLSelectElement,
  selectPrioridad: HTMLSelectElement,
  selectOrdenar: HTMLSelectElement,
  selectDireccion: HTMLSelectElement
): void {
  inputNombre.value = '';
  selectEstado.value = '';
  selectPrioridad.value = '';
  selectOrdenar.value = '';
  selectDireccion.value = '';

  this.filtro.set({
    nombre: '',
    idEstadoTarea: null,
    idPrioridadTarea: null,
    ordenarPor: '',
    direccionOrden: ''
  });

  this.cargarRegistros();
}


}