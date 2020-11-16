import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public profileForm: FormGroup;
  public usuario:Usuario;
  public imagenSubir:File;
  public imgTemp:any=null;

  constructor(  private fb:FormBuilder,private usuarioService:UsuarioService, private fileUploadService:FileUploadService) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      nombre:[this.usuario.nombre,Validators.required],
      email:[this.usuario.email,[Validators.required, Validators.email]]
    })
  }

  actualizarPerfil(){
    this.usuarioService.actualizarPerfil(this.profileForm.value)
    .subscribe( (resp:any) => {
      this.usuario.nombre = resp.usuario.nombre || '';
      this.usuario.email = resp.usuario.email || '';
      Swal.fire('Guardado','Usuario actualizado con exito','success');
    },(err) => {
      Swal.fire('Error',err.error.msg,'warning');
    })
  }

  cambiarImagen( file:File ){
    this.imagenSubir = file;

    if( !file ){ 
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => { this.imgTemp = reader.result; }

  }

  subirImagen(){
    this.fileUploadService.actualizarFoto( this.imagenSubir,'usuarios', this.usuario.usuarioId)
    .then( img =>{
      this.usuario.img = img;
      Swal.fire('Guardado','Imagen actualizada con exito','success');
    }).catch( err => Swal.fire('Error',err.error.msg,'warning'));
  }




}
