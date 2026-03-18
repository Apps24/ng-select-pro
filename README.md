# ng-select-pro

[![npm version](https://img.shields.io/npm/v/@apps24/ng-select-pro.svg)](https://www.npmjs.com/package/@apps24/ng-select-pro)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-8%2B-red.svg)](https://angular.io)
[![Build Status](https://github.com/apps24/ng-select-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/apps24/ng-select-pro/actions)

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
npm install @apps24/ng-select-pro
```

> ⚠️ **`@angular/cdk` required peer dependency**
>
> This library uses `@angular/cdk` for virtual scrolling. If your project does not already have `@angular/cdk` installed, install it first at the **same major version as your Angular** to avoid peer dependency conflicts:
>
> ```bash
> npm install @angular/cdk@16   # for Angular 16
> npm install @angular/cdk@17   # for Angular 17
> npm install @angular/cdk@18   # for Angular 18
> npm install @angular/cdk@19   # for Angular 19
> npm install @angular/cdk@20   # for Angular 20
> ```
>
> Not sure which version you have? Run `ng version` in your project directory.

---

## Quick Start

### Step 1 — Import the module

**Module-based app (Angular 8–16):**
```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MultiSelectModule } from '@apps24/ng-select-pro';

@NgModule({
  imports: [
    BrowserAnimationsModule,  // required for dropdown animation
    FormsModule,
    MultiSelectModule
  ]
})
export class AppModule {}
```

**Standalone app (Angular 14+):**
```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from '@apps24/ng-select-pro';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    importProvidersFrom(FormsModule, MultiSelectModule)
  ]
});
```

### Step 2 — Use in your component

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { IMultiSelectOption } from '@apps24/ng-select-pro';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  selected: IMultiSelectOption[] = [];

  options: IMultiSelectOption[] = [
    { id: 1, label: 'Angular' },
    { id: 2, label: 'React' },
    { id: 3, label: 'Vue' }
  ];
}
```

```html
<!-- app.component.html -->
<ng-multiselect
  [(ngModel)]="selected"
  [options]="options"
></ng-multiselect>

<p>Selected: {{ selected | json }}</p>
```

---

## Complete Real-World Demo

A complete example showing multi-select, single-select, grouped options, reactive forms, max selection, disabled items, and event handling — all in one component.

### Component TypeScript

