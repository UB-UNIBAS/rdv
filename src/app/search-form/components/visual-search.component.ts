import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';

import {environment} from '../../../environments/environment';
import * as fromSearch from "../reducers";
import * as fromLayoutActions from "../actions/layout.actions";

@Component({
  selector: 'app-visual-search',
  template: `
    <!-- DIV-Container fuer Tab-Links -->
    <nav class="nav nav-pills"
         id="facet-pills-tab"
         role="tablist">

      <!-- Tab-Ueberschriften fuer Facetten als Pills-Link -->
      <a *ngFor="let key of facetFieldsConfig | objectKeys"
         class="nav-link text-sm-center px-2 py-0"
         [ngClass]="'order-' + facetFieldsConfig[key].order"
         [class.active]="facetFieldsConfig[key].order == 1"
         [id]="'facet-pills-'+key+'-tab'"
         data-toggle="pill"
         href="#"
         (click)="changeView('facet-pills-'+key)"
         role="tab"
         aria-controls="'pills-'+key"
         aria-expanded="true">{{facetFieldsConfig[key].label}}</a>

      <!-- Tab-Ueberschriften fuer Ranges als Pills-Link -->
      <a *ngFor="let key of rangeFieldsConfig | objectKeys"
         class="nav-link text-sm-center px-2 py-0"
         [ngClass]="'order-' + rangeFieldsConfig[key].order"
         [class.active]="rangeFieldsConfig[key].order == 1"
         id="facet-pills-{{key}}-tab"
         data-toggle="pill"
         href="#"
         (click)="changeView('facet-pills-'+key)"
         role="tab"
         aria-controls="'facet-pills-'+key"
         aria-expanded="true">{{rangeFieldsConfig[key].label}}</a>
    </nav>

    <!-- DIV-Container fuer Tab-Inhalte -->
    <div style="height: 300px; overflow-y: scroll;"
         class="tab-content mt-2"
         id="facet-pills-tabContent">
      <app-facets></app-facets>
      <app-ranges></app-ranges>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisualSearchComponent {
  rangeFieldsConfig: any;
  facetFieldsConfig: any;

  constructor(private _searchStore: Store<fromSearch.State>) {
    this.rangeFieldsConfig = environment.rangeFields;
    this.facetFieldsConfig = environment.facetFields;
  }

  changeView(view: string) {
    this._searchStore.dispatch(new fromLayoutActions.ShowFacetOrRange(view));
  }
}
