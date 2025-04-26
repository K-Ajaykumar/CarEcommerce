import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CartViewComponent } from './cart-view/cart-view.component';

const routes: Routes = [
  {
    path: '',
    component: CartViewComponent
  }
];

@NgModule({
  declarations: [
    CartViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CartModule { } 
 