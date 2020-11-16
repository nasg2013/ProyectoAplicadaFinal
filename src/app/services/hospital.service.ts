import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

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

  constructor(private http:HttpClient) { }

  cargarHospitales(){
    const url = `${base_url}/hospitales`;
    return this.http.get(url,this.header)
    .pipe(
      map( (resp: {ok:boolean, hospitales:Hospital[]}) => resp.hospitales)
    );    
  }

  crearHospital( nombre:string ){
    const url = `${base_url}/hospitales`;
    return this.http.post(url,{nombre},this.header);
  }
  
  actualizarHospital( hospital:Hospital ){
    const url = `${base_url}/hospitales/${hospital._id}`;
    return this.http.put(url,hospital,this.header);
  }

  borrarHospital( _id:string ){
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.delete(url,this.header);
  }

  



}
