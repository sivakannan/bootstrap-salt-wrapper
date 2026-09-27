# AGENTS.md — AI Developer Context & System Instructions

> **Purpose:** This file provides complete architectural context, coding rules, component mappings, and debugging gotchas for any AI assistant (GitHub Copilot, Roo Code, Cline, Cursor, Claude, etc.) working on this repository.

---

## 1. Project Overview & Architecture

This repository demonstrates how an enterprise web platform built on **Bootstrap 5** can seamlessly host and visually adapt microfrontends built with **J.P. Morgan's Salt Design System (`@salt-ds/core`)** via **Vite Module Federation**.

### Decoupled Monorepo Structure
```
bootstrap-salt-wrapper/
├── packages/
│   ├── bootstrap-host/        # Host Application (Port 3000)
│   │   ├── src/
│   │   │   ├── App.tsx        # Side-by-side parity dashboard
│   │   │   ├── index.css      # Bootstrap imports & custom styles
│   │   │   └── declarations.d.ts # TypeScript remote module definitions
│   │   └── vite.config.ts     # Module Federation Consumer
│   │
│   └── salt-mfe/              # Salt Microfrontend (Port 3001)
│       ├── src/
│       │   ├── mfe/
│       │   │   ├── SaltWidget.tsx          # Remote entry component (forwards compatMode)
│       │   │   └── SaltMicrofrontend.tsx   # Salt DS component showcase suite
│       │   ├── styles/salt-bootstrap-bridge/
│       │   │   ├── _tokens.css             # Bootstrap ➔ Salt token bridge
│       │   │   ├── _typography.css         # Font-family & scale mapping
│       │   │   └── _component-overrides.css# Scoped component adaptations
│       │   └── components/SaltMFEWrapper.tsx
│       └── vite.config.ts     # Module Federation Provider
│
├── tests/                     # Playwright automated parity test suites
│   ├── test-all-components.mjs
│   └── verify-tabs-dialog-accordion-metrics.mjs
└── docs/                      # Architectural LLD, guides, and knowledge base
```

---

## 2. Core Non-Negotiable Rules

When modifying or adding features, you **MUST** follow these 5 golden rules:

### Rule 1: Preserve Dual-Mode Behavior
- **Standalone Mode (`http://localhost:3001/`)**: MUST remain **100% pure native Salt DS**. Uses Open Sans typography, native text underlines, slate action buttons, and pure Salt modal scrim.
- **Host Integrated Mode (`http://localhost:3000/`)**: MUST dynamically adopt **Bootstrap 5 aesthetics** via the `.salt-bootstrap-compat` bridge.
- **Test condition**: Any change made to the bridge must never break or leak into port 3001 when `compatMode` is false.

### Rule 2: Strict CSS Scoping (Zero Global Leaks)
- **NEVER** write global unscoped selectors in `_component-overrides.css` (e.g. NEVER write `.saltDialog`, `.saltButton`, `.saltScrim`, or `.saltInput` without a prefix).
- **ALWAYS** scope selectors under `.salt-bootstrap-compat`:
  ```css
  /* CORRECT */
  .salt-bootstrap-compat.saltDialog,
  .salt-bootstrap-compat .saltDialog { ... }

  /* INCORRECT - Will leak into standalone mode! */
  .saltDialog { ... }
  ```

### Rule 3: Handling React Portals (Dialogs, Tooltips, Menus)
- Floating elements like `<Dialog>` and `<Tooltip>` render via React Portal directly into `document.body`, escaping the wrapper div.
- **Solution**:
  1. Forward `compatMode` down as a boolean prop.
  2. Apply dynamic class name: `<Dialog className={compatMode ? "salt-bootstrap-compat" : undefined}>`.
  3. Target portaled backdrop scrims with:
     ```css
     body:has(.salt-bootstrap-compat.saltDialog) .saltScrim {
       background: rgba(0, 0, 0, 0.5) !important;
       backdrop-filter: blur(1px);
     }
     ```

### Rule 4: Salt Table Class Names
- `@salt-ds/core` compiles table elements to `.saltTable-th`, `.saltTable-td`, and `.saltTable-tr` (NOT `.saltTH` or `.saltTD`).
- Target `.saltTable-th, th` and `.saltTable-td, td` for complete Bootstrap table compatibility.

