import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: Auth,
    data: { mode: 'login' }
  },
  {
    path: 'signup',
    component: Auth,
    data: { mode: 'signup' }
  }
];