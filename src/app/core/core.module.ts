import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './components/about.component';
import { AppComponent } from './containers/app.component';
import { DetailedViewComponent } from './containers/detailed-view.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header.component';

const COMPONENTS = [
  AboutComponent,
  AppComponent,
  FooterComponent,
  HeaderComponent,
  DetailedViewComponent,
];

/**
 * Contains components for core functionalities and handles state for dynamically loaded filter settings
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: 'doc/:id', component: DetailedViewComponent},
      {path: 'about', component: AboutComponent},
    ]),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class CoreModule {
}
