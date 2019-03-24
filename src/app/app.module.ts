import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './core/containers/app.component';
import { SearchComponent } from './search-form/components/search.component';
import { SearchFormModule } from './search-form/search-form.module';
import { backendSearchServiceProvider } from './shared/services/backend-search.service.provider';
import { StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { CoreModule } from './core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { RemoteFilterConfigsEffects } from './core/effects/remote-filter-configs.effects';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    SearchFormModule,
    CoreModule,
    RouterModule.forRoot([
      {path: '', component: SearchComponent},
      {path: '**', component: SearchComponent}
    ]),
    StoreModule.forRoot(reducers, {metaReducers}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([RemoteFilterConfigsEffects]),
  ],
  providers: [backendSearchServiceProvider],
  bootstrap: [AppComponent]
})
export class AppModule {
}
