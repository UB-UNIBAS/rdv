import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Information about the application
 */
@Component({
  selector: 'app-about',
  template: `
    <div class="container mt-2">
      <div class="no-gutters p-1"> Hier geht es um den Inhalt der Datenbank</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
}
