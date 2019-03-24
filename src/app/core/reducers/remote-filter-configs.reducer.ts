import { RemoteFilterConfigsActions, RemoteFilterConfigsActionTypes } from '../actions/remote-filter-configs.actions';
import { environment } from '../../../environments/environment';
import { mergeDeep } from '../../shared/utils';


/**
 * State slice containing remotely fetched filter fields and probably fetching errors
 */
export interface State {
  /**
   * Object of filter fields
   */
  filterFields: any;
  /**
   * Fetching errors (if any)
   */
  error: any;
}


/**
 * @ignore
 */
export const initialState: State = {
  filterFields: environment.filterFields,
  error: '',
};

/**
 * Adds named filter field with options
 *
 * @param {string} key Name of filter field
 * @param {string} value Option
 */
function setFilterOption(key: string, value: string) {
  const filterFields = {filterFields: {}};
  filterFields[key] = {options: value};
  return filterFields;
}

/**
 * @ignore
 */
export function reducer(state = initialState, action: RemoteFilterConfigsActions): State {
  switch (action.type) {

    case RemoteFilterConfigsActionTypes.SetRemoteFilterFieldOptions:
      return mergeDeep(state, setFilterOption(action.payload.key, action.payload.value));

    case RemoteFilterConfigsActionTypes.OptionRetrieveError:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}
