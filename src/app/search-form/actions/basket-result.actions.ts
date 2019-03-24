import {Action} from '@ngrx/store';
import {BasketResult} from '../models/basket-result.model';

/***
 * Provides action types for managing elements (ie. documents) in one basket
 */
export enum BasketResultActionTypes {
  AddBasketResults = '[BasketResult] Add BasketResults',
  ClearBasketResults = '[BasketResult] Clear BasketResults'
}

export class AddBasketResults implements Action {
  readonly type = BasketResultActionTypes.AddBasketResults;

  constructor(public payload: { basketResults: BasketResult[] }) {
  }
}

export class ClearBasketResults implements Action {
  readonly type = BasketResultActionTypes.ClearBasketResults;
}

export type BasketResultActions =
  AddBasketResults
  | ClearBasketResults;
