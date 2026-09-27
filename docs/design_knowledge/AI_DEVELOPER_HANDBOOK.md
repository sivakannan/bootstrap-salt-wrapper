# AI Developer & Engineering Handbook: Bootstrap ↔ Salt DS Bridge

> **Audience:** AI assistants (GitHub Copilot, Roo Code, Cline, Cursor, Claude, Devin) and Human Engineers onboarding or extending this codebase.

---

## 1. Quick Orientation

This repository is an **Enterprise Microfrontend Bridge Architecture**. It bridges J.P. Morgan's **Salt Design System (`@salt-ds/core`)** into a **Bootstrap 5.3** host application using **Vite Module Federation**.

### Key Concept: The Decoupled Monorepo
- **`packages/bootstrap-host` (Port 3000)**: Consumes the remote Salt widget and renders a side-by-side comparison dashboard.
- **`packages/salt-mfe` (Port 3001)**: Exposes `SaltWidget` via Module Federation at `/assets/remoteEntry.js`.
  - When viewed directly at `http://localhost:3001/`, it runs in **Pure Native Salt DS mode** (`compatMode = false`).
  - When loaded by the host on `http://localhost:3000/`, it runs with the **Bootstrap Bridge active** (`compatMode = true`), adopting the host's design tokens.

---

## 2. Directory & File Map

```
bootstrap-salt-wrapper/
├── AGENTS.md                                # Universal agent rules (Copilot, Roo, Cline, Claude)
├── .clinerules                              # Roo Code / Cline custom rules
├── .cursorrules                             # Cursor IDE rules
├── .github/copilot-instructions.md          # GitHub Copilot rules
├── package.json                             # Monorepo workspaces & root scripts
│
├── packages/bootstrap-host/                 # HOST APPLICATION (PORT 3000)
│   ├── src/
│   │   ├── App.tsx                          # Side-by-side comparison dashboard
│   │   ├── declarations.d.ts                # Remote module typings for salt_mfe/SaltWidget
│   │   ├── index.css                        # Bootstrap 5 imports & theme variables
│   │   └── main.tsx                         # Host React 19 entry
│   └── vite.config.ts                       # Federation consumer configuration
│
├── packages/salt-mfe/                       # SALT MICROFRONTEND (PORT 3001)
│   ├── src/
│   │   ├── mfe/
│   │   │   ├── SaltWidget.tsx               # Federated wrapper (handles compatMode toggle)
│   │   │   └── SaltMicrofrontend.tsx        # Showcase suite (4 tabs: Forms, Table, Dialog, Metrics)
│   │   ├── styles/salt-bootstrap-bridge/    # THE CSS BRIDGE
│   │   │   ├── _tokens.css                  # Bootstrap CSS variables ➔ Salt tokens
│   │   │   ├── _typography.css              # Font stack & scale mapping
│   │   │   ├── _component-overrides.css     # Scoped overrides (.salt-bootstrap-compat)
│   │   │   ├── _dark-mode.css               # Dynamic dark mode bridge
│   │   │   └── index.css                    # Bridge entry stylesheet
│   │   └── components/SaltMFEWrapper/       # Provider wrapper for host consumption
│   └── vite.config.ts                       # Federation provider configuration
│
├── tests/                                   # AUTOMATED PLAYWRIGHT AUDIT
│   ├── test-all-components.mjs              # 26-assertion component parity audit
│   └── verify-tabs-dialog-accordion-metrics.mjs # Granular feature verification
│
└── docs/                                    # SPECIFICATIONS & KNOWLEDGE BASE
    ├── PARITY_AND_VERIFICATION_REPORT.md    # Verified test results & DOM comparison
    ├── design_knowledge/                    # Core design system documentation
    │   ├── README.md                        # Knowledge base index
    │   ├── bootstrap-design-system.md       # Bootstrap 5 tokens, grid, components
    │   ├── salt-design-system.md            # Salt DS characteristic tokens, density, fonts
    │   └── bridge-patterns-and-comparison.md# Comparison matrix & bridge recipes
    ├── design_review/salt-bootstrap-bridge-LLD.md # Low-level design doc
    └── implementation_review/               # Implementation guide
```

---

## 3. The 5 Rules for Modifying Code

Whenever you generate code or propose edits in this repository, follow these rules:

### Rule 1: Always Maintain Dual-Mode Isolation
The MFE MUST support both modes:
- **Standalone Mode (`:3001`)**: `compatMode = false`. Pure Salt DS (Open Sans, text underlines, slate buttons, light scrim).
- **Host Mode (`:3000`)**: `compatMode = true`. Bootstrap bridge active (system fonts, rounded borders, blue/gray buttons, dark scrim).
- **Never hardcode `className="salt-bootstrap-compat"`**. Always use conditional props: `className={compatMode ? "salt-bootstrap-compat" : undefined}`.

### Rule 2: 100% Strict CSS Scoping
- In `packages/salt-mfe/src/styles/salt-bootstrap-bridge/_component-overrides.css`:
- **Every rule MUST start with `.salt-bootstrap-compat`**.
- Unscoped rules (e.g. `.saltDialog { ... }`) are forbidden because they pollute standalone mode.

### Rule 3: React Portal Scoping
- Components that portal to `document.body` (`<Dialog>`, `<Tooltip>`) escape container divs.
- **Handling Recipe:**
  1. Add `className={compatMode ? "salt-bootstrap-compat" : undefined}` directly to `<Dialog>`.
  2. In CSS, target `.salt-bootstrap-compat.saltDialog` and `body:has(.salt-bootstrap-compat.saltDialog) .saltScrim`.

### Rule 4: Table Selectors
- Salt compiles tables to `.saltTable-th`, `.saltTable-td`, `.saltTable-tr`.
- Always target `.saltTable-th, th` and `.saltTable-td, td`.

### Rule 5: Keep Both CSS Copies in Sync
- The primary CSS bridge is at `packages/salt-mfe/src/styles/salt-bootstrap-bridge/`.
- If modifying CSS, keep `src/styles/salt-bootstrap-bridge/` in sync.

---

## 4. Common Tasks & How to Implement Them

### Task A: Adding a New Component to the Comparison Dashboard
1. Open `packages/salt-mfe/src/mfe/SaltMicrofrontend.tsx` and implement the Salt component.
2. Open `packages/bootstrap-host/src/App.tsx` and implement the exact equivalent Native Bootstrap 5 component on the left column.
3. If Salt styling differs from Bootstrap, add a scoped override in `packages/salt-mfe/src/styles/salt-bootstrap-bridge/_component-overrides.css`:
   ```css
   .salt-bootstrap-compat .saltNewComponent {
     border-radius: var(--bs-border-radius, 0.375rem);
   }
   ```
4. Rebuild `salt-mfe` (`npm run build:salt`) and test with `npm test`.

### Task B: Running the Test Suites
```bash
# Full 26-assertion component audit
npm test

# Granular Tab, Dialog, Accordion, and Metrics check
npm run test:features
```

### Task C: Starting Development Servers
```bash
# Starts both MFE (3001) and Host (3000) concurrently
npm start
```
