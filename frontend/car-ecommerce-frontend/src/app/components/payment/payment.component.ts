import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';
import { CartItem } from '../../models/cart-item.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup;
  cartTotal$ = this.cartService.getCartTotal();
  cartItemCount$ = this.cartService.getCartItemCount();
  cartItems: CartItem[] = [];
  orderTotal: number = 0;
  isProcessing = false;
  errorMessage = '';
  orderPlaced = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      cardType: ['credit', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      cardholderName: ['', [Validators.required]],
      expiryMonth: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      expiryYear: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      saveCard: [false]
    });
  }

  ngOnInit(): void {
    // Pre-fill cardholder name with user's name if available
    this.authService.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.paymentForm.patchValue({
          cardholderName: user.name || user.username
        });
      }
    });

    // Get cart items and total
    this.cartService.cartItems$.pipe(take(1)).subscribe(items => {
      this.cartItems = items;
    });
    this.cartService.getCartTotal().pipe(take(1)).subscribe(total => {
      this.orderTotal = total;
    });

    // Load billing address
    const billingAddress = localStorage.getItem('billingAddress');
    if (billingAddress) {
      const address = JSON.parse(billingAddress);
      if (address.fullName) {
        this.paymentForm.patchValue({
          cardholderName: address.fullName
        });
      }
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.paymentForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.isProcessing = true;
      this.errorMessage = '';
      
      // Simulate payment processing
      setTimeout(() => {
        // In a real application, you would send the payment details to your payment processor
        // and handle the response accordingly
        
        // For now, we'll just simulate a successful payment
        this.processOrder();
      }, 1500);
    } else {
      Object.keys(this.paymentForm.controls).forEach(key => {
        const control = this.paymentForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  processOrder(): void {
    // Get billing address
    const billingAddress = localStorage.getItem('billingAddress');
    const shippingAddress = billingAddress ? JSON.parse(billingAddress) : null;

    // Create order details with proper structure
    const orderDetails = {
      id: uuidv4(), // Generate unique order ID
      date: new Date().toISOString(),
      items: this.cartItems.map(item => ({
        id: item.id,
        make: item.make,
        model: item.model,
        year: item.year,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity
      })),
      total: this.orderTotal,
      status: 'Processing' as 'Completed' | 'Processing' | 'Shipped',
      shippingAddress: shippingAddress
    };
    
    // For now, we'll just simulate a successful order
    this.cartService.clearCart().subscribe({
      next: () => {
        this.isProcessing = false;
        this.orderPlaced = true;
        // Store order details in localStorage for history
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderDetails);
        localStorage.setItem('orders', JSON.stringify(orders));
        // Remove billing address from localStorage
        localStorage.removeItem('billingAddress');
      },
      error: (error) => {
        this.isProcessing = false;
        this.errorMessage = error.message || 'Failed to place order. Please try again.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/cars']);
  }
} 