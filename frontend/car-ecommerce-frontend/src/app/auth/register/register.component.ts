import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Register</h2>
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="username"
              required
              minlength="2"
              #usernameInput="ngModel"
            >
            <div class="error" *ngIf="usernameInput.invalid && usernameInput.touched">
              Please enter a username (minimum 2 characters)
            </div>
          </div>

          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              [(ngModel)]="firstName"
              required
              #firstNameInput="ngModel"
            >
            <div class="error" *ngIf="firstNameInput.invalid && firstNameInput.touched">
              Please enter your first name
            </div>
          </div>

          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              [(ngModel)]="lastName"
              required
              #lastNameInput="ngModel"
            >
            <div class="error" *ngIf="lastNameInput.invalid && lastNameInput.touched">
              Please enter your last name
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              #emailInput="ngModel"
            >
            <div class="error" *ngIf="emailInput.invalid && emailInput.touched">
              Please enter a valid email
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="6"
              #passwordInput="ngModel"
            >
            <div class="error" *ngIf="passwordInput.invalid && passwordInput.touched">
              Password must be at least 6 characters
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              [(ngModel)]="confirmPassword"
              required
              #confirmPasswordInput="ngModel"
            >
            <div class="error" *ngIf="confirmPasswordInput.touched && password !== confirmPassword">
              Passwords do not match
            </div>
          </div>

          <div class="form-group">
            <label for="address">Address (Optional)</label>
            <input
              type="text"
              id="address"
              name="address"
              [(ngModel)]="address"
              #addressInput="ngModel"
            >
          </div>

          <div class="form-group">
            <label for="phoneNumber">Phone Number (Optional)</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              [(ngModel)]="phoneNumber"
              #phoneNumberInput="ngModel"
            >
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button type="submit" [disabled]="registerForm.invalid || password !== confirmPassword || isLoading">
            {{ isLoading ? 'Registering...' : 'Register' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 100px);
      padding: 2rem;
    }

    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;

      h2 {
        text-align: center;
        margin-bottom: 2rem;
        color: #333;
      }
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #666;
      }

      input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: #007bff;
        }
      }
    }

    .error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .error-message {
      color: #dc3545;
      text-align: center;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #0056b3;
      }

      &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
    }
  `]
})
export class RegisterComponent {
  username: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  address: string = '';
  phoneNumber: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register({
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      address: this.address || undefined,
      phoneNumber: this.phoneNumber || undefined
    }).subscribe({
      next: () => {
        this.router.navigate(['/cars']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to register. Please try again.';
      }
    });
  }
} 
 