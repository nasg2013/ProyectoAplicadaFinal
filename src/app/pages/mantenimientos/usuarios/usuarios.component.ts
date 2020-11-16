import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number=0;
  public desde: number=0;
  public usuarios: Usuario[]=[];
  public cargando:boolean = true;

  public imgSubs:Subscription;

  constructor(  private usuarioService:UsuarioService,
                private busquedasService:BusquedasService,
                private modalImagenService:ModalImagenService) { } 
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe(); 
  }

  ngOnInit(): void {
    this.cargarUsuarios();
   
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe( delay(100))
    .subscribe( img => this.cargarUsuarios());
    
  }

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe( ({total,usuarios}) => {
      this.totalUsuarios =  total;
      this.usuarios = usuarios;   
      this.cargando = false;
    })
  }

  cambiarPagina( valor:number ){
    this.desde += valor;
    if( this.desde < 0 ){
      this.desde = 0;
    }else if( this.desde >= this.totalUsuarios ){
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar(termino:string){

    if(termino.length === 0){
      return this.cargarUsuarios();
    }

    if(termino.trim() === ''){
      return this.cargarUsuarios();
    }

    this.busquedasService.buscar('usuarios',termino)
      .subscribe( (resp:any) => {
        this.usuarios = resp.resultados;
        this.totalUsuarios = resp.resultados.length;
      });
  }

  eliminarUsuario( usuario:Usuario ){

    if( usuario.usuarioId === this.usuarioService.usuarioId){
      return Swal.fire('Error','No puede borrar su propio usuario','warning');
    }

    Swal.fire({
      title: '¿Esta seguro?',
      text: `¡Esta apunto de borrar a ${usuario.nombre}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioService.eliminarUsuario(usuario)
        .subscribe( resp => {
          Swal.fire(
            '¡Borrado!',
            `${usuario.nombre} ha sido borrado correctamente`,
            'success'
          )
          this.cargarUsuarios();      
        });  
      }
    })
  }
  
  CambiarRole(usuario:Usuario){

    this.usuarioService.CambiarRole(usuario)
    .subscribe( resp => {
      if(!resp){
        Swal.fire('Error','Por favor intente de nuevo','warning');
      }      
    });

  }

  abrirModal(usuario:Usuario){
    this.modalImagenService.abrirModal('usuarios',usuario.usuarioId,usuario.img);
  }

}
