import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesa',
  templateUrl: './promesa.component.html',
  styles: [
  ]
})
export class PromesaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.getUsers().then( users => {
      console.log( users );
    });

    // const promesa = new Promise( ( resolve,reject ) => {
      
    //   if( false ){
    //     resolve('Hola Mundo');
    //   }else{
    //     reject ('algo salio mal');
    //   }
      
    // });

    // promesa.then(( message )=>{
    //   console.log(message);  
    // })
    // .catch( error => console.log('Error en mi promesa', error));

    // console.log("Fin OnInit");
  
  }

  getUsers(){
    //promesa
    return new Promise( resolve => {
      fetch('https://reqres.in/api/users')
      .then( resp => resp.json() )
      .then( body => resolve( body.data ) ); 
    });
  }//fin getUsers

}
