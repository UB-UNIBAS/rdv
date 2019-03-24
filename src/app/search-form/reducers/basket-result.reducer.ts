import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {BasketResult} from '../models/basket-result.model';
import {BasketResultActions, BasketResultActionTypes} from '../actions/basket-result.actions';

export interface State extends EntityState<BasketResult> {
  // additional entities state properties
}

export const adapter: EntityAdapter<BasketResult> = createEntityAdapter<BasketResult>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: BasketResultActions
): State {
  switch (action.type) {
    case BasketResultActionTypes.AddBasketResults: {
      return adapter.addMany(action.payload.basketResults, state);
    }

    case BasketResultActionTypes.ClearBasketResults: {
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
