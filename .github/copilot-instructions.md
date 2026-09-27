# GitHub Copilot Instructions for Bootstrap-Salt Wrapper Monorepo

You are assisting a developer working on the **Bootstrap 5 + Salt Design System Microfrontend Bridge**.

## Repository Context & Guidelines

### 1. Dual-Architecture Microfrontend
- This is a monorepo consisting of:
  - `packages/bootstrap-host` (Port 3000): Native Bootstrap 5 application acting as Module Federation Consumer.
  - `packages/salt-mfe` (Port 3001): Remote Microfrontend exposing Salt Design System components via Module Federation (`SaltWidget`).
- **Critical Requirement:**
  - Standalone mode at `http://localhost:3001/` must run in **pure native Salt DS mode** (Open Sans font, native underline inputs, slate buttons).
  - Integrated mode at `http://localhost:3000/` dynamically adopts **Bootstrap 5 styling** via the `.salt-bootstrap-compat` CSS bridge.

### 2. Strict CSS Scoping Rules
- When writing CSS in `packages/salt-mfe/src/styles/salt-bootstrap-bridge/`:
  - **NEVER** write unscoped global classes like `.saltDialog`, `.saltButton`, `.saltScrim`, or `.saltInput`.
  - **ALWAYS** scope them under `.salt-bootstrap-compat`:
    ```css
    .salt-bootstrap-compat.saltDialog,
    .salt-bootstrap-compat .saltDialog { ... }
    ```
  - Unscoped selectors will leak into Standalone mode on Port 3001, which is strictly forbidden.

### 3. React Portals (Dialogs, Tooltips)
- Salt's `<Dialog>` mounts directly to `document.body` via React Portal.
- Forward `compatMode` down from `SaltWidget` to `SaltMicrofrontend` and apply:
  `<Dialog className={compatMode ? "salt-bootstrap-compat" : undefined} ...>`
- For the backdrop scrim:
  `body:has(.salt-bootstrap-compat.saltDialog) .saltScrim { background: rgba(0, 0, 0, 0.5) !important; }`

### 4. Table Class Names in `@salt-ds/core`
- Note: `@salt-ds/core` compiles table elements to `.saltTable-th`, `.saltTable-td`, and `.saltTable-tr` (NOT `.saltTH` or `.saltTD`).

### 5. Accordion State Selection
- Use `.salt-bootstrap-compat .saltAccordionHeader[aria-expanded="true"]` to target the active expanded accordion header and apply `--bs-primary-bg-subtle` (`#cfe2ff`) and `--bs-primary-text-emphasis` (`#052c65`).

### 6. Development Workflow
- To run both applications: `npm start`
- To build both workspaces: `npm run build`
- To run Playwright visual audit: `npm test`
