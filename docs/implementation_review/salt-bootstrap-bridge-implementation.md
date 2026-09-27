# Implementation Guide: Salt ↔ Bootstrap Bridge

**Document Version:** 1.0  
**Date:** 2026-09-27  
**Status:** Ready for Implementation  
**Related Design Doc:** [salt-bootstrap-bridge-LLD.md](file:///Users/sivakkannanr/.gemini/antigravity-ide/scratch/docs/design_review/salt-bootstrap-bridge-LLD.md)  
**Audience:** Frontend Developers implementing the bridge

---

## Table of Contents

1. [Prerequisites & Environment Setup](#1-prerequisites--environment-setup)
2. [Project Scaffolding](#2-project-scaffolding)
3. [Step-by-Step Implementation](#3-step-by-step-implementation)
4. [Token Audit Script](#4-token-audit-script)
5. [Testing Implementation](#5-testing-implementation)
6. [CI/CD Pipeline](#6-cicd-pipeline)
7. [Host App Integration Guide](#7-host-app-integration-guide)
8. [Storybook Component Gallery](#8-storybook-component-gallery)
9. [NPM Package Publishing](#9-npm-package-publishing)
10. [Git Workflow & Release Process](#10-git-workflow--release-process)
11. [Implementation Checklist](#11-implementation-checklist)
12. [Review & Sign-Off](#12-review--sign-off)

---

## 1. Prerequisites & Environment Setup

### 1.1 Required Dependencies

```bash
# Host application (already installed)
npm list bootstrap react react-dom
# Expected: bootstrap@5.3.x, react@18.x+, react-dom@18.x+

# Salt Design System (installed in the MFE)
npm list @salt-ds/core @salt-ds/theme
# Expected: @salt-ds/core@1.30+, @salt-ds/theme@1.28+
```

### 1.2 Install Missing Dependencies (if needed)

```bash
# In your MFE project
npm install @salt-ds/core @salt-ds/theme

# Dev dependencies for testing and auditing
npm install -D playwright @playwright/test stylelint
```

### 1.3 Verify Bootstrap CSS Variables Are Available

Run this in your browser console on the host app to confirm Bootstrap exposes CSS variables:

```js
// Should return a color value like "#0d6efd" or "rgb(13, 110, 253)"
getComputedStyle(document.documentElement).getPropertyValue('--bs-primary');

// Should return a font stack
getComputedStyle(document.documentElement).getPropertyValue('--bs-body-font-family');
```

> [!WARNING]
> If these return empty strings, your Bootstrap version may be too old (< 5.1.0) or Bootstrap CSS is loaded differently. Upgrade to Bootstrap 5.3+ or ensure the Bootstrap CSS is loaded at the `:root` level.

### 1.4 Directory Creation

```bash
# Create the bridge directory structure
mkdir -p src/styles/salt-bootstrap-bridge/scripts
mkdir -p src/components/SaltMFEWrapper
mkdir -p tests/visual
```

---

## 2. Project Scaffolding

After running the commands above, your structure should look like:

```
src/
├── styles/
│   └── salt-bootstrap-bridge/
│       ├── index.css                  ← Step 3.9
│       ├── _colors.css                ← Step 3.1
│       ├── _typography.css            ← Step 3.2
│       ├── _spacing.css               ← Step 3.3
│       ├── _borders.css               ← Step 3.4
│       ├── _shadows.css               ← Step 3.5
│       ├── _status.css                ← Step 3.6
│       ├── _dark-mode.css             ← Step 3.7
│       ├── _component-overrides.css   ← Step 3.8
│       └── scripts/
│           └── audit-tokens.js        ← Step 4
├── components/
│   └── SaltMFEWrapper/
│       ├── SaltMFEWrapper.tsx         ← Step 3.10
│       ├── SaltMFEWrapper.test.tsx    ← Step 5
│       └── index.ts                   ← Step 3.11
└── tests/
    └── visual/
        ├── bridge-visual.spec.ts      ← Step 5.2
        └── visual.config.ts           ← Step 5.3
```

---

## 3. Step-by-Step Implementation

> [!IMPORTANT]
> **Implementation order matters.** Follow the numbered steps below. Each step builds on the previous one. After completing each file, perform the verification check listed at the end of each step.

---

### 3.1 Colors CSS — `_colors.css`

This is the **most important file** — it handles all color token remapping for actionable elements, containers, content, navigation, editable inputs, selectable items, and overlays.

**File:** `src/styles/salt-bootstrap-bridge/_colors.css`

```css
/*
 * Salt-Bootstrap Bridge: Color Token Mappings
 * 
 * Maps Salt's color characteristics to Bootstrap 5 CSS variables.
 * 
 * CHARACTERISTIC GROUPS COVERED:
 *   - Actionable (buttons, links, interactive elements)
 *   - Container (cards, panels, dialogs, surfaces)
 *   - Content (text, icons, foreground elements)
 *   - Navigable (tabs, breadcrumbs, navigation items)
 *   - Editable (inputs, text areas, dropdowns)
 *   - Selectable (checkboxes, radio buttons, list selection)
 *   - Overlayable (dropdown menus, popovers, tooltip backgrounds)
 * 
 * CONVENTION:
 *   --salt-[token]: var(--bs-[equivalent], [hardcoded-fallback]);
 *   The fallback ensures this works even if Bootstrap vars are missing.
 * 
 * LAST UPDATED: 2026-09-27
 * BOOTSTRAP VERSION: 5.3.x
 * SALT VERSION: @salt-ds/theme >= 1.28.0
 */

.salt-bootstrap-compat {

  /* ════════════════════════════════════════════════════════════════
   * ACTIONABLE — Buttons, Links, Interactive Elements
   * ════════════════════════════════════════════════════════════════ */

  /* ── Primary Actions (filled buttons, primary links) ── */
  --salt-actionable-primary-background:          var(--bs-primary, #0d6efd);
  --salt-actionable-primary-background-hover:    var(--bs-primary-hover, #0b5ed7);
  --salt-actionable-primary-background-active:   #0a58ca;
  --salt-actionable-primary-background-disabled: var(--bs-secondary-bg, #e9ecef);
  --salt-actionable-primary-foreground:          #ffffff;
  --salt-actionable-primary-foreground-hover:    #ffffff;
  --salt-actionable-primary-foreground-active:   #ffffff;
  --salt-actionable-primary-foreground-disabled: var(--bs-secondary-color, #6c757d);
  --salt-actionable-primary-borderColor:         var(--bs-primary, #0d6efd);
  --salt-actionable-primary-borderColor-hover:   var(--bs-primary-hover, #0b5ed7);
  --salt-actionable-primary-borderColor-active:  #0a58ca;
  --salt-actionable-primary-borderColor-disabled: var(--bs-secondary-bg, #e9ecef);

  /* ── Secondary Actions (outline/ghost buttons) ── */
  --salt-actionable-secondary-background:          transparent;
  --salt-actionable-secondary-background-hover:    rgba(13, 110, 253, 0.08);
  --salt-actionable-secondary-background-active:   rgba(13, 110, 253, 0.12);
  --salt-actionable-secondary-background-disabled: transparent;
  --salt-actionable-secondary-foreground:          var(--bs-primary, #0d6efd);
  --salt-actionable-secondary-foreground-hover:    var(--bs-primary, #0d6efd);
  --salt-actionable-secondary-foreground-active:   var(--bs-primary, #0d6efd);
  --salt-actionable-secondary-foreground-disabled: var(--bs-secondary-color, #6c757d);
  --salt-actionable-secondary-borderColor:         var(--bs-primary, #0d6efd);
  --salt-actionable-secondary-borderColor-hover:   var(--bs-primary-hover, #0b5ed7);
  --salt-actionable-secondary-borderColor-disabled: var(--bs-secondary-bg, #e9ecef);

  /* ── CTA Actions (call-to-action, high emphasis) ── */
  --salt-actionable-cta-background:          var(--bs-success, #198754);
  --salt-actionable-cta-background-hover:    #157347;
  --salt-actionable-cta-background-active:   #146c43;
  --salt-actionable-cta-background-disabled: var(--bs-secondary-bg, #e9ecef);
  --salt-actionable-cta-foreground:          #ffffff;
  --salt-actionable-cta-foreground-hover:    #ffffff;
  --salt-actionable-cta-foreground-active:   #ffffff;
  --salt-actionable-cta-foreground-disabled: var(--bs-secondary-color, #6c757d);

  /* ── Accented Actions ── */
  --salt-actionable-accented-background:       var(--bs-primary, #0d6efd);
  --salt-actionable-accented-background-hover: var(--bs-primary-hover, #0b5ed7);
  --salt-actionable-accented-foreground:       #ffffff;

  /* ════════════════════════════════════════════════════════════════
   * CONTAINER — Cards, Panels, Dialogs, Surfaces
   * ════════════════════════════════════════════════════════════════ */

  --salt-container-primary-background:       var(--bs-body-bg, #ffffff);
  --salt-container-primary-borderColor:      var(--bs-border-color, #dee2e6);
  --salt-container-primary-borderColor-hover: var(--bs-border-color-translucent, rgba(0, 0, 0, 0.175));
  --salt-container-secondary-background:     var(--bs-secondary-bg, #e9ecef);
  --salt-container-secondary-borderColor:    var(--bs-border-color, #dee2e6);
  --salt-container-tertiary-background:      var(--bs-tertiary-bg, #f8f9fa);
  --salt-container-tertiary-borderColor:     var(--bs-border-color, #dee2e6);

  /* ════════════════════════════════════════════════════════════════
   * CONTENT — Text, Icons, Foreground Elements
   * ════════════════════════════════════════════════════════════════ */

  --salt-content-primary-foreground:     var(--bs-body-color, #212529);
  --salt-content-secondary-foreground:   var(--bs-secondary-color, #6c757d);
  --salt-content-tertiary-foreground:    var(--bs-tertiary-color, #adb5bd);
  --salt-content-primary-background:     var(--bs-body-bg, #ffffff);
  --salt-content-secondary-background:   var(--bs-secondary-bg, #e9ecef);

  /* ════════════════════════════════════════════════════════════════
   * NAVIGABLE — Navigation elements, tabs, breadcrumbs
   * ════════════════════════════════════════════════════════════════ */

  --salt-navigable-background:         transparent;
  --salt-navigable-background-hover:   rgba(13, 110, 253, 0.06);
  --salt-navigable-background-active:  rgba(13, 110, 253, 0.1);
  --salt-navigable-foreground:         var(--bs-body-color, #212529);
  --salt-navigable-foreground-hover:   var(--bs-primary, #0d6efd);
  --salt-navigable-foreground-active:  var(--bs-primary, #0d6efd);
  --salt-navigable-indicator-activeColor: var(--bs-primary, #0d6efd);

  /* ════════════════════════════════════════════════════════════════
   * EDITABLE — Input fields, text areas, dropdowns
   * ════════════════════════════════════════════════════════════════ */

  --salt-editable-primary-background:         var(--bs-body-bg, #ffffff);
  --salt-editable-primary-background-hover:   var(--bs-body-bg, #ffffff);
  --salt-editable-primary-background-active:  var(--bs-body-bg, #ffffff);
  --salt-editable-primary-background-disabled: var(--bs-secondary-bg, #e9ecef);
  --salt-editable-primary-background-readonly: var(--bs-tertiary-bg, #f8f9fa);
  --salt-editable-primary-borderColor:        var(--bs-border-color, #dee2e6);
  --salt-editable-primary-borderColor-hover:  var(--bs-body-color, #212529);
  --salt-editable-primary-borderColor-active: var(--bs-primary, #0d6efd);
  --salt-editable-primary-borderColor-disabled: var(--bs-border-color, #dee2e6);

  /* ════════════════════════════════════════════════════════════════
   * SELECTABLE — Checkboxes, radio buttons, list selection
   * ════════════════════════════════════════════════════════════════ */

  --salt-selectable-background:          transparent;
  --salt-selectable-background-hover:    rgba(13, 110, 253, 0.06);
  --salt-selectable-background-selected: rgba(13, 110, 253, 0.1);
  --salt-selectable-background-selectedHover: rgba(13, 110, 253, 0.15);
  --salt-selectable-foreground:          var(--bs-body-color, #212529);
  --salt-selectable-foreground-hover:    var(--bs-body-color, #212529);
  --salt-selectable-foreground-selected: var(--bs-primary, #0d6efd);
  --salt-selectable-borderColor-selected: var(--bs-primary, #0d6efd);

  /* ════════════════════════════════════════════════════════════════
   * OVERLAYABLE — Dropdowns, popovers, tooltips
   * ════════════════════════════════════════════════════════════════ */

  --salt-overlayable-background:   var(--bs-body-bg, #ffffff);
  --salt-overlayable-borderColor:  var(--bs-border-color, #dee2e6);
}
```

**✅ Verification:** Open DevTools → inspect a Salt Button → `--salt-actionable-primary-background` should resolve to Bootstrap's primary blue (`#0d6efd`).

---

### 3.2 Typography CSS — `_typography.css`

**File:** `src/styles/salt-bootstrap-bridge/_typography.css`

```css
/*
 * Salt-Bootstrap Bridge: Typography Token Mappings
 * 
 * Maps Salt's font families, sizes, weights, and line-heights
 * to Bootstrap 5's typography system.
 * 
 * CRITICAL: Salt defaults to "Open Sans" font. This file overrides
 * it to match Bootstrap's system font stack.
 */

.salt-bootstrap-compat {

  /* ── Base Text Properties ── */
  --salt-text-fontFamily:    var(--bs-body-font-family, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif);
  --salt-text-fontSize:      var(--bs-body-font-size, 1rem);
  --salt-text-fontWeight:    var(--bs-body-font-weight, 400);
  --salt-text-lineHeight:    var(--bs-body-line-height, 1.5);
  --salt-text-letterSpacing: 0;
  --salt-text-color:         var(--bs-body-color, #212529);

  /* ── Override Salt's Named Font Families ──
   * Salt defines specific font families (Open Sans, Amplitude, PT Mono).
   * We override ALL of them to Bootstrap's system fonts.
   */
  --salt-typography-fontFamily-openSans:  var(--bs-body-font-family, system-ui, -apple-system, sans-serif);
  --salt-typography-fontFamily-amplitude: var(--bs-body-font-family, system-ui, -apple-system, sans-serif);
  --salt-typography-fontFamily-ptMono:    var(--bs-font-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);

  /* ── Font Weight Scale ── */
  --salt-typography-fontWeight-light:     300;
  --salt-typography-fontWeight-regular:   var(--bs-body-font-weight, 400);
  --salt-typography-fontWeight-medium:    500;
  --salt-typography-fontWeight-semiBold:  600;
  --salt-typography-fontWeight-bold:      700;
  --salt-typography-fontWeight-extraBold: 800;

  /* ── Heading Sizes (match Bootstrap: h1=2.5rem, h2=2rem, h3=1.75rem, h4=1.5rem) ── */
  --salt-text-h1-fontSize:    2.5rem;
  --salt-text-h1-lineHeight:  1.2;
  --salt-text-h1-fontWeight:  500;
  --salt-text-h2-fontSize:    2rem;
  --salt-text-h2-lineHeight:  1.2;
  --salt-text-h2-fontWeight:  500;
  --salt-text-h3-fontSize:    1.75rem;
  --salt-text-h3-lineHeight:  1.2;
  --salt-text-h3-fontWeight:  500;
  --salt-text-h4-fontSize:    1.5rem;
  --salt-text-h4-lineHeight:  1.2;
  --salt-text-h4-fontWeight:  500;

  /* ── Small / Caption / Label Text ── */
  --salt-text-label-fontSize:    0.875rem;
  --salt-text-label-lineHeight:  1.5;
  --salt-text-notation-fontSize: 0.75rem;
  --salt-text-notation-lineHeight: 1.5;
}
```

**✅ Verification:** Inspect any text → `font-family` should show Bootstrap's system stack, not "Open Sans".

---

### 3.3 Spacing CSS — `_spacing.css`

**File:** `src/styles/salt-bootstrap-bridge/_spacing.css`

```css
/*
 * Salt-Bootstrap Bridge: Spacing Token Mappings
 * 
 * Salt spacing is DENSITY-DEPENDENT. The base unit (--salt-spacing-100)
 * changes based on density class. All other spacings are multiples of the base.
 * 
 * Medium density (8px base) is the default — closest to Bootstrap.
 */

/* Touch Density */
.salt-bootstrap-compat .salt-density-touch,
.salt-bootstrap-compat.salt-density-touch {
  --salt-spacing-100: 16px;
}

/* Low Density */
.salt-bootstrap-compat .salt-density-low,
.salt-bootstrap-compat.salt-density-low {
  --salt-spacing-100: 12px;
}

/* Medium Density (DEFAULT) */
.salt-bootstrap-compat .salt-density-medium,
.salt-bootstrap-compat.salt-density-medium {
  --salt-spacing-100: 8px;
}

/* High Density */
.salt-bootstrap-compat .salt-density-high,
.salt-bootstrap-compat.salt-density-high {
  --salt-spacing-100: 4px;
}

/* Derived Spacing Scale (all densities) */
.salt-bootstrap-compat .salt-density-touch,
.salt-bootstrap-compat .salt-density-low,
.salt-bootstrap-compat .salt-density-medium,
.salt-bootstrap-compat .salt-density-high,
.salt-bootstrap-compat.salt-density-touch,
.salt-bootstrap-compat.salt-density-low,
.salt-bootstrap-compat.salt-density-medium,
.salt-bootstrap-compat.salt-density-high {
  --salt-spacing-25:  calc(0.25 * var(--salt-spacing-100));
  --salt-spacing-50:  calc(0.5  * var(--salt-spacing-100));
  --salt-spacing-75:  calc(0.75 * var(--salt-spacing-100));
  --salt-spacing-150: calc(1.5  * var(--salt-spacing-100));
  --salt-spacing-200: calc(2    * var(--salt-spacing-100));
  --salt-spacing-250: calc(2.5  * var(--salt-spacing-100));
  --salt-spacing-300: calc(3    * var(--salt-spacing-100));
  --salt-spacing-350: calc(3.5  * var(--salt-spacing-100));
  --salt-spacing-400: calc(4    * var(--salt-spacing-100));
}
```

---

### 3.4 Borders CSS — `_borders.css`

**File:** `src/styles/salt-bootstrap-bridge/_borders.css`

```css
/*
 * Salt-Bootstrap Bridge: Border & Curve Token Mappings
 * 
 * Salt uses --salt-curve-* for border-radius.
 * Bootstrap uses --bs-border-radius, --bs-border-radius-sm, --bs-border-radius-lg.
 */

.salt-bootstrap-compat {
  --salt-curve-0:   0px;
  --salt-curve-50:  1px;
  --salt-curve-100: var(--bs-border-radius-sm, 0.25rem);
  --salt-curve-150: var(--bs-border-radius, 0.375rem);
  --salt-curve-200: var(--bs-border-radius, 0.375rem);
  --salt-curve-250: var(--bs-border-radius, 0.375rem);
  --salt-curve-300: var(--bs-border-radius-lg, 0.5rem);
  --salt-curve-350: var(--bs-border-radius-lg, 0.5rem);
  --salt-curve-999: var(--bs-border-radius-pill, 50rem);

  --salt-size-border:          var(--bs-border-width, 1px);
  --salt-size-border-strong:   2px;
  --salt-borderStyle-default:  solid;
  --salt-palette-neutral-border-default: var(--bs-border-color, #dee2e6);
}
```

---

### 3.5 Shadows CSS — `_shadows.css`

**File:** `src/styles/salt-bootstrap-bridge/_shadows.css`

```css
/*
 * Salt-Bootstrap Bridge: Shadow Token Mappings
 * 
 * Salt hierarchy: scroll < default < region < overlay
 * Bootstrap hierarchy: box-shadow-sm < box-shadow < box-shadow-lg
 */

.salt-bootstrap-compat {
  --salt-overlayable-shadow-scroll:     var(--bs-box-shadow-sm, 0 .125rem .25rem rgba(0, 0, 0, .075));
  --salt-overlayable-shadow-default:    var(--bs-box-shadow, 0 .5rem 1rem rgba(0, 0, 0, .15));
  --salt-overlayable-shadow-region:     var(--bs-box-shadow, 0 .5rem 1rem rgba(0, 0, 0, .15));
  --salt-overlayable-shadow-overlay:    var(--bs-box-shadow-lg, 0 1rem 3rem rgba(0, 0, 0, .175));
  --salt-overlayable-shadow-none:       none;
}
```

---

### 3.6 Status CSS — `_status.css`

**File:** `src/styles/salt-bootstrap-bridge/_status.css`

```css
/*
 * Salt-Bootstrap Bridge: Status Token Mappings
 * 
 * Salt "error"   -> Bootstrap "danger"
 * Salt "warning" -> Bootstrap "warning"
 * Salt "success" -> Bootstrap "success"
 * Salt "info"    -> Bootstrap "info"
 */

.salt-bootstrap-compat {
  /* Error / Danger */
  --salt-status-error-foreground:           var(--bs-danger, #dc3545);
  --salt-status-error-background:           var(--bs-danger-bg-subtle, #f8d7da);
  --salt-status-error-borderColor:          var(--bs-danger-border-subtle, #f5c2c7);
  --salt-status-error-foreground-decorative: var(--bs-danger, #dc3545);

  /* Warning */
  --salt-status-warning-foreground:           var(--bs-warning, #ffc107);
  --salt-status-warning-background:           var(--bs-warning-bg-subtle, #fff3cd);
  --salt-status-warning-borderColor:          var(--bs-warning-border-subtle, #ffecb5);
  --salt-status-warning-foreground-decorative: var(--bs-warning, #ffc107);

  /* Success / Positive */
  --salt-status-success-foreground:           var(--bs-success, #198754);
  --salt-status-success-background:           var(--bs-success-bg-subtle, #d1e7dd);
  --salt-status-success-borderColor:          var(--bs-success-border-subtle, #badbcc);
  --salt-status-success-foreground-decorative: var(--bs-success, #198754);

  /* Info */
  --salt-status-info-foreground:            var(--bs-info, #0dcaf0);
  --salt-status-info-background:            var(--bs-info-bg-subtle, #cff4fc);
  --salt-status-info-borderColor:           var(--bs-info-border-subtle, #b6effb);
  --salt-status-info-foreground-decorative:  var(--bs-info, #0dcaf0);
}
```

---

### 3.7 Dark Mode CSS — `_dark-mode.css`

**File:** `src/styles/salt-bootstrap-bridge/_dark-mode.css`

```css
/*
 * Salt-Bootstrap Bridge: Dark Mode Overrides
 * 
 * Bootstrap 5.3+ uses [data-bs-theme="dark"] on <html>.
 * Salt uses data-mode="dark" on SaltProvider.
 * The SaltMFEWrapper auto-detects Bootstrap's theme via MutationObserver.
 */

/* Dark mode via Bootstrap theme attribute */
[data-bs-theme="dark"] .salt-bootstrap-compat {
  --salt-container-primary-background:     var(--bs-body-bg, #212529);
  --salt-container-primary-borderColor:    var(--bs-border-color, #495057);
  --salt-container-secondary-background:   var(--bs-secondary-bg, #343a40);
  --salt-container-secondary-borderColor:  var(--bs-border-color, #495057);
  --salt-container-tertiary-background:    var(--bs-tertiary-bg, #2b3035);

  --salt-content-primary-foreground:       var(--bs-body-color, #dee2e6);
  --salt-content-secondary-foreground:     var(--bs-secondary-color, #adb5bd);
  --salt-content-tertiary-foreground:      var(--bs-tertiary-color, #6c757d);
  --salt-content-primary-background:       var(--bs-body-bg, #212529);

  --salt-actionable-primary-background:    var(--bs-primary, #0d6efd);
  --salt-actionable-primary-foreground:    #ffffff;
  --salt-actionable-secondary-foreground:  #6ea8fe;
  --salt-actionable-secondary-borderColor: #6ea8fe;
  --salt-actionable-secondary-background-hover: rgba(110, 168, 254, 0.1);

  --salt-editable-primary-background:         var(--bs-body-bg, #212529);
  --salt-editable-primary-borderColor:        var(--bs-border-color, #495057);
  --salt-editable-primary-borderColor-active: var(--bs-primary, #0d6efd);

  --salt-overlayable-background:   var(--bs-body-bg, #212529);
  --salt-overlayable-borderColor:  var(--bs-border-color, #495057);
}

/* Dark mode via Salt's own attribute */
.salt-bootstrap-compat [data-mode="dark"] {
  --salt-container-primary-background:     var(--bs-body-bg, #212529);
  --salt-content-primary-foreground:       var(--bs-body-color, #dee2e6);
  --salt-content-secondary-foreground:     var(--bs-secondary-color, #adb5bd);
}
```

---

### 3.8 Component Overrides CSS — `_component-overrides.css`

**File:** `src/styles/salt-bootstrap-bridge/_component-overrides.css`

```css
/*
 * Salt-Bootstrap Bridge: Component-Specific Overrides
 * 
 * Token remapping handles ~90% of visual alignment. This file handles the
 * remaining ~10% — geometry, transitions, z-index, and focus rings.
 * 
 * RULES:
 *   1. Only add overrides if token remapping is insufficient
 *   2. Always document WHY the override is needed
 *   3. Never use !important
 */

/* ── Z-Index Alignment ── */
.salt-bootstrap-compat {
  --salt-zIndex-default:       auto;
  --salt-zIndex-appHeader:     var(--bs-zindex-sticky, 1020);
  --salt-zIndex-popout:        var(--bs-zindex-dropdown, 1000);
  --salt-zIndex-floating:      var(--bs-zindex-popover, 1070);
  --salt-zIndex-overlay:       var(--bs-zindex-modal, 1055);
  --salt-zIndex-notification:  var(--bs-zindex-toast, 1090);
}

/* ── Focus Ring (match Bootstrap's) ── */
.salt-bootstrap-compat {
  --salt-focused-outlineColor:  var(--bs-focus-ring-color, rgba(13, 110, 253, 0.25));
  --salt-focused-outlineWidth:  var(--bs-focus-ring-width, 0.25rem);
  --salt-focused-outlineStyle:  solid;
  --salt-focused-outlineOffset: 0;
}

/* ── Button Geometry (WHY: Salt buttons have different padding than Bootstrap) ── */
.salt-bootstrap-compat .saltButton {
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  transition: color 0.15s ease-in-out,
              background-color 0.15s ease-in-out,
              border-color 0.15s ease-in-out,
              box-shadow 0.15s ease-in-out;
}

.salt-bootstrap-compat .saltButton[data-size="small"] {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.salt-bootstrap-compat .saltButton[data-size="large"] {
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
}

/* ── Input Geometry (WHY: Match Bootstrap form-control height) ── */
.salt-bootstrap-compat .saltInput {
  min-height: calc(1.5em + 0.75rem + calc(var(--bs-border-width, 1px) * 2));
  padding: 0.375rem 0.75rem;
  border-radius: var(--bs-border-radius, 0.375rem);
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out,
              box-shadow 0.15s ease-in-out;
}

/* ── Card Geometry (WHY: Bootstrap cards have no shadow by default) ── */
.salt-bootstrap-compat .saltCard {
  border: var(--bs-border-width, 1px) solid var(--bs-border-color, #dee2e6);
  border-radius: var(--bs-border-radius, 0.375rem);
  box-shadow: none;
}
```

---

### 3.9 Main Entry Point — `index.css`

**File:** `src/styles/salt-bootstrap-bridge/index.css`

```css
/*
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║           Salt <-> Bootstrap Bridge — Main Entry Point          ║
 * ║                                                                 ║
 * ║  Import this ONE file to activate the bridge.                   ║
 * ║                                                                 ║
 * ║  IMPORT ORDER (in your MFE):                                    ║
 * ║    1. @salt-ds/theme/index.css   (Salt defaults — FIRST)        ║
 * ║    2. This file                  (Bridge overrides — SECOND)    ║
 * ║    3. Your MFE overrides         (Optional — THIRD)             ║
 * ║                                                                 ║
 * ║  VERSION: 1.0.0                                                 ║
 * ║  COMPATIBLE: Bootstrap 5.3.x | @salt-ds/theme >= 1.28.0        ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

/* Token Mappings */
@import "./_colors.css";
@import "./_typography.css";
@import "./_spacing.css";
@import "./_borders.css";
@import "./_shadows.css";
@import "./_status.css";

/* Mode & State Overrides */
@import "./_dark-mode.css";

/* Component Fine-Tuning (MUST be last — highest priority) */
@import "./_component-overrides.css";
```

---

### 3.10 React Wrapper — `SaltMFEWrapper.tsx`

**File:** `src/components/SaltMFEWrapper/SaltMFEWrapper.tsx`

```tsx
import React, { useEffect, useState, useCallback } from 'react';
import { SaltProvider } from '@salt-ds/core';
import '@salt-ds/theme/index.css';
import '../../styles/salt-bootstrap-bridge/index.css';

type ColorMode = 'light' | 'dark' | 'auto';
type Density = 'high' | 'medium' | 'low' | 'touch';

interface SaltMFEWrapperProps {
  children: React.ReactNode;
  /** Color mode. 'auto' detects from Bootstrap's [data-bs-theme]. @default 'auto' */
  colorMode?: ColorMode;
  /** Salt density. 'medium' maps closest to Bootstrap. @default 'medium' */
  density?: Density;
  /** Additional CSS class name */
  className?: string;
  /** Enable debug mode — logs warnings for unmapped tokens. @default false */
  debug?: boolean;
  /** ID attribute for the wrapper div */
  id?: string;
}

function getBootstrapTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light';
}

function validateBridgeTokens(el: HTMLElement): void {
  const styles = getComputedStyle(el);
  const tokens = [
    '--salt-actionable-primary-background',
    '--salt-content-primary-foreground',
    '--salt-container-primary-background',
    '--salt-text-fontFamily',
    '--salt-status-error-foreground',
  ];

  const issues = tokens.filter(t => !styles.getPropertyValue(t).trim());

  if (issues.length > 0) {
    console.warn('[SaltMFEWrapper] Unmapped tokens:', issues);
  } else {
    console.log('[SaltMFEWrapper] ✅ All critical bridge tokens mapped.');
  }
}

/**
 * Wraps any Salt DS micro-frontend to visually match Bootstrap host app.
 *
 * @example
 * <SaltMFEWrapper colorMode="auto" density="medium">
 *   <Button variant="cta">Submit</Button>
 * </SaltMFEWrapper>
 */
export const SaltMFEWrapper: React.FC<SaltMFEWrapperProps> = ({
  children,
  colorMode = 'auto',
  density = 'medium',
  className = '',
  debug = false,
  id,
}) => {
  const [bsTheme, setBsTheme] = useState<'light' | 'dark'>(getBootstrapTheme);

  useEffect(() => {
    if (colorMode !== 'auto') return;
    setBsTheme(getBootstrapTheme());

    const observer = new MutationObserver(() => setBsTheme(getBootstrapTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-bs-theme'],
    });
    return () => observer.disconnect();
  }, [colorMode]);

  const wrapperRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && debug) {
        requestAnimationFrame(() => validateBridgeTokens(node));
      }
    },
    [debug]
  );

  const resolvedMode = colorMode === 'auto' ? bsTheme : colorMode;

  return (
    <div
      ref={wrapperRef}
      className={['salt-bootstrap-compat', className].filter(Boolean).join(' ')}
      id={id}
    >
      <SaltProvider mode={resolvedMode} density={density}>
        {children}
      </SaltProvider>
    </div>
  );
};

export default SaltMFEWrapper;
```

---

### 3.11 Public Export — `index.ts`

**File:** `src/components/SaltMFEWrapper/index.ts`

```ts
export { SaltMFEWrapper } from './SaltMFEWrapper';
export type { default as SaltMFEWrapperType } from './SaltMFEWrapper';
```

---

## 4. Token Audit Script

**File:** `src/styles/salt-bootstrap-bridge/scripts/audit-tokens.js`

```js
#!/usr/bin/env node

/**
 * Salt-Bootstrap Bridge — Token Audit Tool
 * 
 * Scans bridge CSS and checks for unmapped tokens + missing fallbacks.
 * 
 * USAGE:  node scripts/audit-tokens.js [bridge-index-path]
 * EXIT:   0 = pass, 1 = critical tokens missing
 */

const fs = require('fs');
const path = require('path');

const CRITICAL_TOKENS = [
  '--salt-actionable-primary-background',
  '--salt-actionable-primary-foreground',
  '--salt-content-primary-foreground',
  '--salt-container-primary-background',
  '--salt-text-fontFamily',
  '--salt-text-fontSize',
  '--salt-status-error-foreground',
  '--salt-status-warning-foreground',
  '--salt-status-success-foreground',
  '--salt-status-info-foreground',
];

function resolveImports(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
  let css = fs.readFileSync(filePath, 'utf-8');
  const dir = path.dirname(filePath);

  css = css.replace(/@import\s+["']([^"']+)["'];/g, (_, p) => {
    const full = path.resolve(dir, p);
    return fs.existsSync(full) ? fs.readFileSync(full, 'utf-8') : '';
  });
  css = css.replace(/@import\s+url\(["']?([^"')]+)["']?\);/g, (_, p) => {
    const full = path.resolve(dir, p);
    return fs.existsSync(full) ? fs.readFileSync(full, 'utf-8') : '';
  });
  return css;
}

function main() {
  const bridgePath = process.argv[2] || path.resolve(__dirname, '../index.css');
  console.log('🔍 Salt-Bootstrap Bridge Token Audit\n');

  const css = resolveImports(bridgePath);
  const mapped = new Set();
  const re = /--(salt-[\w-]+)/g;
  let m;
  while ((m = re.exec(css)) !== null) mapped.add('--' + m[1]);

  console.log(`   Bridge defines: ${mapped.size} token mappings\n`);

  let missing = 0;
  console.log('── Critical Token Check ──');
  CRITICAL_TOKENS.forEach(t => {
    if (mapped.has(t)) console.log(`   ✅ ${t}`);
    else { console.log(`   ❌ ${t} — MISSING`); missing++; }
  });

  const vars = css.match(/var\(--bs-[^)]+\)/g) || [];
  let noFallback = 0;
  console.log('\n── Fallback Check ──');
  vars.forEach(v => { if (!v.includes(',')) { console.log(`   ⚠️  ${v}`); noFallback++; } });
  if (noFallback === 0) console.log(`   ✅ All ${vars.length} var() refs have fallbacks`);

  console.log(`\n── Summary ──`);
  console.log(`   Mapped: ${mapped.size} | Critical missing: ${missing} | No fallback: ${noFallback}`);
  console.log(missing > 0 ? '\n❌ AUDIT FAILED' : '\n✅ AUDIT PASSED');
  process.exit(missing > 0 ? 1 : 0);
}

main();
```

**Add to `package.json`:**
```json
{
  "scripts": {
    "audit:bridge": "node src/styles/salt-bootstrap-bridge/scripts/audit-tokens.js"
  }
}
```

---

## 5. Testing Implementation

### 5.1 Unit Tests — `SaltMFEWrapper.test.tsx`

```tsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { SaltMFEWrapper } from './SaltMFEWrapper';

describe('SaltMFEWrapper', () => {
  it('renders children inside bridge boundary', () => {
    render(<SaltMFEWrapper><button data-testid="btn">Click</button></SaltMFEWrapper>);
    expect(screen.getByTestId('btn')).toBeInTheDocument();
  });

  it('applies salt-bootstrap-compat class', () => {
    const { container } = render(<SaltMFEWrapper><div /></SaltMFEWrapper>);
    expect(container.querySelector('.salt-bootstrap-compat')).toBeInTheDocument();
  });

  it('detects Bootstrap dark mode', () => {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    const { container } = render(<SaltMFEWrapper colorMode="auto"><div /></SaltMFEWrapper>);
    expect(container.querySelector('[data-mode]')).toHaveAttribute('data-mode', 'dark');
    document.documentElement.removeAttribute('data-bs-theme');
  });

  it('responds to Bootstrap theme toggle', async () => {
    const { container } = render(<SaltMFEWrapper colorMode="auto"><div /></SaltMFEWrapper>);
    expect(container.querySelector('[data-mode]')).toHaveAttribute('data-mode', 'light');
    
    act(() => document.documentElement.setAttribute('data-bs-theme', 'dark'));
    await act(async () => { await new Promise(r => setTimeout(r, 50)); });
    
    expect(container.querySelector('[data-mode]')).toHaveAttribute('data-mode', 'dark');
    document.documentElement.removeAttribute('data-bs-theme');
  });
});
```

### 5.2 Visual Regression — `bridge-visual.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test.describe('Bridge Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bridge-test-page');
    await page.waitForSelector('.salt-bootstrap-compat');
  });

  test('Salt Button matches Bootstrap', async ({ page }) => {
    const btn = page.locator('.salt-bootstrap-compat .saltButton').first();
    await expect(btn).toHaveScreenshot('salt-button.png', { maxDiffPixelRatio: 0.05 });
  });

  test('Dark mode renders correctly', async ({ page }) => {
    await page.evaluate(() => document.documentElement.setAttribute('data-bs-theme', 'dark'));
    await page.waitForTimeout(500);
    const mfe = page.locator('.salt-bootstrap-compat');
    await expect(mfe).toHaveScreenshot('dark-mode.png', { maxDiffPixelRatio: 0.05 });
  });
});
```

---

## 6. CI/CD Pipeline

**File:** `.github/workflows/bridge-ci.yml`

```yaml
name: Salt-Bootstrap Bridge CI

on:
  push:
    paths: ['src/styles/salt-bootstrap-bridge/**', 'src/components/SaltMFEWrapper/**']
  pull_request:
    paths: ['src/styles/salt-bootstrap-bridge/**', 'src/components/SaltMFEWrapper/**']

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - name: Stylelint
        run: npx stylelint "src/styles/salt-bootstrap-bridge/**/*.css"
      - name: Token Audit
        run: node src/styles/salt-bootstrap-bridge/scripts/audit-tokens.js
      - name: Size Check
        run: |
          SIZE=$(cat src/styles/salt-bootstrap-bridge/*.css | gzip -c | wc -c)
          echo "Bridge CSS gzipped: ${SIZE} bytes"
          [ "$SIZE" -gt 3072 ] && echo "FAIL: exceeds 3KB" && exit 1 || echo "PASS"

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx jest --testPathPattern="SaltMFEWrapper"

  visual-tests:
    runs-on: ubuntu-latest
    needs: [quality, unit-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci && npx playwright install --with-deps chromium
      - run: npx playwright test --config=tests/visual/visual.config.ts
      - if: failure()
        uses: actions/upload-artifact@v4
        with: { name: visual-diffs, path: test-results/, retention-days: 14 }
```

---

## 7. Host App Integration Guide

> [!TIP]
> Share this section with the Bootstrap host app team as a standalone guide.

### 7.1 Mount a Salt MFE

```tsx
import { SaltMFEWrapper } from '@your-org/salt-bootstrap-bridge';
const SaltMFE = React.lazy(() => import('@your-org/salt-dashboard-mfe'));

function Page() {
  return (
    <div className="container">
      <h1>Dashboard</h1>
      <React.Suspense fallback={<div className="spinner-border" />}>
        <SaltMFEWrapper colorMode="auto" density="medium">
          <SaltMFE />
        </SaltMFEWrapper>
      </React.Suspense>
    </div>
  );
}
```

### 7.2 Portal Root Setup (Required for Modals)

Add **once** at app root:

```tsx
<div id="salt-portal-root" className="salt-bootstrap-compat">
  <SaltProvider mode="light" density="medium" />
</div>
```

### 7.3 Quick Verification (paste in browser console)

```js
const w = document.querySelector('.salt-bootstrap-compat');
const s = getComputedStyle(w);
console.table({
  'actionable-bg': s.getPropertyValue('--salt-actionable-primary-background'),
  'font': s.getPropertyValue('--salt-text-fontFamily').substring(0, 40) + '...',
  'border-radius': s.getPropertyValue('--salt-curve-150'),
});
```

---

## 8. Storybook Component Gallery

```tsx
// stories/BridgeComparison.stories.tsx
import { SaltMFEWrapper } from '../src/components/SaltMFEWrapper';
import { Button } from '@salt-ds/core';

export default { title: 'Bridge/Comparison' };

export const Buttons = () => (
  <div style={{ display: 'flex', gap: '3rem' }}>
    <div>
      <h3>Bootstrap</h3>
      <button className="btn btn-primary">Primary</button>
      <button className="btn btn-outline-primary ms-2">Outline</button>
    </div>
    <div>
      <h3>Salt (with Bridge)</h3>
      <SaltMFEWrapper>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Outline</Button>
        </div>
      </SaltMFEWrapper>
    </div>
  </div>
);
```

---

## 9. NPM Package Publishing

```json
{
  "name": "@your-org/salt-bootstrap-bridge",
  "version": "1.0.0",
  "style": "src/styles/salt-bootstrap-bridge/index.css",
  "main": "src/components/SaltMFEWrapper/index.ts",
  "peerDependencies": {
    "@salt-ds/core": ">=1.30.0",
    "@salt-ds/theme": ">=1.28.0",
    "bootstrap": ">=5.3.0",
    "react": ">=18.0.0"
  },
  "scripts": {
    "audit": "node src/styles/salt-bootstrap-bridge/scripts/audit-tokens.js",
    "prepublishOnly": "npm run audit && npm test"
  }
}
```

```bash
npm version patch -m "fix: corrected border-radius mapping"
npm publish --access restricted
```

---

## 10. Git Workflow & Release Process

```
main ← Production-ready
  └── develop ← Integration
       ├── feature/add-navigable-tokens
       ├── fix/dark-mode-input-border
       └── chore/upgrade-salt-v1.35
```

**PR Checklist:**
- [ ] Fallback value in all new `var()` references
- [ ] `npm run audit:bridge` passes
- [ ] Visual tests pass or new snapshots approved
- [ ] CHANGELOG entry added
- [ ] No `!important` used

---

## 11. Implementation Checklist

### Day 1 — Foundation
- [ ] Create directory structure (Section 2)
- [ ] `_colors.css` (Section 3.1) — verify: Salt Button is Bootstrap blue
- [ ] `_typography.css` (Section 3.2) — verify: font is system stack, not Open Sans
- [ ] `index.css` entry point (Section 3.9)
- [ ] `SaltMFEWrapper.tsx` (Section 3.10)
- [ ] `index.ts` export (Section 3.11)

### Day 2 — Complete Coverage
- [ ] `_spacing.css` (Section 3.3)
- [ ] `_borders.css` (Section 3.4)
- [ ] `_shadows.css` (Section 3.5)
- [ ] `_status.css` (Section 3.6)
- [ ] `_dark-mode.css` (Section 3.7) — verify: dark mode toggle works

### Day 3 — Polish & Testing
- [ ] `_component-overrides.css` (Section 3.8)
- [ ] Audit script (Section 4) — run and verify passes
- [ ] Unit tests (Section 5.1)
- [ ] Visual regression tests (Section 5.2)

### Day 4 — Integration & CI
- [ ] CI pipeline (Section 6)
- [ ] Host app integration (Section 7)
- [ ] Portal root for modals (Section 7.2)
- [ ] Cross-browser testing
- [ ] Performance audit (< 3KB gzipped)

### Day 5 — Documentation & Release
- [ ] Storybook gallery (Section 8)
- [ ] CHANGELOG.md
- [ ] Code review
- [ ] NPM publish (if applicable)
- [ ] ✅ Merge to main

---

## 12. Review & Sign-Off

| Review Area | Reviewer | Status | Date |
|---|---|---|---|
| CSS Token Mappings | Design System Lead | ⬜ Pending | — |
| React Wrapper Component | Frontend Tech Lead | ⬜ Pending | — |
| Dark Mode Implementation | QA Lead | ⬜ Pending | — |
| CI/CD Pipeline | DevOps Lead | ⬜ Pending | — |
| Visual Regression Baselines | UX Designer | ⬜ Pending | — |
| Host App Integration | Host App Team Lead | ⬜ Pending | — |
| Performance & Bundle Size | Performance Engineer | ⬜ Pending | — |

**Final Approval:**

| Approver | Role | Signature | Date |
|---|---|---|---|
| | Tech Lead | | |
| | Design System Lead | | |
| | Product Owner | | |
