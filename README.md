# ng-select-pro

[![npm version](https://img.shields.io/npm/v/ng-select-pro.svg)](https://www.npmjs.com/package/ng-select-pro)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-8%2B-red.svg)](https://angular.io)
[![Build Status](https://github.com/your-org/ng-select-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/ng-select-pro/actions)

A production-ready Angular multiselect dropdown component with search, virtual scroll, keyboard navigation, group support, and full theming.

---

## Features

- **Multi-select and single-select** modes
- **Search/filter** with configurable placeholder
- **Virtual scrolling** (CDK) auto-activated for lists > 100 items
- **Full keyboard navigation** — ArrowUp/Down, Enter, Escape, Tab
- **ControlValueAccessor** — works with `ngModel` and `ReactiveFormsModule`
- **Select all / Deselect all**
- **Badge display** with overflow indicator (+N)
- **Group headers** from `option.group`
- **Disabled options** and disabled component state
- **Tooltip** support via `option.tooltip`
- **Loading spinner** state
- **Dropdown position** — auto (smart), top, or bottom
- **Angular animations** for smooth open/close
- **ARIA** roles and attributes for accessibility
- **CSS custom properties** for complete theming
- **Tailwind CSS** integration support
- **Angular Material** theme built-in
- **Angular 8 – 20+** compatible (partial-Ivy compilation)

---

## Installation

```bash
npm install ng-select-pro @angular/cdk
```

---

## Quick Start

### Module-based apps (Angular 8–16)

```typescript
// app.module.ts
import { MultiSelectModule } from 'ng-select-pro';

@NgModule({
  imports: [
    MultiSelectModule
    // or with global defaults:
    // MultiSelectModule.forRoot({ placeholder: 'Choose...', maxDisplayed: 2 })
  ]
})
export class AppModule {}
```

```html
<!-- component.html -->
<ng-multiselect
  [(ngModel)]="selected"
  [options]="options"
></ng-multiselect>
```

### Standalone apps (Angular 14+)

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { MultiSelectModule } from 'ng-select-pro';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(MultiSelectModule.forRoot({ placeholder: 'Select...' }))
  ]
});
```

### Reactive Forms

```typescript
import { FormControl } from '@angular/forms';
import { IMultiSelectOption } from 'ng-select-pro';

control = new FormControl<IMultiSelectOption[]>([]);
```

```html
<ng-multiselect [formControl]="control" [options]="options"></ng-multiselect>
```

---

## Option Interface

```typescript
interface IMultiSelectOption {
  id: any;          // Unique identifier
  label: string;    // Display text
  disabled?: boolean; // Prevent selection
  group?: string;   // Group header label
  image?: string;   // Image URL shown in option row
  tooltip?: string; // Native browser tooltip
  data?: any;       // Arbitrary extra data
}
```

---

## Configuration Reference

All config options are available via `[config]="{ ... }"`:

| Option | Type | Default | Description |
|---|---|---|---|
| `mode` | `'multi' \| 'single'` | `'multi'` | Selection mode |
| `searchEnabled` | `boolean` | `true` | Show search input |
| `searchPlaceholder` | `string` | `'Search...'` | Search input placeholder |
| `placeholder` | `string` | `'Select options'` | Placeholder when empty |
| `maxSelect` | `number \| null` | `null` | Max selections (null = unlimited) |
| `maxDisplayed` | `number` | `3` | Max badges shown before +N overflow |
| `selectionLimit` | `number \| null` | `null` | Alias for maxSelect (legacy) |
| `disabled` | `boolean` | `false` | Disable entire component |
| `closeOnSelect` | `boolean` | `false` | Auto-close after each selection |
| `showSelectAll` | `boolean` | `true` | Show Select All link (multi only) |
| `showClearAll` | `boolean` | `true` | Show × clear button |
| `labelRenderer` | `((opt) => string) \| null` | `null` | Custom badge label function |
| `itemRenderer` | `((opt) => string) \| null` | `null` | Custom option label (supports HTML) |
| `noResultsText` | `string` | `'No results found'` | Empty search state text |
| `loadingText` | `string` | `'Loading...'` | Loading state text |
| `loading` | `boolean` | `false` | Show loading spinner |
| `autoClose` | `boolean` | `true` | Close on outside click |
| `dropdownPosition` | `'auto' \| 'top' \| 'bottom'` | `'auto'` | Dropdown direction |
| `theme` | `IMultiSelectTheme` | See below | CSS class overrides |

### Theme object

| Key | Purpose |
|---|---|
| `containerClass` | Applied to the trigger container |
| `dropdownClass` | Applied to the dropdown panel |
| `searchClass` | Applied to the search `<input>` |
| `itemClass` | Applied to each option row |
| `selectedItemClass` | Applied to selected option labels |
| `disabledItemClass` | Applied to disabled option rows |
| `badgeClass` | Applied to each selected badge |
| `overflowBadgeClass` | Applied to the +N overflow badge |
| `clearBtnClass` | Applied to the × clear button |
| `selectAllClass` | Applied to the select-all row |

---

## Outputs

| Output | Type | When |
|---|---|---|
| `selectionChange` | `EventEmitter<IMultiSelectOption[]>` | Selection changes |
| `searchChange` | `EventEmitter<string>` | User types in search |
| `dropdownOpen` | `EventEmitter<void>` | Dropdown opens |
| `dropdownClose` | `EventEmitter<void>` | Dropdown closes |

---

## Global defaults via injection token

```typescript
import { MULTI_SELECT_DEFAULT_CONFIG } from 'ng-select-pro';

// In your module or providers array:
{
  provide: MULTI_SELECT_DEFAULT_CONFIG,
  useValue: {
    placeholder: 'Choose...',
    maxDisplayed: 2,
    searchEnabled: false
  }
}
```

---

## Theming

### CSS Custom Properties

Override any visual value by setting CSS variables on `:root` or a parent element:

```css
:root {
  --ng-select-border: 1px solid #6366f1;
  --ng-select-border-radius: 12px;
  --ng-select-badge-bg: #eef2ff;
  --ng-select-badge-text: #4f46e5;
  --ng-select-item-hover-bg: #eef2ff;
  --ng-select-item-selected-bg: #e0e7ff;
  --ng-select-item-selected-text: #3730a3;
  --ng-select-font-size: 13px;
  --ng-select-max-height: 320px;
}
```

Full variable list:

| Variable | Default | Purpose |
|---|---|---|
| `--ng-select-border` | `1px solid #d1d5db` | Container border |
| `--ng-select-border-radius` | `8px` | Corner radius |
| `--ng-select-bg` | `#ffffff` | Container background |
| `--ng-select-text` | `#111827` | Text color |
| `--ng-select-placeholder` | `#9ca3af` | Placeholder color |
| `--ng-select-dropdown-bg` | `#ffffff` | Dropdown background |
| `--ng-select-dropdown-shadow` | subtle shadow | Dropdown elevation |
| `--ng-select-item-hover-bg` | `#f9fafb` | Hovered option background |
| `--ng-select-item-selected-bg` | `#eff6ff` | Selected option background |
| `--ng-select-item-selected-text` | `#1d4ed8` | Selected option text |
| `--ng-select-badge-bg` | `#dbeafe` | Badge background |
| `--ng-select-badge-text` | `#1e40af` | Badge text |
| `--ng-select-badge-radius` | `4px` | Badge corner radius |
| `--ng-select-search-border` | `1px solid #e5e7eb` | Search input border |
| `--ng-select-disabled-opacity` | `0.5` | Disabled element opacity |
| `--ng-select-font-size` | `14px` | Base font size |
| `--ng-select-max-height` | `280px` | Dropdown max height |

### Tailwind CSS

See [docs/tailwind-integration.md](docs/tailwind-integration.md).

### Angular Material

See [docs/material-integration.md](docs/material-integration.md).

Add `.ng-select-material` class to the host for a Material Design appearance.

---

## Keyboard Navigation

| Key | Action |
|---|---|
| `↓` ArrowDown | Open dropdown / move focus down |
| `↑` ArrowUp | Move focus up |
| `Enter` | Open dropdown / select focused option |
| `Escape` | Close dropdown |
| `Tab` | Close dropdown and move focus |

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes with tests
4. Run tests: `npm test`
5. Run lint: `npm run lint`
6. Submit a PR against `main`

### Development Setup

```bash
git clone https://github.com/your-org/ng-select-pro.git
cd ng-select-pro
npm install
npm run build:lib       # Build the library
npm start               # Start demo app at localhost:4200
npm test                # Run library tests
```

---

## License

MIT © your-org
