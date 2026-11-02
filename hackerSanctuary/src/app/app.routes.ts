import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'gg',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'news',
    loadComponent: () => import('./news/news.page').then((m) => m.NewsPage),
  },
];
