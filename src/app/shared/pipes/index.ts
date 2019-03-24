import { NgModule } from '@angular/core';
import { ObjectKeysPipe } from './object-keys.pipe';

const PIPES = [
  ObjectKeysPipe,
];

@NgModule({
  declarations: PIPES,
  exports: PIPES,
})
export class PipesModule {
}
