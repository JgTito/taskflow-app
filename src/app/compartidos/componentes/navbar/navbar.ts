import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SeguridadService } from '../../../seguridad/seguridad.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './navbar.html',
})
export class Navbar {


  router = inject(Router)

  seguridadService = inject(SeguridadService)

  menuMovilAbierto = signal(false);
  menuUsuarioAbierto = signal(false);

  toggleMenuMovil() {
    this.menuMovilAbierto.update(v => !v);
  }

  toggleUserMenu() {
    this.menuUsuarioAbierto.update(v => !v);
  }

  logout() {
    console.log('logout');
    this.router.navigateByUrl("/login");
    this.seguridadService.logout();
    this.menuUsuarioAbierto.set(false);
  }


 }
