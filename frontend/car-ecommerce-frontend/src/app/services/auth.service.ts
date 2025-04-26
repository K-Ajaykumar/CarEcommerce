import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address?: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  username: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5083/api/auth';
  private userSubject = new BehaviorSubject<AuthResponse | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthState();
  }

  private checkAuthState(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.token) {
          this.userSubject.next(user);
        } else {
          this.logout(); // Clear invalid state
        }
      } catch {
        this.logout(); // Clear invalid state
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('user', JSON.stringify(response));
            this.userSubject.next(response);
          }
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('user', JSON.stringify(response));
            this.userSubject.next(response);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    const currentUser = this.userSubject.value;
    return !!(currentUser && currentUser.token);
  }

  getToken(): string | null {
    const currentUser = this.userSubject.value;
    return currentUser ? currentUser.token : null;
  }
} 