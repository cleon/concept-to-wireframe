import { Routes } from '@angular/router';

import { DecisionDetailPage } from './decision-detail-page';
import { DecisionsQueuePage } from './decisions-queue-page';
import { PostDetailPage } from './post-detail-page';
import { SignalsListPage } from './signals-list-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'signals' },
  { path: 'signals', component: SignalsListPage },
  { path: 'posts/:id', component: PostDetailPage },
  { path: 'decisions', component: DecisionsQueuePage },
  { path: 'decisions/:id', component: DecisionDetailPage },
  { path: '**', redirectTo: 'signals' },
];
