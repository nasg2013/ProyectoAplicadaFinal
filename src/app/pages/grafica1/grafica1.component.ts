import { Component } from '@angular/core';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {  

  public labels1:string []= ['Ventas Totales', 'Ventas en proceso', 'Ventas por email'];
  public labels2:string []= ['Ventas Totales 2', 'Ventas en proceso 2', 'Ventas por email 2'];
  public labels3:string []= ['Ventas Totales 3', 'Ventas en proceso 3', 'Ventas por email 3'];
  public labels4:string []= ['Ventas Totales 4', 'Ventas en proceso 4', 'Ventas por email 4'];

  public data1: number [] = [ 50, 100, 300 ];
  public data2: number [] = [ 400, 500, 600 ];
  public data3: number [] = [ 10, 20, 30 ];
  public data4: number [] = [ 1000, 1500, 200 ];

  public colors4: Color[] = [
    { backgroundColor: [ '#FF8C00','#9932CC','#8B0000']}
  ];

}
