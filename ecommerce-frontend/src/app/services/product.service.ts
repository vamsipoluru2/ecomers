import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../app.config';
import { map } from 'rxjs/operators';

export interface Product {
  productId?: number;
  id?: number; // Backend might return 'id' instead of 'productId'
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private base = `${environment.apiBase}/api/admin/product`;
  private customerBase = `${environment.apiBase}/api/product`; // Add customer endpoint

  constructor(private http: HttpClient) {}

  // ✅ Admin products with pagination
  list(page = 0, size = 6, keyword?: string, category?: string) {
    let params = new HttpParams().set('page', page).set('size', size);
    if (keyword) params = params.set('keyword', keyword);
    if (category) params = params.set('category', category);
    return this.http.get<any>(this.base, { params }).pipe(map((r) => r.data));
  }

  // ✅ Customer products (might be different endpoint)
  getCustomerProducts(page = 0, size = 20, keyword?: string, category?: string) {
    let params = new HttpParams().set('page', page).set('size', size);
    if (keyword) params = params.set('keyword', keyword);
    if (category) params = params.set('category', category);
    return this.http.get<any>(this.customerBase, { params }).pipe(map((r) => r.data));
  }

  // Get single product by ID
  get(id: number) {
    return this.http
      .get<any>(`${this.customerBase}/${id}`)
      .pipe(map((r) => r.data?.product || r.data));
  }

  // Add new product
  addProduct(formData: FormData) {
    return this.http.post<any>(this.base, formData).pipe(map((r) => r.data));
  }

  // Update existing product
  updateProduct(id: number, formData: FormData) {
    return this.http.put<any>(`${this.base}/${id}`, formData).pipe(map((r) => r.data));
  }

  // Delete product
  deleteProduct(id: number) {
    return this.http.delete<any>(`${this.base}/${id}`).pipe(map((r) => r.data));
  }

  // Get all categories
  getCategories() {
    return this.http.get<any>(`${this.customerBase}/categories`).pipe(map((r) => r.data));
  }
}
