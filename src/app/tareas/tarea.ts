export interface TareaInfoDto {
  idTarea: number;
  idTareaPadre?: number | null;

  nombre: string;
  descripcion: string;
  fechaLimite: string; // DateOnly → string (ISO)

  fechaTerminoReal?: string | null;
  userId?: string | null;

  estadoNombre:string;
  prioridadNombre:string;

  idEstadoTarea: number;
  idPrioridadTarea: number;

  tareaPadre?: TareaPadreDto | null;
  subTareas: TareaSubTareaDto[];
}
export interface TareaSubTareaDto {
  idTarea: number;
  idTareaPadre?: number | null;

  nombre: string;
  descripcion: string;

  estadoNombre:string;
  prioridadNombre:string;

  fechaLimite: string;
  fechaTerminoReal?: string | null;

  userId: string;

  idEstadoTarea: number;
  idPrioridadTarea: number;
}
export interface TareaPadreDto {
  idTarea: number;
  idTareaPadre?: number | null;

  nombre: string;
  descripcion: string;

  estadoNombre:string;
  prioridadNombre:string;

  fechaLimite: string;
  fechaTerminoReal?: string | null;

  userId: string;

  idEstadoTarea: number;
  idPrioridadTarea: number;
}
export interface TareaBaseDto {
  idTareaPadre?: number | null;

  nombre: string;
  descripcion: string;
  fechaLimite: string; // DateOnly → string

  fechaTerminoReal?: string | null;
  idEstadoTarea: number;
  idPrioridadTarea: number;
}
export interface TareaCreateDto extends TareaBaseDto {
}
export interface TareaPadreInfoDto {
  idTarea: number;
  nombre: string;
}
export interface TareaEditDto extends TareaBaseDto
{   
     userId?: string | null;
     idTarea : number;
}

export interface TareaFiltroDto {
    nombre:string;
    idEstadoTarea:number | null;
    idPrioridadTarea:number | null;
    ordenarPor:string;
    direccionOrden:string;
}

export interface OrdenarPorDto{
  campoNombre:string;
  valor:string;
}

export interface DireccionOrdenDto {
  campoNombre: string;
  valor: 'asc' | 'desc';
}