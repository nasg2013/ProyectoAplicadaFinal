import { Component } from '@angular/core';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {  

  //Titulos a mostrar en grafica
  public labels1:string []= ['Ventas Totales', 'Ventas en proceso', 'Ventas por email'];

  //Valores a mostrar en grafica
  public data1: number [] = [ 50, 100, 300 ];

  //Colores a mostrar en grafica
  public colors1: Color[] = [
    { backgroundColor: [ '#FF8C00','#9932CC','#8B0000']}
  ];

}
