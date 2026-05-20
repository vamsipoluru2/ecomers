import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../services/product.service';
import { environment } from '../../app.config';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private readonly API_URL = environment.apiBase;

  products: Product[] = [];
  isLoading = true;
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(page: number = 0) {
    this.isLoading = true;
    this.productService.list(page, this.pageSize).subscribe({
      next: (response: any) => {
        console.log('Admin products response:', response);
        const products = response.products || response || [];
        // Fix image URLs for display
        this.products = products.map((product: Product) => ({
          ...product,
          imageUrl: product.imageUrl && !product.imageUrl.startsWith('http')
            ? `${this.API_URL}${product.imageUrl}`
            : product.imageUrl
        }));
        this.currentPage = response.currentPage || page;
        this.totalPages = response.totalPages || 0;
        this.totalElements = response.totalElements || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading admin products:', error);
        this.isLoading = false;
      },
    });
  }

  deleteProduct(productId: number | undefined) {
    if (!productId) {
      alert('Invalid product ID');
      return;
    }
    
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          alert('Product deleted successfully');
          this.loadProducts(this.currentPage);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Error deleting product. Please try again.');
        },
      });
    }
  }

  onPageChange(page: number) {
    this.loadProducts(page);
  }
}
