import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../app.config';

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl?: string | null;
};

// Backend returns ApiResponse format, not PageResponse
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
    keyword?: string;
    category?: string;
  };
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  private http = inject(HttpClient);

  // ✅ Use environment API base URL (matches backend port 8080)
  private readonly API_URL = environment.apiBase;

  // 🔎 Filters
  keyword = '';
  category = '';
  categories: string[] = [];

  // 📄 Data + pagination
  products: Product[] = [];
  currentPage = 0;
  pageSize = 12;
  totalPages = 0;
  pages: number[] = [];

  // 🧭 Lifecycle-ish: call this from parent route or load immediately
  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  // ✅ Load categories from product API response
  loadCategories() {
    // Categories are included in the product API response
    // We'll load them when products are loaded
    // Fallback categories if needed
    this.categories = ['Electronics', 'Clothing', 'Books', 'Accessories'];
  }

  // ✅ Load products (paged, with filters)
  // WHY: Backend returns ApiResponse format: { success: true, data: { products: [...], totalPages: ... } }
  loadProducts() {
    let params = new HttpParams()
      .set('page', this.currentPage)
      .set('size', this.pageSize);

    if (this.keyword?.trim()) params = params.set('keyword', this.keyword.trim());
    if (this.category?.trim()) params = params.set('category', this.category.trim());

    // WHY: Backend returns ApiResponse, not PageResponse
    // Structure: { success: true, data: { products: [...], currentPage: 0, totalPages: 1, ... } }
    this.http
      .get<ProductApiResponse>(`${this.API_URL}/api/product`, { params })
      .subscribe({
        next: (response) => {
          // WHY: Check if response is successful and has data
          if (response.success && response.data) {
            // WHY: Backend returns products in data.products, not data.content
            this.products = response.data.products || [];
            // WHY: Backend returns currentPage, not number
            this.currentPage = response.data.currentPage ?? 0;
            // WHY: Backend returns totalPages directly in data
            this.totalPages = response.data.totalPages ?? 1;
            
            // WHY: Load categories from API response if available
            if (response.data.categories && response.data.categories.length > 0) {
              this.categories = response.data.categories;
            }
          } else {
            // WHY: Handle case where response is not successful
            this.products = [];
            this.totalPages = 0;
            this.currentPage = 0;
          }
          this.rebuildPages();
        },
        error: (err) => {
          // WHY: Log error for debugging and handle gracefully
          console.error('Error loading products:', err);
          this.products = [];
          this.totalPages = 0;
          this.currentPage = 0;
          this.rebuildPages();
        },
      });
  }

  // 🔍 Search submit
  onSearchSubmit() {
    this.currentPage = 0;
    this.loadProducts();
  }

  // 🧭 Pagination helpers
  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProducts();
    }
  }
  nextPage() {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
    }
  }
  gotoPage(i: number) {
    if (i >= 0 && i < this.totalPages) {
      this.currentPage = i;
      this.loadProducts();
    }
  }
  private rebuildPages() {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
  }

  // 🖼️ Image helper
  // WHY: Database stores image_url as relative path (e.g., /images/1762341133767_image.png)
  // Need to prepend backend URL to make it accessible
  imgSrc(url?: string | null): string {
    if (!url) return 'https://via.placeholder.com/200x200?text=No+Image';
    // If already a full URL, return as is
    if (/^https?:\/\//i.test(url)) return url;
    // WHY: Backend serves static files from /images/ directory
    // Need to construct full URL: http://localhost:8080/images/...
    return `${this.API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  // ✂️ Truncate helper
  truncate(text: string | null | undefined, length: number): string {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '…' : text;
  }

  // 🛒 Add to cart
  // WHY: Backend requires user to be logged in (session-based cart)
  // CartService throws IllegalStateException if no logged-in user in session
  onAddToCart(productId: number, event?: Event) {
    // WHY: Show loading state or disable button during request
    const button = event?.target as HTMLButtonElement;
    const originalText = button?.textContent;
    if (button) {
      button.disabled = true;
      button.textContent = 'Adding...';
    }

    // WHY: Backend endpoint POST /api/cart/add/{id} requires:
    // 1. User must be logged in (session must have "loggedUser")
    // 2. Product must exist in database
    // 3. Request must include credentials (withCredentials: true via interceptor)
    this.http.post<ApiResponse>(`${this.API_URL}/api/cart/add/${productId}`, {}).subscribe({
      next: (response) => {
        // WHY: Backend returns ApiResponse format
        if (response.success) {
          console.log('✅ Added to cart:', productId);
          // WHY: Show success feedback to user
          alert('Product added to cart successfully!');
          // TODO: Replace alert with a toast notification component
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
        // WHY: Handle different error scenarios
        console.error('❌ Add to cart error:', err);
        
        let errorMessage = 'Failed to add product to cart. ';
        
        if (err.status === 401 || err.status === 403) {
          errorMessage += 'Please log in first.';
        } else if (err.status === 404) {
          errorMessage += 'Product not found.';
        } else if (err.status === 500) {
          // WHY: Backend throws IllegalStateException if no user in session
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

  // 🔁 TrackBy for ngFor
  trackById(_index: number, p: Product) {
    return p.id;
  }
}
