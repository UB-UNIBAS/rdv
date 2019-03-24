import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from "rxjs";
import { select, Store } from "@ngrx/store";

import { environment } from "../../../environments/environment";
import * as fromBasketActions from '../actions/basket.actions';
import * as fromSearch from '../reducers';

/**
 * Lists documents saved in selected basket
 */
@Component({
  selector: 'app-basket-results-list',
  template: `
    <div class="tab-pane list-group"
         id="results-pills-basket"
         role="tabpanel"
         aria-labelledby="facet-pills-basket-tab">

      <!-- Zeile aus Treffer-Anzahl und Pagination der Merkliste -->
      <div class="d-flex justify-content-start flex-wrap">

        <!-- Block: Pagination fuer Merlisten-Treffertabelle (keine Auswahlmoeglichkeit wie viele Treffer pro Seite) -->
        <div *ngIf="(numberOfBaskets$ | async) && (currentBasket$ | async).ids.length"
             class="d-flex flex-wrap align-items-center justify-content-between justify-content-md-end flex-auto">
          <app-export-results-list *ngIf="showExportList" [results]="currentBasketResults$ | async"></app-export-results-list>
          <app-rows-per-page [rowsPerPage]="rowsPerPage$ | async"
                             (changeRowsPerPage)="changeRowsPerPage($event)">
          </app-rows-per-page>
          <app-result-paging [rowsPerPage]="rowsPerPage$ | async"
                             [numberOfRows]="numberOfBasketResults$ | async"
                             (offset)="setBasketOffset($event)">
          </app-result-paging>
        </div>
      </div>

      <!-- Merklisten-Treffertabelle -->
      <div *ngIf="numberOfBaskets$ | async"
           class="mt-2 mh-table-view">
        <app-result-header [tableFields]="tableFields"
                           [sortedBy]="(currentBasket$ | async)?.queryParams.sortField"
                           [sortOrder]="(currentBasket$ | async)?.queryParams.sortDir"
                           (sortByField)="sortBasketTable($event)">
        </app-result-header>

        <!-- Tabellenzeilen -->
        <div class="mh-table-row d-flex flex-column"
             *ngFor="let doc of currentBasketResults$ | async">
          <app-result-row [doc]="doc"></app-result-row>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .flex-auto {
      flex: auto;
    }

    select {
      width: auto;
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

      .mh-table-row > .mh-table-row-main > div {
        word-break: break-word;
        border-top: 1px solid grey;
        border-left: 1px solid grey;
      }

      .mh-table-row > .mh-table-row-main > div:first-of-type, .mh-table-header > div:first-of-type {
        border-left: 0;
      }

      .mh-table-row > .mh-table-row-info {
        border-top: 1px solid grey;
      }
    }

    @media (max-width: 575px) {
      .mh-table-header > div {
        border-top: 1px solid grey;
        border-bottom: 1px solid grey;
        border-left: 1px solid grey;
      }

      .mh-table-header > div:first-child {
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
      }

      .mh-table-header > div:last-child {
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        border-right: 1px solid grey;
      }

      .mh-table-row {
        border: 1px solid grey;
        border-radius: 3px;
        margin-top: 20px;
      }
    }

    .mh-table-row > div > div > label {
      width: 140px;
    }

    .mh-table-row > div > div > label:after {
      content: ''
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
export class BasketResultsListComponent {
  /**
   * Selected basket
   */
  currentBasket$: Observable<any>;
  /**
   * Documents in selected basket (as Observable)
   */
  currentBasketResults$: Observable<any>;
  /**
   * Documents in selected basket
   */
  currentBasketResults: any;
  /**
   * Number of baskets
   */
  numberOfBaskets$: Observable<number>;
  /**
   * Total number of elements in selected basket
   */
  numberOfBasketResults$: Observable<number>;
  /**
   * Shown rows per page
   */
  rowsPerPage$: Observable<number>;

  /**
   * @ignore
   */
  readonly showExportList = environment.showExportList.basket;
  /**
   * @ignore
   */
  readonly tableFields = environment.tableFields;

  /**
   * @ignore
   */
  private _currentBasket: any;

  /**
   * @ignore
   */
  constructor(private _searchStore: Store<fromSearch.State>) {
    this.numberOfBaskets$ = _searchStore.pipe(select(fromSearch.getBasketCount));
    this.currentBasket$ = _searchStore.pipe(select(fromSearch.getCurrentBasket));
    this.rowsPerPage$ = _searchStore.pipe(select(fromSearch.getCurrentBasketsDisplayedRows));
    this.currentBasket$.subscribe(basket => {
      this._currentBasket = basket;
    });
    this.currentBasketResults$ = _searchStore.pipe(select(fromSearch.getAllBasketResults));
    this.currentBasketResults$.subscribe(res => this.currentBasketResults = res);
    this.numberOfBasketResults$ = _searchStore.pipe(select(fromSearch.getCurrentBasketElementsCount));
  }

  /**
   * Reset list offset (starts new search query)
   *
   * @param {Object} offset New list offset
   */
  setBasketOffset(offset) {
    this._searchStore.dispatch(new fromBasketActions.UpsertBasket({
      basket: {
        ...this._currentBasket,
        queryParams: {
          ...this._currentBasket.queryParams,
          start: offset,
        }
      }
    }));
  }

  /**
   * Sort list by category and/or ascending / descending (starts new search query since whole list is reordered)
   *
   * @param {string} sortBy Either `asc`, `desc` or name of category
   */
  sortBasketTable(sortBy: string) {
    if (sortBy === 'asc' || sortBy === 'desc') {
      this._searchStore.dispatch(new fromBasketActions.UpsertBasket({
        basket: {
          ...this._currentBasket,
          queryParams: {
            ...this._currentBasket.queryParams,
            sortDir: sortBy,
          }
        }
      }));
    } else {
      this._searchStore.dispatch(new fromBasketActions.UpsertBasket({
        basket: {
          ...this._currentBasket,
          queryParams: {
            ...this._currentBasket.queryParams,
            sortField: sortBy,
            sortDir: 'asc',
          }
        }
      }));
    }
  }

  /**
   * Changes number of shown rows per page (starts new search query)
   *
   * @param {number} no Number of rows
   */
  changeRowsPerPage(no: number) {
    this._searchStore.dispatch(new fromBasketActions.UpsertBasket({
      basket: {
        ...this._currentBasket,
        queryParams: {
          ...this._currentBasket.queryParams,
          rows: no,
        }
      }
    }));
  }
}
