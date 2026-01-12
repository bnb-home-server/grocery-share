import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'purchases',
    pathMatch: 'full'
  },
  {
    path: 'purchases',
    loadComponent: () => import('./pages/purchases/purchases.page').then(m => m.PurchasesPage)
  },
  {
    path: 'purchase/:id',
    loadComponent: () => import('./pages/purchase-detail/purchase-detail.page').then(m => m.PurchaseDetailPage)
  },
  {
    path: 'people',
    loadComponent: () => import('./pages/people/people.page').then(m => m.PeoplePage)
  }
];
