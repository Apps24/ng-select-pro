import { Pipe, PipeTransform } from '@angular/core';
import { IMultiSelectOption } from '../models/multiselect.models';

@Pipe({
  name: 'filterOptions',
  standalone: true,
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(options: IMultiSelectOption[], query: string): IMultiSelectOption[] {
    if (!query || !query.trim()) {
      return options;
    }
    const lowerQuery = query.toLowerCase().trim();
    return options.filter(option =>
      option.label.toLowerCase().includes(lowerQuery) ||
      (option.group && option.group.toLowerCase().includes(lowerQuery))
    );
  }
}
