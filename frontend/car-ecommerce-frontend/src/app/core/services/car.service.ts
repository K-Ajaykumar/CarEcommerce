import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  color: string;
  engineType: string;
  transmission: string;
  mileage: number;
  description: string;
  imageUrl: string;
  stockQuantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = 'http://localhost:5000/api/cars';

  constructor(private http: HttpClient) {}

  getAllCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl);
  }

  getCarById(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`);
  }

  createCar(car: Omit<Car, 'id'>): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, car);
  }

  updateCar(id: number, car: Partial<Car>): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}/${id}`, car);
  }

  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 