```typescript
// user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMultiSelectOption, IMultiSelectConfig } from '@apps24/ng-select-pro';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  form!: FormGroup;

  // ── Skills multi-select ──────────────────────────────────────────────────
  skillOptions: IMultiSelectOption[] = [
    { id: 'angular',     label: 'Angular',     group: 'Frontend' },
    { id: 'react',       label: 'React',       group: 'Frontend' },
    { id: 'vue',         label: 'Vue.js',      group: 'Frontend' },
    { id: 'nodejs',      label: 'Node.js',     group: 'Backend'  },
    { id: 'python',      label: 'Python',      group: 'Backend'  },
    { id: 'go',          label: 'Go',          group: 'Backend'  },
    { id: 'postgres',    label: 'PostgreSQL',  group: 'Database' },
    { id: 'mongo',       label: 'MongoDB',     group: 'Database' },
    { id: 'redis',       label: 'Redis',       group: 'Database' },
    { id: 'docker',      label: 'Docker',      group: 'DevOps'   },
    { id: 'k8s',         label: 'Kubernetes',  group: 'DevOps'   },
  ];

  skillConfig: Partial<IMultiSelectConfig> = {
    placeholder: 'Select your skills',
    searchPlaceholder: 'Search skills...',
    maxSelect: 5,
    maxDisplayed: 3,
    showSelectAll: false,
    showClearAll: true
  };

  // ── Country single-select ────────────────────────────────────────────────
  countryOptions: IMultiSelectOption[] = [
    { id: 'us', label: 'United States', group: 'Americas' },
    { id: 'ca', label: 'Canada',        group: 'Americas' },
    { id: 'gb', label: 'United Kingdom',group: 'Europe'   },
    { id: 'de', label: 'Germany',       group: 'Europe'   },
    { id: 'fr', label: 'France',        group: 'Europe'   },
    { id: 'jp', label: 'Japan',         group: 'Asia'     },
    { id: 'in', label: 'India',         group: 'Asia'     },
  ];

  countryConfig: Partial<IMultiSelectConfig> = {
    mode: 'single',
    placeholder: 'Select country',
    closeOnSelect: true,
    showSelectAll: false,
    showClearAll: true
  };

  // ── Role select (disabled items) ─────────────────────────────────────────
  roleOptions: IMultiSelectOption[] = [
    { id: 'dev',     label: 'Developer'                                    },
    { id: 'lead',    label: 'Tech Lead'                                    },
    { id: 'mgr',     label: 'Engineering Manager'                          },
    { id: 'arch',    label: 'Architect'                                    },
    { id: 'cto',     label: 'CTO',     disabled: true, tooltip: 'Contact sales' },
    { id: 'vp',      label: 'VP Eng',  disabled: true, tooltip: 'Contact sales' },
  ];

  roleConfig: Partial<IMultiSelectConfig> = {
    mode: 'single',
    placeholder: 'Select your role',
    closeOnSelect: true,
    showSelectAll: false
  };

  // ── Event log ─────────────────────────────────────────────────────────────
  events: string[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:    ['', Validators.required],
      skills:  [[], Validators.required],
      country: [null, Validators.required],
      role:    [null, Validators.required]
    });
  }

  onSkillsChange(selected: IMultiSelectOption[]): void {
    this.events.unshift(`Skills changed → ${selected.map(s => s.label).join(', ') || 'none'}`);
  }

  onCountryChange(selected: IMultiSelectOption[]): void {
    this.events.unshift(`Country changed → ${selected[0]?.label || 'none'}`);
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form value:', this.form.value);
      this.events.unshift('Form submitted ✓');
    }
  }
}
```

### Component Template

```html
<!-- user-form.component.html -->
<form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">

  <!-- Name field -->
  <div class="field">
    <label>Full Name</label>
    <input formControlName="name" type="text" placeholder="John Doe" />
  </div>

  <!-- Skills — multi-select, max 5, grouped, with search -->
  <div class="field">
    <label>Skills <small>(max 5)</small></label>
    <ng-multiselect
      formControlName="skills"
      [options]="skillOptions"
      [config]="skillConfig"
      (selectionChange)="onSkillsChange($event)"
    ></ng-multiselect>
    <small *ngIf="form.get('skills')?.invalid && form.get('skills')?.touched">
      Please select at least one skill.
    </small>
  </div>

  <!-- Country — single-select with groups -->
  <div class="field">
    <label>Country</label>
    <ng-multiselect
      formControlName="country"
      [options]="countryOptions"
      [config]="countryConfig"
      (selectionChange)="onCountryChange($event)"
    ></ng-multiselect>
  </div>

  <!-- Role — single-select with some disabled options -->
  <div class="field">
    <label>Role</label>
    <ng-multiselect
      formControlName="role"
      [options]="roleOptions"
      [config]="roleConfig"
    ></ng-multiselect>
  </div>

  <button type="submit" [disabled]="form.invalid">Submit</button>

</form>

<!-- Event log -->
<div class="event-log" *ngIf="events.length">
  <h4>Events</h4>
  <p *ngFor="let e of events">{{ e }}</p>
</div>
```

### Component Styles

```scss
/* user-form.component.scss */
.form {
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-weight: 600;
    font-size: 14px;
    color: #374151;
  }

  small {
    color: #ef4444;
    font-size: 12px;
  }

  input {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    outline: none;

    &:focus { border-color: #3b82f6; }
  }
}

button[type="submit"] {
  padding: 10px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;

  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:hover:not(:disabled) { background: #2563eb; }
}

.event-log {
  margin-top: 24px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 13px;
  color: #475569;
}
```

