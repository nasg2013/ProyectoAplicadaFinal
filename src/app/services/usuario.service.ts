import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';

import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment.prod';
import { LoginForm } from '../interfaces/login.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;
declare const gapi:any; 
 
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2:any;
  public usuario:Usuario;

  constructor(  private http:HttpClient, 
                private router:Router,
                private ngZone:NgZone) {  
    this.googleInit(); 
  }

  get token():string{
    return localStorage.getItem('token') || '';
  }

  get usuarioId():string{
    return this.usuario.usuarioId || '';
  } 
  get header(){
    return {
      headers:{
        'x-token': this.token
      }
    }
  }
  
googleInit(){

  return new Promise( resolve =>{
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '924681969112-feb60jnfvs0sdv689dipi5blen39alob.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });
      resolve();
    });
  })
  
}

validarToken():Observable<boolean>{
  return this.http.get( `${ base_url }/login/renew`,this.header)
  .pipe(
    map( ( resp: any ) =>{
      const {email,google,nombre,role,img='',usuarioId,activo}= resp.usuarioDB;
      this.usuario = new Usuario( nombre,email,'',img,google,role,usuarioId,activo );
      localStorage.setItem('token', resp.token);
      return true;
    }),
    catchError( error => of(false) )
  );
}

  crearUsuario( formData: RegisterForm ){
    return this.http.post( `${ base_url }/usuarios`, formData)
    .pipe(
      tap( (resp:any) =>{
        localStorage.setItem('token', resp.token);
      })
    );
  }

  login( formData: LoginForm){
    return this.http.post( `${ base_url }/login`, formData)
    .pipe(
      tap( (resp:any) =>{
        localStorage.setItem('token', resp.token);
      })
    );
  }

  loginGoogle( token ){
    return this.http.post( `${ base_url }/login/google`, { token } )
    .pipe(
      tap( (resp:any) =>{
        localStorage.setItem('token', resp.token);
      })
    );
  }

  logout(){
    localStorage.removeItem('token');
    this.auth2.signOut().then( ()=> {
      this.ngZone.run(()=>{
        this.router.navigateByUrl('/login');
      })
    });

  }

  actualizarPerfil( data:{email:string,nombre:string, role:string}){
    data= {
      ...data,
      role:this.usuario.role
    }
    return this.http.put( `${ base_url }/usuarios/${ this.usuarioId }`, data,this.header);
  }

  cargarUsuarios(desde:number = 0){
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url,this.header)
    .pipe(
      map( resp => {
        const usuarios = resp.usuarios.map(
          usuario => new Usuario(usuario.nombre,usuario.email,'',usuario.img,usuario.google,usuario.role,usuario.usuarioId,usuario.activo)
        );
        return {
          total: resp.total,
          usuarios
        }
      })
    )
  }

  eliminarUsuario( usuario:Usuario){
    
    const url = `${base_url}/usuarios/${usuario.usuarioId}`;
    return this.http.delete(url,this.header);

  }

  CambiarRole(usuario:Usuario){
    return this.http.put( `${ base_url }/usuarios/${ usuario.usuarioId }`, usuario ,this.header);
  }

}
 