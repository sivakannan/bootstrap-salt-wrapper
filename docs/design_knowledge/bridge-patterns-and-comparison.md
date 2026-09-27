# Bootstrap 5 ↔ Salt Design System: Comparison & Bridge Patterns

**Document Version:** 1.0  
**Scope:** Architectural comparison, Token mapping formulas, Portaled overlay isolation, and Microfrontend Module Federation bridge patterns.

---

## 1. High-Level Comparison Matrix

| Architectural Dimension | Bootstrap 5 | Salt Design System (J.P. Morgan) |
| :--- | :--- | :--- |
| **Primary Domain** | General web applications, SaaS dashboards | Mission-critical financial trading, investment banking |
| **Component Philosophy** | Semantic CSS classes (`.btn`, `.form-control`) | Headless/React component library (`<Button>`, `<Input>`) |
| **Design Aesthetics** | Rounded corners (`0.375rem`), full-border inputs | Sharp corners (`0px`), underline inputs, financial density |
| **Theming Engine** | Flat CSS variables (`--bs-primary`, `--bs-body-bg`) | Structured characteristic tokens (`--salt-action-*`, `--salt-container-*`) |
| **Density Control** | Manual sizing via utility classes (`.btn-sm`, `.form-control-lg`) | Native 4-level density engine (`touch`, `low`, `medium`, `high`) |
| **Typography Default** | System UI font stack | Open Sans + PT Mono (numbers/financial data) |
| **Dark Mode** | Attribute-based (`data-bs-theme="dark"`) | Provider-based (`<SaltProvider mode="dark">`) |
| **Modal Architecture** | Standard DOM or JS modal (`.modal-backdrop`) | Portaled React overlay mounted on `document.body` |

---

## 2. Token Remapping Architecture

To allow Salt components to seamlessly blend into a Bootstrap 5 host application without modifying Salt source code, we construct a **CSS Variable Remapping Bridge** scoped under `.salt-bootstrap-compat`:

```
┌──────────────────────────────────────────────┐
│        Bootstrap 5 Host Application          │
│       --bs-primary: #0d6efd                  │
│       --bs-border-radius: 0.375rem           │
│       --bs-body-font-family: system-ui...    │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│   Bridge Compatibility Layer (.salt-bootstrap-compat)
│   --salt-action-primary-background: var(--bs-primary)
│   --salt-palette-corner: var(--bs-border-radius)
│   --salt-typography-fontFamily: var(--bs-body-font-family)
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│           Salt Component Suite               │
│   <Button variant="primary">                 │
│   <Input />                                  │
│   <Table />                                  │
└──────────────────────────────────────────────┘
```

### 2.1 Core Token Mapping Formula

```css
.salt-bootstrap-compat {
  /* Colors */
  --salt-action-primary-background: var(--bs-primary, #0d6efd);
  --salt-action-primary-background-hover: var(--bs-primary, #0d6efd);
  --salt-action-primary-foreground: #ffffff;
  
  --salt-action-secondary-background: var(--bs-secondary, #6c757d);
  --salt-action-secondary-foreground: #ffffff;

  /* Typography */
  --salt-typography-fontFamily: var(--bs-body-font-family);
  --salt-typography-fontSize: var(--bs-body-font-size, 1rem);
  --salt-typography-lineHeight: var(--bs-body-line-height, 1.5);

  /* Geometry & Borders */
  --salt-palette-corner: var(--bs-border-radius, 0.375rem);
  --salt-separable-primary-borderColor: var(--bs-border-color, #dee2e6);
  --salt-editable-borderColor: var(--bs-border-color, #dee2e6);
  --salt-editable-borderColor-hover: var(--bs-primary, #0d6efd);

  /* Status Colors */
  --salt-status-success-foreground: var(--bs-success, #198754);
  --salt-status-info-foreground: var(--bs-info, #0dcaf0);
  --salt-status-warning-foreground: var(--bs-warning, #ffc107);
  --salt-status-error-foreground: var(--bs-danger, #dc3545);
}
```

---

## 3. Critical Bridge Implementation Patterns

### Pattern 1: Strict Scoping for Portaled Overlays (Modals & Tooltips)

**Problem:** React Portals mount elements (`<Dialog>`, `<Tooltip>`) directly onto `document.body`, outside the `<div class="salt-bootstrap-compat">` wrapper hierarchy. If overrides are written globally (e.g. `.saltDialog`), they will leak into Standalone mode!

**Solution:**
1. Forward `compatMode` to the root microfrontend component.
2. Dynamically apply `.salt-bootstrap-compat` to the portaled component itself:
   ```tsx
   <Dialog className={compatMode ? "salt-bootstrap-compat" : undefined} ...>
   ```
3. Scope all CSS overrides strictly to `.salt-bootstrap-compat`:
   ```css
   /* Targets portaled dialog when bridge is active */
   .salt-bootstrap-compat.saltDialog,
   .salt-bootstrap-compat .saltDialog {
     background-color: var(--bs-body-bg, #ffffff);
     border-radius: var(--bs-border-radius-lg, 0.5rem);
   }

   /* Targets backdrop scrim only when a bridged dialog is open */
   body:has(.salt-bootstrap-compat.saltDialog) .saltScrim {
     background: rgba(0, 0, 0, 0.5) !important;
     backdrop-filter: blur(1px);
   }
   ```

### Pattern 2: Accordion Active State Tinting

**Problem:** Bootstrap 5 tints active accordion headers with subtle light blue `--bs-primary-bg-subtle` (`#cfe2ff`) and dark blue text `--bs-primary-text-emphasis` (`#052c65`), while Salt uses transparent/neutral headers.

**Solution:**
Target the expanded ARIA attribute:
```css
.salt-bootstrap-compat .saltAccordionHeader[aria-expanded="true"] {
  background-color: var(--bs-primary-bg-subtle, #cfe2ff) !important;
  color: var(--bs-primary-text-emphasis, #052c65) !important;
}
```

### Pattern 3: Full-Border Form Inputs

**Problem:** Salt inputs feature a bottom underline by default. Bootstrap inputs require a full 4-sided rounded border (`0.375rem`) and glow focus box-shadow.

**Solution:**
```css
.salt-bootstrap-compat .saltInput {
  border: 1px solid var(--bs-border-color, #dee2e6);
  border-radius: var(--bs-border-radius, 0.375rem);
  background-color: var(--bs-body-bg, #ffffff);
  min-height: 38px;
}

.salt-bootstrap-compat .saltInput:focus-within {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
```

---

## 4. Best Practices for Microfrontend Integration

1. **Never mutate `@salt-ds/core` package internals:** Rely strictly on token remapping and scoped CSS overrides.
2. **Support Dual-Mode execution:** Always ensure the MFE can run in pure native mode for Salt-centric consumers, and bridged mode for Bootstrap consumers.
3. **Automate Visual Parity Audits:** Use Playwright test suites to continuously verify that computed CSS values (backgrounds, border radii, font families) match the host application.
