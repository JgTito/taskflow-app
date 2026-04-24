import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrioridadTareaDto } from './prioridad-tarea';
import { environment } from '../../environments/environment.development';
import { PaginacionDTO } from '../compartidos/modelos/PaginacionDTO';
import { construirQueryParams } from '../compartidos/funciones/construirQueryParams';

@Injectable({
  providedIn: 'root'
})
export class PrioridadTareaService {
  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/PrioridadTarea';

  obtenerPaginado(paginacion: PaginacionDTO): Observable<HttpResponse<PrioridadTareaDto[]>> {
    const params = construirQueryParams(paginacion);

    return this.http.get<PrioridadTareaDto[]>(this.urlBase, {
      params,
      observe: 'response'
    });
  }

  obtenerTodas(): Observable<PrioridadTareaDto[]> {
    return this.http.get<PrioridadTareaDto[]>(`${this.urlBase}/ObtenerTodas`);
  }

  obtenerPorId(id: number): Observable<PrioridadTareaDto> {
    return this.http.get<PrioridadTareaDto>(`${this.urlBase}/${id}`);
  }

  crear(dto: PrioridadTareaDto): Observable<PrioridadTareaDto> {
    return this.http.post<PrioridadTareaDto>(this.urlBase, dto);
  }

  editar(id: number, dto: PrioridadTareaDto): Observable<void> {
    return this.http.put<void>(`${this.urlBase}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }
}