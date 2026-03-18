# Angular Material Integration Guide

`ng-select-pro` ships with a built-in Material Design theme. Activate it by adding the `ng-select-material` class to the component host.

---

## Quick start

```html
<ng-multiselect
  class="ng-select-material"
  [(ngModel)]="selected"
  [options]="options"
></ng-multiselect>
```

This activates Material-style aesthetics:
- Flat bottom border underline (no box border)
- Rounded top corners (`4px 4px 0 0`)
- Indigo/blue accent color (`#3f51b5`)
- Elevated dropdown shadow (Material `elevation-8`)
- Pill-shaped badges

---

## Match your Material theme palette

Override CSS variables to match your application's Material theme:

```scss
// styles.scss

// Using Angular Material 15+ theme colors
ng-multiselect.ng-select-material {
  // Primary color (mat.get-color-from-palette($primary, 500))
  --ng-select-item-selected-bg: rgba(var(--mat-primary-rgb, 63, 81, 181), 0.08);
  --ng-select-item-selected-text: rgb(var(--mat-primary-rgb, 63, 81, 181));
  --ng-select-badge-bg: rgba(var(--mat-primary-rgb, 63, 81, 181), 0.12);
  --ng-select-badge-text: rgb(var(--mat-primary-rgb, 63, 81, 181));

  .ng-select-container {
    border-bottom-color: var(--mat-divider-color, #bdbdbd);

    &.ng-select--open,
    &:focus-within {
      border-bottom-color: rgb(var(--mat-primary-rgb, 63, 81, 181));
    }
  }
}
```

---

## Using with Angular Material 17 (M3 tokens)

```scss
@use '@angular/material' as mat;

ng-multiselect.ng-select-material {
  --ng-select-font-size: #{mat.get-theme-typography($theme, body-medium, font-size)};
  --ng-select-bg: #{mat.get-theme-color($theme, surface)};
  --ng-select-text: #{mat.get-theme-color($theme, on-surface)};
  --ng-select-item-selected-bg: #{mat.get-theme-color($theme, primary-container)};
  --ng-select-item-selected-text: #{mat.get-theme-color($theme, on-primary-container)};
  --ng-select-badge-bg: #{mat.get-theme-color($theme, secondary-container)};
  --ng-select-badge-text: #{mat.get-theme-color($theme, on-secondary-container)};
}
```

---

## Matching mat-form-field appearance

To make the component look exactly like a `mat-form-field` with `appearance="fill"`:

```scss
ng-multiselect.ng-select-material {
  .ng-select-container {
    background: #f5f5f5;
    border-radius: 4px 4px 0 0;
    padding: 12px 12px 4px;
    min-height: 56px;
    align-items: flex-end;

    &:hover {
      background: #eeeeee;
    }
  }
}
```

For `appearance="outline"`:

```scss
ng-multiselect.ng-select-material-outline {
  --ng-select-border: 1px solid rgba(0, 0, 0, 0.12);
  --ng-select-border-radius: 4px;

  .ng-select-container {
    &:hover {
      --ng-select-border: 1px solid rgba(0, 0, 0, 0.87);
    }

    &.ng-select--open,
    &:focus-within {
      --ng-select-border: 2px solid #3f51b5;
    }
  }
}
```

---

## Ripple effect (optional)

Add Material ripple effect to dropdown items by importing `MatRippleModule`:

```typescript
// your.module.ts
import { MatRippleModule } from '@angular/material/core';
```

Then pass a class and add ripple manually, or use `ng-select-pro`'s `itemClass`:

```html
<ng-multiselect
  class="ng-select-material"
  [config]="{ theme: { itemClass: 'mat-mdc-option' } }"
  ...
></ng-multiselect>
```

---

## Full working example

```typescript
// component.ts
import { Component } from '@angular/core';
import { IMultiSelectOption, IMultiSelectConfig } from 'ng-select-pro';

@Component({
  template: `
    <mat-form-field appearance="fill" style="width: 100%">
      <mat-label>Technologies</mat-label>
      <ng-multiselect
        class="ng-select-material"
        [(ngModel)]="selected"
        [options]="options"
        [config]="config"
        style="margin-top: 4px"
      ></ng-multiselect>
    </mat-form-field>
  `
})
export class MyComponent {
  selected: IMultiSelectOption[] = [];
  options: IMultiSelectOption[] = [
    { id: 'ng', label: 'Angular' },
    { id: 'ts', label: 'TypeScript' },
    { id: 'rxjs', label: 'RxJS' }
  ];
  config: Partial<IMultiSelectConfig> = {
    placeholder: 'Select technologies',
    maxDisplayed: 2
  };
}
```

---

## CSS variable reference (Material overrides)

| Variable | Material default | Purpose |
|---|---|---|
| `--ng-select-border` | `none` | Removes box border |
| `--ng-select-border-radius` | `4px 4px 0 0` | Top-only radius |
| `--ng-select-bg` | `#f5f5f5` | Fill background |
| `--ng-select-dropdown-shadow` | Material elevation 8 | Dropdown shadow |
| `--ng-select-item-selected-bg` | `rgba(63,81,181,0.08)` | Selected item background |
| `--ng-select-item-selected-text` | `#3f51b5` | Selected item text |
| `--ng-select-badge-bg` | `#e8eaf6` | Badge background |
| `--ng-select-badge-text` | `#3f51b5` | Badge text |
| `--ng-select-badge-radius` | `16px` | Pill shape |
