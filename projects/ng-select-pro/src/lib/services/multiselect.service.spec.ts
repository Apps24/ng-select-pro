import { TestBed } from '@angular/core/testing';
import { MultiSelectService } from './multiselect.service';
import { IMultiSelectConfig, IMultiSelectOption } from '../models/multiselect.models';

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

const SAMPLE_OPTIONS: IMultiSelectOption[] = [
  { id: 1, label: 'Apple', group: 'Fruits' },
  { id: 2, label: 'Banana', group: 'Fruits' },
  { id: 3, label: 'Carrot', group: 'Vegetables' },
  { id: 4, label: 'Daikon', group: 'Vegetables', disabled: true },
  { id: 5, label: 'Elderberry' }
];

describe('MultiSelectService', () => {
  let service: MultiSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ===== filterOptions =====
  describe('filterOptions', () => {
    it('should return all options when query is empty', () => {
      expect(service.filterOptions(SAMPLE_OPTIONS, '')).toEqual(SAMPLE_OPTIONS);
    });

    it('should return all options when query is whitespace', () => {
      expect(service.filterOptions(SAMPLE_OPTIONS, '   ')).toEqual(SAMPLE_OPTIONS);
    });

    it('should filter by label (case-insensitive)', () => {
      const result = service.filterOptions(SAMPLE_OPTIONS, 'apple');
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(1);
    });

    it('should filter by group (case-insensitive)', () => {
      const result = service.filterOptions(SAMPLE_OPTIONS, 'fruits');
      expect(result.length).toBe(2);
      expect(result.map(o => o.id)).toEqual([1, 2]);
    });

    it('should return empty array when no match', () => {
      const result = service.filterOptions(SAMPLE_OPTIONS, 'xyz');
      expect(result.length).toBe(0);
    });

    it('should handle partial label match', () => {
      const result = service.filterOptions(SAMPLE_OPTIONS, 'an');
      expect(result.length).toBe(1);
      expect(result[0].label).toBe('Banana');
    });

    it('should handle empty options array', () => {
      expect(service.filterOptions([], 'apple')).toEqual([]);
    });
  });

  // ===== getDisplayLabel =====
  describe('getDisplayLabel', () => {
    it('should return placeholder when no options selected', () => {
      const result = service.getDisplayLabel([], DEFAULT_CONFIG);
      expect(result).toBe('Select options');
    });

    it('should return comma-separated labels for multiple selections', () => {
      const selected = [SAMPLE_OPTIONS[0], SAMPLE_OPTIONS[1]];
      const result = service.getDisplayLabel(selected, DEFAULT_CONFIG);
      expect(result).toBe('Apple, Banana');
    });

    it('should use labelRenderer when provided', () => {
      const config: IMultiSelectConfig = {
        ...DEFAULT_CONFIG,
        labelRenderer: (opt) => `[${opt.label}]`
      };
      const selected = [SAMPLE_OPTIONS[0]];
      expect(service.getDisplayLabel(selected, config)).toBe('[Apple]');
    });

    it('should return single label for single selection', () => {
      const result = service.getDisplayLabel([SAMPLE_OPTIONS[2]], DEFAULT_CONFIG);
      expect(result).toBe('Carrot');
    });
  });

  // ===== isSelected =====
  describe('isSelected', () => {
    it('should return true when option is in selected list', () => {
      expect(service.isSelected(SAMPLE_OPTIONS[0], [SAMPLE_OPTIONS[0]])).toBe(true);
    });

    it('should return false when option is not in selected list', () => {
      expect(service.isSelected(SAMPLE_OPTIONS[0], [SAMPLE_OPTIONS[1]])).toBe(false);
    });

    it('should return false when selected list is empty', () => {
      expect(service.isSelected(SAMPLE_OPTIONS[0], [])).toBe(false);
    });

    it('should match by id, not reference', () => {
      const clone: IMultiSelectOption = { id: 1, label: 'Apple (clone)' };
      expect(service.isSelected(clone, [SAMPLE_OPTIONS[0]])).toBe(true);
    });
  });

  // ===== toggleSelection =====
  describe('toggleSelection', () => {
    describe('multi mode', () => {
      it('should add option when not selected', () => {
        const result = service.toggleSelection(SAMPLE_OPTIONS[0], [], DEFAULT_CONFIG);
        expect(result).toEqual([SAMPLE_OPTIONS[0]]);
      });

      it('should remove option when already selected', () => {
        const result = service.toggleSelection(
          SAMPLE_OPTIONS[0],
          [SAMPLE_OPTIONS[0], SAMPLE_OPTIONS[1]],
          DEFAULT_CONFIG
        );
        expect(result.length).toBe(1);
        expect(result[0].id).toBe(2);
      });

      it('should not exceed maxSelect limit', () => {
        const config: IMultiSelectConfig = { ...DEFAULT_CONFIG, maxSelect: 2 };
        const current = [SAMPLE_OPTIONS[0], SAMPLE_OPTIONS[1]];
        const result = service.toggleSelection(SAMPLE_OPTIONS[2], current, config);
        expect(result.length).toBe(2);
      });

      it('should not exceed selectionLimit when maxSelect is null', () => {
        const config: IMultiSelectConfig = { ...DEFAULT_CONFIG, maxSelect: null, selectionLimit: 2 };
        const current = [SAMPLE_OPTIONS[0], SAMPLE_OPTIONS[1]];
        const result = service.toggleSelection(SAMPLE_OPTIONS[2], current, config);
        expect(result.length).toBe(2);
      });

      it('should not select disabled option', () => {
        const disabledOption = SAMPLE_OPTIONS[3]; // disabled: true
        const result = service.toggleSelection(disabledOption, [], DEFAULT_CONFIG);
        expect(result).toEqual([]);
      });

      it('should allow adding when under maxSelect limit', () => {
        const config: IMultiSelectConfig = { ...DEFAULT_CONFIG, maxSelect: 3 };
        const current = [SAMPLE_OPTIONS[0]];
        const result = service.toggleSelection(SAMPLE_OPTIONS[1], current, config);
        expect(result.length).toBe(2);
      });
    });

    describe('single mode', () => {
      const singleConfig: IMultiSelectConfig = { ...DEFAULT_CONFIG, mode: 'single' };

      it('should replace selection with new option', () => {
        const result = service.toggleSelection(SAMPLE_OPTIONS[1], [SAMPLE_OPTIONS[0]], singleConfig);
        expect(result).toEqual([SAMPLE_OPTIONS[1]]);
      });

      it('should deselect when selecting the same option', () => {
        const result = service.toggleSelection(SAMPLE_OPTIONS[0], [SAMPLE_OPTIONS[0]], singleConfig);
        expect(result).toEqual([]);
      });

      it('should select option from empty state', () => {
        const result = service.toggleSelection(SAMPLE_OPTIONS[0], [], singleConfig);
        expect(result).toEqual([SAMPLE_OPTIONS[0]]);
      });

      it('should not select disabled option in single mode', () => {
        const result = service.toggleSelection(SAMPLE_OPTIONS[3], [], singleConfig);
        expect(result).toEqual([]);
      });
    });
  });
});
