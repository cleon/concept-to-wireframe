import { Component } from '@angular/core';

@Component({
  selector: 'app-demo-banner',
  template: `
    <aside class="demo-banner" role="status">
      <strong>DEMO</strong>
      <span>Mock data only — fictional projects, no live systems, no real PII.</span>
    </aside>
  `,
})
export class DemoBanner {}
