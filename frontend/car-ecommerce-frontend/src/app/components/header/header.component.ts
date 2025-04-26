import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="logo">
        <a routerLink="/">Car Ecommerce</a>
      </div>
      <nav class="nav-links">
        <a routerLink="/cars">Cars</a>
      </nav>
      <div class="auth-buttons">
        <ng-container *ngIf="!(authService.user$ | async); else loggedIn">
          <button class="login-btn" routerLink="/login">Login</button>
          <button class="register-btn" routerLink="/register">Register</button>
        </ng-container>
        <ng-template #loggedIn>
          <span class="welcome-text">Welcome, {{(authService.user$ | async)?.username}}!</span>
          <a routerLink="/orders" class="orders-link">My Orders</a>
          <a routerLink="/cart" class="cart-link">
            <div class="cart-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span class="cart-badge" *ngIf="(cartItemCount$ | async) !== 0">
                {{ cartItemCount$ | async }}
              </span>
            </div>
            <span class="cart-text">Cart</span>
          </a>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </ng-template>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #333;
      color: white;
    }

    .logo a {
      color: white;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
      
      a {
        color: white;
        text-decoration: none;
        font-size: 1.1rem;
        
        &:hover {
          color: #007bff;
        }
      }
    }

    .auth-buttons {
      display: flex;
      gap: 1rem;
      align-items: center;

      button {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
      }

      .orders-link {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: all 0.2s ease;
        font-size: 1.1rem;
        font-weight: 500;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }

      .cart-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: all 0.2s ease;
        margin-right: 1rem;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .cart-icon {
          position: relative;
          display: flex;
          align-items: center;
          color: #007bff;
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: #dc3545;
          color: white;
          border-radius: 50%;
          padding: 0.25rem;
          font-size: 0.75rem;
          min-width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-text {
          font-size: 1.1rem;
          font-weight: 500;
        }
      }

      .login-btn {
        background-color: transparent;
        color: white;
        border: 1px solid white;

        &:hover {
          background-color: white;
          color: #333;
        }
      }

      .register-btn {
        background-color: #007bff;
        color: white;

        &:hover {
          background-color: #0056b3;
        }
      }

      .logout-btn {
        background-color: #dc3545;
        color: white;
        border: none;

        &:hover {
          background-color: #c82333;
        }
      }

      .welcome-text {
        color: white;
        font-size: 1.1rem;
        margin-right: 1rem;
      }
    }
  `]
})
export class HeaderComponent {
  cartItemCount$ = this.cartService.getCartItemCount().pipe(
    map(count => count || 0)
  );

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 