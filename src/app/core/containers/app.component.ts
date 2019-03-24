import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Store } from '@ngrx/store';

import { environment } from '../../../environments/environment';
import * as fromRoot from '../../reducers';
import * as fromActions from '../actions/remote-filter-configs.actions';

/**
 * Main entry point to the application.
 */
@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <router-outlet class="no-gutters"></router-outlet>
    <app-footer></app-footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AppComponent {

  /**
   * @ignore
   */
  constructor(private _rootStore: Store<fromRoot.State>) {
    this._fetchRemoteFilterConfigs();
  }

  /**
   * Triggers remote fetching of filter options if respective filter value is an URL
   */
  private _fetchRemoteFilterConfigs() {
    for (const key of Object.keys(environment.filterFields)) {
      if (environment.filterFields[key].url) {
        this._rootStore.dispatch(
          new fromActions.GetRemoteFilterFieldOptions({key: key, url: environment.filterFields[key].url})
        );
      }
    }
  }

}
