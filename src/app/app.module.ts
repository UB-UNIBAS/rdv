import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SearchComponent } from './search-form/containers/search.component';
import { AboutComponent } from './components/about/about.component'
import { LandingPageComponent } from './containers/landing-page/landing-page.component';

import { UserConfigService } from 'app/services/user-config.service';
import { SearchFormModule } from './search-form/search-form.module';
import { backendSearchServiceProvider } from './services/backend-search.service.provider';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    LandingPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SearchFormModule,
    RouterModule.forRoot([
      {path: '', component: SearchComponent},
      {path: 'doc/:id', component: LandingPageComponent},
      {path: 'about', component: AboutComponent},
      {path: '**', component: SearchComponent}
    ]),
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [
    backendSearchServiceProvider,
    UserConfigService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
