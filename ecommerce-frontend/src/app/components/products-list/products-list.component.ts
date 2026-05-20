import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string | null;
};

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: 'products-list.component.html',
  styleUrls: ['products-list.component.css'],
})
export class AdminProductListComponent {
  private http = inject(HttpClient);

  // Change this to your backend origin
  private readonly API_URL = 'http://localhost:4040';

  products: Product[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading = true;
    this.error = null;
    // Adjust endpoint to your backend
    this.http.get<Product[]>(`${this.API_URL}/api/admin/products`).subscribe({
      next: (data) => {
        this.products = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load products.';
        this.loading = false;
      },
    });
  }

  imgSrc(url?: string | null) {
    if (!url) return 'https://via.placeholder.com/80?text=No+Image';
    if (/^https?:\/\//i.test(url)) return url;
    return `${this.API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  confirmAndDelete(id: number) {
    const ok = confirm('Delete this product? This cannot be undone.');
    if (!ok) return;

    // Adjust endpoint/method as needed
    this.http.delete(`${this.API_URL}/api/admin/products/${id}`).subscribe({
      next: () => {
        // Optimistic refresh
        this.products = this.products.filter(p => p.id !== id);
      },
      error: (err) => {
        console.error(err);
        alert('Delete failed. Please try again.');
      },
    });
  }

  trackById(_i: number, p: Product) {
    return p.id;
  }
}
