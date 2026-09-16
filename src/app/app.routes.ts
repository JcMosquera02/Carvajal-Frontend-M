import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component')
        .then(m => m.LoginComponent)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component')
        .then(m => m.RegisterComponent)
  },

  {
    path: 'catalog',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/catalog/catalog.component')
        .then(m => m.CatalogComponent)
  },

  {
    path: 'wishlist',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/wishlist/wishlist.component')
        .then(m => m.WishlistComponent)
  },

  {
    path: 'history',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/history/history.component')
        .then(m => m.HistoryComponent)
  },

  {
    path: 'admin/products',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin-products/admin-products.component')
        .then(m => m.AdminProductsComponent)
  },

  {
    path: 'admin/roles',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin-role/admin-role.component')
        .then(m => m.AdminRoleComponent)
  },

  {
    path: '',
    redirectTo: 'catalog',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'catalog'
  }

];
