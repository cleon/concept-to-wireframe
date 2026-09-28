import { Component, input } from '@angular/core';

import type { Health, Severity } from './mock/types';

@Component({
  selector: 'app-health-badge',
  template: `<span class="badge" [attr.data-tone]="tone()">{{ label() }}</span>`,
})
export class HealthBadge {
  readonly tone = input.required<Health | Severity>();
  readonly label = input.required<string>();
}
