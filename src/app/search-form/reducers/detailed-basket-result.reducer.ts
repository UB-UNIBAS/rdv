import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {DetailedResult} from '../models/detailed-result.model';
import {DetailedResultActions, DetailedResultActionTypes} from '../actions/detailed-result.actions';

export interface State extends EntityState<DetailedResult> {
  // additional entities state properties
}

export const adapter: EntityAdapter<DetailedResult> = createEntityAdapter<DetailedResult>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: DetailedResultActions
): State {
  switch (action.type) {
    case DetailedResultActionTypes.AddDetailedResult: {
      return adapter.addOne(action.payload.detailedResult, state);
    }

    case DetailedResultActionTypes.DeleteDetailedResult: {
      return adapter.removeOne(action.payload.id, state);
    }

    case DetailedResultActionTypes.ClearDetailedResults: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
