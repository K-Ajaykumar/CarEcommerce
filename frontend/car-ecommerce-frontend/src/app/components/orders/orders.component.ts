import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';

interface OrderItem {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  quantity: number;
  totalPrice: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'Completed' | 'Processing' | 'Shipped';
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, DecimalPipe],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  ngOnInit() {
    // Retrieve orders from localStorage
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      this.orders = JSON.parse(storedOrders);
      // Sort orders by date (most recent first)
      this.orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
} 