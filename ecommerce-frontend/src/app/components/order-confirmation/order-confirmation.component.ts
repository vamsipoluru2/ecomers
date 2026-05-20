import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../app.config';

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

interface Confirmation {
  orderId: number;
  message: string;
  estimatedDelivery?: string;
}

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css'],
})
export class OrderConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiBase;

  data: Confirmation | null = null;
  loading = true;
  error = '';
  orderId: number | null = null;

  ngOnInit() {
    const orderIdParam = this.route.snapshot.queryParamMap.get('orderId');
    if (orderIdParam) {
      this.orderId = parseInt(orderIdParam, 10);
      // WHY: Load order confirmation data
      // Backend endpoint: GET /api/orders/confirm?orderId={id}
      this.http.get<ApiResponse>(`${this.API_URL}/api/checkout/confirm?orderId=${this.orderId}`).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.data = {
              orderId: this.orderId!,
              message: response.data.message || `Order #${this.orderId} placed successfully!`,
              estimatedDelivery: response.data.estimatedDelivery,
            };
          } else {
            // Fallback if endpoint doesn't exist
            this.data = {
              orderId: this.orderId!,
              message: `Order #${this.orderId} placed successfully!`,
            };
          }
          this.loading = false;
        },
        error: () => {
          // Fallback: create confirmation data from orderId
          this.data = {
            orderId: this.orderId!,
            message: `Order #${this.orderId} placed successfully!`,
          };
          this.loading = false;
        },
      });
    } else {
      this.error = 'Order ID not found';
      this.loading = false;
    }
  }

  /**
   * WHY: Download invoice PDF for the order
   * Backend endpoint: GET /api/orders/{id}/invoice.pdf
   * Returns PDF file that browser will download
   */
  downloadInvoice() {
    if (!this.orderId) return;

    // WHY: Set responseType to 'blob' to handle PDF binary data
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
