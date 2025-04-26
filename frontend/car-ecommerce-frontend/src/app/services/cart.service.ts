import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { CartItem } from '../models/cart-item.model';
import { AuthService } from './auth.service';

interface CartItemDTO {
  id: number;
  carId: number;
  carMake: string;
  carModel: string;
  carYear: number;
  carPrice: number;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5083/api/cart';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadCartItems();
  }

  private getHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 401:
          errorMessage = 'Please login to access cart';
          break;
        case 404:
          // For 404 errors, we'll handle them silently for remove operations
          if (error.url?.includes('delete')) {
            return throwError(() => ({ silent: true }));
          }
          errorMessage = 'Item not found';
          break;
        case 400:
          errorMessage = error.error?.message || 'Invalid request';
          break;
        default:
          errorMessage = `Error: ${error.status} - ${error.error?.message || 'Unknown error'}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  private mapCartItemDTOToCartItem(dto: CartItemDTO): CartItem {
    return {
      id: dto.id,
      carId: dto.carId,
      make: dto.carMake,
      model: dto.carModel,
      year: dto.carYear,
      price: dto.carPrice,
      quantity: dto.quantity,
      totalPrice: dto.totalPrice,
      createdAt: new Date(dto.createdAt),
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined
    };
  }

  loadCartItems(): void {
    this.http.get<CartItemDTO[]>(this.apiUrl, this.getHeaders())
      .pipe(
        map(items => items.map(item => this.mapCartItemDTOToCartItem(item))),
        catchError(this.handleError)
      )
      .subscribe({
        next: (items) => this.cartItemsSubject.next(items),
        error: (error) => {
          console.error('Error loading cart items:', error);
          this.cartItemsSubject.next([]);
        }
      });
  }

  addToCart(carId: number, quantity: number = 1): Observable<void> {
    return this.http.post<void>(
      this.apiUrl,
      { carId, quantity },
      this.getHeaders()
    ).pipe(
      tap(() => this.loadCartItems()),
      catchError(this.handleError)
    );
  }

  updateCartItem(itemId: number, quantity: number): Observable<void> {
    if (quantity <= 0) {
      return this.removeFromCart(itemId);
    }

    return this.http.put<void>(
      `${this.apiUrl}/${itemId}`,
      { quantity },
      this.getHeaders()
    ).pipe(
      tap(() => this.loadCartItems()),
      catchError(this.handleError)
    );
  }

  removeFromCart(itemId: number): Observable<void> {
    // Optimistically remove the item from the local state
    const currentItems = this.cartItemsSubject.value;
    const itemToRemove = currentItems.find(item => item.id === itemId);
    
    if (!itemToRemove) {
      return throwError(() => new Error('Item not found'));
    }

    const updatedItems = currentItems.filter(item => item.id !== itemId);
    this.cartItemsSubject.next(updatedItems);

    return this.http.delete<void>(
      `${this.apiUrl}/${itemToRemove.carId}`, // Use carId instead of id
      this.getHeaders()
    ).pipe(
      catchError((error) => {
        // If there's an error, revert the optimistic update
        if (!error.silent) {
          this.cartItemsSubject.next(currentItems);
        }
        return this.handleError(error);
      })
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/clear`,
      this.getHeaders()
    ).pipe(
      tap(() => this.cartItemsSubject.next([])),
      catchError(this.handleError)
    );
  }

  getCartTotal(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + item.totalPrice, 0))
    );
  }

  getCartItemCount(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((count, item) => count + item.quantity, 0))
    );
  }
} 