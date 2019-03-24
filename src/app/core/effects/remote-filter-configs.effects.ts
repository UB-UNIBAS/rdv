import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import * as fromActions from '../actions/remote-filter-configs.actions';

/**
 * Effects for configuration changes at runtime
 */
@Injectable()
export class RemoteFilterConfigsEffects {

  /**
   * Requests document data from backend on action {@link GetRemoteFilterFieldOptions}
   */
  @Effect()
  remoteFilterFieldOptions$ = this._actions$.pipe(
    ofType(fromActions.RemoteFilterConfigsActionTypes.GetRemoteFilterFieldOptions),
    map((action: fromActions.GetRemoteFilterFieldOptions) =>
      this._http.get(action.payload.url)
        .subscribe(
          (res: string) => new fromActions.SetRemoteFilterFieldOptions({key: action.payload.key, value: res}),
          (err) => new fromActions.OptionRetrieveError(err))));

  /**
   * @ignore
   */
  constructor(private _actions$: Actions, private _http: HttpClient) {
  }
}
