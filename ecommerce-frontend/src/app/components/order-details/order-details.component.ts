import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../app.config';

// Backend Order structure
interface BackendOrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string | null;
    category?: string;
    description?: string;
  };
  quantity: number;
  totalPrice: number;
}

interface BackendOrder {
  id: number;
  orderDate: string;
  totalAmount: number;
  paymentStatus: string;
  items: BackendOrderItem[];
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

// Frontend Order structure (for display)
interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  imageUrl?: string;
}

interface Order {
  id: number;
  createdAt: string;
  status: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress?: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    phone?: string;
  };
  paymentMethod: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    order: BackendOrder;
  };
}

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [CurrencyPipe, DatePipe],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private readonly API_URL = environment.apiBase;

  loading = true;
  error = '';
  order: Order | null = null;
  orderId: number | null = null;

  ngOnInit() {
    // WHY: Subscribe to route params to handle navigation changes
    // Using snapshot might not work if component is reused
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        const parsedId = parseInt(id, 10);
        if (!isNaN(parsedId)) {
          this.orderId = parsedId;
          this.loadOrderDetails();
        } else {
          this.error = 'Invalid order ID';
          this.loading = false;
        }
      } else {
        this.error = 'Order ID not found in URL';
        this.loading = false;
      }
    });
  }

  /**
   * WHY: Load order details from backend API
   * Backend endpoint: GET /api/orders/{id}
   * Returns: { success: true, data: { order: {...} } }
   */
  loadOrderDetails() {
    this.loading = true;
    this.error = '';

    // WHY: Backend returns ApiResponse format
    this.http.get<ApiResponse>(`${this.API_URL}/api/orders/${this.orderId}`).subscribe({
      next: (response) => {
        if (response.success && response.data?.order) {
          // WHY: Map backend order structure to frontend order structure
          this.order = this.mapBackendOrderToFrontend(response.data.order);
          this.loading = false;
        } else {
          this.error = response.message || 'Order not found';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error loading order details:', err);
        if (err.status === 404) {
          this.error = 'Order not found';
        } else {
          this.error = err.error?.message || 'Failed to load order details. Please try again.';
        }
        this.loading = false;
      },
    });
  }

  /**
   * WHY: Map backend Order structure to frontend Order structure
   * Backend: { id, orderDate, totalAmount, paymentStatus, items: [{ product: {...}, quantity, totalPrice }] }
   * Frontend: { id, createdAt, status, items: [{ productName, quantity, price, totalPrice }], total, ... }
   */
  private mapBackendOrderToFrontend(backendOrder: BackendOrder): Order {
    // WHY: Map order items from backend structure to frontend structure
    const items: OrderItem[] = (backendOrder.items || []).map((item) => ({
      productName: item.product?.name || 'Unknown Product',
      quantity: item.quantity || 0,
      price: item.product?.price || 0,
      totalPrice: item.totalPrice || (item.product?.price || 0) * (item.quantity || 0),
      imageUrl: item.product?.imageUrl || undefined,
    }));

    // WHY: Calculate subtotal from items
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const shipping = 0; // Backend doesn't provide shipping, default to 0
    const tax = 0; // Backend doesn't provide tax, default to 0
    const total = backendOrder.totalAmount || subtotal;

    return {
      id: backendOrder.id,
      createdAt: backendOrder.orderDate || new Date().toISOString(),
      status: backendOrder.paymentStatus || 'CREATED',
      items: items,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      // WHY: Shipping address not in backend Order model, set to undefined
      shippingAddress: undefined,
      paymentMethod: backendOrder.paymentStatus === 'PAID' ? 'Online Payment' : 'Cash on Delivery',
    };
  }

  /**
   * WHY: Get image source URL
   * Handles relative paths from database
   */
  img(url?: string | null): string {
    if (!url) {
      return 'https://via.placeholder.com/60x60?text=No+Image';
    }
    // If already a full URL, return as is
    if (/^https?:\/\//i.test(url)) {
      return url;
    }
    // If relative path, prepend API URL
    return `${this.API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  trackByName = (_: number, it: OrderItem) => it.productName;

  /**
   * WHY: Download invoice PDF for the order
   * Backend endpoint: GET /api/orders/{id}/invoice.pdf
   */
  downloadInvoice() {
    if (!this.orderId) return;

    this.http
      .get(`${this.API_URL}/api/orders/${this.orderId}/invoice.pdf`, {
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
          link.download = `invoice-${this.orderId}.pdf`;
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
