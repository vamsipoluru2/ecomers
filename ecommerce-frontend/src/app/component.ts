import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <!-- ✅ Navbar only visible on allowed routes -->
    <nav *ngIf="showNavbar" style="padding:12px; background:#0f172a; color:#fff;">
      <a routerLink="/" style="margin-right:12px; color:#fff;">Home</a>
      <a routerLink="/login" style="margin-right:12px; color:#fff;">Login</a>
      <a routerLink="/register" style="margin-right:12px; color:#fff;">Register</a>
      <a routerLink="/cart" style="margin-right:12px; color:#fff;">Cart</a>
      <a routerLink="/checkout" style="margin-right:12px; color:#fff;">Checkout</a>
      <a routerLink="/orders" style="margin-right:12px; color:#fff;">Orders</a>
    </nav>

    <!-- Main Router View -->
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  showNavbar = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // ✅ Hide top bar on these routes
        const hideNavbarRoutes = ['/cart', '/checkout', '/logout'];
        this.showNavbar = !hideNavbarRoutes.includes(event.url);
      }
    });
  }
}
