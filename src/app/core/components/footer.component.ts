import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Application footer component
 */
@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <div class="container">
        <span class="text-muted">Afrikaportal 2017.</span>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
}
