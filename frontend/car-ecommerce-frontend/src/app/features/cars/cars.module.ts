import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarListComponent } from './car-list/car-list.component';

@NgModule({
  declarations: [
    CarListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CarListComponent }
    ])
  ],
  exports: [
    CarListComponent
  ]
})
export class CarsModule { } 
 