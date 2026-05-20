import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../app.config';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CartService {
  private base = `${environment.apiBase}/api/cart`;
  constructor(private http: HttpClient) {}

  view() {
    return this.http.post<any>(this.base, {}).pipe(map((r) => r.data));
  } // POST /api/cart
  add(productId: number) {
    return this.http.post<any>(`${this.base}/add/${productId}`, {});
  }
  update(productId: number, quantity: number) {
    return this.http.post<any>(`${this.base}/update/${productId}`, {}, { params: { quantity } });
  }
  remove(productId: number) {
    return this.http.delete<any>(`${this.base}/remove/${productId}`);
  }
  clear() {
    return this.http.delete<any>(`${this.base}/clear`);
  }
}
