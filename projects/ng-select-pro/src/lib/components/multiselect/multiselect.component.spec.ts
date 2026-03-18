import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { MultiSelectComponent } from './multiselect.component';
import { MultiSelectModule } from '../../module/multiselect.module';
import { IMultiSelectOption, IMultiSelectConfig } from '../../models/multiselect.models';
import { MultiSelectService } from '../../services/multiselect.service';

const SAMPLE_OPTIONS: IMultiSelectOption[] = [
  { id: 1, label: 'Apple' },
  { id: 2, label: 'Banana' },
  { id: 3, label: 'Cherry' },
  { id: 4, label: 'Date', disabled: true },
  { id: 5, label: 'Elderberry', group: 'Berries' },
  { id: 6, label: 'Fig', group: 'Dried Fruits' }
];

// Host component for ngModel testing
@Component({
  template: `
    <ng-multiselect
      [(ngModel)]="selectedValue"
      [options]="options"
      [config]="config"
    ></ng-multiselect>
  `
})
class NgModelHostComponent {
  selectedValue: IMultiSelectOption[] = [];
  options: IMultiSelectOption[] = SAMPLE_OPTIONS;
  config: Partial<IMultiSelectConfig> = {};
}

// Host component for reactive forms testing
@Component({
  template: `
    <ng-multiselect
      [formControl]="control"
      [options]="options"
      [config]="config"
    ></ng-multiselect>
  `
})
class ReactiveHostComponent {
  control = new FormControl<IMultiSelectOption[]>([]);
  options: IMultiSelectOption[] = SAMPLE_OPTIONS;
  config: Partial<IMultiSelectConfig> = {};
}

