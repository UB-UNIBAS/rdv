import {Action} from '@ngrx/store';

/***
 * Provides action types for handling requests
 */
export enum QueryActionTypes {
  MakeSearchRequest = '[Query] Make search request',
  MakeDetailedSearchRequest = '[Query] Make detailed search request',
  MakeBasketSearchRequest = '[Query] Make basket request',
  SetOffset = '[Query] Set offset of result view',
  SetRows = '[Query] Set number of results per page',
  SetSortField = '[Query] Set sort field',
  SetSortOrder = '[Query] Set sort order',
  SearchSuccess = '[Query] Search successful',
  SearchFailure = '[Query] Search failed',
  DetailedSearchSuccess = '[Query] Detailed search successful',
  DetailedSearchFailure = '[Query] Detailed search failed',
  BasketSearchSuccess = '[Query] Basket search successful',
  BasketSearchFailure = '[Query] Basket search failed',
}

export class MakeSearchRequest implements Action {
  readonly type = QueryActionTypes.MakeSearchRequest;

  constructor(public payload: any) {
  }
}

export class MakeDetailedSearchRequest implements Action {
  readonly type = QueryActionTypes.MakeDetailedSearchRequest;

  constructor(public payload: any) {
  }
}

export class MakeBasketSearchRequest implements Action {
  readonly type = QueryActionTypes.MakeBasketSearchRequest;

  constructor(public payload: any) {
  }
}

export class SetOffset implements Action {
  readonly type = QueryActionTypes.SetOffset;

  constructor(public payload: number) {
  }
}

export class SetRows implements Action {
  readonly type = QueryActionTypes.SetRows;

  constructor(public payload: number) {
  }
}

export class SetSortOrder implements Action {
  readonly type = QueryActionTypes.SetSortOrder;

  constructor(public payload: string) {
  }
}

export class SetSortField implements Action {
  readonly type = QueryActionTypes.SetSortField;

  constructor(public payload: string) {
  }
}

export class SearchSuccess implements Action {
  readonly type = QueryActionTypes.SearchSuccess;

  constructor(public payload: any) {
  }
}

export class SearchFailure implements Action {
  readonly type = QueryActionTypes.SearchFailure;

  constructor(public payload: string) {
  }
}

export class DetailedSearchSuccess implements Action {
  readonly type = QueryActionTypes.DetailedSearchSuccess;

  constructor(public payload: any) {
  }
}

export class DetailedSearchFailure implements Action {
  readonly type = QueryActionTypes.DetailedSearchFailure;

  constructor(public payload: string) {
  }
}

export class BasketSearchSuccess implements Action {
  readonly type = QueryActionTypes.BasketSearchSuccess;

  constructor(public payload: any) {
  }
}

export class BasketSearchFailure implements Action {
  readonly type = QueryActionTypes.BasketSearchFailure;

  constructor(public payload: string) {
  }
}

export type QueryActions
  = MakeSearchRequest
  | MakeBasketSearchRequest
  | SetOffset
  | SetRows
  | SetSortField
  | SetSortOrder
  | SearchSuccess
  | SearchFailure
  | BasketSearchSuccess
  | BasketSearchFailure;
