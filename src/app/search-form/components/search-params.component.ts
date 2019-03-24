import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-search-params',
  template: `
    <div class="d-flex flex-column flex-md-row no-gutters mt-2">

      <div class="col-md p-2 mr-md-2 mb-2 mb-md-0 d-flex flex-column justify-content-between no-gutters"
           style="border: 1px solid grey; border-radius:3px; margin-right: 20px;">
        <app-fields></app-fields>
        <app-filters></app-filters>
      </div>

      <!-- Facetten/Ranges-Bereich als Tabs (Pills) -->
      <div class="d-flex flex-column p-2 col-md"
           style="border: 1px solid grey; border-radius:3px;">
        <app-visual-search></app-visual-search>
      </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchParamsComponent {
}
