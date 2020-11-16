import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm:FormGroup;
  public hospitales: Hospital[]=[];
  public hospitalSeleccionado:Hospital;
  public medicoSeleccionado:Medico;

  constructor(  private fb:FormBuilder,
                private hospitalService:HospitalService,
                private medicoService:MedicoService,
                private router:Router,
                private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.cargarHospitales();
    this.cargarMedicoById();

    this.medicoForm = this.fb.group({
      nombre:  ['', Validators.required],
      hospital: ['-1',[Validators.required,Validators.min(0)]]
    })

    this.medicoForm.get('hospital').valueChanges
    .subscribe( hospitalId =>{
      this.hospitalSeleccionado = this.hospitales.find( hospital => hospital._id === hospitalId);
    })
  }

  cargarMedicoById(){
    this.activatedRoute.params
    .subscribe( ({id}) => {
      this.medicoService.cargarMedicoById(id)
      .subscribe( medico =>{
        const {nombre, hospital:{_id} } = medico;
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({nombre,hospital:_id});
      })
    })
    // this.medicoService
  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales()
    .subscribe( (hospitales: Hospital[]) =>{
      this.hospitales = hospitales;
    })
  }

  guardarMedico(){
    const {nombre} = this.medicoForm.value;
    this.medicoService.crearMedico(this.medicoForm.value)
    .subscribe((resp:any)=>{
      Swal.fire('Creado',`${nombre} creado correctamente`,'success');
      this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`)
    })
  }

}
