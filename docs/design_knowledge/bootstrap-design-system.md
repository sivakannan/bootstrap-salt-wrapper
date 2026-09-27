# Bootstrap 5 Design System — Knowledge Guide

**Document Version:** 1.0  
**Target Version:** Bootstrap 5.3.x  
**Scope:** Core architecture, Design Tokens, Grid & Layout, Typography, Component System, and Dark Mode

---

## 1. Overview & Philosophy

**Bootstrap** is an open-source, mobile-first frontend toolkit created by Mark Otto and Jacob Thornton at Twitter. Bootstrap 5 marks a major architectural milestone:
- **No jQuery dependency**: Entirely native ES6 JavaScript.
- **CSS Custom Properties (Variables)**: Dynamic runtime theming without requiring Sass recompilation.
- **Color Modes & Dark Mode**: Native support via `data-bs-theme="dark"`.
- **Utility API**: Powerful utility generator built with Sass maps.

Bootstrap is designed for rapid development, consistent layout grids, and broad consumer-facing and administrative web applications.

---

## 2. Core Design Tokens (CSS Custom Properties)

Bootstrap 5 exposes runtime CSS variables prefixed with `--bs-`:

### 2.1 Theme Colors
```css
:root {
  --bs-primary: #0d6efd;
  --bs-secondary: #6c757d;
  --bs-success: #198754;
  --bs-info: #0dcaf0;
  --bs-warning: #ffc107;
  --bs-danger: #dc3545;
  --bs-light: #f8f9fa;
  --bs-dark: #212529;

  /* Subtle background and emphasis tints (v5.3+) */
  --bs-primary-bg-subtle: #cfe2ff;
  --bs-primary-text-emphasis: #052c65;
  --bs-primary-border-subtle: #9ec5fe;
  
  --bs-success-bg-subtle: #d1e7dd;
  --bs-success-text-emphasis: #0a3622;
  
  --bs-danger-bg-subtle: #f8d7da;
  --bs-danger-text-emphasis: #58151c;
}
```

### 2.2 Body & Surface Tokens
```css
:root {
  --bs-body-color: #212529;
  --bs-body-bg: #ffffff;
  --bs-secondary-color: rgba(33, 37, 41, 0.75);
  --bs-secondary-bg: #e9ecef;
  --bs-tertiary-bg: #f8f9fa;
  --bs-border-color: #dee2e6;
  --bs-border-color-translucent: rgba(0, 0, 0, 0.175);
}
```

### 2.3 Typography Tokens
```css
:root {
  --bs-body-font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif;
  --bs-body-font-size: 1rem;       /* 16px */
  --bs-body-font-weight: 400;
  --bs-body-line-height: 1.5;
  --bs-font-sans-serif: system-ui, -apple-system, "Segoe UI", Roboto, ...;
  --bs-font-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
```

### 2.4 Border Radius & Elevation Tokens
```css
:root {
  --bs-border-radius: 0.375rem;    /* 6px */
  --bs-border-radius-sm: 0.25rem; /* 4px */
  --bs-border-radius-lg: 0.5rem;  /* 8px */
  --bs-border-radius-xl: 1rem;    /* 16px */
  --bs-border-radius-2xl: 2rem;   /* 32px */
  --bs-border-radius-pill: 50rem;

  --bs-box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  --bs-box-shadow-sm: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  --bs-box-shadow-lg: 0 1rem 3rem rgba(0, 0, 0, 0.175);
}
```

---

## 3. Grid & Layout System

Bootstrap uses a **12-column flexbox grid** with 6 default responsive breakpoints:

| Breakpoint | Infix | Min-Width | Target Device |
| :--- | :--- | :--- | :--- |
| Extra small | *(none)* | `< 576px` | Portrait mobile phones |
| Small | `sm` | `≥ 576px` | Landscape phones |
| Medium | `md` | `≥ 768px` | Tablets |
| Large | `lg` | `≥ 992px` | Desktops / Laptops |
| Extra large | `xl` | `≥ 1200px`| Large desktop monitors |
| Extra extra large | `xxl` | `≥ 1400px`| Ultra-wide displays |

### Containers & Rows
- `.container`: Responsive fixed-width container with responsive max-widths.
- `.container-fluid`: Full-width 100% container spanning the entire viewport.
- `.row`: Flex wrapper with negative margins to compensate for column padding (`--bs-gutter-x`, `--bs-gutter-y`).
- `.col-*`: Auto-layout or sized flex children (`col-1` to `col-12`, `col-lg-6`).

---

## 4. Key Component Architecture

### 4.1 Form Controls (`.form-control`, `.form-select`, `.form-range`)
- **Structure**: High-contrast, full-border inputs with 1px border (`#dee2e6`), `0.375rem` border-radius, and standard `0.375rem 0.75rem` padding.
- **Focus State**: Glowing blue box-shadow focus ring:
  ```css
  .form-control:focus {
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }
  ```

### 4.2 Buttons (`.btn`, `.btn-*`)
- Standardized heights, `0.375rem` border-radius, `font-weight: 400`, `text-transform: none` (sentence case).
- Variants: `.btn-primary`, `.btn-secondary`, `.btn-outline-*`.

### 4.3 Modals (`.modal`, `.modal-dialog`, `.modal-backdrop`)
- Rendered with a floating dialog card centered on screen.
- Scrim / Backdrop: Fixed overlay with `background-color: #000; opacity: 0.5;` (`.modal-backdrop.show`).
- Close button: Top-right `.btn-close` using an SVG background image with opacity hover transition.

### 4.4 Accordions (`.accordion`, `.accordion-button`)
- Collapsible cards with chevron toggle indicator that rotates 180° on expand.
- Expanded State Styling:
  ```css
  .accordion-button:not(.collapsed) {
    color: var(--bs-primary-text-emphasis, #052c65);
    background-color: var(--bs-primary-bg-subtle, #cfe2ff);
    box-shadow: inset 0 calc(-1 * var(--bs-accordion-border-width)) 0 var(--bs-accordion-border-color);
  }
  ```

### 4.5 Tables (`.table`, `.table-hover`)
- Transparent backgrounds with border-bottom divider lines (`#dee2e6`).
- Monospace support for numeric/financial data via `.font-monospace`.

### 4.6 Progress Bars (`.progress`, `.progress-bar`)
- Track height typically `1rem` or `0.5rem` (`8px`), with `border-radius: 0.375rem` and background `#e9ecef`.
- Inner bar fills horizontally with `--bs-primary` (`#0d6efd`).

---

## 5. Color Modes & Dark Mode

In Bootstrap 5.3+, dark mode is activated by setting the attribute `data-bs-theme="dark"` on `<html>`, `<body>`, or any individual container:

```html
<html data-bs-theme="dark">
  ...
</html>
```

When active, Bootstrap redefines its variables dynamically:
- `--bs-body-bg`: `#212529`
- `--bs-body-color`: `#dee2e6`
- `--bs-border-color`: `#495057`
- `--bs-secondary-bg`: `#343a40`
- `--bs-tertiary-bg`: `#2b3035`
