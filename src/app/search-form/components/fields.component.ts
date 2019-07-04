import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromSearch from '../reducers';
import * as fromFormActions from '../actions/form.actions';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-fields',
  template: `
    <div class="h6">Suche</div>

    <div class="input-group searchfieldrow" *ngFor="let field of searchFields$ | async | objectKeys">

      <!-- Auswahl des Suchfeldtyps (Freitext, Titel, Person,...) -->
      <div class="input-group-btn">
        <select class="btn btn-sm" title="Suchfeldtyp" #searchType (change)="updateSearchType(field, searchType.value)">
          <option *ngFor="let key of searchFieldsConfig.options | objectKeys" [value]="key"
                  [selected]="key === (searchFieldByKey$ | async)(field).field">
            {{searchFieldsConfig.options[key]}}
          </option>
        </select>
      </div>

      <!-- Suchfeld -->
      <input class="form-control form-control-sm"
             type="text"
             [value]="(searchFieldByKey$ | async)(field).value"
             #searchValue
             (keyup)="updateSearchValue(field, searchValue.value)"
             (keyup.esc)="form.get(field, '')"
             placeholder="Suchbegriff eingeben">
    </div>
  `,
  styles: [`
    .searchfieldrow + .searchfieldrow {
      margin-top: 10px;
    }

    select {
      width: auto;
    }

    .input-group-btn select {
      border-color: #ccc;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsComponent {
  searchFieldsConfig: any;
  searchFields$: Observable<any>;
  searchFieldByKey$: Observable<any>;

  constructor(private _searchStore: Store<fromSearch.State>) {
    this.searchFieldsConfig = environment.searchFields;
    this.searchFields$ = _searchStore.pipe(select(fromSearch.getSearchValues));
    this.searchFieldByKey$ = _searchStore.pipe(select(fromSearch.getSearchValuesByKey));
  }

  updateSearchType(fieldName: string, typeName: string) {
    this._searchStore.dispatch(new fromFormActions.UpdateSearchFieldType({field: fieldName, type: typeName}));
  }

  updateSearchValue(fieldName: string, value: string) {
    this._searchStore.dispatch(new fromFormActions.UpdateSearchFieldValue({field: fieldName, value: value}));
  }
}
