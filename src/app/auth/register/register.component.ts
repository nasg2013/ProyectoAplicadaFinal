import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  {

  public formSubmitted:boolean=false;

  public registerForm = this.fb.group({
    nombre : ['Néstor Sánchez',[ Validators.required]],
    email : ['test@email.com',[ Validators.required, Validators.email]],
    password : ['12345678',[ Validators.required, Validators.minLength(8)]],
    password2 : ['12345678',[ Validators.required, Validators.minLength(8)]],
    terminos : [false,Validators.required]    
  },{
    validators: this.passwordsIguales('password','password2')
  });
 
  constructor( private router:Router, private fb:FormBuilder, private usuarioService:UsuarioService ) { }

  crearUsuario(){
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if(this.registerForm.invalid){
      return;
    }

    //Crear usuario

    this.usuarioService.crearUsuario( this.registerForm.value )
    .subscribe( resp =>{
      //redireccionar
      this.router.navigateByUrl('/');
    },(err)=> {
      //Manejo del error
      Swal.fire('Error',err.error.msg,'error');
    });
  }  

  contrasennasNoValidas():boolean{
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if( pass1 !== pass2 && this.formSubmitted ){
      return true;
    }else{
      return false;
    }
  }

  passwordsIguales(password:string,password2:string){

    return ( formGroup:FormGroup )=>{
      const pass1Control = formGroup.get(password);
      const pass2Control = formGroup.get(password2);
      
      if(pass1Control.value === pass2Control.value ){
        pass2Control.setErrors(null);
      }else{
        pass2Control.setErrors({noEsIgual:true});
      }
    }

  }

  aceptaTerminos():boolean{
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }
  

  campoNoValido( campo:string):boolean{

    if(this.registerForm.get(campo).invalid && this.formSubmitted){
      return true;
    }else{
      return false;
    }
    

  }

}