### Rule 5: Accordion Active State Selector
- Salt tracks expanded state via `aria-expanded="true"`.
- Use `.salt-bootstrap-compat .saltAccordionHeader[aria-expanded="true"]` to apply Bootstrap's `--bs-primary-bg-subtle` (`#cfe2ff`) and `--bs-primary-text-emphasis` (`#052c65`).

---

## 3. Essential Commands

```bash
# 1. Start both servers concurrently (MFE on 3001, Host on 3000)
npm start

# 2. Build both packages
npm run build

# 3. Run full automated 26-assertion Playwright audit
npm test

# 4. Run granular feature verification (Tabs, Dialog, Accordion, Metrics)
npm run test:features
```

---

## 4. Key Component Mapping Reference

| Component Feature | Native Bootstrap 5 | Salt Component | Bridge Selector / Recipe |
| :--- | :--- | :--- | :--- |
| **Input** | `.form-control` | `<Input>` | `.salt-bootstrap-compat .saltInput` (full border, radius `0.375rem`, focus ring) |
| **Dropdown** | `.form-select` | `<Dropdown>` | `.salt-bootstrap-compat .saltDropdown` |
| **Textarea** | `.form-control` | `<MultilineInput>` | `.salt-bootstrap-compat .saltMultilineInput` |
| **Slider** | `.form-range` | `<Slider>` | `.salt-bootstrap-compat .saltSlider-trackFill` (primary blue) |
| **Rating** | Star cluster | `<Rating max={5} />` | Native Salt Rating |
| **Buttons** | `.btn .btn-primary` | `<Button variant="primary">` | Scoped `.saltButton-primary` (`var(--bs-primary)`) |
| **Data Table** | `.table .table-hover` | `<Table>` | `.salt-bootstrap-compat .saltTable-th, .saltTable-td` |
| **Modal Dialog** | `.modal-content` | `<Dialog>` | `<Dialog className={compatMode ? "salt-bootstrap-compat" : undefined}>` |
| **Backdrop** | `.modal-backdrop` | `.saltScrim` | `body:has(.salt-bootstrap-compat.saltDialog) .saltScrim` |
| **Accordion** | `.accordion-button` | `<Accordion>` | `.salt-bootstrap-compat .saltAccordionHeader[aria-expanded="true"]` |
| **Progress** | `.progress` (0.5rem) | `<LinearProgress>` | `.salt-bootstrap-compat .saltLinearProgress` (hide label, 0.5rem height) |
| **Status** | Colored badge cards | `<StatusIndicator>` | `.salt-bootstrap-compat .saltStatusIndicator` |

---

## 5. Token Remapping Formula (Bridge Core)

The bridge in `packages/salt-mfe/src/styles/salt-bootstrap-bridge/_tokens.css` remaps CSS variables:
```css
.salt-bootstrap-compat {
  /* Colors */
  --salt-action-primary-background: var(--bs-primary, #0d6efd);
  --salt-action-primary-background-hover: var(--bs-primary, #0d6efd);
  --salt-action-secondary-background: var(--bs-secondary, #6c757d);

  /* Typography */
  --salt-typography-fontFamily: var(--bs-body-font-family);
  --salt-typography-fontSize: var(--bs-body-font-size, 1rem);

  /* Geometry & Borders */
  --salt-palette-corner: var(--bs-border-radius, 0.375rem);
  --salt-separable-primary-borderColor: var(--bs-border-color, #dee2e6);
  --salt-editable-borderColor: var(--bs-border-color, #dee2e6);
}
```

---

## 6. How to Add a New Salt Component

When introducing a new Salt component to the showcase:
1. Import the component in [SaltMicrofrontend.tsx](file:///Applications/XAMPP/xamppfiles/htdocs/study/bootstrap-salt-wrapper/packages/salt-mfe/src/mfe/SaltMicrofrontend.tsx).
2. Add the equivalent native Bootstrap 5 component in [App.tsx](file:///Applications/XAMPP/xamppfiles/htdocs/study/bootstrap-salt-wrapper/packages/bootstrap-host/src/App.tsx) on the left column.
3. Check if Salt's default styles match Bootstrap. If not, add a scoped override inside [\_component-overrides.css](file:///Applications/XAMPP/xamppfiles/htdocs/study/bootstrap-salt-wrapper/packages/salt-mfe/src/styles/salt-bootstrap-bridge/_component-overrides.css) prefixed with `.salt-bootstrap-compat`.
4. Rebuild `salt-mfe` (`npm run build:salt`) and run `npm test` to verify zero visual regressions.
