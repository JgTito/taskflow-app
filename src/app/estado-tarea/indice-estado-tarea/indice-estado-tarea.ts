import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { PaginacionDTO } from '../../compartidos/modelos/PaginacionDTO';
import { EstadoTareaDto } from '../estado-tarea';
import { EstadoTareaService } from '../estado-tarea.service';
import { ModalEstadoTarea } from '../modal-estado-tarea/modal-estado-tarea';
import { ModalConfirmacion } from '../../compartidos/componentes/modal-confirmacion/modal-confirmacion';


@Component({
  selector: 'app-indice-estado-tarea',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    ModalEstadoTarea,
    ModalConfirmacion
  ],
  templateUrl: './indice-estado-tarea.html',
})
export class IndiceEstadoTarea implements OnInit {
  private estadoTareaService = inject(EstadoTareaService);

  paginacion: PaginacionDTO = { pagina: 1, recordsPorPagina: 6 };
  estados = signal<EstadoTareaDto[]>([]);
  cantidadTotalRegistros = 0;

  mostrarModal = signal(false);
  modoModal = signal<'crear' | 'editar'>('crear');
  estadoSeleccionado = signal<EstadoTareaDto | null>(null);

  mostrarConfirmacion = signal(false);
  estadoAEliminar = signal<number | null>(null);

  columnasAMostrar: string[] = ['idEstadoTarea', 'nombre', 'acciones'];

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
    this.estadoTareaService.obtenerPaginado(this.paginacion)
      .subscribe({
        next: (respuesta: HttpResponse<EstadoTareaDto[]>) => {
          this.estados.set(respuesta.body ?? []);
          const cabecera = respuesta.headers.get('cantidad-total-registros');
          this.cantidadTotalRegistros = cabecera ? parseInt(cabecera, 10) : 0;
        },
        error: (error) => {
          console.error('Error al cargar estados de tarea', error);
          this.estados.set([]);
          this.cantidadTotalRegistros = 0;
        }
      });
  }

  abrirModalCrear(): void {
    this.modoModal.set('crear');
    this.estadoSeleccionado.set(null);
    this.mostrarModal.set(true);
  }

  abrirModalEditar(estado: EstadoTareaDto): void {
    this.modoModal.set('editar');
    this.estadoSeleccionado.set(estado);
    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.estadoSeleccionado.set(null);
  }

  guardado(): void {
    this.mostrarModal.set(false);
    this.estadoSeleccionado.set(null);
    this.cargarRegistros();
  }

  confirmarEliminar(id: number): void {
    this.estadoAEliminar.set(id);
    this.mostrarConfirmacion.set(true);
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacion.set(false);
    this.estadoAEliminar.set(null);
  }

  eliminarConfirmado(): void {
    const id = this.estadoAEliminar();

    if (!id) {
      return;
    }

    this.estadoTareaService.eliminar(id).subscribe({
      next: () => {
        this.cancelarEliminar();
        this.cargarRegistros();
      },
      error: err => {
        console.error('Error al eliminar estado de tarea', err);
        this.cancelarEliminar();
      }
    });
  }
}