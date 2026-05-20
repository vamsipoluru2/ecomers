import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly API_URL = 'http://localhost:4040/api/admin/products'; // ✅ Adjust if needed

  productForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    imageFile: [null, Validators.required],
  });

  selectedFile: File | null = null;
  loading = false;
  successMsg = '';
  errorMsg = '';

  // 🔹 Handle file input change
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.productForm.patchValue({ imageFile: this.selectedFile });
    }
  }

  // 🔹 Submit form to backend
  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    Object.entries(this.productForm.value).forEach(([key, value]) => {
      if (key === 'imageFile' && this.selectedFile) {
        formData.append('imageFile', this.selectedFile);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.http.post(`${this.API_URL}/save`, formData).subscribe({
      next: () => {
        this.successMsg = '✅ Product added successfully!';
        this.loading = false;
        this.productForm.reset();
        this.selectedFile = null;
        setTimeout(() => this.router.navigate(['/admin/products']), 1500);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = '❌ Failed to add product.';
        this.loading = false;
      },
    });
  }
}
