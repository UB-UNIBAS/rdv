import { FormActions, FormActionTypes } from '../actions/form.actions';
import { environment } from '../../../environments/environment';

export interface State {
  facetFields: any;
  filterFields: any;
  rangeFields: any;
  searchFields: any;
}

export const initialState: State = {
  facetFields: Object.keys(environment.facetFields).reduce((agg, k) => {
    agg[k] = {
      field: environment.facetFields[k].field,
      values: [],
      operator: environment.facetFields[k].operator,
    };
    return agg;
  }, {}),
  filterFields: Object.keys(environment.filterFields).reduce((agg, k) => {
    agg[k] = {
      field: environment.filterFields[k].field,
      values: environment.filterFields[k].options.map(x => x.value),
    };
    return agg;
  }, {}),
  rangeFields: Object.keys(environment.rangeFields).reduce((agg, k) => {
    agg[k] = {
      field: environment.rangeFields[k].field,
      min: environment.rangeFields[k].min,
      from: environment.rangeFields[k].from,
      to: environment.rangeFields[k].to,
      max: environment.rangeFields[k].max,
      showMissingValues: environment.rangeFields[k].showMissingValues,
    };
    return agg;
  }, {}),
  searchFields: environment.searchFields.preselect.reduce((agg, k, index) => {
    agg['search' + index] = {
      field: k,
      value: '',
    };
    return agg;
  }, {}),
};


export function reducer(state = initialState, action: FormActions): State {
  switch (action.type) {

    case FormActionTypes.UpdateEntireForm:
      return {
        ...action.payload
      };

    case FormActionTypes.ToggleFilterValue:
      return {
        ...state,
        filterFields: Object.keys(state['filterFields']).reduce((agg, k) => {
          agg[k] = k === action.payload.filter ?
            {
              ...state.filterFields[k],
              values: state.filterFields[k].values.includes(action.payload.value) ?
                state.filterFields[k].values.filter(x => x !== action.payload.value) :
                state.filterFields[k].values.concat(action.payload.value)
            } :
            state['filterFields'][k];
          return agg;
        }, {}),
      };

    case FormActionTypes.UpdateSearchFieldType:
      return {
        ...state,
        searchFields: Object.keys(state['searchFields']).reduce((agg, k) => {
          agg[k] = k === action.payload.field ?
            {...state.searchFields[k], field: action.payload.type} :
            state['searchFields'][k];
          return agg;
        }, {}),
      };

    case FormActionTypes.UpdateSearchFieldValue:
      return {
        ...state,
        searchFields: Object.keys(state['searchFields']).reduce((agg, k) => {
          agg[k] = k === action.payload.field ?
            {...state.searchFields[k], value: action.payload.value} :
            state['searchFields'][k];
          return agg;
        }, {}),
      };

    case FormActionTypes.AddFacetValue:
      return {
        ...state,
        facetFields: Object.keys(state['facetFields']).reduce((agg, k) => {
          agg[k] = k === action.payload.facet ?
            {...state.facetFields[k], values: state.facetFields[k].values.concat(action.payload.value)} :
            state['facetFields'][k];
          return agg;
        }, {}),
      };

    case FormActionTypes.RemoveFacetValue:
      return {
        ...state,
        facetFields: Object.keys(state['facetFields']).reduce((agg, k) => {
          agg[k] = k === action.payload.facet ?
            {...state.facetFields[k], values: state.facetFields[k].values.filter(x => x !== action.payload.value)} :
            state['facetFields'][k];
          return agg;
        }, {}),
      };

    case FormActionTypes.UpdateFacetOperator:
      return {
        ...state,
        facetFields: Object.keys(state['facetFields']).reduce((agg, k) => {
          agg[k] = k === action.payload.facet ?
            {...state.facetFields[k], operator: action.payload.value} :
            state['facetFields'][k];
          return agg;
        }, {}),
      };

    case FormActionTypes.UpdateRangeBoundaries:
      return {
        ...state,
        rangeFields: Object.keys(state['rangeFields']).reduce((agg, k) => {
          agg[k] = k === action.payload.key ?
            {...state.rangeFields[k], from: action.payload.from, to: action.payload.to} :
            state['rangeFields'][k];
          return agg;
        }, {}),
      };

    case FormActionTypes.ShowMissingValuesInRange:
      return {
        ...state,
        rangeFields: Object.keys(state['rangeFields']).reduce((agg, k) => {
          agg[k] = k === action.payload ?
            {...state.rangeFields[k], showMissingValues: !state.rangeFields[k].showMissingValues} :
            state['rangeFields'][k];
          return agg;
        }, {})
      };

    case FormActionTypes.ResetRange:
      return {
        ...state,
        rangeFields: Object.keys(environment.rangeFields).reduce((agg, k) => {
          agg[k] = action.payload === k ? {
              field: environment.rangeFields[k].field,
              min: environment.rangeFields[k].min,
              from: environment.rangeFields[k].from,
              to: environment.rangeFields[k].to,
              max: environment.rangeFields[k].max,
              showMissingValues: environment.rangeFields[k].showMissingValues,
            } :
            state.rangeFields[k];
          return agg;
        }, {}),
      };

    case FormActionTypes.ResetAll:
      return initialState;

    default:
      return state;
  }
}
