import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NavbarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  user = computed(() => this.auth.user());
  isLoggedIn = computed(() => !!this.user());
  showNavbar = true;

  ngOnInit() {
    this.auth.me().subscribe({ next: () => {}, error: () => {} }); // hydrate session if cookie exists
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        const url = evt.urlAfterRedirects || evt.url;
        this.showNavbar = !url.startsWith('/login');
      }
    });
  }
  logout() {
    this.auth.logout().subscribe(() => (location.href = '/login'));
  }
}
