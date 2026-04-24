import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { SeguridadService } from '../seguridad.service';

export const estaLogeadoGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const seguridadService = inject(SeguridadService);

  if (seguridadService.estaLogueado()){
    return true;
  }

  router.navigate(['/login']);
  return true;
};
