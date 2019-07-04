import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';

import * as fromRoot from '../../reducers';
import * as fromSearch from '../reducers';
import * as fromQueryActions from '../actions/query.actions';
import * as fromBasketActions from '../actions/basket.actions';
import * as fromBasketResultActions from '../actions/basket-result.actions'
import * as fromSavedQueryActions from '../actions/saved-query.actions';
import { environment } from '../../../environments/environment';
import { randomHashCode } from '../../shared/utils';
import { combineLatest } from "rxjs";

/**
 * @ignore
 */
declare var LZString: any;


/**
 * Root component for {@link SearchFormModule}. Responsible for initial setup of search state and for watching changes in search form
 */
@Component({
  selector: 'app-search',
  template: `
    <div class="container mt-2">
      <app-manage-search></app-manage-search>
      <app-search-params></app-search-params>
      <app-result-lists></app-result-lists>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnDestroy {
  /**
   * All saved baskets
   */
  private _baskets: any;
  /**
   * All saved search queries
   */
  private _savedQueries: any;
  /**
   * Latest version of search query
   */
  private _combinedQuery: any;

  /**
   * Decodes and parses search parameters from URL as JSON
   * @param {Object} params
   * @private
   */
  private static _loadQueryFromUrl(params: any) {
    return JSON.parse(LZString.decompressFromEncodedURIComponent(params.get("search")));
  }

  /**
   * Parses saved search queries from localstorage as JSON
   *
   * @private
   */
  private static _loadQueryFromLocalStorage() {
    return JSON.parse(localStorage.getItem("userQuery"));
  }

  /**
   * Watches for search form changes and updates search state accordingly
   *
   * @param {ActivatedRoute} _route Activated route
   * @param {Store<>} _rootStore NgRx application root store
   * @param {Store<>} _searchStore NgRx root search form store
   */
  constructor(private _route: ActivatedRoute,
              private _rootStore: Store<fromRoot.State>,
              private _searchStore: Store<fromSearch.State>) {

    this._watchSearchRequestChanges();

    _searchStore.pipe(select(fromSearch.getCurrentBasket),
      filter(x => !!x))
      .subscribe(basket => {
        this._searchStore.dispatch(new fromBasketResultActions.ClearBasketResults());
        this._searchStore.dispatch(new fromQueryActions.MakeBasketSearchRequest(basket));
      });
    _searchStore.pipe(select(fromSearch.getAllBaskets)).subscribe(baskets => this._baskets = baskets);
    _searchStore.pipe(select(fromSearch.getAllSavedQueries)).subscribe(savedQueries => this._savedQueries = savedQueries);
  }

  /**
   * Saves data to localstorage before leaving app
   */
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler() {
    this._writeToLocalStorage();
  }

  /**
   * Loads saved searches and baskets from URL or localstorage
   */
  ngOnInit() {
    this._route.queryParamMap.subscribe(params => {
      if (params.get("search")) {
        this._searchRequestFromUrl(params);
      } else if (localStorage.getItem("userQuery") || localStorage.getItem("userQuery") !== "undefined") {
        this._searchRequestFromLocalStorage();
      }

      if (params.get("basket")) {
        this._loadBasketFromUrl(params);
      } else if (localStorage.getItem("savedBaskets") && JSON.parse(localStorage.getItem("savedBaskets")).length) {
        this._loadBasketFromLocalStorage();
      } else {
        this._generateInitialBasket();
      }
    });

    this._loadSavedSearchQueries();
  }

  /**
   * Writes to localstorage when leaving component
   */
  ngOnDestroy(): void {
    this._writeToLocalStorage();
  }

  /**
   * Watches for changes in fields required for search requests and emits such a request whenever a field has been changed
   *
   * @private
   */
  private _watchSearchRequestChanges() {
    combineLatest(
      this._searchStore.pipe(
        select(fromSearch.getQueryParams),
        map(val => {
            return {
              queryParams: {
                rows: val.rows,
                sortDir: val.sortOrder,
                sortField: val.sortField,
                start: val.offset
              }
            };
          }
        ),
      ),
      this._searchStore.pipe(
        select(fromSearch.getCombinedSearchQueries),
        debounceTime(750),
        distinctUntilChanged(),
      )
    ).pipe(
      map(val => Object.assign(val[0], val[1])))
      .subscribe(vals => {
        this._combinedQuery = vals;
        this._searchStore.dispatch(new fromQueryActions.MakeSearchRequest(vals));
      });
  }

  /**
   * Issues search request based on encoded search parameters in URL
   *
   * @param {Object} params Encoded search parameters
   * @private
   */
  private _searchRequestFromUrl(params: any) {
    this._searchStore.dispatch(new fromQueryActions.MakeSearchRequest(SearchComponent._loadQueryFromUrl(params)));
  }

  /**
   * Issues search request based on saved search parameters in localstorage
   *
   * @private
   */
  private _searchRequestFromLocalStorage() {
    this._searchStore.dispatch(new fromQueryActions.MakeSearchRequest(SearchComponent._loadQueryFromLocalStorage()));
  }

  /**
   * Decodes basket information from url and loads the basket into state store
   *
   * @param {Object} params Encoded basket information
   * @private
   */
  private _loadBasketFromUrl(params: any) {
    const compressedBasket = params.get("basket");
    const basketFromLink = JSON.parse(LZString.decompressFromEncodedURIComponent(compressedBasket));
    const hash = randomHashCode();
    this._searchStore.dispatch(new fromBasketActions.ClearBaskets());
    this._searchStore.dispatch(new fromBasketActions.AddBasket({basket: {...basketFromLink, id: hash}}));

    this._searchStore.dispatch(new fromBasketActions.SelectBasket({id: hash}));
  }

  /**
   * Loads saved search queries from localstorage
   *
   * @private
   */
  private _loadSavedSearchQueries() {
    const localStorageSavedUserQueries = localStorage.getItem("savedUserQueries");
    if (localStorageSavedUserQueries) {
      this._searchStore.dispatch(new fromSavedQueryActions.AddSavedQueries({savedQueries: JSON.parse(localStorageSavedUserQueries)}));
    }
  }

  /**
   * Loads basket from localstorage
   * @private
   */
  private _loadBasketFromLocalStorage() {
    const parsedBaskets = JSON.parse(localStorage.getItem("savedBaskets")).map((x: any) => {
      return {...x, id: randomHashCode()}
    });
    this._searchStore.dispatch(new fromBasketActions.ClearBaskets());
    this._searchStore.dispatch(new fromBasketActions.AddBaskets({baskets: parsedBaskets}));
    this._searchStore.dispatch(new fromBasketActions.SelectBasket({id: parsedBaskets[0].id}));
  }

  /**
   * Builds initial basket
   *
   * @private
   */
  private _generateInitialBasket() {
    const hash = randomHashCode();
    this._searchStore.dispatch(new fromBasketActions.AddBasket({
      basket: {
        id: hash,
        name: 'Meine Merkliste 1',
        ids: [],
        queryParams: {
          rows: environment.queryParams.rows,
          start: environment.queryParams.start,
          sortField: environment.queryParams.sortField,
          sortDir: environment.queryParams.sortDir,
        }
      }
    }));
    this._searchStore.dispatch(new fromBasketActions.SelectBasket({id: hash}));
  }

  /**
   * Writes current query parameters, saved search queries and saved baskets to localstorage
   *
   * @private
   */
  private _writeToLocalStorage() {
    localStorage.setItem("userQuery", JSON.stringify(this._combinedQuery));
    localStorage.setItem("savedUserQueries", JSON.stringify(this._savedQueries));
    localStorage.setItem("savedBaskets", JSON.stringify(this._baskets));
  }
}

//Bug: Enter in Suchfeld

//TODO Slider / Chart
//TODO elasticsearch vs. solr-service -> data-service mit useconfig
//TODO i18n AND OR -> UND / ODER
//TODO Baum-Suche
//TODO Merklisten / Anfragen umsortieren

//Bereiche ein- / ausblenden

//TODO style zu CSS umarbeiten
//TODO Merklisten Export
//TODO Trefferliste pills / paging mit position absolute
//We write the choice in the term to see it in the input
//Filters als property (FormGroup)
//mehrere Felder für Sortierung
//Filter in Uebersicht oben anzeigen
//Overflow bei Facetten scroll-y
