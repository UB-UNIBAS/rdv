import {ChangeDetectionStrategy, Component} from '@angular/core';
import {select, Store} from "@ngrx/store";

import * as fromSearch from '../reducers';
import * as fromQueryActions from '../actions/query.actions';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Component({
  selector: 'app-search-results-list',
  template: `
    <div class="tab-pane list-group active"
         id="results-pills-search"
         role="tabpanel"
         aria-labelledby="facet-pills-search-tab">

      <!-- Zeile aus Treffer-Anzahl, Select Treffer pro Seite, Pagination der Treffertabelle -->
      <div class="d-flex justify-content-start flex-wrap">

        <!-- Block: Select Treffer pro Seite + Pagination -->
        <div *ngIf="count$ | async"
             class="d-flex flex-wrap align-items-center justify-content-between justify-content-md-end flex-auto">

          <app-export-results-list *ngIf="showExportList" [results]="docs$ | async"></app-export-results-list>
          <app-rows-per-page [rowsPerPage]="rowsPerPage$ | async"
                             (changeRowsPerPage)="changeRowsPerPage($event)">
          </app-rows-per-page>
          <app-result-paging [numberOfRows]="count$ | async"
                             [rowsPerPage]="rowsPerPage$ | async"
                             (offset)="setSearchOffset($event)">
          </app-result-paging>
        </div>
      </div>

      <!-- Treffertabelle -->
      <div *ngIf="count$ | async"
           class="mt-2 mh-table-view">

        <app-result-header [tableFields]="tableFields"
                           [sortedBy]="sortedBy$ | async"
                           [sortOrder]="sortOrder$ | async"
                           (sortByField)="sortSearchTable($event)">
        </app-result-header>

        <!-- Tabellenzeilen -->
        <div class="mh-table-row d-flex flex-column"
             *ngFor="let doc of (docs$ | async)">
          <app-result-row [doc]="doc"></app-result-row>
        </div>
      </div>
    </div> `,
  styles: [`
    .flex-auto {
      flex: auto;
    }

    .mh-flex-1 {
      flex: 1;
    }

    label {
      margin-bottom: 0;
    }

    .mh-table-row:nth-child(2n - 1) {
      background: #f2f2f2;
    }

    @media (min-width: 576px) {

      .mh-table-view {
        border: 1px solid grey;
        border-radius: 3px;
      }

      .mh-sort-by-column {
        background-color: rgba(0, 255, 255, 0.05);
      }

      .mh-table-header > div {
        word-break: break-word;
        border-left: 1px solid grey;
      }
    }

    @media (max-width: 575px) {
      .mh-table-row {
        border: 1px solid grey;
        border-radius: 3px;
        margin-top: 20px;
      }
    }


    .mh-sort {
      position: absolute;
      right: 3px;
      top: 4px;
    }

    .mh-table-header {
      background: #ddd;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultsListComponent {
  count$: Observable<number>;
  currentBasket$: Observable<any>;
  docs$: Observable<any>;
  offset$: Observable<number>;
  rowsPerPage$: Observable<number>;
  sortedBy$: Observable<string>;
  sortOrder$: Observable<string>;

  readonly showExportList = environment.showExportList.table;
  readonly tableFields = environment.tableFields;

  constructor(private _searchStore: Store<fromSearch.State>) {
    this.docs$ = _searchStore.pipe(select(fromSearch.getAllResults));
    this.count$ = _searchStore.pipe(select(fromSearch.getTotalResultsCount));
    this.offset$ = _searchStore.pipe(select(fromSearch.getResultOffset));
    this.rowsPerPage$ = _searchStore.pipe(select(fromSearch.getResultRows));
    this.sortedBy$ = _searchStore.pipe(select(fromSearch.getResultSortField));
    this.sortOrder$ = _searchStore.pipe(select(fromSearch.getResultSortOrder));
    this.currentBasket$ = _searchStore.pipe(select(fromSearch.getCurrentBasket));
  }

  setSearchOffset(offset) {
    this._searchStore.dispatch(new fromQueryActions.SetOffset(offset));
  }

  sortSearchTable(sortField: string) {
    if (sortField === 'asc' || sortField === 'desc') {
      this._searchStore.dispatch(new fromQueryActions.SetSortOrder(sortField));
    } else {
      this._searchStore.dispatch(new fromQueryActions.SetSortField(sortField));
      this._searchStore.dispatch(new fromQueryActions.SetSortOrder('asc'));
    }
    this._searchStore.dispatch(new fromQueryActions.SetOffset(0));
  }

  changeRowsPerPage(no: number) {
    this._searchStore.dispatch(new fromQueryActions.SetRows(no));
  }
}
