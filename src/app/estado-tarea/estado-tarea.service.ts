import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { EstadoTareaDto } from './estado-tarea';
import { PaginacionDTO } from '../compartidos/modelos/PaginacionDTO';
import { construirQueryParams } from '../compartidos/funciones/construirQueryParams';

@Injectable({
  providedIn: 'root'
})
export class EstadoTareaService {
  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/EstadoTarea';

  obtenerPaginado(paginacion: PaginacionDTO): Observable<HttpResponse<EstadoTareaDto[]>> {
    const params = construirQueryParams(paginacion);

    return this.http.get<EstadoTareaDto[]>(this.urlBase, {
      params,
      observe: 'response'
    });
  }

  obtenerTodos(): Observable<EstadoTareaDto[]> {
    return this.http.get<EstadoTareaDto[]>(`${this.urlBase}/ObtenerTodos`);
  }

  crear(dto: EstadoTareaDto): Observable<EstadoTareaDto> {
    return this.http.post<EstadoTareaDto>(this.urlBase, dto);
  }

  editar(id: number, dto: EstadoTareaDto): Observable<void> {
    return this.http.put<void>(`${this.urlBase}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }
}