### Module Registration

```typescript
// user-form.module.ts  (or add to AppModule)
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MultiSelectModule } from '@apps24/ng-select-pro';
import { UserFormComponent } from './user-form.component';

@NgModule({
  declarations: [UserFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MultiSelectModule
  ],
  exports: [UserFormComponent]
})
export class UserFormModule {}
```

---

## More Usage Examples

### ngModel (template-driven form)

```typescript
selectedFruits: IMultiSelectOption[] = [];
fruits: IMultiSelectOption[] = [
  { id: 1, label: 'Apple' },
  { id: 2, label: 'Banana' },
  { id: 3, label: 'Cherry' }
];
```

```html
<ng-multiselect [(ngModel)]="selectedFruits" [options]="fruits"></ng-multiselect>
<p>You selected: {{ selectedFruits.map(o => o.label).join(', ') }}</p>
```

---

### Single select mode

```html
<ng-multiselect
  [(ngModel)]="selectedCountry"
  [options]="countryOptions"
  [config]="{ mode: 'single', closeOnSelect: true, showSelectAll: false }"
></ng-multiselect>
```

---

### Max selections (e.g. pick up to 3 tags)

```html
<ng-multiselect
  [(ngModel)]="selectedTags"
  [options]="tagOptions"
  [config]="{ maxSelect: 3, placeholder: 'Pick up to 3 tags' }"
></ng-multiselect>
```

---

### Loading state (async options)

```typescript
isLoading = true;
options: IMultiSelectOption[] = [];

ngOnInit() {
  this.api.getOptions().subscribe(data => {
    this.options = data;
    this.isLoading = false;
  });
}
```

```html
<ng-multiselect
  [(ngModel)]="selected"
  [options]="options"
  [config]="{ loading: isLoading, loadingText: 'Fetching options...' }"
></ng-multiselect>
```

---

### Custom item renderer (with HTML)

```typescript
config: Partial<IMultiSelectConfig> = {
  itemRenderer: (opt) => `<strong>${opt.label}</strong> <small style="color:#9ca3af">#${opt.id}</small>`
};
```

```html
<ng-multiselect [(ngModel)]="selected" [options]="options" [config]="config"></ng-multiselect>
```

---

### Listen to events

```html
<ng-multiselect
  [(ngModel)]="selected"
  [options]="options"
  (selectionChange)="onSelectionChange($event)"
  (searchChange)="onSearch($event)"
  (dropdownOpen)="onOpen()"
  (dropdownClose)="onClose()"
></ng-multiselect>
```

```typescript
onSelectionChange(selected: IMultiSelectOption[]) {
  console.log('Selected:', selected);
}

