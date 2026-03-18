import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  HostListener,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  forwardRef,
  Inject,
  Optional,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { IMultiSelectConfig, IMultiSelectOption, IMultiSelectTheme } from '../../models/multiselect.models';
import { MultiSelectService } from '../../services/multiselect.service';
import { MULTI_SELECT_DEFAULT_CONFIG } from '../../tokens/multiselect.token';

const DEFAULT_CONFIG: IMultiSelectConfig = {
  mode: 'multi',
  searchEnabled: true,
  searchPlaceholder: 'Search...',
  placeholder: 'Select options',
  maxSelect: null,
  maxDisplayed: 3,
  selectionLimit: null,
  disabled: false,
  closeOnSelect: false,
  showSelectAll: true,
  showClearAll: true,
  labelRenderer: null,
  itemRenderer: null,
  noResultsText: 'No results found',
  loadingText: 'Loading...',
  loading: false,
  autoClose: true,
  dropdownPosition: 'auto',
  theme: {
    containerClass: '',
    dropdownClass: '',
    searchClass: '',
    itemClass: '',
    selectedItemClass: '',
    disabledItemClass: '',
    badgeClass: '',
    clearBtnClass: '',
    selectAllClass: '',
    overflowBadgeClass: ''
  }
};

@Component({
  selector: 'ng-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('dropdownAnimation', [
      state('void', style({ opacity: 0, transform: 'translateY(-8px) scaleY(0.95)' })),
      state('open', style({ opacity: 1, transform: 'translateY(0) scaleY(1)' })),
      transition('void => open', animate('150ms cubic-bezier(0.4, 0, 0.2, 1)')),
      transition('open => void', animate('100ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ])
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ]
})
export class MultiSelectComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {

  @Input() options: IMultiSelectOption[] = [];
  @Input() config: Partial<IMultiSelectConfig> = {};
  @Input() disabled: boolean = false;

  @Output() selectionChange = new EventEmitter<IMultiSelectOption[]>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() dropdownOpen = new EventEmitter<void>();
  @Output() dropdownClose = new EventEmitter<void>();

  @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('dropdownContainer') dropdownContainerRef?: ElementRef<HTMLElement>;

  mergedConfig: IMultiSelectConfig = { ...DEFAULT_CONFIG };
  isOpen: boolean = false;
  searchQuery: string = '';
  selectedOptions: IMultiSelectOption[] = [];
  focusedIndex: number = -1;
  filteredOptions: IMultiSelectOption[] = [];
  groupedOptions: Array<{ group: string | null; options: IMultiSelectOption[] }> = [];

  // Virtual scroll threshold
  readonly VIRTUAL_SCROLL_THRESHOLD = 100;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private service: MultiSelectService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    @Optional() @Inject(MULTI_SELECT_DEFAULT_CONFIG) private injectedConfig: Partial<IMultiSelectConfig> | null
  ) {}

  ngOnInit(): void {
    this.buildConfig();
    this.updateFilteredOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] || changes['disabled']) {
      this.buildConfig();
    }
    if (changes['options']) {
      this.updateFilteredOptions();
    }
  }

  ngOnDestroy(): void {}

  private buildConfig(): void {
    this.mergedConfig = {
      ...DEFAULT_CONFIG,
      ...(this.injectedConfig || {}),
      ...this.config,
      disabled: this.disabled || (this.config.disabled ?? false) || (this.injectedConfig?.disabled ?? false),
      theme: {
        ...DEFAULT_CONFIG.theme,
        ...(this.injectedConfig?.theme || {}),
        ...(this.config.theme || {})
      }
    };
  }

  private updateFilteredOptions(): void {
    this.filteredOptions = this.service.filterOptions(this.options, this.searchQuery);
    this.buildGroupedOptions();
  }

  private buildGroupedOptions(): void {
    const hasGroups = this.filteredOptions.some(o => !!o.group);
    if (!hasGroups) {
      this.groupedOptions = [{ group: null, options: this.filteredOptions }];
      return;
    }
    const groupMap = new Map<string, IMultiSelectOption[]>();
    const noGroup: IMultiSelectOption[] = [];
    for (const opt of this.filteredOptions) {
      if (opt.group) {
        if (!groupMap.has(opt.group)) groupMap.set(opt.group, []);
        groupMap.get(opt.group)!.push(opt);
      } else {
        noGroup.push(opt);
      }
    }
    const groups: Array<{ group: string | null; options: IMultiSelectOption[] }> = [];
    if (noGroup.length) groups.push({ group: null, options: noGroup });
    groupMap.forEach((opts, group) => groups.push({ group, options: opts }));
    this.groupedOptions = groups;
  }

  get displayedBadges(): IMultiSelectOption[] {
    return this.selectedOptions.slice(0, this.mergedConfig.maxDisplayed);
  }

  get overflowCount(): number {
    return Math.max(0, this.selectedOptions.length - this.mergedConfig.maxDisplayed);
  }

  get isDisabled(): boolean {
    return this.mergedConfig.disabled;
  }

  get useVirtualScroll(): boolean {
    return this.filteredOptions.length > this.VIRTUAL_SCROLL_THRESHOLD;
  }

  get allSelected(): boolean {
    const selectableOptions = this.options.filter(o => !o.disabled);
    return selectableOptions.length > 0 && selectableOptions.every(o => this.isSelected(o));
  }

  get dropdownAnimationState(): string {
    return this.isOpen ? 'open' : 'void';
  }

  get computedDropdownPosition(): 'top' | 'bottom' {
    if (this.mergedConfig.dropdownPosition !== 'auto') {
      return this.mergedConfig.dropdownPosition;
    }
    // Auto-detect based on available space
    const el = this.elementRef.nativeElement as HTMLElement;
    const rect = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    return spaceBelow >= 300 || spaceBelow >= spaceAbove ? 'bottom' : 'top';
  }

  toggleDropdown(): void {
    if (this.isDisabled) return;
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown(): void {
    if (this.isDisabled || this.isOpen) return;
    this.isOpen = true;
    this.focusedIndex = -1;
    this.dropdownOpen.emit();
    this.cdr.markForCheck();
    setTimeout(() => {
      this.searchInputRef?.nativeElement.focus();
    }, 0);
  }

  closeDropdown(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.searchQuery = '';
    this.updateFilteredOptions();
    this.focusedIndex = -1;
    this.dropdownClose.emit();
    this.onTouched();
    this.cdr.markForCheck();
  }

  onSearchInput(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.updateFilteredOptions();
    this.focusedIndex = -1;
    this.searchChange.emit(this.searchQuery);
    this.cdr.markForCheck();
  }

  isSelected(option: IMultiSelectOption): boolean {
    return this.service.isSelected(option, this.selectedOptions);
  }

  selectOption(option: IMultiSelectOption, event?: Event): void {
    event?.stopPropagation();
    if (option.disabled || this.isDisabled) return;

    this.selectedOptions = this.service.toggleSelection(option, this.selectedOptions, this.mergedConfig);
    this.emitChange();

    if (this.mergedConfig.closeOnSelect || this.mergedConfig.mode === 'single') {
      this.closeDropdown();
    }
    this.cdr.markForCheck();
  }

  selectAll(): void {
    if (this.isDisabled) return;
    const selectableOptions = this.filteredOptions.filter(o => !o.disabled);
    const limit = this.mergedConfig.maxSelect ?? this.mergedConfig.selectionLimit;

    let toSelect = selectableOptions;
    if (limit !== null) {
      toSelect = selectableOptions.slice(0, limit);
    }
    // Merge with already selected (not in current filtered set)
    const currentNonFiltered = this.selectedOptions.filter(
      s => !this.filteredOptions.some(f => f.id === s.id)
    );
    this.selectedOptions = [...currentNonFiltered, ...toSelect];
    this.emitChange();
    this.cdr.markForCheck();
  }

  deselectAll(): void {
    if (this.isDisabled) return;
    // Only deselect items visible in current filtered set
    const filteredIds = new Set(this.filteredOptions.map(o => o.id));
    this.selectedOptions = this.selectedOptions.filter(s => !filteredIds.has(s.id));
    this.emitChange();
    this.cdr.markForCheck();
  }

  toggleSelectAll(): void {
    if (this.allSelected) {
      this.deselectAll();
    } else {
      this.selectAll();
    }
  }

  clearAll(event: Event): void {
    event.stopPropagation();
    if (this.isDisabled) return;
    this.selectedOptions = [];
    this.emitChange();
    this.cdr.markForCheck();
  }

  removeOption(option: IMultiSelectOption, event: Event): void {
    event.stopPropagation();
    if (this.isDisabled) return;
    this.selectedOptions = this.selectedOptions.filter(s => s.id !== option.id);
    this.emitChange();
    this.cdr.markForCheck();
  }

  private emitChange(): void {
    const value = this.mergedConfig.mode === 'single'
      ? (this.selectedOptions[0] ?? null)
      : this.selectedOptions;
    this.onChange(value);
    this.selectionChange.emit(this.selectedOptions);
  }

  getItemLabel(option: IMultiSelectOption): string {
    if (this.mergedConfig.itemRenderer) {
      return this.mergedConfig.itemRenderer(option);
    }
    return option.label;
  }

  // ControlValueAccessor
  writeValue(value: IMultiSelectOption | IMultiSelectOption[] | null): void {
    if (value === null || value === undefined) {
      this.selectedOptions = [];
    } else if (Array.isArray(value)) {
      this.selectedOptions = value;
    } else {
      this.selectedOptions = [value];
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.mergedConfig = { ...this.mergedConfig, disabled: isDisabled };
    this.cdr.markForCheck();
  }

  // Keyboard Navigation
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.openDropdown();
        } else {
          this.focusedIndex = Math.min(this.focusedIndex + 1, this.filteredOptions.length - 1);
          this.scrollToFocused();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen) {
          this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
          this.scrollToFocused();
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (!this.isOpen) {
          this.openDropdown();
        } else if (this.focusedIndex >= 0 && this.focusedIndex < this.filteredOptions.length) {
          this.selectOption(this.filteredOptions[this.focusedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;
      case 'Tab':
        if (this.isOpen) {
          this.closeDropdown();
        }
        break;
    }
    this.cdr.markForCheck();
  }

  private scrollToFocused(): void {
    setTimeout(() => {
      const container = this.dropdownContainerRef?.nativeElement;
      if (!container) return;
      const focusedEl = container.querySelector('.ng-select-option--focused') as HTMLElement;
      if (focusedEl) {
        focusedEl.scrollIntoView({ block: 'nearest' });
      }
    }, 0);
  }

  // Click outside to close
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (this.isOpen) {
        this.closeDropdown();
      }
    }
  }

  trackByOption(_index: number, option: IMultiSelectOption): any {
    return option.id;
  }
}
