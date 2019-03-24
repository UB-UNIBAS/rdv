import {Action} from '@ngrx/store';
import {DetailedResult} from '../models/detailed-result.model';

/***
 * Provides action types for managing detailed information on results
 */
export enum DetailedResultActionTypes {
  AddDetailedResult = '[DetailedBasketResult] Add DetailedBasketResult',
  DeleteDetailedResult = '[DetailedBasketResult] Delete DetailedBasketResult',
  ClearDetailedResults = '[DetailedBasketResult] Clear DetailedBasketResults',
}


export class AddDetailedResult implements Action {
  readonly type = DetailedResultActionTypes.AddDetailedResult;

  constructor(public payload: { detailedResult: DetailedResult }) {
  }
}

export class DeleteDetailedResult implements Action {
  readonly type = DetailedResultActionTypes.DeleteDetailedResult;

  constructor(public payload: { id: string }) {
  }
}

export class ClearDetailedResults implements Action {
  readonly type = DetailedResultActionTypes.ClearDetailedResults;
}

export type DetailedResultActions =
  | AddDetailedResult
  | DeleteDetailedResult
  | ClearDetailedResults;
