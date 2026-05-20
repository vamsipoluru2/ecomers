import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { environment } from '../../app.config';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productForm: FormGroup;
  selectedFile: File | null = null;
  isLoading = false;
  isEditMode = false;
  productId: number | null = null;
  currentImageUrl: string | null = null;

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = parseInt(id, 10);
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.get(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
        });
        // Handle relative image URLs from backend
        if (product.imageUrl) {
          this.currentImageUrl = product.imageUrl.startsWith('http') 
            ? product.imageUrl 
            : `${environment.apiBase}${product.imageUrl}`;
        } else {
          this.currentImageUrl = null;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        alert('Error loading product details');
        this.router.navigate(['/admin/products']);
        this.isLoading = false;
      },
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading = true;

      const formData = new FormData();

      // ✅ Create product object as expected by backend
      const productData = {
        name: this.productForm.get('name')?.value,
        description: this.productForm.get('description')?.value,
        price: this.productForm.get('price')?.value,
        category: this.productForm.get('category')?.value,
      };

      // ✅ Append as 'product' (matches @RequestPart("product") in backend)
      formData.append(
        'product',
        new Blob([JSON.stringify(productData)], {
          type: 'application/json',
        })
      );

      // ✅ Append image file (matches @RequestPart("imageFile") in backend)
      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile);
      }

      console.log('Sending to:', `${environment.apiBase}/api/admin/product`);

      // Use update or add based on mode
      const request = this.isEditMode && this.productId
        ? this.productService.updateProduct(this.productId, formData)
        : this.productService.addProduct(formData);

      request.subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('✅ Success response:', response);
          alert(this.isEditMode ? 'Product updated successfully!' : 'Product added successfully!');
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('❌ Full error:', error);
          console.error('❌ Error status:', error.status);
          console.error('❌ Error message:', error.message);

          let errorMessage = this.isEditMode
            ? 'Error updating product. Please try again.'
            : 'Error adding product. Please try again.';
          if (error.status === 401) {
            errorMessage = 'Unauthorized. Please login as admin.';
          } else if (error.status === 403) {
            errorMessage = 'Access denied. Admin privileges required.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          alert(errorMessage);
        },
      });
    } else {
      Object.keys(this.productForm.controls).forEach((key) => {
        this.productForm.get(key)?.markAsTouched();
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.errors?.['required']) {
      return 'This field is required';
    } else if (field?.errors?.['minlength']) {
      return `Minimum length is ${field.errors?.['minlength'].requiredLength} characters`;
    } else if (field?.errors?.['min']) {
      return `Minimum value is ${field.errors?.['min'].min}`;
    }
    return '';
  }
}