onSearch(query: string) {
  // Can be used to trigger remote search
  console.log('Search query:', query);
}
```

---

## Option Interface

```typescript
interface IMultiSelectOption {
  id: any;           // Unique identifier
  label: string;     // Display text
  disabled?: boolean;// Prevent selection (greyed out)
  group?: string;    // Group header label
  image?: string;    // Image URL shown in option row
  tooltip?: string;  // Native browser tooltip on hover
  data?: any;        // Store any extra data (not rendered)
}
```

---

## Configuration Reference

All options are passed via `[config]="{ ... }"`:

| Option | Type | Default | Description |
|---|---|---|---|
| `mode` | `'multi' \| 'single'` | `'multi'` | Selection mode |
| `searchEnabled` | `boolean` | `true` | Show search input |
| `searchPlaceholder` | `string` | `'Search...'` | Search input placeholder |
| `placeholder` | `string` | `'Select options'` | Placeholder when empty |
| `maxSelect` | `number \| null` | `null` | Max selections (null = unlimited) |
| `maxDisplayed` | `number` | `3` | Max badges shown before +N overflow |
| `disabled` | `boolean` | `false` | Disable entire component |
| `closeOnSelect` | `boolean` | `false` | Auto-close after each selection |
| `showSelectAll` | `boolean` | `true` | Show Select All link (multi only) |
| `showClearAll` | `boolean` | `true` | Show × clear button |
| `labelRenderer` | `((opt) => string) \| null` | `null` | Custom badge label function |
| `itemRenderer` | `((opt) => string) \| null` | `null` | Custom option HTML (supports HTML) |
| `noResultsText` | `string` | `'No results found'` | Empty search state text |
| `loadingText` | `string` | `'Loading...'` | Loading state text |
| `loading` | `boolean` | `false` | Show loading spinner |
| `autoClose` | `boolean` | `true` | Close on outside click |
| `dropdownPosition` | `'auto' \| 'top' \| 'bottom'` | `'auto'` | Dropdown direction |
| `theme` | `IMultiSelectTheme` | — | CSS class overrides per slot |

### Theme object

| Key | Applied to |
|---|---|
| `containerClass` | Trigger container div |
| `dropdownClass` | Dropdown panel div |
| `searchClass` | Search `<input>` |
| `itemClass` | Each option row |
| `selectedItemClass` | Selected option rows |
| `disabledItemClass` | Disabled option rows |
| `badgeClass` | Each selected badge |
| `overflowBadgeClass` | The +N overflow badge |
| `clearBtnClass` | Clear all × button |
| `selectAllClass` | Select all row |

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

Set defaults once for the entire app:

```typescript
import { MULTI_SELECT_DEFAULT_CONFIG } from '@apps24/ng-select-pro';

// app.module.ts
providers: [
  {
    provide: MULTI_SELECT_DEFAULT_CONFIG,
    useValue: {
      placeholder: 'Choose...',
      maxDisplayed: 2,
      showSelectAll: false
    }
  }
]
```

Or use `forRoot()`:

```typescript
MultiSelectModule.forRoot({
  placeholder: 'Choose...',
  maxDisplayed: 2,
  showSelectAll: false
})
```

---

## Theming

### CSS Custom Properties

Override any visual value on `:root` or a parent selector:

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

| Variable | Default | Purpose |
|---|---|---|
| `--ng-select-border` | `1px solid #d1d5db` | Container border |
| `--ng-select-border-radius` | `8px` | Corner radius |
| `--ng-select-bg` | `#ffffff` | Container background |
| `--ng-select-text` | `#111827` | Text color |
| `--ng-select-placeholder` | `#9ca3af` | Placeholder color |
| `--ng-select-dropdown-bg` | `#ffffff` | Dropdown background |
| `--ng-select-dropdown-shadow` | subtle shadow | Dropdown elevation |
| `--ng-select-item-hover-bg` | `#f9fafb` | Hovered option bg |
| `--ng-select-item-selected-bg` | `#eff6ff` | Selected option bg |
| `--ng-select-item-selected-text` | `#1d4ed8` | Selected option text |
| `--ng-select-badge-bg` | `#dbeafe` | Badge background |
| `--ng-select-badge-text` | `#1e40af` | Badge text |
| `--ng-select-badge-radius` | `4px` | Badge corner radius |
| `--ng-select-search-border` | `1px solid #e5e7eb` | Search input border |
| `--ng-select-disabled-opacity` | `0.5` | Disabled opacity |
| `--ng-select-font-size` | `14px` | Base font size |
| `--ng-select-max-height` | `280px` | Dropdown max height |

### Tailwind CSS

See [Tailwind Integration Guide](https://github.com/apps24/ng-select-pro/blob/main/docs/tailwind-integration.md).

### Angular Material

Add `.ng-select-material` class to the host:

```html
<ng-multiselect class="ng-select-material" ...></ng-multiselect>
```

See [Angular Material Integration Guide](https://github.com/apps24/ng-select-pro/blob/main/docs/material-integration.md).

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
git clone https://github.com/apps24/ng-select-pro.git
cd ng-select-pro
npm install
npm run build:lib    # Build the library
npm start            # Start demo app at localhost:4200
npm test             # Run library unit tests
```

---

## License

MIT © apps24
