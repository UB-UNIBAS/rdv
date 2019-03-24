import {Action} from '@ngrx/store';
import {Result} from '../models/result.model';

/***
 * Provides action types for managing the result list
 */
export enum ResultActionTypes {
  AddResults = '[Result] Add Results',
  ClearResults = '[Result] Clear Results'
}

export class AddResults implements Action {
  readonly type = ResultActionTypes.AddResults;

  constructor(public payload: { results: Result[] }) {
  }
}

export class ClearResults implements Action {
  readonly type = ResultActionTypes.ClearResults;
}

export type ResultActions =
  AddResults
  | ClearResults;
