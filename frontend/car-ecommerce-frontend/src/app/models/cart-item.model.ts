export interface CartItem {
  id: number;
  carId: number;
  make: string;
  model: string;
  year: number;
  price: number;
  quantity: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt?: Date;
} 