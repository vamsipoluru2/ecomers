import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  user = computed(() => this.auth.user());
  isLoggedIn = computed(() => !!this.user());
  isAdmin = computed(() => this.user()?.role?.toUpperCase() === 'ADMIN');

  ngOnInit() {
    this.auth.me().subscribe({ next: () => {}, error: () => {} });
  }

  navigateHome() {
    const currentUser = this.user();
    console.log('Navigating home - Current user:', currentUser);
    console.log('User role:', currentUser?.role);
    
    if (currentUser && currentUser.role?.toUpperCase() === 'ADMIN') {
      console.log('Navigating to admin dashboard');
      this.router.navigate(['/admin/dashboard']);
    } else {
      console.log('Navigating to customer home');
      this.router.navigate(['/']);
    }
  }

  logout() {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }
}