describe('MultiSelectComponent', () => {
  let component: MultiSelectComponent;
  let fixture: ComponentFixture<MultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiSelectComponent, NgModelHostComponent, ReactiveHostComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        ScrollingModule,
        MultiSelectModule
      ],
      providers: [MultiSelectService]
    })
    .overrideComponent(MultiSelectComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiSelectComponent);
    component = fixture.componentInstance;
    component.options = [...SAMPLE_OPTIONS];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ===== Rendering =====
  describe('rendering', () => {
    it('should show placeholder when nothing selected', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.ng-select-placeholder')?.textContent?.trim()).toBe('Select options');
    });

    it('should not show dropdown initially', () => {
      expect(component.isOpen).toBeFalse();
      expect(fixture.nativeElement.querySelector('.ng-select-dropdown')).toBeNull();
    });

    it('should render options when dropdown is open', () => {
      component.openDropdown();
      fixture.detectChanges();
      const options = fixture.nativeElement.querySelectorAll('.ng-select-option');
      expect(options.length).toBe(SAMPLE_OPTIONS.length);
    });
  });

  // ===== Dropdown open/close =====
  describe('dropdown toggle', () => {
    it('should open dropdown on toggleDropdown()', () => {
      component.toggleDropdown();
      fixture.detectChanges();
      expect(component.isOpen).toBeTrue();
    });

    it('should close dropdown when toggleDropdown() called while open', () => {
      component.openDropdown();
      fixture.detectChanges();
      component.toggleDropdown();
      fixture.detectChanges();
      expect(component.isOpen).toBeFalse();
    });

    it('should not open when disabled', () => {
      component.disabled = true;
      component.ngOnChanges({ disabled: { currentValue: true, previousValue: false, firstChange: false, isFirstChange: () => false } });
      fixture.detectChanges();
      component.toggleDropdown();
      expect(component.isOpen).toBeFalse();
    });

    it('should emit dropdownOpen event', () => {
      spyOn(component.dropdownOpen, 'emit');
      component.openDropdown();
      expect(component.dropdownOpen.emit).toHaveBeenCalled();
    });

    it('should emit dropdownClose event', () => {
      component.openDropdown();
      spyOn(component.dropdownClose, 'emit');
      component.closeDropdown();
      expect(component.dropdownClose.emit).toHaveBeenCalled();
    });
  });

  // ===== Selection =====
  describe('selection', () => {
    it('should select an option', () => {
      component.selectOption(SAMPLE_OPTIONS[0]);
      expect(component.selectedOptions).toContain(SAMPLE_OPTIONS[0]);
    });

    it('should deselect an already-selected option', () => {
      component.selectedOptions = [SAMPLE_OPTIONS[0]];
      component.selectOption(SAMPLE_OPTIONS[0]);
      expect(component.selectedOptions).not.toContain(SAMPLE_OPTIONS[0]);
    });

    it('should not select disabled options', () => {
      const disabled = SAMPLE_OPTIONS.find(o => o.disabled)!;
      component.selectOption(disabled);
      expect(component.selectedOptions).not.toContain(disabled);
    });

    it('should emit selectionChange when option selected', () => {
      spyOn(component.selectionChange, 'emit');
      component.selectOption(SAMPLE_OPTIONS[0]);
      expect(component.selectionChange.emit).toHaveBeenCalledWith([SAMPLE_OPTIONS[0]]);
    });

    it('should respect maxSelect limit', () => {
      component.config = { maxSelect: 2 };
      component.ngOnChanges({ config: { currentValue: component.config, previousValue: {}, firstChange: false, isFirstChange: () => false } });
      component.selectOption(SAMPLE_OPTIONS[0]);
      component.selectOption(SAMPLE_OPTIONS[1]);
      component.selectOption(SAMPLE_OPTIONS[2]);
      expect(component.selectedOptions.length).toBe(2);
    });

    it('should clear all selections', () => {
      component.selectedOptions = [SAMPLE_OPTIONS[0], SAMPLE_OPTIONS[1]];
      const event = new MouseEvent('click');
      component.clearAll(event);
      expect(component.selectedOptions.length).toBe(0);
    });

    it('should remove specific badge via removeOption()', () => {
      component.selectedOptions = [SAMPLE_OPTIONS[0], SAMPLE_OPTIONS[1]];
      const event = new MouseEvent('click');
      component.removeOption(SAMPLE_OPTIONS[0], event);
      expect(component.selectedOptions).not.toContain(SAMPLE_OPTIONS[0]);
      expect(component.selectedOptions).toContain(SAMPLE_OPTIONS[1]);
    });
  });

  // ===== Badges =====
  describe('badge display', () => {
    it('should show only maxDisplayed badges', () => {
      component.config = { maxDisplayed: 2 };
      component.ngOnChanges({ config: { currentValue: component.config, previousValue: {}, firstChange: false, isFirstChange: () => false } });
      component.selectedOptions = [SAMPLE_OPTIONS[0], SAMPLE_OPTIONS[1], SAMPLE_OPTIONS[2]];
      fixture.detectChanges();
      expect(component.displayedBadges.length).toBe(2);
      expect(component.overflowCount).toBe(1);
    });

    it('should show overflow badge when selection exceeds maxDisplayed', () => {
      component.selectedOptions = [SAMPLE_OPTIONS[0], SAMPLE_OPTIONS[1], SAMPLE_OPTIONS[2], SAMPLE_OPTIONS[4]];
      fixture.detectChanges();
      expect(component.overflowCount).toBe(1);
    });
  });

  // ===== Search/filter =====
  describe('search filtering', () => {
    beforeEach(() => {
      component.openDropdown();
      fixture.detectChanges();
    });

    it('should filter options by search query', () => {
      component.searchQuery = 'apple';
      component['updateFilteredOptions']();
      fixture.detectChanges();
      expect(component.filteredOptions.length).toBe(1);
      expect(component.filteredOptions[0].label).toBe('Apple');
    });

    it('should show no results message when query matches nothing', () => {
      component.searchQuery = 'zzz';
      component['updateFilteredOptions']();
      fixture.detectChanges();
      expect(component.filteredOptions.length).toBe(0);
    });

    it('should emit searchChange when user types', () => {
      spyOn(component.searchChange, 'emit');
      const event = { target: { value: 'ban' } } as unknown as Event;
      component.onSearchInput(event);
      expect(component.searchChange.emit).toHaveBeenCalledWith('ban');
    });

    it('should reset search on close', () => {
      component.searchQuery = 'apple';
      component.closeDropdown();
      expect(component.searchQuery).toBe('');
    });
  });

  // ===== Select All =====
  describe('select all', () => {
    it('should select all non-disabled options', () => {
      component.selectAll();
      const selectableCount = SAMPLE_OPTIONS.filter(o => !o.disabled).length;
      expect(component.selectedOptions.length).toBe(selectableCount);
    });

    it('should deselect all visible options', () => {
      component.selectedOptions = SAMPLE_OPTIONS.filter(o => !o.disabled);
      component.deselectAll();
      expect(component.selectedOptions.length).toBe(0);
    });

    it('allSelected should be true when all non-disabled options are selected', () => {
      component.selectedOptions = SAMPLE_OPTIONS.filter(o => !o.disabled);
      expect(component.allSelected).toBeTrue();
    });

    it('allSelected should be false when not all are selected', () => {
      component.selectedOptions = [SAMPLE_OPTIONS[0]];
      expect(component.allSelected).toBeFalse();
    });
  });

  // ===== Keyboard navigation =====
  describe('keyboard navigation', () => {
    it('should open dropdown on ArrowDown when closed', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      component.onKeyDown(event);
      expect(component.isOpen).toBeTrue();
    });

    it('should move focus down on ArrowDown when open', () => {
      component.openDropdown();
      component.focusedIndex = 0;
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      component.onKeyDown(event);
      expect(component.focusedIndex).toBe(1);
    });

    it('should move focus up on ArrowUp', () => {
      component.openDropdown();
      component.focusedIndex = 2;
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      component.onKeyDown(event);
      expect(component.focusedIndex).toBe(1);
    });

    it('should not go below 0 on ArrowUp', () => {
      component.openDropdown();
      component.focusedIndex = 0;
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      component.onKeyDown(event);
      expect(component.focusedIndex).toBe(0);
    });

    it('should select focused option on Enter', () => {
      component.openDropdown();
      component.focusedIndex = 0;
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onKeyDown(event);
      expect(component.selectedOptions).toContain(component.filteredOptions[0]);
    });

    it('should close dropdown on Escape', () => {
      component.openDropdown();
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onKeyDown(event);
      expect(component.isOpen).toBeFalse();
    });

    it('should close dropdown on Tab', () => {
      component.openDropdown();
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      component.onKeyDown(event);
      expect(component.isOpen).toBeFalse();
    });

    it('should not navigate when disabled', () => {
      component.disabled = true;
      component.ngOnChanges({ disabled: { currentValue: true, previousValue: false, firstChange: false, isFirstChange: () => false } });
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      component.onKeyDown(event);
      expect(component.isOpen).toBeFalse();
    });
  });

  // ===== ControlValueAccessor =====
  describe('ControlValueAccessor', () => {
    it('should write value from writeValue()', () => {
      component.writeValue([SAMPLE_OPTIONS[0], SAMPLE_OPTIONS[1]]);
      expect(component.selectedOptions.length).toBe(2);
    });

    it('should handle null writeValue', () => {
      component.writeValue(null);
      expect(component.selectedOptions).toEqual([]);
    });

    it('should handle single object writeValue', () => {
      component.writeValue(SAMPLE_OPTIONS[0]);
      expect(component.selectedOptions).toEqual([SAMPLE_OPTIONS[0]]);
    });

    it('should call onChange when selection changes', () => {
      const spy = jasmine.createSpy('onChange');
      component.registerOnChange(spy);
      component.selectOption(SAMPLE_OPTIONS[0]);
      expect(spy).toHaveBeenCalled();
    });

    it('should call onTouched when dropdown closes', () => {
      const spy = jasmine.createSpy('onTouched');
      component.registerOnTouched(spy);
      component.openDropdown();
      component.closeDropdown();
      expect(spy).toHaveBeenCalled();
    });

    it('should disable the component via setDisabledState', () => {
      component.setDisabledState(true);
      expect(component.mergedConfig.disabled).toBeTrue();
    });
  });

  // ===== Single mode =====
  describe('single mode', () => {
    beforeEach(() => {
      component.config = { mode: 'single' };
      component.ngOnChanges({ config: { currentValue: component.config, previousValue: {}, firstChange: false, isFirstChange: () => false } });
      fixture.detectChanges();
    });

    it('should only allow one selection', () => {
      component.selectOption(SAMPLE_OPTIONS[0]);
      component.selectOption(SAMPLE_OPTIONS[1]);
      expect(component.selectedOptions.length).toBe(1);
      expect(component.selectedOptions[0].id).toBe(2);
    });

    it('should deselect when same option selected again', () => {
      component.selectOption(SAMPLE_OPTIONS[0]);
      component.selectOption(SAMPLE_OPTIONS[0]);
      expect(component.selectedOptions.length).toBe(0);
    });
  });

  // ===== Groups =====
  describe('grouping', () => {
    it('should group options by group property', () => {
      component['updateFilteredOptions']();
      const hasGroups = component.groupedOptions.some(g => g.group !== null);
      expect(hasGroups).toBeTrue();
    });

    it('should put ungrouped options first', () => {
      const ungrouped = component.groupedOptions.find(g => g.group === null);
      expect(ungrouped).toBeDefined();
    });
  });

  // ===== Virtual scroll threshold =====
  describe('virtual scroll', () => {
    it('should not use virtual scroll for small lists', () => {
      expect(component.useVirtualScroll).toBeFalse();
    });

    it('should use virtual scroll when options exceed threshold', () => {
      component.options = Array.from({ length: 101 }, (_, i) => ({ id: i, label: `Option ${i}` }));
      component.ngOnChanges({ options: { currentValue: component.options, previousValue: [], firstChange: false, isFirstChange: () => false } });
      expect(component.useVirtualScroll).toBeTrue();
    });
  });

  // ===== computedDropdownPosition =====
  describe('computedDropdownPosition', () => {
    it('should return "bottom" when dropdownPosition is forced to bottom', () => {
      component.config = { dropdownPosition: 'bottom' };
      component.ngOnChanges({ config: { currentValue: component.config, previousValue: {}, firstChange: false, isFirstChange: () => false } });
      expect(component.computedDropdownPosition).toBe('bottom');
    });

    it('should return "top" when dropdownPosition is forced to top', () => {
      component.config = { dropdownPosition: 'top' };
      component.ngOnChanges({ config: { currentValue: component.config, previousValue: {}, firstChange: false, isFirstChange: () => false } });
      expect(component.computedDropdownPosition).toBe('top');
    });

    it('should return "top" in auto mode when space above is greater', () => {
      component.config = { dropdownPosition: 'auto' };
      component.ngOnChanges({ config: { currentValue: component.config, previousValue: {}, firstChange: false, isFirstChange: () => false } });
      spyOn(component['elementRef'].nativeElement, 'getBoundingClientRect').and.returnValue({
        bottom: window.innerHeight - 100, top: 600
      } as DOMRect);
      // spaceBelow = 100, spaceAbove = 600 → top
      expect(component.computedDropdownPosition).toBe('top');
    });
  });

  // ===== openDropdown / closeDropdown idempotency =====
  describe('idempotency guards', () => {
    it('should not re-emit dropdownOpen if already open', () => {
      component.openDropdown();
      spyOn(component.dropdownOpen, 'emit');
      component.openDropdown();
      expect(component.dropdownOpen.emit).not.toHaveBeenCalled();
    });

    it('should not change state if closeDropdown called when already closed', () => {
      spyOn(component.dropdownClose, 'emit');
      component.closeDropdown();
      expect(component.dropdownClose.emit).not.toHaveBeenCalled();
    });
  });

  // ===== closeOnSelect =====
  describe('closeOnSelect', () => {
    it('should close dropdown after selection when closeOnSelect is true', () => {
      component.config = { closeOnSelect: true };
      component.ngOnChanges({ config: { currentValue: component.config, previousValue: {}, firstChange: false, isFirstChange: () => false } });
      component.openDropdown();
      fixture.detectChanges();
      component.selectOption(SAMPLE_OPTIONS[0]);
      expect(component.isOpen).toBeFalse();
    });

    it('should not close dropdown after selection when closeOnSelect is false', () => {
      component.config = { closeOnSelect: false };
      component.ngOnChanges({ config: { currentValue: component.config, previousValue: {}, firstChange: false, isFirstChange: () => false } });
      component.openDropdown();
      component.selectOption(SAMPLE_OPTIONS[0]);
      expect(component.isOpen).toBeTrue();
    });
  });

  // ===== getItemLabel =====
  describe('getItemLabel', () => {
    it('should return option label by default', () => {
      expect(component.getItemLabel(SAMPLE_OPTIONS[0])).toBe('Apple');
    });

    it('should use itemRenderer when provided', () => {
      component.config = { itemRenderer: (opt) => `★ ${opt.label}` };
      component.ngOnChanges({ config: { currentValue: component.config, previousValue: {}, firstChange: false, isFirstChange: () => false } });
      expect(component.getItemLabel(SAMPLE_OPTIONS[0])).toBe('★ Apple');
    });
  });

  // ===== allSelected edge case =====
  describe('allSelected with all-disabled options', () => {
    it('should return false when all options are disabled', () => {
      component.options = [
        { id: 1, label: 'A', disabled: true },
        { id: 2, label: 'B', disabled: true }
      ];
      component.selectedOptions = [{ id: 1, label: 'A' }, { id: 2, label: 'B' }];
      expect(component.allSelected).toBeFalse();
    });
  });

  // ===== selectAll / deselectAll while disabled =====
  describe('selectAll / deselectAll disabled guard', () => {
    beforeEach(() => {
      component.config = { disabled: true };
      component.ngOnChanges({ config: { currentValue: component.config, previousValue: {}, firstChange: false, isFirstChange: () => false } });
    });

    it('should not select all when component is disabled', () => {
      component.selectAll();
      expect(component.selectedOptions.length).toBe(0);
    });

    it('should not deselect all when component is disabled', () => {
      component.selectedOptions = [SAMPLE_OPTIONS[0]];
      component.deselectAll();
      expect(component.selectedOptions.length).toBe(1);
    });
  });

  // ===== selectAll with limit and pre-existing selection outside filter =====
  describe('selectAll with limit', () => {
    it('should respect maxSelect when selecting all', () => {
      component.config = { maxSelect: 2 };
      component.ngOnChanges({ config: { currentValue: component.config, previousValue: {}, firstChange: false, isFirstChange: () => false } });
      component.selectAll();
      expect(component.selectedOptions.length).toBeLessThanOrEqual(2);
    });

    it('should preserve selected options outside the current filtered set', () => {
      // Pre-select an option, then filter to a subset; selectAll should keep the pre-selected one
      component.selectedOptions = [SAMPLE_OPTIONS[4]]; // Elderberry (group: Berries)
      component.searchQuery = 'apple';
      component['updateFilteredOptions'](); // filteredOptions = [Apple]
      component.selectAll();
      const ids = component.selectedOptions.map(o => o.id);
      expect(ids).toContain(SAMPLE_OPTIONS[4].id); // Elderberry preserved
      expect(ids).toContain(SAMPLE_OPTIONS[0].id); // Apple added
    });
  });

  // ===== dropdownAnimationState =====
  describe('dropdownAnimationState', () => {
    it('should return "open" when dropdown is open', () => {
      component.isOpen = true;
      expect(component.dropdownAnimationState).toBe('open');
    });

    it('should return "void" when dropdown is closed', () => {
      component.isOpen = false;
      expect(component.dropdownAnimationState).toBe('void');
    });
  });

  // ===== ArrowDown at upper boundary =====
  describe('keyboard boundary', () => {
    it('should not exceed last index on repeated ArrowDown', () => {
      component.openDropdown();
      component.focusedIndex = component.filteredOptions.length - 1;
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      component.onKeyDown(event);
      expect(component.focusedIndex).toBe(component.filteredOptions.length - 1);
    });
  });

  // ===== writeValue with undefined =====
  describe('writeValue edge cases', () => {
    it('should clear selection when writeValue receives undefined', () => {
      component.selectedOptions = [SAMPLE_OPTIONS[0]];
      component.writeValue(undefined as any);
      expect(component.selectedOptions).toEqual([]);
    });
  });
});
