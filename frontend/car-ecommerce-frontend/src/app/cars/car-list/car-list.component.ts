import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Car } from '../../models/car.model';
import { CarService } from '../../services/car.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit {
  cars: Car[] = [];
  filteredCars: Car[] = [];
  makes: string[] = [];
  searchTerm: string = '';
  selectedMake: string = '';

  constructor(
    private carService: CarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.carService.getCars().subscribe(
      cars => {
        this.cars = cars;
        this.filteredCars = cars;
        this.makes = [...new Set(cars.map(car => car.make))];
      },
      error => {
        console.error('Error loading cars:', error);
      }
    );
  }

  filterCars(): void {
    this.filteredCars = this.cars.filter(car => {
      const matchesSearch = this.searchTerm === '' ||
                          car.model.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          car.make.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesMake = !this.selectedMake || car.make === this.selectedMake;
      return matchesSearch && matchesMake;
    });
  }

  onSearchChange(): void {
    this.filterCars();
  }

  onMakeChange(): void {
    this.filterCars();
  }

  viewCarDetails(id: number): void {
    this.router.navigate(['/cars', id]);
  }

  onImageError(event: any): void {
    event.target.src = 'assets/cars/placeholder.jpg';
  }
} 