import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;
  message: string | null = null;
  isLoading = false;

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;
    this.error = null;
    this.message = null;

    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (user) {
          this.message = `Welcome back, ${user.name}!`;
          setTimeout(() => {
            // ✅ Redirect based on role if needed
            if (user.role === 'ADMIN') {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/user/home']);
            }
          }, 800);
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.isLoading = false;
        this.error = err?.error?.message || 'Invalid email or password! Please try again.';
      },
    });
  }
}
