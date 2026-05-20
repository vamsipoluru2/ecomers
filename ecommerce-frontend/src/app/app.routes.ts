import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { LandingComponent } from './components/landing/landing';
import { ProductComponent } from './components/product/product.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { AddProductComponent } from './components/add-product/add-product.component';
// import { AddProductComponent } from './components/add-product/add-product.component'; // Add this import

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user/home', component: UserHomeComponent },
  { path: 'products', component: ProductComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orders', component: OrderListComponent },

  // Order flow
  {
    path: 'order/confirmation',
    loadComponent: () =>
      import('./components/order-confirmation/order-confirmation.component').then(
        (m) => m.OrderConfirmationComponent
      ),
  },
  {
    path: 'order/:id',
    loadComponent: () =>
      import('./components/order-details/order-details.component').then(
        (m) => m.OrderDetailsComponent
      ),
  },
  {
    path: 'payment',
    loadComponent: () =>
      import('./components/payment/payment.component').then(
        (m) => m.PaymentComponent
      ),
  },

  // Admin
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'admin/products', component: AdminProductsComponent },
  { path: 'admin/products/add', component: AddProductComponent },
  { path: 'admin/products/edit/:id', component: AddProductComponent },
  { path: 'admin/orders', component: OrderListComponent },
  {
    path: 'admin/stats',
    loadComponent: () =>
      import('./components/admin-statistics/admin-statistics.component').then(
        (m) => m.AdminStatsComponent
      ),
  },

  { path: '**', redirectTo: '' },
];
