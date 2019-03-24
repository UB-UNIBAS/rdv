import {ChangeDetectionStrategy, Component} from '@angular/core';
import {select, Store} from "@ngrx/store";

import * as fromSearch from '../reducers';
import {Observable} from "rxjs";

@Component({
  selector: 'app-result-lists',
  template: `
    <!-- Trefferlisten (Suche und Merkliste) als Tabs (Pills) -->
    <div class="d-flex flex-column p-2 col-md mt-2 mb-2"
         style="border: 1px solid grey; border-radius:3px;">

      <!-- DIV-Container fuer Tab-Links -->
      <nav class="nav nav-pills "
           id="result-pills-tab"
           role="tablist">

        <!-- Tab-Link fuer Trefferliste -->
        <a class="btn btn-outline-primary mr-2 text-sm-center px-2 py-1 active"
           id="results-pills-search-tab"
           data-toggle="pill"
           href="#"
           (click)="changeView('search')"
           role="tab"
           aria-controls="pills-search"
           aria-expanded="true">Ergebnisse
          <!-- Treffer-Anzahl in Trefferliste -->
          <strong>({{searchCount$ | async}})</strong>
        </a>

        <!-- Tab-Link fuer Merkliste -->
        <a class="btn btn-outline-primary text-sm-center px-2 py-1"
           id="results-pills-basket-tab"
           data-toggle="pill"
           href="#"
           (click)="changeView('basket')"
           role="tab"
           aria-controls="pills-basket"
           aria-expanded="true">Merkliste
          <!-- Treffer-Anzahl in Merkliste -->
          <strong>({{basketCount$ | async}})</strong>
        </a>
      </nav>

      <!-- DIV-Container fuer Tab-Inhalte (Trefferliste + Merkliste) -->
      <div class="tab-content"
           id="result-pills-tabContent">
        <app-search-results-list *ngIf="showSearchResults; else elseBlock"></app-search-results-list>
        <ng-template #elseBlock>
          <app-basket-results-list></app-basket-results-list>
        </ng-template>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultListsComponent {
  basketCount$: Observable<number>;
  searchCount$: Observable<number>;
  showSearchResults = true;

  constructor(private _searchStore: Store<fromSearch.State>) {
    this.basketCount$ = _searchStore.pipe(select(fromSearch.getCurrentBasketElementsCount));
    this.searchCount$ = _searchStore.pipe(select(fromSearch.getTotalResultsCount));
  }

  changeView(view: string) {
    this.showSearchResults = view === 'search';
  }
}
