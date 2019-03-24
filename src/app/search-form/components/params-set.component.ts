import {ChangeDetectionStrategy, Component} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Rx';

import {environment} from '../../../environments/environment';
import * as fromFormActions from "../actions/form.actions";
import * as fromSearch from "../reducers";

@Component({
  selector: 'app-params-set',
  template: `
    <div class="h6">Aktuelle Suche</div>

    <!-- Info "Alle Titel suchen" anzeigen, wenn kein sonstiges Textfeld belegt ist -->
    <div class="d-flex no-gutters mh-lh" *ngIf="searchFieldsAreEmpty">
      <label>Suche:</label>
      <div class="col">alle Titel anzeigen</div>
    </div>

    <div *ngFor="let key of searchFields$ | async | objectKeys"
         class="d-flex no-gutters mh-lh">

      <!-- Wenn in diesem Suchfeld etwas steht -->
      <ng-container *ngIf="(searchFieldByKey$ | async)(key).value.length > 0">

        <!-- Name des ausgewaehlte Suchfelds (Freitext: ) -->
        <label>{{searchFieldsConfig.options[(searchFieldByKey$ | async)(key).field]}}:</label>

        <!-- Suchwert -->
        <div class="col">
          <span>{{(searchFieldByKey$ | async)(key).value}}</span>
          <!-- Undo-Button -->
          <button (click)="resetTerm(key)"
                  class="btn p-1 fa fa-trash"></button>
        </div>
      </ng-container>
    </div>

    <!-- Ausgewaehlte Ranges: Ueber Rangefelder gehen -->
    <div *ngFor="let key of rangeFields$ | async | objectKeys"
         class="d-flex no-gutters mh-lh">

      <!-- Label (Jahr:) -->
      <label>{{rangeFieldsConfig[key].label}}:</label>

      <!-- Div mit aktuellem Wertebereich (1955-1972) -->
      <div class="col">

        <!-- Range-Bereich -->
        <span>{{(rangeFieldByKey$ | async)(key).from}} - {{(rangeFieldByKey$ | async)(key).to}}</span>

        <!-- Reset-Button (Range wieder auf Extrem-Werte setzen) -->
        <button
          *ngIf="(rangeFieldByKey$ | async)(key).from != (rangeFieldByKey$ | async)(key).min ||
           (rangeFieldByKey$ | async)(key).to != (rangeFieldByKey$ | async)(key).max"
          (click)="resetRange(key)"
          class="btn p-1 fa fa-undo"></button>

        <span *ngIf="(rangeFieldByKey$ | async)(key).showMissingValues">
              <span> / auch Einträge ohne {{rangeFieldsConfig[key].label}} anzeigen</span>

          <!-- Undo-Button -->
              <button (click)="toggleShowMissingValues(key)" class="btn p-1 fa fa-trash"></button>
            </span>
      </div>
    </div>

    <!-- Ausgewaehlte Facetenwerte: Ueber Facettenfelder gehen -->
    <div *ngFor="let key of facetFields$ | async | objectKeys"
         class="d-flex no-gutters mh-lh">

      <!-- Wenn es ausgewaehlte Werte dieser Facette gibt -->
      <ng-container *ngIf="(facetFieldByKey$ | async)(key).values.length > 0">

        <!-- Name der Facette (Dokumenttyp: ) -->
        <label>{{facetFieldsConfig[key].label}}:</label>

        <!-- Div mit Werten -->
        <div class="col">

          <!-- Ueber Werte der Facetten gehen -->
          <ng-container *ngFor="let facetVal of (facetFieldByKey$ | async)(key).values; first as first">

            <!-- ab 2. Eintrag Operator ausgeben (... OR eng) -->
            <span *ngIf="!first">{{(facetFieldByKey$ | async)(key).operator}}</span>

            <!-- Facettenwert -->
            <span>{{facetVal}}</span>

            <!-- Remove-Button -->
            <button (click)="removeFacet(key, facetVal)"
                    class="btn p-1 fa fa-trash"></button>
          </ng-container>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .mh-lh {
      line-height: 30px
    }

    label {
      margin-bottom: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParamsSetComponent {
  //speichert den Zustand, ob mind. 1 Textsuchfeld nicht leer ist
  searchFieldsAreEmpty = true;

  facetFieldsConfig: any;
  rangeFieldsConfig: any;
  searchFieldsConfig: any;

  searchFields$: Observable<any>;
  searchFieldByKey$: Observable<any>;
  rangeFields$: Observable<any>;
  rangeFieldByKey$: Observable<any>;
  facetFields$: Observable<any>;
  facetFieldByKey$: Observable<any>;

  private static _checkIfSearchFieldsAreEmpty(fields: any) {
    for (const field of fields) {
      if (field.value) {
        return false;
      }
    }
    return true;
  }

  constructor(private _searchStore: Store<fromSearch.State>) {

    this.searchFields$ = _searchStore.pipe(select(fromSearch.getSearchValues));
    this.searchFields$.subscribe(fields => this.searchFieldsAreEmpty = ParamsSetComponent._checkIfSearchFieldsAreEmpty(fields));
    this.searchFieldByKey$ = _searchStore.pipe(select(fromSearch.getSearchValuesByKey));
    this.rangeFields$ = _searchStore.pipe(select(fromSearch.getRangeValues));
    this.rangeFieldByKey$ = _searchStore.pipe(select(fromSearch.getRangeValuesByKey));
    this.facetFields$ = _searchStore.pipe(select(fromSearch.getFacetValues));
    this.facetFieldByKey$ = _searchStore.pipe(select(fromSearch.getFacetValuesByKey));

    this.facetFieldsConfig = environment.facetFields;
    this.rangeFieldsConfig = environment.rangeFields;
    this.searchFieldsConfig = environment.searchFields;
  }

  removeFacet(field, value) {
    this._searchStore.dispatch(new fromFormActions.RemoveFacetValue({facet: field, value: value}));
    //TODO an Start der Trefferliste springen?
  }

  resetRange(key) {
    this._searchStore.dispatch(new fromFormActions.ResetRange(key));
  }

  resetTerm(key) {
    this._searchStore.dispatch(new fromFormActions.UpdateSearchFieldValue({field: key, value: ''}));
  }

  toggleShowMissingValues(key) {
    this._searchStore.dispatch(new fromFormActions.ShowMissingValuesInRange(key));
  }
}
