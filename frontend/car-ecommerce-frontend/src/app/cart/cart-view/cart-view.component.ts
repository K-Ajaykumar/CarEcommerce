import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.scss']
})
export class CartViewComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  isLoading = false;
  error = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadCartItems(): void {
    this.isLoading = true;
    this.error = '';
    
    const subscription = this.cartService.cartItems$.subscribe({
      next: (items) => {
        this.items = items;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load cart items';
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(subscription);
  }

  getCartTotal(): number {
    return this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  updateQuantity(item: CartItem, change: number): void {
    const newQuantity = Math.max(1, item.quantity + change);
    if (newQuantity === item.quantity) return;

    this.error = '';
    const subscription = this.cartService.updateCartItem(item.id, newQuantity).subscribe({
      error: (error) => {
        this.error = error.message || 'Failed to update item quantity';
      }
    });
    
    this.subscriptions.push(subscription);
  }

  removeItem(item: CartItem): void {
    this.error = '';
    
    const subscription = this.cartService.removeFromCart(item.id).subscribe({
      error: (error) => {
        this.error = error.message || 'Failed to remove item from cart';
      }
    });
    
    this.subscriptions.push(subscription);
  }

  clearCart(): void {
    this.error = '';
    
    const subscription = this.cartService.clearCart().subscribe({
      error: (error) => {
        this.error = error.message || 'Failed to clear cart';
      }
    });
    
    this.subscriptions.push(subscription);
  }

  checkout(): void {
    if (this.items.length === 0) {
      this.error = 'Cart is empty';
      return;
    }
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/cars']);
  }
} 