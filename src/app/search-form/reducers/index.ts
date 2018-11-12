import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromForm from './form.reducer';
import * as fromLayout from './layout.reducer';
import * as fromRoot from '../../reducers';
import { memoize } from '../../shared/utils';


export interface SearchState {
  form: fromForm.State;
  layout: fromLayout.State;
}

export interface State extends fromRoot.State {
  search: SearchState;
}

export const reducers: ActionReducerMap<SearchState> = {
  form: fromForm.reducer,
  layout: fromLayout.reducer,
};

export const getSearch = createFeatureSelector<State, SearchState>('search');

export const getLayout = createSelector(
  getSearch,
  (state) => state.layout,
);

export const getFormValues = createSelector(
  getSearch,
  (state) => state.form,
);

export const getRangeValues = createSelector(
  getFormValues,
  (formValues) => formValues.rangeFields,
);

export const getRangeValuesByKey = createSelector(
  getRangeValues,
  (rangeFields) => memoize((key: string) => rangeFields[key]),
);

export const getFacetValues = createSelector(
  getFormValues,
  (formValues) => formValues.facetFields,
);

export const getFacetValuesByKey = createSelector(
  getFacetValues,
  (facetFields) => memoize((key: string) => facetFields[key]),
);

export const getShownFacetOrRange = createSelector(
  getLayout,
  (state) => state.shownFacetOrRange,
);

export const getSearchValues = createSelector(
  getFormValues,
  (formValues) => formValues.searchFields,
);

export const getSearchValuesByKey = createSelector(
  getSearchValues,
  (searchFields) => memoize((key: string) => searchFields[key]),
);

export const getFilterValues = createSelector(
  getFormValues,
  (formValues) => formValues.filterFields,
);

export const getFilterValuesByKey = createSelector(
  getFilterValues,
  (filters) => memoize((key: string) => filters[key])
);
