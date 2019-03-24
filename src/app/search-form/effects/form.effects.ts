import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { FormActionTypes, RangeBoundariesChanged, UpdateRangeBoundaries } from '../actions/form.actions';
import { debounceTime, map } from 'rxjs/operators';


@Injectable()
export class FormEffects {

  @Effect()
  rangeBoundariesChanged$ = this.actions$.pipe(
    ofType(FormActionTypes.RangeBoundariesChanged),
    debounceTime(250),
    map((action: RangeBoundariesChanged) => new UpdateRangeBoundaries(action.payload))
  );

  constructor(private actions$: Actions) {
  }
}
