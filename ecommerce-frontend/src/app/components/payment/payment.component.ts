import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly API = 'http://localhost:4040/api/payments/checkout';

  orderId = this.route.snapshot.queryParamMap.get('orderId');

  form = this.fb.group({
    method: ['CARD', Validators.required],          // CARD | COD | UPI
    nameOnCard: [''],
    cardNumber: [''],
    expiry: [''],
    cvv: [''],
    upiId: [''],
  });

  loading = false;
  error = '';
  success = '';

  get method() { return this.form.value.method; }

  onSubmit() {
    this.error = this.success = '';
    if (!this.method) return;

    // basic client-side rules
    if (this.method === 'CARD') {
      this.form.patchValue({
        upiId: '',
      });
    } else if (this.method === 'UPI') {
      this.form.patchValue({
        nameOnCard: '', cardNumber: '', expiry: '', cvv: '',
      });
    }

    this.loading = true;
    const payload = { orderId: this.orderId, ...this.form.value };

    this.http.post(this.API, payload, { headers: { 'Content-Type': 'application/json' }})
      .subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Payment successful!';
          setTimeout(() => this.router.navigate(['/order/confirmation'], { queryParams: { orderId: this.orderId } }), 800);
        },
        error: () => { this.loading = false; this.error = 'Payment failed. Try again.'; }
      });
  }
}
