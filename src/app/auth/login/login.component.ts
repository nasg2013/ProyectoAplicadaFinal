import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css' ]
})
export class LoginComponent implements OnInit {

  public formSubmitted:boolean=false;
  public auth2:any;

  public loginForm = this.fb.group({
    email : [localStorage.getItem('email') || '',[ Validators.required, Validators.email]],
    password : ['',[ Validators.required, Validators.minLength(8)]],
    remember: [true]
  });

  constructor(  private router:Router, 
                private fb:FormBuilder,
                private usurioService:UsuarioService,
                private ngZone:NgZone) { }
  
  ngOnInit(): void {
    this.renderButton();
  }
 
  login(){

    this.usurioService.login(this.loginForm.value)
    .subscribe( resp => {
      if(this.loginForm.get('remember').value){
        localStorage.setItem('email',this.loginForm.get('email').value);
      }else{
        localStorage.removeItem('email');
      }
      //redireccionar
      this.router.navigateByUrl('/');
    }, (err) =>{
        //Manejo del error
        Swal.fire('Error',err.error.msg,'error');
    });
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark'
      });
      this.startApp();
    }

  async startApp(){
    await this.usurioService.googleInit();
    this.auth2 = this.usurioService.auth2; 
    this.attachSignin(document.getElementById('my-signin2'));
  }

    attachSignin(element) {
      console.log(element.id);
      this.auth2.attachClickHandler(element, {},
          (googleUser) => {
           const id_token = googleUser.getAuthResponse().id_token;
           this.usurioService.loginGoogle( id_token)
           .subscribe( resp  =>{
              //redireccionar
              this.ngZone.run(()=>{
                this.router.navigateByUrl('/');
              })
           }
           );
           
          }, function(error) {
            alert(JSON.stringify(error, undefined, 2));
          });
    }

}
