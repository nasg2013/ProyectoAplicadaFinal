import { Component } from '@angular/core';
import { Color, Label } from 'ng2-charts';
import { ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {  

  //Titulos a mostrar en grafica Dona
  public labels1:string []= ['Ventas Totales', 'Ventas en proceso', 'Ventas por email'];

  //Valores a mostrar en grafica dona
  public data1: number [] = [ 50, 100, 300 ];

  //Colores a mostrar en grafica Dona
  public colors1: Color[] = [
    { backgroundColor: [ '#FF8C00','#9932CC','#8B0000']}
  ];

  //Barras
  public labelsBarras: Label []= ['Titulo 1', 'Titulo 2', 'Titulo 3'];
  //Valores a mostrar en grafica barras
  public dataBarras: ChartDataSets [] = [
    {data:[ 50, 100, 300 ],label:'Dato 1'},
    {data:[ 80, 130, 330 ],label:'Dato 2'},
    {data:[ 110, 160, 350 ],label:'Dato 3'}
  ]




}
