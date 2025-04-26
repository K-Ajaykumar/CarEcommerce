import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Car } from '../../models/car.model';
import { CarService } from '../../services/car.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.scss']
})
export class CarDetailComponent implements OnInit {
  car: Car | undefined;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCarDetails(id);
  }

  loadCarDetails(id: number): void {
    this.carService.getCarById(id).subscribe({
      next: (car) => {
        this.car = car;
      },
      error: (error) => {
        console.error('Error loading car details:', error);
        this.errorMessage = 'Error loading car details. Please try again.';
      }
    });
  }

  addToCart(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.car) {
      this.errorMessage = 'Car details not available.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.cartService.addToCart(this.car.id).subscribe({
      next: () => {
        this.isLoading = false;
        // Show success message or redirect to cart
        this.router.navigate(['/cart']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error adding to cart:', error);
        if (error.status === 401) {
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = error.error?.message || 'Error adding to cart. Please try again.';
        }
      }
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/cars/placeholder.jpg';
  }
} 