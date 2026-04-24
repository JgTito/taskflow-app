import { Component, EventEmitter, inject, input, Input, output, Output } from '@angular/core';
import { CredencialesUsuarioDTO } from '../../seguridad';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MostrarErrores } from "../../../compartidos/componentes/mostrar-errores/mostrar-errores";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-formulario-autenticacion',
  imports: [MostrarErrores, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatInputModule],
  templateUrl: './formulario-autenticacion.html',
  styleUrl: './formulario-autenticacion.css'
})
export class FormularioAutenticacion {

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    email: ['', {validators: [Validators.required, Validators.email]}],
    password: ['', {validators: [Validators.required]}]
  })
  
  titulo = input.required<string>();
  errores = input<string[]>();
  posteoFormulario = output<CredencialesUsuarioDTO>();

  obtenerMensajeErrorEmail(): string{
    let campo = this.form.controls.email;

    if (campo.hasError('required')){
      return 'El campo email es requerido';
    }

    
    if (campo.hasError('email')){
      return 'El email no es válido';
    }

    return '';
  }

  obtenerMensajeErrorPassword(): string{
    let campo = this.form.controls.password;

    if (campo.hasError('required')){
      return 'El campo password es requerido';
    }

    return '';
  }

  guardarCambios(){
    if (!this.form.valid){
      return;
    }

    const credenciales = this.form.value as CredencialesUsuarioDTO;
    this.posteoFormulario.emit(credenciales);
  }


 }
