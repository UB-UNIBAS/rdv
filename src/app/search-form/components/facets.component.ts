import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {select, Store} from '@ngrx/store';

import * as fromSearch from "../reducers";
import * as fromFormActions from "../actions/form.actions"
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-facets',
  template: `
    <ng-container *ngFor="let key of facetFieldsConfig | objectKeys">
      <!-- DIV pro Facette fuer Facettenwerte -->
      <div *ngIf="(shownFacetOrRange$ | async) === 'facet-pills-' + key"
           [class.active]="facetFieldsConfig[key].order == 1"
           class="tab-pane list-group"
           id="facet-pills-{{key}}"
           role="tabpanel"
           aria-labelledby="'facet-pills-'+key+'-tab'">

        <!-- Select fuer Auswahl wie die Facetten-Werte kombiniert werden sollen (OR vs. AND) -->
        Werte werden per
        <!-- bei mehreren Operatoren ein Select anzeigen, sonst nur den Wert des Operators -->
        <div *ngIf="facetFieldsConfig[key].operators.length > 1;then operatorSelect else singleOperator"></div>

        <!-- Select wie Facettenwerte dieser Facette verknuepft werden sollen -->
        <ng-template #operatorSelect>
          <select title="Verknüpfungsart" class="btn btn-sm" #sel (change)="changeOperator(key, sel.value)">
            <option *ngFor="let operator of facetFieldsConfig[key].operators"
                    [value]="operator" [selected]="operator === (facetFieldByKey$ | async)(key).operator">{{operator}}
            </option>
          </select>
        </ng-template>

        <!-- Anzeige wie Facettenwerte dieser Facetten immer verknupeft werden -->
        <ng-template #singleOperator>{{facetFieldsConfig[key].operator}}</ng-template>

        verküpft

        <!-- Liste der Facettenwerte dieser Facette -->
        <ng-container *ngFor="let value of (facetFieldCountByKey$ | async)((facetFieldByKey$ | async)(key).field)">

          <!-- Facettenwert (z.B. Dissertation) und Anzahl (43) anzeigen und Button zum Auswaehlen anbieten -->
          <button *ngIf="(facetFieldByKey$ | async)(key).values.indexOf(value[0]) == -1"
                  (click)="selectFacet(key, value[0])"
                  type="button"
                  class="list-group-item list-group-item-action p-1">
                <span class="justify-content-between align-items-center d-flex">
                  <span style="word-break: break-word">{{value[0]}}</span>
                  <span class="badge badge-pill badge-secondary">{{value[1]}}</span>
                </span>
          </button>
        </ng-container>
      </div>
    </ng-container>
  `,
  styles: [`
    select {
      width: auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacetsComponent {
  facetFieldsConfig: any;
  facetFieldByKey$: Observable<any>;
  facetFieldCountByKey$: Observable<any>;
  shownFacetOrRange$: Observable<string>;

  constructor(private _searchStore: Store<fromSearch.State>) {
    this.facetFieldsConfig = environment.facetFields;
    this.shownFacetOrRange$ = _searchStore.pipe(select(fromSearch.getShownFacetOrRange));
    this.facetFieldByKey$ = _searchStore.pipe(select(fromSearch.getFacetValuesByKey));
    this.facetFieldCountByKey$ = _searchStore.pipe(select(fromSearch.getFacetFieldCountByKey));
  }

  selectFacet(field, value) {
    this._searchStore.dispatch(new fromFormActions.AddFacetValue({facet: field, value: value}));
  }

  changeOperator(facet: string, value: string) {
    this._searchStore.dispatch(new fromFormActions.UpdateFacetOperator({facet: facet, value: value}));
  }
}
