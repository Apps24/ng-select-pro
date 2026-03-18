import { InjectionToken } from '@angular/core';
import { IMultiSelectConfig } from '../models/multiselect.models';

export const MULTI_SELECT_DEFAULT_CONFIG = new InjectionToken<Partial<IMultiSelectConfig>>(
  'MULTI_SELECT_DEFAULT_CONFIG'
);
