import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Basket} from '../models/basket.model';
import {BasketActions, BasketActionTypes} from '../actions/basket.actions';

export interface State extends EntityState<Basket> {
  selectedBasketId: string | null;
}

export const adapter: EntityAdapter<Basket> = createEntityAdapter<Basket>();

export const initialState: State = adapter.getInitialState({
  selectedBasketId: null,
});

export function reducer(
  state = initialState,
  action: BasketActions
): State {
  switch (action.type) {
    case BasketActionTypes.AddBasket: {
      return adapter.addOne(action.payload.basket, state);
    }

    case BasketActionTypes.UpsertBasket: {
      return adapter.upsertOne(action.payload.basket, state);
    }

    case BasketActionTypes.AddBaskets: {
      return adapter.addMany(action.payload.baskets, state);
    }

    case BasketActionTypes.UpdateBasket: {
      return adapter.updateOne(action.payload.basket, state);
    }

    case BasketActionTypes.DeleteBasket: {
      return adapter.removeOne(action.payload.id, state);
    }

    case BasketActionTypes.ClearBaskets: {
      return adapter.removeAll({...state, selectedBasketId: null});
    }

    case BasketActionTypes.SelectBasket: {
      return Object.assign({...state, selectedBasketId: action.payload.id})
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

export const selectCurrentBasketId = (state: State) => state.selectedBasketId;
