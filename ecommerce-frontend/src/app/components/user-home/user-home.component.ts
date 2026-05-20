import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../app.config';

// Product interface matching backend structure
interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl?: string | null;
}

// API Response structure from backend
interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any; // Flexible data structure for different endpoints
}

// Product API response structure
interface ProductApiResponse extends ApiResponse {
  data: {
    products: Product[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    categories?: string[];
  };
}

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css'],
})
export class UserHomeComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiBase;

  user = computed(() => this.auth.user());

  // Product data properties
  products: Product[] = [];
  isLoadingProducts = false;
  productsError: string | null = null;

  ngOnInit() {
    console.log('User data:', this.user());
    console.log('User name:', this.user()?.name);
    // Fetch products from database when component loads
    this.loadProducts();
  }

  /**
   * WHY: Fetch products from database to display on customer page
   * This method calls the existing backend endpoint /api/product without pagination
   * to get a limited set of products (e.g., 6 products) to showcase on the home page
   */
  loadProducts() {
    this.isLoadingProducts = true;
    this.productsError = null;

    // WHY: Using HttpParams to set query parameters for pagination
    // We fetch only first page with 6 products to keep the home page clean
    const params = new HttpParams()
      .set('page', '0')  // First page
      .set('size', '6');  // Limit to 6 products for home page display

    // WHY: Using the existing backend endpoint /api/product
    // This endpoint already exists and returns products from database
    // No backend changes needed - we're just consuming the existing API
    this.http.get<ApiResponse>(`${this.API_URL}/api/product`, { params }).subscribe({
      next: (response) => {
        // WHY: Check if response is successful and has data
        // Backend returns { success: true, data: { products: [...] } }
        if (response.success && response.data?.products) {
          this.products = response.data.products;
        } else {
          this.products = [];
          this.productsError = 'No products available';
        }
        this.isLoadingProducts = false;
      },
      error: (err) => {
        // WHY: Handle errors gracefully without breaking the page
        console.error('Error loading products:', err);
        this.products = [];
        this.productsError = 'Failed to load products. Please try again later.';
        this.isLoadingProducts = false;
      },
    });
  }

  /**
   * WHY: Helper method to get image source URL
   * Handles cases where image might be null or a relative path
   * If image is relative, prepends the API URL
   */
  getImageSrc(imageUrl?: string | null): string {
    if (!imageUrl) {
      return 'https://via.placeholder.com/200x200?text=No+Image';
    }
    // If already a full URL, return as is
    if (/^https?:\/\//i.test(imageUrl)) {
      return imageUrl;
    }
    // If relative path, prepend API URL
    return `${this.API_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }

  /**
   * WHY: Helper to truncate long descriptions
   * Keeps product cards clean and uniform
   */
  truncateDescription(text: string | null | undefined, maxLength: number = 60): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '…' : text;
  }

  /**
   * WHY: Add product to cart functionality
   * Uses existing backend endpoint /api/cart/add/{id}
   * Backend requires user to be logged in (session-based cart)
   */
  addToCart(productId: number, event?: Event) {
    const button = event?.target as HTMLButtonElement;
    const originalText = button?.textContent;
    if (button) {
      button.disabled = true;
      button.textContent = 'Adding...';
    }

    this.http.post<ApiResponse>(`${this.API_URL}/api/cart/add/${productId}`, {}).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('✅ Product added to cart:', productId);
          alert('Product added to cart successfully!');
        } else {
          console.error('❌ Add to cart failed:', response.message);
          alert('Failed to add product: ' + (response.message || 'Unknown error'));
        }
        if (button) {
          button.disabled = false;
          button.textContent = originalText || 'Add to Cart';
        }
      },
      error: (err) => {
        console.error('❌ Add to cart error:', err);
        
        let errorMessage = 'Failed to add product to cart. ';
        
        if (err.status === 401 || err.status === 403) {
          errorMessage += 'Please log in first.';
        } else if (err.status === 404) {
          errorMessage += 'Product not found.';
        } else if (err.status === 500) {
          errorMessage += 'You must be logged in to add items to cart.';
        } else if (err.error?.message) {
          errorMessage += err.error.message;
        } else {
          errorMessage += 'Please try again.';
        }
        
        alert(errorMessage);
        if (button) {
          button.disabled = false;
          button.textContent = originalText || 'Add to Cart';
        }
      },
    });
  }

  logout() {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
