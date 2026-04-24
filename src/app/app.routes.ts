import { Routes } from '@angular/router';
import { IndiceTareas  } from './tareas/indice-tareas/indice-tareas';
import { estaLogeadoGuardGuard } from './seguridad/guards/estaLogeadoGuard-guard';
import { Layout } from './compartidos/componentes/layout/layout';
import { Login } from './seguridad/login/login.component/login';
import { Registro } from './seguridad/registro/registro.component/registro';
import { IndiceEstadoTarea } from './estado-tarea/indice-estado-tarea/indice-estado-tarea';
import { IndicePrioridadTarea } from './prioridad-tarea/indice-prioridad-tarea/indice-prioridad-tarea';

export const routes: Routes = [

  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
 
  {
    path: '',
    component: Layout,
    canActivate: [estaLogeadoGuardGuard],
    children: [
      { path: 'tareas', component: IndiceTareas },
      { path: 'estado-tarea', component: IndiceEstadoTarea, },
      { path: 'prioridad-tarea', component: IndicePrioridadTarea }
    ]
  }
];
