import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.scss']
})
export class CartViewComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;
  errorMessage: string = '';

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartTotal$ = this.cartService.getCartTotal();
  }

  ngOnInit(): void {
    this.cartService.loadCartItems();
  }

  updateQuantity(item: CartItem, change: number): void {
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      this.removeFromCart(item.id);
      return;
    }

    this.cartService.updateCartItem(item.id, newQuantity).subscribe({
      error: (error) => {
        this.errorMessage = error.message;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  removeFromCart(itemId: number): void {
    this.cartService.removeFromCart(itemId).subscribe({
      error: (error) => {
        if (!error.silent) {
          this.errorMessage = error.message;
          setTimeout(() => this.errorMessage = '', 3000);
        }
      }
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      error: (error) => {
        this.errorMessage = error.message;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }
} 