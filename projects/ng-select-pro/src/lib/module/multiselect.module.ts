import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MultiSelectComponent } from '../components/multiselect/multiselect.component';
import { FilterPipe } from '../pipes/filter.pipe';
import { MULTI_SELECT_DEFAULT_CONFIG } from '../tokens/multiselect.token';
import { IMultiSelectConfig } from '../models/multiselect.models';

@NgModule({
  declarations: [
    MultiSelectComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ScrollingModule,
    FilterPipe
  ],
  exports: [
    MultiSelectComponent,
    FilterPipe,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MultiSelectModule {
  /**
   * Use forRoot() to provide global default configuration.
   * Example:
   *   MultiSelectModule.forRoot({ placeholder: 'Choose...', searchEnabled: false })
   */
  static forRoot(config: Partial<IMultiSelectConfig> = {}): ModuleWithProviders<MultiSelectModule> {
    return {
      ngModule: MultiSelectModule,
      providers: [
        {
          provide: MULTI_SELECT_DEFAULT_CONFIG,
          useValue: config
        }
      ]
    };
  }
}
