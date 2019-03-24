import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromRemoteFilterConfigs from '../core/reducers/remote-filter-configs.reducer';
import { memoize } from '../shared/utils';


export interface State {
  userConfig: fromRemoteFilterConfigs.State;
}

export const reducers: ActionReducerMap<State> = {
  userConfig: fromRemoteFilterConfigs.reducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];


export const getUserConfigState = createFeatureSelector<State, fromRemoteFilterConfigs.State>(
  'userConfig'
);

export const getFilterFields = createSelector(
  getUserConfigState,
  (userConfig) => userConfig.filterFields,
);

export const getFilterFieldsByKey = createSelector(
  getFilterFields,
  (filterFields) => memoize((key: string) => filterFields[key]),
);
