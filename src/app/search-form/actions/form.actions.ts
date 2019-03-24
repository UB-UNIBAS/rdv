import {Action} from '@ngrx/store';

/***
 * Provides action types for managing form settings
 */
export enum FormActionTypes {
  UpdateEntireForm = '[Form] Update entire form',
  ToggleFilterValue = '[Form] Toggle filter in form model',
  UpdateSearchFieldType = '[Form] Update search field type in form model',
  UpdateSearchFieldValue = '[Form] Update search field value in form model',
  AddFacetValue = '[Form] Add facet value in form model',
  RemoveFacetValue = '[Form] Remove facet value in form model',
  UpdateFacetOperator = '[Form] Update Facets in Form Model',
  RangeBoundariesChanged = '[Form] Boundaries for range in form model changed',
  UpdateRangeBoundaries = '[Form] Set new boundaries for range in form model',
  ResetRange = '[Form] Reset Ranges in Form Model',
  ShowMissingValuesInRange = '[Form] Toggle Show Missing Values',
  ResetAll = '[Form] Reset All',
}


export class UpdateEntireForm implements Action {
  readonly type = FormActionTypes.UpdateEntireForm;

  constructor(public payload: any) {
  }
}

export class ToggleFilterValue implements Action {
  readonly type = FormActionTypes.ToggleFilterValue;

  constructor(public payload: { filter: string, value: string }) {
  }
}

export class UpdateSearchFieldType implements Action {
  readonly type = FormActionTypes.UpdateSearchFieldType;

  constructor(public payload: { field: string, type: string }) {
  }
}

export class UpdateSearchFieldValue implements Action {
  readonly type = FormActionTypes.UpdateSearchFieldValue;

  constructor(public payload: { field: string, value: string }) {
  }
}

export class AddFacetValue implements Action {
  readonly type = FormActionTypes.AddFacetValue;

  constructor(public payload: {
    facet: string,
    value: string,
  }) {
  }
}

export class RemoveFacetValue implements Action {
  readonly type = FormActionTypes.RemoveFacetValue;

  constructor(public payload: {
    facet: string,
    value: string,
  }) {
  }
}

export class UpdateFacetOperator implements Action {
  readonly type = FormActionTypes.UpdateFacetOperator;

  constructor(public payload: { facet: string, value: string }) {
  }
}

export class RangeBoundariesChanged implements Action {
  readonly type = FormActionTypes.RangeBoundariesChanged;

  constructor(public payload: {
    key: string,
    from: number,
    to: number,
  }) {
  }
}

export class UpdateRangeBoundaries implements Action {
  readonly type = FormActionTypes.UpdateRangeBoundaries;

  constructor(public payload: {
    key: string,
    from: number,
    to: number,
  }) {
  }
}

export class ResetRange implements Action {
  readonly type = FormActionTypes.ResetRange;

  constructor(public payload: string) {
  }
}

export class ShowMissingValuesInRange implements Action {
  readonly type = FormActionTypes.ShowMissingValuesInRange;

  constructor(public payload: string) {
  }
}

export class ResetAll implements Action {
  readonly type = FormActionTypes.ResetAll;
}


export type FormActions
  = UpdateEntireForm
  | ToggleFilterValue
  | UpdateSearchFieldType
  | UpdateSearchFieldValue
  | AddFacetValue
  | RemoveFacetValue
  | UpdateFacetOperator
  | RangeBoundariesChanged
  | UpdateRangeBoundaries
  | ResetRange
  | ShowMissingValuesInRange
  | ResetAll;
