import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { IMultiSelectOption, IMultiSelectConfig, MultiSelectModule } from 'ng-select-pro';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MultiSelectModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // ===== Basic options =====
  fruitOptions: IMultiSelectOption[] = [
    { id: 1, label: 'Apple' },
    { id: 2, label: 'Banana' },
    { id: 3, label: 'Cherry' },
    { id: 4, label: 'Date' },
    { id: 5, label: 'Elderberry' },
    { id: 6, label: 'Fig' },
    { id: 7, label: 'Grape' },
    { id: 8, label: 'Honeydew' }
  ];

  countryOptions: IMultiSelectOption[] = [
    { id: 'us', label: 'United States', group: 'Americas' },
    { id: 'ca', label: 'Canada', group: 'Americas' },
    { id: 'mx', label: 'Mexico', group: 'Americas' },
    { id: 'gb', label: 'United Kingdom', group: 'Europe' },
    { id: 'fr', label: 'France', group: 'Europe' },
    { id: 'de', label: 'Germany', group: 'Europe' },
    { id: 'it', label: 'Italy', group: 'Europe' },
    { id: 'jp', label: 'Japan', group: 'Asia' },
    { id: 'cn', label: 'China', group: 'Asia' },
    { id: 'in', label: 'India', group: 'Asia' }
  ];

  techStackOptions: IMultiSelectOption[] = [
    { id: 'ng', label: 'Angular', tooltip: 'Frontend framework by Google' },
    { id: 'react', label: 'React', tooltip: 'UI library by Meta' },
    { id: 'vue', label: 'Vue.js', tooltip: 'Progressive framework' },
    { id: 'svelte', label: 'Svelte', tooltip: 'Compile-time framework' },
    { id: 'node', label: 'Node.js', disabled: true, tooltip: 'Not available in this plan' },
    { id: 'deno', label: 'Deno', disabled: true, tooltip: 'Not available in this plan' },
    { id: 'ts', label: 'TypeScript' },
    { id: 'go', label: 'Go' }
  ];

  largeOptions: IMultiSelectOption[] = Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    label: `Option ${i + 1}`,
    group: i < 50 ? 'Group A' : i < 100 ? 'Group B' : i < 150 ? 'Group C' : 'Group D'
  }));

  // ===== Demo selections =====
  basicSelected: IMultiSelectOption[] = [];
  singleSelected: IMultiSelectOption[] = [];
  searchSelected: IMultiSelectOption[] = [];
  maxSelected: IMultiSelectOption[] = [];
  disabledSelected: IMultiSelectOption[] = [{ id: 'ng', label: 'Angular' }];
  tailwindSelected: IMultiSelectOption[] = [];
  materialSelected: IMultiSelectOption[] = [];
  virtualScrollSelected: IMultiSelectOption[] = [];

  // Reactive form
  reactiveControl = new FormControl<IMultiSelectOption[]>([]);

  // ===== Playground state =====
  playgroundSelected: IMultiSelectOption[] = [];
  playgroundOptions: IMultiSelectOption[] = [
    { id: 1, label: 'Angular', group: 'Frameworks' },
    { id: 2, label: 'React', group: 'Frameworks' },
    { id: 3, label: 'Vue', group: 'Frameworks' },
    { id: 4, label: 'TypeScript', group: 'Languages' },
    { id: 5, label: 'JavaScript', group: 'Languages' },
    { id: 6, label: 'Python', group: 'Languages', disabled: true },
    { id: 7, label: 'Go', group: 'Languages' }
  ];

  playgroundConfig: Partial<IMultiSelectConfig> = {
    mode: 'multi',
    searchEnabled: true,
    placeholder: 'Select options',
    searchPlaceholder: 'Search...',
    maxSelect: null,
    maxDisplayed: 3,
    disabled: false,
    closeOnSelect: false,
    showSelectAll: true,
    showClearAll: true,
    loading: false,
    dropdownPosition: 'auto',
    noResultsText: 'No results found'
  };

  // Playground control values (for UI binding)
  pg_mode: 'multi' | 'single' = 'multi';
  pg_searchEnabled: boolean = true;
  pg_placeholder: string = 'Select options';
  pg_maxSelect: number | '' = '';
  pg_maxDisplayed: number = 3;
  pg_disabled: boolean = false;
  pg_closeOnSelect: boolean = false;
  pg_showSelectAll: boolean = true;
  pg_showClearAll: boolean = true;
  pg_loading: boolean = false;
  pg_dropdownPosition: 'auto' | 'top' | 'bottom' = 'auto';
  pg_noResultsText: string = 'No results found';

  // ===== Configs =====
  singleConfig: Partial<IMultiSelectConfig> = { mode: 'single', closeOnSelect: true, showSelectAll: false };
  maxConfig: Partial<IMultiSelectConfig> = { maxSelect: 3, showSelectAll: false };
  disabledConfig: Partial<IMultiSelectConfig> = { disabled: true };

  tailwindConfig: Partial<IMultiSelectConfig> = {
    theme: {
      containerClass: 'tw-container',
      dropdownClass: 'tw-dropdown',
      itemClass: 'tw-item',
      selectedItemClass: 'tw-item--selected',
      badgeClass: 'tw-badge',
      searchClass: 'tw-search',
      clearBtnClass: '',
      selectAllClass: '',
      disabledItemClass: '',
      overflowBadgeClass: ''
    }
  };

  materialConfig: Partial<IMultiSelectConfig> = {};

  // ===== Event log =====
  eventLog: string[] = [];

  ngOnInit(): void {
    this.reactiveControl.valueChanges.subscribe(val => {
      this.logEvent(`ReactiveForm value changed: ${JSON.stringify(val?.map(o => o?.label))}`);
    });
  }

  logEvent(msg: string): void {
    const time = new Date().toLocaleTimeString();
    this.eventLog.unshift(`[${time}] ${msg}`);
    if (this.eventLog.length > 10) {
      this.eventLog = this.eventLog.slice(0, 10);
    }
  }

  updatePlaygroundConfig(): void {
    this.playgroundConfig = {
      mode: this.pg_mode,
      searchEnabled: this.pg_searchEnabled,
      placeholder: this.pg_placeholder,
      searchPlaceholder: 'Search...',
      maxSelect: this.pg_maxSelect === '' ? null : Number(this.pg_maxSelect),
      maxDisplayed: this.pg_maxDisplayed,
      disabled: this.pg_disabled,
      closeOnSelect: this.pg_closeOnSelect,
      showSelectAll: this.pg_showSelectAll,
      showClearAll: this.pg_showClearAll,
      loading: this.pg_loading,
      dropdownPosition: this.pg_dropdownPosition,
      noResultsText: this.pg_noResultsText
    };
  }

  get playgroundConfigJson(): string {
    return JSON.stringify(this.playgroundConfig, null, 2);
  }
}
