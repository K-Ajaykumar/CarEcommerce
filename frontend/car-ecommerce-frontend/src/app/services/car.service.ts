import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Car } from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = 'http://localhost:5083/api/cars';
  private mockCars: Car[] = [
    {
      id: 3, // Tesla Model 3 ID
      make: 'Tesla',
      model: 'Model 3',
      year: 2024,
      price: 46000,
      imageUrl: 'assets/cars/tesla-model-3.jpg',
      description: 'The Tesla Model 3 is an electric four-door sedan.',
      engineType: 'Electric',
      transmission: 'Automatic',
      mileage: 0,
      color: 'White',
      stockQuantity: 10
    },
    {
      id: 4, // BMW X5 ID
      make: 'BMW',
      model: 'X5',
      year: 2024,
      price: 66000,
      imageUrl: 'assets/cars/BMW X5.jpeg',
      description: 'The BMW X5 is a luxury SUV with powerful performance.',
      engineType: '3.0L Twin-Turbo',
      transmission: 'Automatic',
      mileage: 0,
      color: 'Alpine White',
      stockQuantity: 5
    },
    {
      id: 7, // Ford Mustang Mach-E ID
      make: 'Ford',
      model: 'Mustang Mach-E',
      year: 2024,
      price: 53000,
      imageUrl: 'assets/cars/ford-mustang-mach-e.jpg',
      description: 'The Ford Mustang Mach-E is an all-electric SUV.',
      engineType: 'Electric',
      transmission: 'Automatic',
      mileage: 0,
      color: 'Grabber Green',
      stockQuantity: 8
    },
    {
      id: 9, // Mercedes-Benz C-Class ID
      make: 'Mercedes-Benz',
      model: 'C-Class',
      year: 2024,
      price: 55000,
      imageUrl: 'assets/cars/Mercedes-Benz C-Class.jpeg',
      description: 'The Mercedes-Benz C-Class is a luxury sedan.',
      engineType: '2.0L Turbo',
      transmission: 'Automatic',
      mileage: 0,
      color: 'Obsidian Black',
      stockQuantity: 7
    },
    {
      id: 8, // Audi A4 ID
      make: 'Audi',
      model: 'A4',
      year: 2024,
      price: 48000,
      imageUrl: 'assets/cars/Audi A4.jpeg',
      description: 'The Audi A4 is a premium compact executive car.',
      engineType: '2.0L Turbo',
      transmission: 'Automatic',
      mileage: 0,
      color: 'Blue',
      stockQuantity: 6
    },
    {
      id: 10, // Ferrari 488 ID
      make: 'Ferrari',
      model: '488',
      year: 2024,
      price: 330000,
      imageUrl: 'assets/cars/Ferrari 488.jpeg',
      description: 'The Ferrari 488 is a high-performance sports car.',
      engineType: '3.9L V8 Twin-Turbo',
      transmission: 'Automatic',
      mileage: 0,
      color: 'Rosso Corsa',
      stockQuantity: 2
    },
    {
      id: 1, // Toyota Camry ID
      make: 'Toyota',
      model: 'Camry',
      year: 2024,
      price: 29999.99,
      imageUrl: 'assets/cars/Toyota Camry.jpeg',
      description: 'The Toyota Camry is a reliable mid-size sedan.',
      engineType: '2.5L 4-Cylinder',
      transmission: 'Automatic',
      mileage: 0,
      color: 'Silver',
      stockQuantity: 15
    },
    {
      id: 2, // Honda CR-V ID
      make: 'Honda',
      model: 'CR-V',
      year: 2024,
      price: 32999.99,
      imageUrl: 'assets/cars/Honda CR-V.jpg',
      description: 'The Honda CR-V is a compact SUV known for its versatility.',
      engineType: '1.5L Turbo',
      transmission: 'CVT',
      mileage: 0,
      color: 'Modern Steel',
      stockQuantity: 12
    },
    {
      id: 6, // Ford F-150 ID
      make: 'Ford',
      model: 'F-150',
      year: 2024,
      price: 52999.99,
      imageUrl: 'assets/cars/Ford-F-150.jpg',
      description: 'The Ford F-150 is America\'s best-selling pickup truck.',
      engineType: '3.5L EcoBoost',
      transmission: 'Automatic',
      mileage: 0,
      color: 'Oxford White',
      stockQuantity: 10
    }
  ];

  constructor(private http: HttpClient) { }

  getCars(): Observable<Car[]> {
    // In production, use this:
    // return this.http.get<Car[]>(this.apiUrl);
    
    // For development with mock data:
    return of(this.mockCars);
  }

  getCarById(id: number): Observable<Car> {
    // In production, use this:
    // return this.http.get<Car>(`${this.apiUrl}/${id}`);
    
    // For development with mock data:
    const car = this.mockCars.find(c => c.id === id);
    return of(car as Car);
  }

  searchCars(searchTerm: string): Observable<Car[]> {
    const filtered = this.mockCars.filter(car => 
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.make.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return of(filtered);
  }

  getCarsByMake(make: string): Observable<Car[]> {
    const filtered = this.mockCars.filter(car => car.make === make);
    return of(filtered);
  }
} 