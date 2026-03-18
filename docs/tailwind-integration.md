# Tailwind CSS Integration Guide

`ng-select-pro` ships with zero Tailwind dependency but is designed to work seamlessly with Tailwind CSS. There are two approaches:

---

## Approach 1 — Use the `theme` config option (recommended)

Pass Tailwind utility classes directly via the `[config]` input. This leaves all built-in structure intact while giving you full visual control.

```html
<ng-multiselect
  [(ngModel)]="selected"
  [options]="options"
  [config]="{
    theme: {
      containerClass: 'border border-gray-300 rounded-lg shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500',
      dropdownClass: 'border border-gray-200 rounded-lg shadow-lg mt-1',
      searchClass: 'border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400',
      itemClass: 'hover:bg-blue-50 px-3 py-2 rounded-md mx-1 cursor-pointer',
      selectedItemClass: 'bg-blue-50 text-blue-700 font-medium',
      disabledItemClass: 'opacity-40 cursor-not-allowed',
      badgeClass: 'bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-medium',
      overflowBadgeClass: 'bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 text-xs',
      clearBtnClass: 'text-gray-400 hover:text-gray-600',
      selectAllClass: 'border-b border-gray-100 py-1'
    }
  }"
></ng-multiselect>
```

---

## Approach 2 — Strip defaults with `.ng-select-tailwind`

Add the `ng-select-tailwind` class to the component host. This removes ALL built-in visual styles so you can compose entirely from scratch using Tailwind classes in the `theme` config:

```html
<ng-multiselect
  class="ng-select-tailwind"
  [(ngModel)]="selected"
  [options]="options"
  [config]="{
    theme: {
      containerClass: 'flex items-center border-2 border-gray-200 rounded-xl px-3 py-2 min-h-[42px] bg-white cursor-pointer transition hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200',
      dropdownClass: 'border border-gray-100 rounded-xl shadow-2xl overflow-hidden',
      searchClass: 'w-full text-sm px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:bg-white focus:border-blue-400',
      itemClass: 'flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-indigo-50 hover:text-indigo-700',
      selectedItemClass: 'bg-indigo-50 text-indigo-700 font-semibold',
      badgeClass: 'inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 rounded-full pl-2.5 pr-1.5 py-0.5 text-xs font-semibold',
      overflowBadgeClass: 'inline-flex items-center bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 text-xs font-semibold',
      clearBtnClass: 'text-gray-300 hover:text-gray-500 transition',
      selectAllClass: '',
      disabledItemClass: 'opacity-30 pointer-events-none',
    }
  }"
></ng-multiselect>
```

---

## Approach 3 — Override CSS custom properties in your Tailwind config

You can also set `ng-select-pro` CSS variables globally in your `tailwind.config.js` to match your design system tokens:

```js
// tailwind.config.js
module.exports = {
  // ...
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        ':root': {
          '--ng-select-border': `1px solid ${theme('colors.gray.300')}`,
          '--ng-select-border-radius': theme('borderRadius.lg'),
          '--ng-select-bg': theme('colors.white'),
          '--ng-select-text': theme('colors.gray.900'),
          '--ng-select-placeholder': theme('colors.gray.400'),
          '--ng-select-dropdown-bg': theme('colors.white'),
          '--ng-select-dropdown-shadow': theme('boxShadow.lg'),
          '--ng-select-item-hover-bg': theme('colors.blue.50'),
          '--ng-select-item-selected-bg': theme('colors.blue.100'),
          '--ng-select-item-selected-text': theme('colors.blue.700'),
          '--ng-select-badge-bg': theme('colors.blue.100'),
          '--ng-select-badge-text': theme('colors.blue.700'),
          '--ng-select-badge-radius': theme('borderRadius.full'),
          '--ng-select-font-size': theme('fontSize.sm'),
          '--ng-select-disabled-opacity': '0.4',
          '--ng-select-max-height': '280px',
        },
      });
    },
  ],
};
```

Or in your global `styles.css` / `styles.scss`:

```css
:root {
  --ng-select-border: 1px solid theme('colors.gray.300');
  --ng-select-border-radius: 0.5rem;
  --ng-select-badge-bg: #dbeafe;
  --ng-select-badge-text: #1e40af;
}
```

---

## Content security with Tailwind's safelist

If you pass Tailwind classes dynamically (from a backend/API), add them to the Tailwind safelist to prevent purging:

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  safelist: [
    // ng-select-pro theme classes used dynamically
    'border', 'border-gray-300', 'rounded-lg', 'bg-blue-50',
    'text-blue-700', 'font-medium', 'shadow-sm',
    { pattern: /^(bg|text|border|rounded|px|py|hover:bg|focus:)/ }
  ],
};
```

---

## Complete example with Tailwind dark mode

```html
<ng-multiselect
  class="ng-select-tailwind"
  [(ngModel)]="selected"
  [options]="options"
  [config]="{
    placeholder: 'Choose frameworks...',
    theme: {
      containerClass: 'border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 px-3 py-2 min-h-[40px] flex items-center cursor-pointer',
      dropdownClass: 'border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl bg-white dark:bg-gray-800',
      itemClass: 'px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100',
      badgeClass: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full px-2 text-xs font-medium',
      searchClass: 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm px-3 py-2 w-full outline-none',
      selectedItemClass: '',
      disabledItemClass: '',
      clearBtnClass: '',
      selectAllClass: '',
      overflowBadgeClass: ''
    }
  }"
></ng-multiselect>
```
