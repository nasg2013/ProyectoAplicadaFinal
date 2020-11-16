import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Hospital } from '../../../models/hospital.model';

import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';



@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit {

  public hospitales:Hospital[] = [];
  public cargando:boolean = true;

  public imgSubs:Subscription;

  constructor( private hospitalService:HospitalService,
                private modalImagenService:ModalImagenService,
                private busquedasService:BusquedasService) { }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe( delay(100))
    .subscribe( img => this.cargarHospitales());

  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales()
    .subscribe(hospitales => {
      this.hospitales = hospitales;
      this.cargando = false; 
    })
  }

  async crearHospital(){
    
    const {value=''} = await Swal.fire<string>({
      title:'Crear nuevo hospital',
      input:'text',
      confirmButtonText: 'Crear',
      inputPlaceholder: 'Nombre del nuevo hospital',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
      icon:'info'
    })

    if(value.trim().length > 0 ){
      this.hospitalService.crearHospital(value)
      .subscribe( (resp:any) =>{
        this.hospitales.push(resp.hospital)
      })
    }

  }

  guardarCambios(hospital:Hospital){
    this.hospitalService.actualizarHospital(hospital)
    .subscribe( (resp:any) => {
      Swal.fire('Actualizado',hospital.nombre,'success');
    });
  }

  borrarHospital(hospital:Hospital){
    Swal.fire({
      title: '¿Esta seguro?',
      text: `¡Esta apunto de borrar a ${hospital.nombre}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.borrarHospital(hospital._id)
          .subscribe( (resp:any) => {
            this.cargarHospitales();
            Swal.fire('Eliminado',hospital.nombre,'success');
          });
      }
    })
  }

  abrirModal(hospital:Hospital){
    this.modalImagenService.abrirModal('hospitales',hospital._id,hospital.img);
  }

  buscar(termino:string){

    if(termino.length === 0){
      return this.cargarHospitales();
    }

    if(termino.trim() === ''){
      return this.cargarHospitales();
    }

    this.busquedasService.buscar('hospitales',termino)
      .subscribe( (resp:any) => {
        this.hospitales = resp.resultados;
      });
  }
}
