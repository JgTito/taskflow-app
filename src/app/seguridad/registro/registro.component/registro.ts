import { Component, inject, signal } from '@angular/core';
import { CredencialesUsuarioDTO } from '../../seguridad';
import { SeguridadService } from '../../seguridad.service';
import { Router } from '@angular/router';
import { extraerErroresIdentity } from '../../../compartidos/funciones/extraerErrores';
import { FormularioAutenticacion } from '../../formulario-autenticacion/formulario-autenticacion.component/formulario-autenticacion';

@Component({
  selector: 'app-registro.component',
  imports: [FormularioAutenticacion],
  templateUrl: './registro.html',
})
export class Registro{ 
   seguridadService = inject(SeguridadService);
  router = inject(Router);
  errores = signal<string[]>([]);

  registrar(credenciales: CredencialesUsuarioDTO){
    this.seguridadService.registrar(credenciales)
    .subscribe({
      next: () => {
        this.router.navigate(['/'])
      },
      error: err => {
        const errores = extraerErroresIdentity(err);
        this.errores.set(errores);
      }
    })
  }
}
