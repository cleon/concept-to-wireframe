import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { DemoBanner } from './demo-banner';
import { HubStore, roleLabel } from './hub-store';
import type { HubRole } from './mock/types';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DemoBanner],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly store = inject(HubStore);
  readonly roleLabel = roleLabel;

  readonly roles: HubRole[] = ['cm', 'scout', 'pm'];

  setRole(role: HubRole): void {
    this.store.setRole(role);
  }
}
