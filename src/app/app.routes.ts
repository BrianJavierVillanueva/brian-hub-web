import { Routes } from '@angular/router';
import { Admin } from './pages/admin/admin';
import { Landing } from './pages/landing/landing';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'admin', component: Admin },
  { path: '**', redirectTo: '' },
];
