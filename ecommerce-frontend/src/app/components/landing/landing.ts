import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css'],
})
export class LandingComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  user = computed(() => this.auth.user());
  showAlert = false;

  logout() {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }

  showLoginAlert() {
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
      this.router.navigate(['/login']);
    }, 2500);
  }
}
