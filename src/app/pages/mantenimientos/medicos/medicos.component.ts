import { Component, OnInit } from '@angular/core';
import { Medico } from '../../../models/medico.model';
import { Subscription } from 'rxjs';
import { MedicoService } from '../../../services/medico.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit {

  public medicos: Medico[]=[];
  public cargando:boolean = true;
  public imgSubs:Subscription;

  constructor(  private medicosService:MedicoService,
                private busquedasService:BusquedasService,
                private modalImagenService:ModalImagenService,
                private router:Router) { } 
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe(); 
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe( delay(100))
    .subscribe( img => this.cargarMedicos());
    
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicosService.cargarMedicos()
    .subscribe( medicos => {
      this.medicos = medicos;   
      this.cargando = false;
    })
  }

  buscar(termino:string){

    if(termino.length === 0){
      return this.cargarMedicos();
    }

    if(termino.trim() === ''){
      return this.cargarMedicos();
    }

    this.busquedasService.buscar('medicos',termino)
      .subscribe( (resp:any) => {
        this.medicos = resp.resultados;
      });
  }

  eliminarMedico( medico:Medico ){
    Swal.fire({
      title: '¿Esta seguro?',
      text: `¡Esta apunto de borrar a ${medico.nombre}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicosService.borrarMedico(medico._id)
          .subscribe( (resp:any) => {
            this.cargarMedicos();
            Swal.fire('Eliminado',medico.nombre,'success');
          });
      }
    })
  }

  editarMedico( medico:Medico ){
    this.router.navigateByUrl(`/dashboard/medico/${medico._id}`); 
  }
  
  abrirModal(medico:Medico){
    this.modalImagenService.abrirModal('medicos',medico._id,medico.img);
  }

}
