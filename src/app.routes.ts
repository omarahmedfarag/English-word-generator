
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: 'learn',
    loadComponent: () => import('./components/learn/learn.component').then(c => c.LearnComponent)
  },
  {
    path: 'translate',
    loadComponent: () => import('./components/translate/translate.component').then(c => c.TranslateComponent)
  },
  {
    path: 'saved',
    loadComponent: () => import('./components/saved-words/saved-words.component').then(c => c.SavedWordsComponent)
  },
  {
    path: '**',
    redirectTo: 'learn',
    pathMatch: 'full'
  }
];
