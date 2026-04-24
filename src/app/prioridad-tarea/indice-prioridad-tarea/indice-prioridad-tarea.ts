import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { PaginacionDTO } from '../../compartidos/modelos/PaginacionDTO';
import { PrioridadTareaDto } from '../prioridad-tarea';
import { PrioridadTareaService } from '../prioridad-tarea.service';
import { ModalPrioridadTarea } from '../modal-prioridad-tarea/modal-prioridad-tarea';
import { ModalConfirmacion } from "../../compartidos/componentes/modal-confirmacion/modal-confirmacion";

@Component({
  selector: 'app-indice-prioridad-tarea',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    ModalPrioridadTarea,
    ModalConfirmacion
],
  templateUrl: './indice-prioridad-tarea.html',
})
export class IndicePrioridadTarea implements OnInit {
  private prioridadTareaService = inject(PrioridadTareaService);

  paginacion: PaginacionDTO = { pagina: 1, recordsPorPagina: 6 };
  prioridades = signal<PrioridadTareaDto[]>([]);
  cantidadTotalRegistros = 0;

  mostrarModal = signal(false);
  modoModal = signal<'crear' | 'editar'>('crear');
  prioridadSeleccionada = signal<PrioridadTareaDto | null>(null);

  mostrarConfirmacion = signal(false);
  prioridadAEliminar = signal<number | null>(null);

  columnasAMostrar: string[] = ['idPrioridadTarea', 'nombre', 'acciones'];

  ngOnInit(): void {
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
    this.prioridadTareaService.obtenerPaginado(this.paginacion)
      .subscribe({
        next: (respuesta: HttpResponse<PrioridadTareaDto[]>) => {
          this.prioridades.set(respuesta.body ?? []);
          const cabecera = respuesta.headers.get('cantidad-total-registros');
          this.cantidadTotalRegistros = cabecera ? parseInt(cabecera, 10) : 0;
        },
        error: (error) => {
          console.error('Error al cargar prioridades de tarea', error);
          this.prioridades.set([]);
          this.cantidadTotalRegistros = 0;
        }
      });
  }

  abrirModalCrear(): void {
    this.modoModal.set('crear');
    this.prioridadSeleccionada.set(null);
    this.mostrarModal.set(true);
  }

  abrirModalEditar(prioridad: PrioridadTareaDto): void {
    this.modoModal.set('editar');
    this.prioridadSeleccionada.set(prioridad);
    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.prioridadSeleccionada.set(null);
  }

  guardado(): void {
    this.mostrarModal.set(false);
    this.prioridadSeleccionada.set(null);
    this.cargarRegistros();
  }

  confirmarEliminar(id: number): void {
    this.prioridadAEliminar.set(id);
    this.mostrarConfirmacion.set(true);
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacion.set(false);
    this.prioridadAEliminar.set(null);
  }

  eliminarConfirmado(): void {
    const id = this.prioridadAEliminar();

    if (!id) {
      return;
    }

    this.prioridadTareaService.eliminar(id).subscribe({
      next: () => {
        this.cancelarEliminar();
        this.cargarRegistros();
      },
      error: err => {
        console.error('Error al eliminar prioridad de tarea', err);
        this.cancelarEliminar();
      }
    });
  }
}