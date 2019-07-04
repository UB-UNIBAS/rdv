import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchComponent} from './components/search.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ChartsModule} from 'ng2-charts';
import {IonRangeSliderModule} from 'ng2-ion-range-slider';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {ClipboardModule} from 'ngx-clipboard';
import {RouterModule} from '@angular/router';
import {ParamsSetComponent} from './components/params-set.component';
import {CopyLinkComponent} from './components/copy-link.component';
import {SaveQueryComponent} from './components/save-query.component';
import {ManageSavedQueriesComponent} from './components/manage-saved-queries.component';
import {BasketListComponent} from './components/basket-list.component';
import {FieldsComponent} from './components/fields.component';
import {FiltersComponent} from './components/filters.component';
import {VisualSearchComponent} from './components/visual-search.component';
import {PipesModule} from '../shared/pipes';
import {StoreModule} from '@ngrx/store';
import * as fromSearch from './reducers';
import {ManageSearchComponent} from './components/manage-search.component';
import {SearchParamsComponent} from './components/search-params.component';
import {EffectsModule} from '@ngrx/effects';
import {QueryEffects} from './effects/query.effects';
import {FacetsComponent} from './components/facets.component';
import {RangesComponent} from './components/ranges.component';
import {FormEffects} from './effects/form.effects';
import {ResultListsComponent} from './components/result-lists.component';
import {BasketResultsListComponent} from './components/basket-results-list.component';
import {SearchResultsListComponent} from './components/search-results-list.component';
import {BasketIconComponent} from './components/basket-icon.component';
import {ExportResultsListComponent} from './components/export-results-list.component';
import {DisplayLinkDirective} from "./shared/directives/display-link.directive";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {DetailedRequestInterceptor} from "../shared/services/detailed-request-interceptor.service";
import {ResultRowComponent} from './components/result-row.component';
import {ResultPagingComponent} from './components/result-paging.component';
import {ResultHeaderComponent} from './components/result-header.component';
import {RowsPerPageComponent} from './components/rows-per-page.component';
import {BasketRequestInterceptor} from "../shared/services/basket-request-interceptor.service";
import {SearchRequestInterceptor} from "../shared/services/search-request-interceptor.service";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChartsModule,
    // IonRangeSliderModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    ClipboardModule,
    PipesModule,
    RouterModule,
    StoreModule.forFeature('search', fromSearch.reducers),
    EffectsModule.forFeature([QueryEffects, FormEffects]),
  ],
  declarations: [
    SearchComponent,
    ManageSearchComponent,
    SearchParamsComponent,
    ParamsSetComponent,
    CopyLinkComponent,
    SaveQueryComponent,
    ManageSavedQueriesComponent,
    BasketListComponent,
    FieldsComponent,
    FiltersComponent,
    VisualSearchComponent,
    FacetsComponent,
    RangesComponent,
    ResultListsComponent,
    BasketResultsListComponent,
    SearchResultsListComponent,
    BasketIconComponent,
    ExportResultsListComponent,
    DisplayLinkDirective,
    ResultRowComponent,
    ResultPagingComponent,
    ResultHeaderComponent,
    RowsPerPageComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SearchRequestInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DetailedRequestInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasketRequestInterceptor,
      multi: true,
    },
  ],
  exports: [
    SearchComponent
  ],
})
export class SearchFormModule {
}
