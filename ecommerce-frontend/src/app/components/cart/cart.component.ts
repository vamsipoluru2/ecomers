import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../app.config';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  category?: string;
  description?: string;
}

// Backend CartItem structure
interface BackendCartItem {
  id: number;
  product: Product;
  quantity: number;
  totalPrice?: number;
}

// Frontend CartItem structure
interface CartItem {
  product: Product;
  quantity: number;
  totalPrice?: number; // optional, we'll compute if missing
}

// API Response structure
interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    cart: BackendCartItem[];
    total: number;
  };
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiBase;

  /** Optional message (e.g. "Item updated") */
  @Input() message: string | null = null;

  /** Cart items - can be provided by parent or fetched from API */
  cart: CartItem[] = [];

  /** If your API needs a base prefix for images, set it here */
  assetBase = environment.apiBase; // Use API base URL for images

  /** Loading and error states */
  isLoading = false;
  error: string | null = null;
  cartTotal = 0;

  ngOnInit() {
    // WHY: Fetch cart data from API when component loads
    // Only fetch if cart is not provided via @Input (for flexibility)
    if (this.cart.length === 0) {
      this.loadCart();
    }
  }

  /**
   * WHY: Fetch cart items from backend API
   * Backend endpoint: GET /api/cart
   * Returns: { success: true, data: { cart: [...], total: ... } }
   */
  loadCart() {
    this.isLoading = true;
    this.error = null;

    // WHY: Backend returns ApiResponse format with cart items
    this.http.get<ApiResponse>(`${this.API_URL}/api/cart`).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // WHY: Map backend CartItem structure to frontend CartItem structure
          // Backend: { id, product: {...}, quantity }
          // Frontend: { product: {...}, quantity, totalPrice }
          this.cart = (response.data.cart || []).map((item: BackendCartItem) => ({
            product: item.product,
            quantity: item.quantity,
            totalPrice: item.totalPrice || (item.product.price * item.quantity),
          }));
          this.cartTotal = response.data.total || 0;
          console.log('✅ Cart loaded:', this.cart);
        } else {
          this.cart = [];
          this.cartTotal = 0;
          this.error = 'Failed to load cart';
        }
        this.isLoading = false;
      },
      error: (err) => {
        // WHY: Handle errors gracefully
        console.error('❌ Error loading cart:', err);
        this.cart = [];
        this.cartTotal = 0;
        
        if (err.status === 401 || err.status === 403) {
          this.error = 'Please log in to view your cart';
        } else if (err.status === 500) {
          this.error = 'You must be logged in to view your cart';
        } else {
          this.error = 'Failed to load cart. Please try again.';
        }
        this.isLoading = false;
      },
    });
  }

  /** Utility: compute line total safely if not sent by backend */
  lineTotal(item: CartItem): number {
    const price = Number(item.product?.price ?? 0);
    const qty = Number(item.quantity ?? 0);
    return price * qty;
  }

  /** Grand total */
  get total(): number {
    // WHY: Use cartTotal from API if available, otherwise calculate
    if (this.cartTotal > 0) {
      return this.cartTotal;
    }
    return (this.cart || []).reduce((sum, it) => {
      const t = typeof it.totalPrice === 'number' ? it.totalPrice : this.lineTotal(it);
      return sum + t;
    }, 0);
  }

  /**
   * WHY: Update quantity using backend API
   * Backend endpoint: POST /api/cart/update/{id}?quantity={qty}
   */
  updateQuantity(item: CartItem, newQty: number): void {
    const qty = Math.max(1, Number(newQty) || 1);
    
    // WHY: Use HttpParams for query parameters
    const params = new HttpParams().set('quantity', qty.toString());
    
    this.http.post<ApiResponse>(
      `${this.API_URL}/api/cart/update/${item.product.id}`,
      {},
      { params }
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.message = 'Quantity updated successfully';
          // Reload cart to get updated data
          this.loadCart();
        } else {
          this.message = 'Failed to update quantity';
        }
        setTimeout(() => (this.message = null), 3000);
      },
      error: (err) => {
        console.error('Error updating quantity:', err);
        this.message = 'Failed to update quantity. Please try again.';
        setTimeout(() => (this.message = null), 3000);
      },
    });
  }

  /**
   * WHY: Remove item using backend API
   * Backend endpoint: DELETE /api/cart/remove/{id}
   */
  removeItem(item: CartItem): void {
    this.http.delete<ApiResponse>(`${this.API_URL}/api/cart/remove/${item.product.id}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.message = 'Item removed from cart';
          // Reload cart to get updated data
          this.loadCart();
        } else {
          this.message = 'Failed to remove item';
        }
        setTimeout(() => (this.message = null), 3000);
      },
      error: (err) => {
        console.error('Error removing item:', err);
        this.message = 'Failed to remove item. Please try again.';
        setTimeout(() => (this.message = null), 3000);
      },
    });
  }

  /**
   * WHY: Clear cart using backend API
   * Backend endpoint: DELETE /api/cart/clear
   */
  clearCart(): void {
    if (!confirm('Are you sure you want to clear your cart?')) {
      return;
    }

    this.http.delete<ApiResponse>(`${this.API_URL}/api/cart/clear`).subscribe({
      next: (response) => {
        if (response.success) {
          this.message = 'Cart cleared';
          this.cart = [];
          this.cartTotal = 0;
        } else {
          this.message = 'Failed to clear cart';
        }
        setTimeout(() => (this.message = null), 3000);
      },
      error: (err) => {
        console.error('Error clearing cart:', err);
        this.message = 'Failed to clear cart. Please try again.';
        setTimeout(() => (this.message = null), 3000);
      },
    });
  }

  /** Navigate to checkout (or call your router) */
  goToCheckout(): void {
    // Typically you’d use the router. If using template link, you can remove this.
    // this.router.navigate(['/checkout']);
  }

  /**
   * WHY: Image source helper
   * Handles relative paths from database (e.g., /images/1762341133767_image.png)
   * Prepends API URL to make images accessible
   */
  imgSrc(url?: string | null): string {
    if (!url) {
      return 'https://via.placeholder.com/200x200?text=No+Image';
    }
    // If already a full URL, return as is
    if (/^https?:\/\//i.test(url)) {
      return url;
    }
    // If relative path, prepend API URL
    return `${this.API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }
}
