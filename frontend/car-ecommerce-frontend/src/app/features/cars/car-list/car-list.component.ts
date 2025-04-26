import { Component, OnInit } from '@angular/core';
import { CarService, Car } from '../../../core/services/car.service';

@Component({
  selector: 'app-car-list',
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Available Cars</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let car of cars" class="bg-white rounded-lg shadow-md overflow-hidden">
          <img [src]="car.imageUrl" [alt]="car.make + ' ' + car.model" class="w-full h-48 object-cover">
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-2">{{ car.make }} {{ car.model }}</h2>
            <p class="text-gray-600 mb-2">{{ car.year }}</p>
            <p class="text-2xl font-bold text-blue-600 mb-4">${{ car.price.toLocaleString() }}</p>
            <p class="text-gray-700 mb-4">{{ car.description }}</p>
            <div class="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <p><span class="font-semibold">Engine:</span> {{ car.specifications.engine }}</p>
              <p><span class="font-semibold">Transmission:</span> {{ car.specifications.transmission }}</p>
              <p><span class="font-semibold">Fuel Type:</span> {{ car.specifications.fuelType }}</p>
              <p><span class="font-semibold">Mileage:</span> {{ car.specifications.mileage }}</p>
              <p><span class="font-semibold">Color:</span> {{ car.specifications.color }}</p>
            </div>
            <div class="mt-4 flex justify-end space-x-2">
              <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CarListComponent implements OnInit {
  cars: Car[] = [];

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.loadCars();
  }

  private loadCars(): void {
    this.carService.getAllCars().subscribe({
      next: (cars) => {
        this.cars = cars;
      },
      error: (error) => {
        console.error('Error loading cars:', error);
        // TODO: Add proper error handling
      }
    });
  }
} 