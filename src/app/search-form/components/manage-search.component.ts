import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import * as fromSearch from '../reducers';
import * as fromFormActions from '../actions/form.actions';

@Component({
  selector: 'app-manage-search',
  template: `
    <div class="query-overview bg-info text-white p-2 rounded">

      <button class="btn btn-default btn-sm"
              (click)="resetSearch()">Neue Suche
      </button>

      <hr>

      <!-- Uebersicht der aktuellen Suchparameter, Link der Suche, Suche speichern -->
      <div class="no-gutters">

        <app-params-set></app-params-set>

        <div class="d-flex no-gutters mh-lh">

          <label>Suche als Link:</label>
          <div class="col">
            Link kopieren
            <app-copy-link [data]="query$ | async" [small]="true"></app-copy-link>
          </div>
        </div>

        <app-save-query></app-save-query>

      </div>

      <app-manage-saved-queries></app-manage-saved-queries>

      <hr>

      <app-basket-list></app-basket-list>

    </div>
  `,
  styles: [`
    .mh-lh {
      line-height: 30px
    }

    .query-overview label {
      width: 140px;
    }

    label {
      margin-bottom: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageSearchComponent {
  query$: Observable<any>;

  constructor(private _searchStore: Store<fromSearch.State>) {
    this.query$ = _searchStore.pipe(select(fromSearch.getFormValues));
  }

  resetSearch() {
    this._searchStore.dispatch(new fromFormActions.ResetAll());
  }
}
