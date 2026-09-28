import { Routes } from '@angular/router';

import { IssuePage } from './issue-page';
import { PortfolioPage } from './portfolio-page';
import { ProjectPage } from './project-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'portfolio' },
  { path: 'portfolio', component: PortfolioPage },
  { path: 'projects/:id/issues/:issueId', component: IssuePage },
  { path: 'projects/:id/:domain', component: ProjectPage },
  { path: 'projects/:id', component: ProjectPage },
  { path: '**', redirectTo: 'portfolio' },
];
