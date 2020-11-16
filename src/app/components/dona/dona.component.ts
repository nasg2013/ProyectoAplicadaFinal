import { Component, Input } from '@angular/core';
import { MultiDataSet, Label, Color } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent  {
 
   // Doughnut
   @Input('labels') public doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
   @Input('data') public doughnutChartData: MultiDataSet = [
     [350, 450, 100]
   ];

   @Input('colors') public colors: Color[] = [
     { backgroundColor: [ '#6857E6','#009FEE','#F02059']}
   ];

   @Input() title:string = "Sin titulo";

   public doughnutChartType: ChartType = 'doughnut';


}
