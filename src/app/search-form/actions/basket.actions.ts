import {Action} from '@ngrx/store';
import {Update} from '@ngrx/entity';
import {Basket} from '../models/basket.model';

export enum BasketActionTypes {
  AddBasket = '[Basket] Add Basket',
  UpsertBasket = '[Basket] Upsert Basket',
  AddBaskets = '[Basket] Add Baskets',
  UpdateBasket = '[Basket] Update Basket',
  DeleteBasket = '[Basket] Delete Basket',
  ClearBaskets = '[Basket] Clear Baskets',
  SelectBasket = '[Basket] Select Basket',
}

export class AddBasket implements Action {
  readonly type = BasketActionTypes.AddBasket;

  constructor(public payload: { basket: Basket }) {
  }
}

export class UpsertBasket implements Action {
  readonly type = BasketActionTypes.UpsertBasket;

  constructor(public payload: { basket: Basket }) {
  }
}

export class AddBaskets implements Action {
  readonly type = BasketActionTypes.AddBaskets;

  constructor(public payload: { baskets: Basket[] }) {
  }
}

export class UpdateBasket implements Action {
  readonly type = BasketActionTypes.UpdateBasket;

  constructor(public payload: { basket: Update<Basket> }) {
  }
}

export class DeleteBasket implements Action {
  readonly type = BasketActionTypes.DeleteBasket;

  constructor(public payload: { id: string }) {
  }
}

export class ClearBaskets implements Action {
  readonly type = BasketActionTypes.ClearBaskets;
}

export class SelectBasket implements Action {
  readonly type = BasketActionTypes.SelectBasket;

  constructor(public payload: { id: string }) {
  }
}


export type BasketActions =
  AddBasket
  | UpsertBasket
  | AddBaskets
  | UpdateBasket
  | DeleteBasket
  | ClearBaskets
  | SelectBasket;
