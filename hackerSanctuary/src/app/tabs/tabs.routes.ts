import type { Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'news',
        loadComponent: () => import('../news/news.page').then((m) => m.NewsPage),
      },
      {
        path: 'tab2',
        redirectTo: 'news',
        pathMatch: 'full',
      },
      {
        path: 'market',
        loadComponent: () => import('../market/market.page').then((m) => m.MarketPage),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
