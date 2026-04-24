import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { construirQueryParams } from '../compartidos/funciones/construirQueryParams';
import { PaginacionDTO } from '../compartidos/modelos/PaginacionDTO';
import { TareaCreateDto, TareaEditDto, TareaFiltroDto, TareaInfoDto, TareaPadreInfoDto } from './tarea';


@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/Tareas';

  obtenerPaginado(paginacion: PaginacionDTO,filtro:TareaFiltroDto): Observable<HttpResponse<TareaInfoDto[]>> {
    const params = construirQueryParams({
                                          ...paginacion,
                                          ...filtro
                                        });
   
    return this.http.get<TareaInfoDto[]>(this.urlBase, {
      params,
      observe: 'response'
    });
  }

  obtenerPorId(id: number): Observable<TareaInfoDto> {
    return this.http.get<TareaInfoDto>(`${this.urlBase}/${id}`);
  }

  crear(tarea: TareaCreateDto): Observable<TareaInfoDto> {
    return this.http.post<TareaInfoDto>(this.urlBase, tarea);
  }

  editar(id: number, tarea: TareaEditDto) {
    return this.http.put<void>(`${this.urlBase}/${id}`, tarea);
  }
  borrar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }

  obtenerTareasPadre(query: string) {
  return this.http.get<TareaPadreInfoDto[]>(`${this.urlBase}/ObtenerTodas`, {
    params: { query }
  });
}
}