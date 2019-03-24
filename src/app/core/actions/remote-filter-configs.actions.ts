import { Action } from '@ngrx/store';

/**
 * Action types for filter configuration changes at runtime
 */
export enum RemoteFilterConfigsActionTypes {
  GetRemoteFilterFieldOptions = '[UserConfig] Get Remote Filter Field Options',
  SetRemoteFilterFieldOptions = '[UserConfig] Set Remote Filter Field Options',
  OptionRetrieveError = '[UserConfig] Option Retrieve Error',
}


/**
 * Action triggered when remote filter field options are required
 */
export class GetRemoteFilterFieldOptions implements Action {
  /**
   * @ignore
   */
  readonly type = RemoteFilterConfigsActionTypes.GetRemoteFilterFieldOptions;

  /**
   * Contains filter name and URL pointing to remote value
   * @param {Object} payload Object with key and URL
   */
  constructor(public payload: { key: string, url: string }) {
  }
}

/**
 * Action triggered when remote filter field options were received
 */
export class SetRemoteFilterFieldOptions implements Action {
  /**
   * @ignore
   */
  readonly type = RemoteFilterConfigsActionTypes.SetRemoteFilterFieldOptions;

  /**
   * Contains fetched value for filter
   * @param {Object} payload Object with key and fetched value
   */
  constructor(public payload: { key: string, value: string }) {
  }
}

/**
 * Action triggered when remote filter field options request was unsuccessful
 */
export class OptionRetrieveError implements Action {
  /**
   * @ignore
   */
  readonly type = RemoteFilterConfigsActionTypes.OptionRetrieveError;

  /**
   * Contains error
   * @param {Object} payload Error
   */
  constructor(public payload: any) {
  }
}


/**
 * @ignore
 */
export type RemoteFilterConfigsActions
  = GetRemoteFilterFieldOptions
  | SetRemoteFilterFieldOptions
  | OptionRetrieveError;
