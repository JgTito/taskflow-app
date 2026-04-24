import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-mostrar-errores',
  imports: [],
  templateUrl: './mostrar-errores.html',
})
export class MostrarErrores {

 
  errores = input<string[]>();
 }
