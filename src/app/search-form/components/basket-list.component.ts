import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromBasketActions from '../actions/basket.actions';
import * as fromSearch from '../reducers';
import { environment } from '../../../environments/environment';
import { randomHashCode } from '../../shared/utils';

/**
 * Lists currently available baskets
 */
@Component({
  selector: 'app-basket-list',
  template: `
    <div class="mt-2 no-gutters">
      <div class="h6">Meine Merklisten</div>
      <button class="btn btn-primary btn-sm fa fa-plus mb-2" (click)="createBasket()"></button>

      <!-- Liste der gespeicherten Baskets -->
      <div class="no-gutters">
        <div *ngFor="let i of basketIds$ | async"
             class="input-group input-group-sm col-md-10 mt-1">

          <!-- Button "Merkliste laden" -->
          <span class="input-group-btn">
              <button class="btn btn-primary fa fa-circle-o"
                      [class.fa-dot-circle-o]="i === (currentBasketId$ | async)"
                      type="button"
                      (click)="loadBasket(i)"></button>
            </span>

          <!-- Name des Baskets -->
          <input type="text"
                 #basketName
                 class="form-control col-md-5"
                 title="Name des Baskets"
                 [value]="(basketEntities$ | async)[i].name"
                 (keyup)="updateBasketName(i, basketName.value)">

          <!-- Anzahl der Titel in dieser Merkliste -->
          <span class="btn btn-sm">
              {{(basketEntities$ | async)[i].ids.length + ' Titel'}}
            </span>

          <!-- Button "Link kopieren" -->
          <span class="input-group-btn">
              <app-copy-link [data]="(basketEntities$ | async)[i]" [mode]="'basket'"></app-copy-link>
            </span>

          <!-- Button "Merkliste loeschen" -->
          <span class="input-group-btn">
              <button class="btn btn-danger fa fa-trash"
                      type="button"
                      (click)="deleteBasket(i)"></button>
            </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .input-group-btn select {
      border-color: #ccc;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketListComponent {
  /**
   * Object of available baskets
   */
  basketEntities$: Observable<any>;
  /**
   * Ids of all baskets
   */
  basketIds$: Observable<any>;
  /**
   * Id of selected basket
   */
  currentBasketId$: Observable<any>;

  /**
   * @ignore
   */
  private _basketEntities: any;
  /**
   * @ignore
   */
  private _nextId: number;
  /**
   * @ignore
   */
  private _currentBasketId: string;
  /**
   * @ignore
   */
  private _basketIds: string[];

  /**
   * @ignore
   */
  constructor(private _searchStore: Store<fromSearch.State>) {
    this.basketEntities$ = this._searchStore.pipe(select(fromSearch.getBasketEntities));
    this.basketEntities$.subscribe(entities => this._basketEntities = entities);
    this.basketIds$ = this._searchStore.pipe(select(fromSearch.getBasketIds));
    this.basketIds$.subscribe((ids: string[]) => {
      this._basketIds = ids;
      this._nextId = ids.length;
    });
    this.currentBasketId$ = this._searchStore.pipe(select(fromSearch.getCurrentBasketId));
    this.currentBasketId$.subscribe(id => this._currentBasketId = id)
  }

  /**
   * Loads another basket by id
   *
   * @param index
   */
  loadBasket(index: string) {
    this._searchStore.dispatch(new fromBasketActions.SelectBasket({id: index}));
  }

  /**
   * Creates a new basket
   */
  createBasket() {
    const hash = randomHashCode();
    this._searchStore.dispatch(new fromBasketActions.AddBasket(
      {
        basket: {
          id: hash,
          name: 'Meine Merkliste ' + this._nextId,
          ids: [],
          queryParams: {
            rows: environment.queryParams.rows,
            start: environment.queryParams.start,
            sortField: environment.queryParams.sortField,
            sortDir: environment.queryParams.sortDir,
          }
        }
      }
    ));
    this._searchStore.dispatch(new fromBasketActions.SelectBasket({id: hash}));
    // this.basketsService.createBasket();
  }

  /**
   * Removes a basket by id
   *
   * @param {string} index Basket id
   */
  deleteBasket(index: string) {
    if (index === this._currentBasketId) {
      if (this._basketIds.length <= 1) {
        this.createBasket();
      } else {
        this._searchStore.dispatch(new fromBasketActions.SelectBasket({
          id: this._basketIds.filter(id => id !== index)[0]
        }))
      }
    }
    this._searchStore.dispatch(new fromBasketActions.DeleteBasket({id: index}));
  }

  /**
   * Update name of basket
   * @param {number} index Index of basket in baskets' list
   * @param {string} name New name of basket
   */
  updateBasketName(index: number, name: string) {
    this._searchStore.dispatch(new fromBasketActions.UpsertBasket({
      basket: {
        ...this._basketEntities[index],
        name: name,
      }
    }));
  }
}
