import { FacetActions, FacetActionTypes } from '../actions/facet.actions';

export interface State {
  facetFields: any[];
  facetRanges: any[];
  facetQueries: any;
  total: number;
}

export const initialState: State = {
  facetFields: [],
  facetRanges: [],
  facetQueries: {},
  total: 0,
};

export function reducer(state = initialState, action: FacetActions): State {
  switch (action.type) {

    case FacetActionTypes.UpdateFacetFields:
      return {...state, facetFields: action.payload};

    case FacetActionTypes.UpdateFacetRanges:
      return {...state, facetRanges: action.payload};

    case FacetActionTypes.UpdateFacetQueries:
      return {...state, facetQueries: action.payload};

    case FacetActionTypes.UpdateTotal:
      return {...state, total: action.payload};

    case FacetActionTypes.ResetAll:
      return initialState;

    default:
      return state;
  }
}
