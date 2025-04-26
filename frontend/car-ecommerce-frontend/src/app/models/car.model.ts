export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  description: string;
  engineType?: string;
  transmission?: string;
  mileage?: number;
  color?: string;
  stockQuantity?: number;
} 