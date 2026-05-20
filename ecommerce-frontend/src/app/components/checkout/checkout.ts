import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../app.config';

// Declare Razorpay type for TypeScript
declare var Razorpay: any;

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  totalPrice?: number;
}

interface PaymentMethod {
  COD: 'COD';
  UPI: 'UPI';
  CARD: 'CARD';
}

interface BillingInfo {
  fullName: string;
  email: string;
  contactNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

interface CheckoutData {
  cartItems: CartItem[];
  total: number;
  methods: string[];
}

interface RazorpayOrderResponse {
  orderId: number;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  razorpayKeyId: string;
  user: {
    name: string;
    email: string;
  };
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
})
export class CheckoutComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = environment.apiBase;

  // Cart data
  cartItems: CartItem[] = [];
  total = 0;
  paymentMethods: string[] = ['COD', 'UPI', 'CARD'];

  // Billing form
  billing: BillingInfo = {
    fullName: '',
    email: '',
    contactNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
  };

  // Payment form
  paymentMethod: string = 'COD';
  upiId: string = '';
  cardHolder: string = '';
  cardNumber: string = '';
  expiry: string = '';
  cvv: string = '';

  // UI states
  isLoading = false;
  error: string | null = null;
  showUpiFields = false;
  showCardFields = false;

  ngOnInit() {
    this.loadCheckoutData();
  }

  /**
   * WHY: Load cart items and payment methods from backend
   * Backend endpoint: GET /api/checkout
   */
  loadCheckoutData() {
    this.isLoading = true;
    this.error = null;

    this.http.get<ApiResponse>(`${this.API_URL}/api/checkout`).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const data = response.data as CheckoutData;
          this.cartItems = data.cartItems || [];
          this.total = data.total || 0;
          this.paymentMethods = data.methods || ['COD', 'UPI', 'CARD'];
          console.log('✅ Checkout data loaded:', data);
        } else {
          this.error = response.message || 'Failed to load checkout data';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error loading checkout:', err);
        if (err.status === 400 && err.error?.message?.includes('empty')) {
          this.error = 'Your cart is empty. Please add items to cart first.';
          setTimeout(() => this.router.navigate(['/products']), 2000);
        } else {
          this.error = err.error?.message || 'Failed to load checkout. Please try again.';
        }
        this.isLoading = false;
      },
    });
  }

  /**
   * WHY: Toggle payment method fields based on selection
   * Shows/hides UPI or CARD fields dynamically
   */
  onPaymentMethodChange() {
    this.showUpiFields = this.paymentMethod === 'UPI';
    this.showCardFields = this.paymentMethod === 'CARD';
  }

  /**
   * WHY: Calculate line total for cart item
   */
  getLineTotal(item: CartItem): number {
    if (item.totalPrice) return item.totalPrice;
    return (item.product.price || 0) * (item.quantity || 0);
  }

  /**
   * WHY: Place order and initiate payment
   * For COD: Creates order directly
   * For UPI/CARD: Creates Razorpay order and opens payment gateway
   */
  placeOrder() {
    if (this.isLoading) return;

    // Validate billing form
    if (!this.billing.fullName || !this.billing.email || !this.billing.contactNumber ||
        !this.billing.addressLine1 || !this.billing.city || !this.billing.state || !this.billing.postalCode) {
      this.error = 'Please fill all required billing fields';
      return;
    }

    // Validate payment method specific fields
    if (this.paymentMethod === 'UPI' && !this.upiId) {
      this.error = 'Please enter UPI ID';
      return;
    }
    if (this.paymentMethod === 'CARD' && (!this.cardHolder || !this.cardNumber || !this.expiry || !this.cvv)) {
      this.error = 'Please fill all card details';
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Prepare payload
    const payload: any = {
      billing: this.billing,
      method: this.paymentMethod,
    };

    if (this.paymentMethod === 'UPI') {
      payload.upiId = this.upiId;
    } else if (this.paymentMethod === 'CARD') {
      payload.cardHolder = this.cardHolder;
      payload.cardNumber = this.cardNumber;
      payload.expiry = this.expiry;
      payload.cvv = this.cvv;
    }

    // WHY: Create order via backend
    // Backend creates local order and Razorpay order (if needed)
    this.http.post<ApiResponse>(`${this.API_URL}/api/checkout`, payload).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const orderData = response.data as RazorpayOrderResponse;

          if (this.paymentMethod === 'COD') {
            // WHY: For COD, order is already created, just show confirmation
            this.handleOrderSuccess(orderData.orderId);
          } else {
            // WHY: For UPI/CARD, initiate Razorpay payment
            this.initiateRazorpayPayment(orderData);
          }
        } else {
          this.error = response.message || 'Failed to create order';
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('❌ Error placing order:', err);
        this.error = err.error?.message || 'Failed to place order. Please try again.';
        this.isLoading = false;
      },
    });
  }

  /**
   * WHY: Initialize Razorpay payment gateway
   * Opens Razorpay checkout with order details from backend
   */
  initiateRazorpayPayment(orderData: RazorpayOrderResponse) {
    // WHY: Check if Razorpay script is loaded
    if (typeof Razorpay === 'undefined') {
      this.error = 'Payment gateway not loaded. Please refresh the page.';
      this.isLoading = false;
      return;
    }

    const options = {
      key: orderData.razorpayKeyId,
      amount: orderData.amount, // Amount in paise
      currency: orderData.currency || 'INR',
      name: 'QuickMart',
      description: `Order #${orderData.orderId}`,
      order_id: orderData.razorpayOrderId,
      handler: (response: any) => {
        // WHY: Handle payment success - verify with backend
        this.verifyPayment(orderData.orderId, response);
      },
      prefill: {
        name: orderData.user.name,
        email: orderData.user.email,
        contact: this.billing.contactNumber,
      },
      theme: {
        color: '#3399cc',
      },
      modal: {
        ondismiss: () => {
          // WHY: Handle payment cancellation
          this.isLoading = false;
          this.error = 'Payment cancelled';
        },
      },
    };

    try {
      const rzp = new Razorpay(options);
      rzp.open();
      // Note: isLoading will be set to false in verifyPayment or on modal dismiss
    } catch (err) {
      console.error('Error opening Razorpay:', err);
      this.error = 'Failed to open payment gateway. Please try again.';
      this.isLoading = false;
    }
  }

  /**
   * WHY: Verify payment with backend after Razorpay success
   * Backend endpoint: POST /api/payment/verify
   */
  verifyPayment(orderId: number, razorpayResponse: any) {
    this.isLoading = true;

    const payload = {
      localOrderId: orderId.toString(),
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
    };

    this.http.post<ApiResponse>(`${this.API_URL}/api/payment/verify`, payload).subscribe({
      next: (response) => {
        if (response.success) {
          this.handleOrderSuccess(orderId);
        } else {
          this.error = response.message || 'Payment verification failed';
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('❌ Payment verification error:', err);
        this.error = err.error?.message || 'Payment verification failed. Please contact support.';
        this.isLoading = false;
      },
    });
  }

  /**
   * WHY: Handle successful order placement
   * Clears cart and redirects to order confirmation page
   */
  handleOrderSuccess(orderId: number) {
    this.isLoading = false;
    
    // WHY: Clear cart after successful order placement
    // Backend endpoint: DELETE /api/cart/clear
    this.http.delete<ApiResponse>(`${this.API_URL}/api/cart/clear`).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('✅ Cart cleared after order placement');
        } else {
          console.warn('⚠️ Cart clear warning:', response.message);
        }
        // WHY: Navigate to order confirmation page regardless of cart clear result
        this.router.navigate(['/order/confirmation'], {
          queryParams: { orderId: orderId },
        });
      },
      error: (err) => {
        // WHY: Log error but don't block navigation - order is already placed
        console.warn('⚠️ Failed to clear cart after order:', err);
        // WHY: Still navigate to confirmation page
        this.router.navigate(['/order/confirmation'], {
          queryParams: { orderId: orderId },
        });
      },
    });
  }
}
