import * as fromActions from '../actions/layout.actions';
import { environment } from '../../../environments/environment';


export interface State {
  shownFacetOrRange: string;
}

const facetsAndRanges = {...environment.rangeFields, ...environment.facetFields};

export const initialState: State = {
  shownFacetOrRange: 'facet-pills-' + Object.keys(facetsAndRanges).filter(k => facetsAndRanges[k].order === 1)[0],
};


export function reducer(state = initialState, action: fromActions.LayoutActions): State {
  switch (action.type) {

    case fromActions.LayoutActionTypes.ShowFacetOrRange:
      return {
        ...state,
        shownFacetOrRange: action.payload,
      };

    default:
      return state;
  }
}
