import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Rx';

import {environment} from '../../../environments/environment';
import * as fromRoot from '../../reducers';
import * as fromFormActions from '../actions/form.actions';
import * as fromSearch from '../reducers';

@Component({
  selector: 'app-filters',
  template: `
    <div *ngFor="let filter of filterFields | objectKeys" class="filterBlock">
      <div class="h6">{{filterFields[filter].label}}</div>
      <label class="btn btn-sm btn-outline-primary mr-1"
             *ngFor="let option of filterFields[filter].options"
             (click)="toggleChecked(filter, option.value)"
             [class.active]="(filterFieldsByKey$ | async)(filter).values.includes(option.value)">
        <span class="fa" [class.fa-check-circle]="(filterFieldsByKey$ | async)(filter).values.includes(option.value)"
              [class.fa-circle-thin]="!(filterFieldsByKey$ | async)(filter).values.includes(option.value)">
        </span>
        <span> {{option.label}}</span>
      </label>
    </div>
  `,
  styles: [`
    label {
      margin-bottom: 0;
    }

    .filterBlock + .filterBlock {
      margin-top: 10px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  filterFields: any;
  filterFieldsByKey$: Observable<any>;

  constructor(private _formBuilder: FormBuilder,
              private _rootStore: Store<fromRoot.State>,
              private _searchStore: Store<fromSearch.State>) {
    this.filterFields = environment.filterFields;
    this.filterFieldsByKey$ = _searchStore.pipe(select(fromSearch.getFilterValuesByKey))
  }

  toggleChecked(filter: string, value: string) {
    this._searchStore.dispatch(new fromFormActions.ToggleFilterValue({filter: filter, value: value}));
  }
}
