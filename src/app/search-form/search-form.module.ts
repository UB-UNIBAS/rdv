import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './containers/search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ClipboardModule } from 'ngx-clipboard';
import { RouterModule } from '@angular/router';
import { ParamsSetComponent } from './containers/params-set.component';
import { CopyLinkComponent } from './components/copy-link.component';
import { SaveQueryComponent } from './containers/save-query.component';
import { ManageSavedQueriesComponent } from './containers/manage-saved-queries.component';
import { BasketListComponent } from './containers/basket-list.component';
import { ResultsComponent } from './containers/results.component';
import { FieldsComponent } from './components/fields.component';
import { FiltersComponent } from './components/filters.component';
import { VisualSearchComponent } from './containers/visual-search.component';
import { QueriesStoreService } from './services/queries-store.service';
import { BasketsService } from './services/baskets.service';
import { BasketsStoreService } from './services/baskets-store.service';
import { FormService } from './services/form.service';
import { QueriesService } from './services/queries.service';
import { UpdateQueryService } from './services/update-query.service';
import { SliderService } from './services/slider.service';
import { PipesModule } from '../shared/pipes';
import { StoreModule } from '@ngrx/store';
import * as fromSearch from './reducers';
import { ManageSearchComponent } from './containers/manage-search.component';
import { SearchParamsComponent } from './containers/search-params.component';
import { EffectsModule } from '@ngrx/effects';
import { FormEffects } from './effects/form.effects';
import { QueryEffects } from './effects/query.effects';
import { OptionSelectorComponent } from './components/option-selector.component';
import { FacetsComponent } from './containers/facets.component';
import { RangesComponent } from './containers/ranges.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChartsModule,
    IonRangeSliderModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    ClipboardModule,
    PipesModule,
    RouterModule,
    StoreModule.forFeature('search', fromSearch.reducers),
    EffectsModule.forFeature([FormEffects, QueryEffects]),
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
    ResultsComponent,
    FieldsComponent,
    FiltersComponent,
    VisualSearchComponent,
    OptionSelectorComponent,
    FacetsComponent,
    RangesComponent,
  ],
  exports: [
    SearchComponent
  ],
  providers: [
    BasketsService,
    BasketsStoreService,
    FormService,
    QueriesService,
    QueriesStoreService,
    SliderService,
    UpdateQueryService
  ]
})
export class SearchFormModule {
}
