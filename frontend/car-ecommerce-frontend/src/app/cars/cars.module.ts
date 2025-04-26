import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CarListComponent } from './car-list/car-list.component';
import { CarDetailComponent } from './car-detail/car-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CarListComponent
  },
  {
    path: ':id',
    component: CarDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CarListComponent,
    CarDetailComponent
  ]
})
export class CarsModule { } 
 