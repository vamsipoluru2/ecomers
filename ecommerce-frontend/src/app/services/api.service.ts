import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:4040/api';

  constructor(private http: HttpClient) {}

  // 🛒 CART
  getCart(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/cart/${userId}`);
  }

  addToCart(userId: number, productId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart/add`, { userId, productId });
  }

  // 💳 CHECKOUT
  createOrder(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/checkout/create-order`, order);
  }

  // 📦 ORDERS
  getOrders(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/${userId}`);
  }
}
