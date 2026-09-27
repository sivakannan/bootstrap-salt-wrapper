# Salt Design System — Knowledge Guide

**Document Version:** 1.0  
**Target Version:** `@salt-ds/core` v1.71+, `@salt-ds/theme` v1.46+, `@salt-ds/icons` v1.18+  
**Origin:** J.P. Morgan Chase & Co.  
**Scope:** Core Architecture, Characteristic Tokens, Density Modes, Provider System, Component Catalog, and Accessibility

---

## 1. Overview & Philosophy

**Salt Design System** is an open-source, enterprise-grade design system developed by **J.P. Morgan Chase & Co.** specifically engineered for complex, data-dense financial trading, wealth management, and corporate banking platforms.

Key architectural pillars:
- **Density Control**: Designed from the ground up for high-density financial screens (trading desks, multi-grid portals, Bloomberg-style terminals).
- **Characteristic Design Tokens**: Structured semantic token layers rather than flat color variables.
- **Micro-Frontend Ready**: Built to operate cleanly within federated architectures and multiple independent React root applications.
- **Strict Accessibility**: Built strictly against WCAG 2.1 AA standards with full ARIA semantics and keyboard navigability.

---

## 2. Token Architecture & Characteristic Layers

Salt uses a structured, multi-tier token taxonomy:

```
Global Foundations (Colors, Spacing, Typography)
       ↓
Characteristic Tokens (Action, Container, Navigation, Separable, Status, Track, Palette)
       ↓
Component Tokens (Button, Input, Table, Accordion, Dialog)
```

### 2.1 Primary Characteristic Categories

| Characteristic | Prefix | Description | Example Tokens |
| :--- | :--- | :--- | :--- |
| **Action** | `--salt-action-*` | Interactive clickable elements (buttons, links) | `--salt-action-primary-background`, `--salt-action-secondary-foreground` |
| **Container** | `--salt-container-*`| Backgrounds and surfaces for cards and panels | `--salt-container-primary-background`, `--salt-container-secondary-background` |
| **Separable** | `--salt-separable-*`| Dividers, borders, and visual boundaries | `--salt-separable-primary-borderColor`, `--salt-separable-tertiary-borderColor` |
| **Status** | `--salt-status-*` | Feedback & alerts (success, info, warning, error) | `--salt-status-success-foreground`, `--salt-status-error-background` |
| **Track** | `--salt-track-*` | Sliders, progress bars, toggles | `--salt-track-background`, `--salt-track-active-background` |
| **Palette** | `--salt-palette-*`| Low-level color ramps and geometry | `--salt-palette-corner` (radius), `--salt-palette-neutral-*` |
| **Typography** | `--salt-typography-*`| Fonts, weights, line-heights, letter-spacing | `--salt-typography-fontFamily`, `--salt-typography-fontSize` |

### 2.2 Density Modes (Unique Salt Feature)

Salt natively supports 4 distinct densities managed via CSS variables and `<SaltProvider>`:

| Density | Row/Item Height | Target Use Case |
| :--- | :--- | :--- |
| **Touch** | `48px` | Mobile & touch-screen kiosk interfaces |
| **Low** | `40px` | Standard marketing and customer portals |
| **Medium** | `32px` | Standard enterprise corporate workflows (Default) |
| **High** | `24px` | Real-time trading blotters, order books, data tables |

Density dynamically changes `--salt-size-base`, spacing units, padding, and font sizes across all child components automatically!

---

## 3. The Salt Provider (`<SaltProvider>`)

All Salt components must be wrapped in a `<SaltProvider>` to receive theme context:

```tsx
import { SaltProvider } from '@salt-ds/core';
import '@salt-ds/theme/index.css';

export const App = () => (
  <SaltProvider mode="light" density="medium">
    <MyApplication />
  </SaltProvider>
);
```

### Supported Modes:
- `mode="light"`: Light theme surfaces.
- `mode="dark"`: Dark theme surfaces (optimized for dark room trading environments).
- `density="touch" | "low" | "medium" | "high"`.

---

## 4. Key Component Architecture

### 4.1 Input Fields (`<Input>`, `<MultilineInput>`, `<Dropdown>`)
- **Native Salt Design**: High-density financial input fields feature a bottom underline (`border-bottom: 1px solid var(--salt-editable-borderColor)`) rather than a full 4-sided rounded border.
- **Adornments**: Native support for start and end adornments:
  ```tsx
  <Input
    startAdornment={<SearchIcon />}
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  ```

### 4.2 Buttons (`<Button>`)
- **Variants**:
  - `variant="primary"`: Solid navy/slate background (`--salt-action-primary-background`), uppercase text (`PT Mono` / `Open Sans`), `0px` border-radius by default.
  - `variant="secondary"`: Transparent background with neutral foreground, subtle hover state.
  - `variant="cta"`: Call-to-action button with elevated visual weight.

### 4.3 Data Grid & Table (`<Table>`, `<TableContainer>`, `<THead>`, `<TBody>`, `<TR>`, `<TH>`, `<TD>`)
- High-performance, high-density financial data grid.
- **Compiled Output**: Note that `@salt-ds/core` renders table elements with `.saltTable-th`, `.saltTable-td`, and `.saltTable-tr` classes.

### 4.4 Modals & Dialogs (`<Dialog>`, `<DialogHeader>`, `<DialogContent>`, `<DialogActions>`)
- Rendered via floating React Portal directly on `document.body`.
- Built-in accessible header, content stack, and action buttons.
- Overlay backdrop is managed by `.saltScrim`.

### 4.5 Accordion (`<Accordion>`, `<AccordionHeader>`, `<AccordionPanel>`)
- Controlled or uncontrolled collapsible panel system.
- State is tracked via `aria-expanded="true" | "false"` on `<button class="saltAccordionHeader">`.

### 4.6 Progress & Indicators (`<LinearProgress>`, `<CircularProgress>`, `<StatusIndicator>`, `<Spinner>`)
- **`<LinearProgress>`**: Financial limit meters with optional buffer patterns and dynamic percentages.
- **`<CircularProgress>`**: Precise circular capacity indicator with value label.
- **`<StatusIndicator>`**: Semantic health icons (`success`, `info`, `warning`, `error`).

---

## 5. Typography System & Web Fonts

Salt requires two primary open-source typefaces:
1. **Open Sans**: Standard interface typography (headings, labels, body text).
   - Weights: 300 (Light), 400 (Regular), 600 (Semi-bold), 700 (Bold).
2. **PT Mono**: Monospaced font for financial figures, trading tickers, timestamps, and currency amounts.
   - Weights: 400 (Regular).

Installed via Fontsource in modern bundlers:
```typescript
import '@fontsource/open-sans/300.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/pt-mono/400.css';
```
