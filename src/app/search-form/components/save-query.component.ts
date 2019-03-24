import {ChangeDetectionStrategy, Component} from '@angular/core';
import {select, Store} from '@ngrx/store';

import * as fromSearch from '../reducers';
import * as fromSavedQueryActions from '../actions/saved-query.actions';
import {randomHashCode} from '../../shared/utils';
import {environment} from '../../../environments/environment';
import {BehaviorSubject, Subject} from "rxjs";

@Component({
  selector: 'app-save-query',
  template: `
    <!-- Block: Suchanfrage speichern -->
    <div class="d-flex no-gutters align-items-start mt-1 mh-lh">

      <label>Suche speichern:</label>
      <div class="col no-gutters d-flex flex-column flex-md-row">

        <!-- Input fuer Namen + Button -->
        <div class="input-group input-group-sm col-8 col-md-4">

          <!-- "UserQuery speichern" Textfeld fuer Name -->
          <input class="form-control"
                 type="text"
                 #saveQueryInput
                 (keyup)="saveQueryName$.next(saveQueryInput.value)"
                 placeholder="Name der Suche">

          <!-- "UserQuery speichern" Button, disabled, wenn Textfeld nicht valide -->
          <span class="input-group-btn">
                <button class="btn btn-primary fa fa-floppy-o"
                        type="button"
                        [disabled]="hasErrors()"
                        (click)="saveUserQuery()"></button>
              </span>
        </div>

        <!-- Info bei Fehler im Namensfeld von "UserQuery speichern" -->
        <div class="input-group ml-md-2 mt-1 mt-md-0"
             *ngIf="hasErrors(saveQueryName$ | async)">
          <div class="bg-danger px-2 rounded"
               *ngIf="isAmbiguous(saveQueryName$ | async)">Name muss eindeutig sein
          </div>
          <div class="bg-danger px-2 rounded"
               *ngIf="!(saveQueryName$ | async)">Name ist Pflichtfeld
          </div>
          <div class="bg-danger px-2 rounded" *ngIf="(saveQueryName$ | async) && (saveQueryName$ | async).length < 3">
            Mindestlänge 3
          </div>
        </div>
      </div>
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
export class SaveQueryComponent {
  saveQueryName$: Subject<string>;
  saveQueryName: string;

  private _formValues: any;
  private _savedQueries: any[];

  constructor(private _searchStore: Store<fromSearch.State>) {
    this.saveQueryName$ = new BehaviorSubject<string>("");
    this.saveQueryName$.subscribe(x => this.saveQueryName = x);
    _searchStore.pipe(select(fromSearch.getFormValues)).subscribe(formValues => this._formValues = formValues);
    _searchStore.pipe(select(fromSearch.getAllSavedQueries)).subscribe(savedQueries => this._savedQueries = savedQueries);
  }

  saveUserQuery() {
    this._searchStore.dispatch(new fromSavedQueryActions.AddSavedQuery({
      savedQuery: {
        id: randomHashCode(),
        name: this.saveQueryName,
        query: {...this._formValues, queryParams: environment.queryParams},
      }
    }));
  }

  hasErrors() {
    return this.isAmbiguous(this.saveQueryName) || this.saveQueryName.length < 3 || !this.saveQueryName;
  }

  isAmbiguous(name: string) {
    return this._savedQueries.filter(x => x.name === name).length > 0
  }
}
