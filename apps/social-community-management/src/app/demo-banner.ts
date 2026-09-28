import { Component } from '@angular/core';

@Component({
  selector: 'app-demo-banner',
  template: `
    <aside class="demo-banner" role="status">
      <strong>DEMO</strong>
      <span
        >Mock data only — fictional social posts and internal signals. No live X, Jira, or
        Teams.</span
      >
    </aside>
  `,
})
export class DemoBanner {}
