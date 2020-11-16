import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})

export class BusquedasService {

  public usuario:Usuario;

  constructor(private http:HttpClient) { }

  
  get token():string{
    return localStorage.getItem('token') || '';
  }

  get header(){
    return {
      headers:{
        'x-token': this.token
      }
    }
  }

  private transFormarUsuarios( resultados:any):Usuario[]{
    return resultados.map(
      usuario => new Usuario(usuario.nombre,usuario.email,'',usuario.img,usuario.google,usuario.role,usuario.usuarioId,usuario.activo)
    );
  }

  private transFormarHospitales( resultados:any):Hospital[]{
    return resultados;
  }

  buscar( 
      tipo: 'usuarios'|'hospitales'|'medicos',
      termino:string,
      desde:number = -1
    ) {
      // /busqueda/coleccion/usuarios/e?desde=20
      var url = '';
      if(tipo === 'usuarios'){
        url = `${base_url}/busqueda/coleccion/${tipo}/${termino}?desde=${desde}`;
      }else{
        url = `${base_url}/busqueda/coleccion/${tipo}/${termino}`;
      }
     
      return this.http.get<any[]>(url,this.header)
      .pipe(
        map( (resp:any) => {
          switch (tipo) {
            case 'usuarios':
              return {
                resultados: this.transFormarUsuarios(resp.resultado),
                total: resp.total
              }
            case 'hospitales':
              return {
                resultados: this.transFormarHospitales(resp.resultado)
              }
            case 'medicos':
              return {
                resultados: this.transFormarHospitales(resp.resultado)
              }
            default:
              return [];
          }

          // return {
          //   resultados: resp.resultado,
          //   total: resp.total            
          // }
        })
      )




  }

  
}
