import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Main navigation container
 */
@Component({
  selector: 'app-header',
  template: `
    <div class="container">
      <nav class="nav nav-pills mt-3">
        <a class="px-2 py-1 btn btn-outline-primary mr-2"
           routerLink=""
           [routerLinkActiveOptions]="{ exact: true }"
           routerLinkActive="active">Datenbank</a>
        <a class="btn btn-outline-primary px-2 py-1"
           routerLink="about"
           routerLinkActive="active">Über das Projekt</a>
      </nav>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
}
