export interface IMultiSelectOption {
  id: any;
  label: string;
  disabled?: boolean;
  group?: string;
  image?: string;
  tooltip?: string;
  data?: any;
}

export interface IMultiSelectTheme {
  containerClass: string;
  dropdownClass: string;
  searchClass: string;
  itemClass: string;
  selectedItemClass: string;
  disabledItemClass: string;
  badgeClass: string;
  clearBtnClass: string;
  selectAllClass: string;
  overflowBadgeClass: string;
}

export interface IMultiSelectConfig {
  mode: 'multi' | 'single';
  searchEnabled: boolean;
  searchPlaceholder: string;
  placeholder: string;
  maxSelect: number | null;
  maxDisplayed: number;
  selectionLimit: number | null;
  disabled: boolean;
  closeOnSelect: boolean;
  showSelectAll: boolean;
  showClearAll: boolean;
  labelRenderer: ((option: IMultiSelectOption) => string) | null;
  itemRenderer: ((option: IMultiSelectOption) => string) | null;
  noResultsText: string;
  loadingText: string;
  loading: boolean;
  theme: IMultiSelectTheme;
  autoClose: boolean;
  dropdownPosition: 'auto' | 'top' | 'bottom';
}
