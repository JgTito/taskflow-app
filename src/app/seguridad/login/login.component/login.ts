import { Component, inject, signal } from '@angular/core';
import { FormularioAutenticacion } from "../../formulario-autenticacion/formulario-autenticacion.component/formulario-autenticacion";
import { SeguridadService } from '../../seguridad.service';
import { Router } from '@angular/router';
import { CredencialesUsuarioDTO } from '../../seguridad';
import { extraerErroresIdentity } from '../../../compartidos/funciones/extraerErrores';

@Component({
  selector: 'app-login.component',
  imports: [FormularioAutenticacion],
  templateUrl: './login.html',
})
export class Login {
  seguridadService = inject(SeguridadService);
  router = inject(Router);
  errores = signal<string[]>([]);

  loguear(credenciales: CredencialesUsuarioDTO){
    this.seguridadService.login(credenciales)
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
