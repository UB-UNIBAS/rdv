import * as fromActions from '../actions/query.actions';
import {environment} from '../../../environments/environment';

export interface State {
  offset: number;
  rows: number;
  sortField: string;
  sortOrder: string;
}


export const initialState: State = {
  offset: environment.queryParams.start,
  rows: environment.queryParams.rows,
  sortField: environment.queryParams.sortField,
  sortOrder: environment.queryParams.sortDir,
};


export function reducer(state = initialState, action: fromActions.QueryActions): State {
  switch (action.type) {

    case fromActions.QueryActionTypes.SetOffset:
      return {
        ...state,
        offset: action.payload,
      };

    case fromActions.QueryActionTypes.SetRows:
      return {
        ...state,
        rows: action.payload,
      };

    case fromActions.QueryActionTypes.SetSortField:
      return {
        ...state,
        sortField: action.payload,
      };

    case fromActions.QueryActionTypes.SetSortOrder:
      return {
        ...state,
        sortOrder: action.payload,
      };

    default:
      return state;
  }
}
