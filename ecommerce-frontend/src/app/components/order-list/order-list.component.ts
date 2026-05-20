import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../app.config';

export interface Order {
  id: number;
  orderDate: string | Date;
  totalAmount: number;
  paymentStatus?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    orders: Order[];
  };
}

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private router = inject(Router);
  private readonly API_URL = environment.apiBase;

  /** Orders provided by a parent/container OR fetched from API */
  @Input() orders: Order[] = [];

  /** When you want to build links instead of (click) events, set a base path like '/orders' */
  @Input() linkBase: string | null = '/order';

  /** If true, shows all orders (admin mode). If false, filters by current user. */
  @Input() showAllOrders: boolean = false;

  /** Page title to display */
  @Input() title: string = '📦 My Orders';

  /** Emits the selected ID for view/delete actions (use if not using routerLink) */
  @Output() view = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();

  // Internal state for fetching
  isLoading = false;
  error: string | null = null;
  userOrders: Order[] = [];

  ngOnInit() {
    // WHY: Detect if we're on admin orders page
    const isAdminOrdersPage = this.router.url.includes('/admin/orders');
    if (isAdminOrdersPage) {
      this.showAllOrders = true;
      this.title = '📦 All Customer Orders';
    }

    // WHY: If orders not provided via @Input, fetch from API
    if (!this.orders || this.orders.length === 0) {
      this.loadOrders();
    } else {
      // Filter orders by current user if provided via Input
      this.filterUserOrders();
    }
  }

  /**
   * WHY: Load orders from backend API
   * Backend endpoint: GET /api/orders
   * Returns all orders, then we filter by current user
   */
  loadOrders() {
    this.isLoading = true;
    this.error = null;

    this.http.get<ApiResponse>(`${this.API_URL}/api/orders`).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.orders = response.data.orders || [];
          this.filterUserOrders();
        } else {
          this.orders = [];
          this.userOrders = [];
          this.error = response.message || 'No orders found';
        }
        this.isLoading = false;
      },
      error: (err) => {
        // WHY: Log full error details for debugging
        console.error('❌ Error loading orders:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.error?.message);
        console.error('Full error object:', JSON.stringify(err.error, null, 2));
        
        this.orders = [];
        this.userOrders = [];
        
        // WHY: Extract user-friendly error message from backend response
        let errorMessage = 'Failed to load orders. Please try again.';
        
        if (err.status === 500) {
          // WHY: Check if error message contains technical details
          const backendMessage = err.error?.message || '';
          const errorTrace = err.error?.trace || '';
          
          // WHY: Check for common database/entity issues
          if (backendMessage.includes('PaymentStatus') || backendMessage.includes('enum') || errorTrace.includes('PaymentStatus')) {
            errorMessage = 'Unable to load orders due to data inconsistency. Please check database for invalid PaymentStatus values.';
          } else if (backendMessage.includes('user') || backendMessage.includes('User') || errorTrace.includes('user_id') || errorTrace.includes('User')) {
            errorMessage = 'Unable to load orders due to missing user data. Please check database for orders with NULL user_id.';
          } else if (backendMessage.includes('LazyInitializationException') || errorTrace.includes('LazyInitializationException')) {
            errorMessage = 'Unable to load orders due to data loading issue. Please contact support.';
          } else {
            errorMessage = 'Server error loading orders. Please check backend logs for details.';
          }
        } else if (err.status === 401 || err.status === 403) {
          errorMessage = 'You must be logged in to view orders';
        } else if (err.error?.message) {
          // WHY: Use backend message if available, but filter out technical details
          const msg = err.error.message;
          if (msg.includes('enum') || msg.includes('PaymentStatus') || msg.includes('No enum constant')) {
            errorMessage = 'Unable to load orders due to data inconsistency. Please contact support.';
          } else {
            errorMessage = msg;
          }
        }
        
        this.error = errorMessage;
        this.isLoading = false;
      },
    });
  }

  /**
   * WHY: Filter orders by current logged-in user
   * Backend returns all orders, but we only show orders for current user
   * Unless showAllOrders is true (admin mode)
   */
  filterUserOrders() {
    // WHY: If admin mode, show all orders without filtering
    if (this.showAllOrders) {
      this.userOrders = this.orders;
      return;
    }

    // WHY: For regular users, filter by current user
    const currentUser = this.auth.user();
    if (currentUser && currentUser.userId) {
      this.userOrders = this.orders.filter(
        (order) => order.user?.id === currentUser.userId
      );
    } else {
      // If no user logged in, show empty
      this.userOrders = [];
    }
  }

  /**
   * WHY: Get orders to display (use userOrders if filtered, otherwise all orders)
   */
  get displayOrders(): Order[] {
    return this.userOrders.length > 0 ? this.userOrders : this.orders;
  }

  onView(id: number) {
    this.view.emit(id);
  }

  onDelete(id: number) {
    this.remove.emit(id);
  }

  /**
   * WHY: Download invoice PDF for an order
   * Backend endpoint: GET /api/orders/{id}/invoice.pdf
   */
  downloadInvoice(orderId: number) {
    // WHY: Set responseType to 'blob' to handle PDF binary data
    this.http
      .get(`${this.API_URL}/api/orders/${orderId}/invoice.pdf`, {
        responseType: 'blob',
        observe: 'response',
      })
      .subscribe({
        next: (response) => {
          // WHY: Create blob from PDF data and trigger download
          const blob = new Blob([response.body!], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `invoice-${orderId}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error downloading invoice:', err);
          alert('Failed to download invoice. Please try again.');
        },
      });
  }
}
