import {Action} from '@ngrx/store';
import {SavedQuery} from '../models/saved-query.model';

/***
 * Provides action types for managing saved queries
 */
export enum SavedQueryActionTypes {
  AddSavedQuery = '[SavedQuery] Add SavedQuery',
  AddSavedQueries = '[SavedQuery] Add SavedQueries',
  DeleteSavedQuery = '[SavedQuery] Delete SavedQuery',
}

export class AddSavedQuery implements Action {
  readonly type = SavedQueryActionTypes.AddSavedQuery;

  constructor(public payload: { savedQuery: SavedQuery }) {
  }
}

export class AddSavedQueries implements Action {
  readonly type = SavedQueryActionTypes.AddSavedQueries;

  constructor(public payload: { savedQueries: SavedQuery[] }) {
  }
}

export class DeleteSavedQuery implements Action {
  readonly type = SavedQueryActionTypes.DeleteSavedQuery;

  constructor(public payload: { id: string }) {
  }
}

export type SavedQueryActions =
  AddSavedQuery
  | AddSavedQueries
  | DeleteSavedQuery;
