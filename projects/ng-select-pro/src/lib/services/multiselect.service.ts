import { Injectable } from '@angular/core';
import { IMultiSelectConfig, IMultiSelectOption } from '../models/multiselect.models';

@Injectable({
  providedIn: 'root'
})
export class MultiSelectService {

  /**
   * Filter options by search query (matches label and group).
   */
  filterOptions(options: IMultiSelectOption[], query: string): IMultiSelectOption[] {
    if (!query || !query.trim()) {
      return options;
    }
    const lowerQuery = query.toLowerCase().trim();
    return options.filter(option =>
      option.label.toLowerCase().includes(lowerQuery) ||
      (option.group && option.group.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get display label for the selected items area.
   */
  getDisplayLabel(selected: IMultiSelectOption[], config: IMultiSelectConfig): string {
    if (selected.length === 0) {
      return config.placeholder;
    }
    if (config.labelRenderer) {
      return selected.map(config.labelRenderer).join(', ');
    }
    return selected.map(o => o.label).join(', ');
  }

  /**
   * Check if a given option is in the selected array.
   */
  isSelected(option: IMultiSelectOption, selected: IMultiSelectOption[]): boolean {
    return selected.some(s => s.id === option.id);
  }

  /**
   * Toggle selection of an option respecting mode (multi/single) and maxSelect limit.
   */
  toggleSelection(
    option: IMultiSelectOption,
    selected: IMultiSelectOption[],
    config: IMultiSelectConfig
  ): IMultiSelectOption[] {
    if (option.disabled) {
      return selected;
    }

    if (config.mode === 'single') {
      // In single mode, selecting the same option deselects it, otherwise replace.
      if (this.isSelected(option, selected)) {
        return [];
      }
      return [option];
    }

    // Multi mode
    if (this.isSelected(option, selected)) {
      return selected.filter(s => s.id !== option.id);
    }

    const limit = config.maxSelect ?? config.selectionLimit;
    if (limit !== null && selected.length >= limit) {
      return selected;
    }

    return [...selected, option];
  }
}
