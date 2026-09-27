# Bootstrap 5 + Salt Design System Microfrontend Bridge

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple.svg)](https://getbootstrap.com/)
[![Salt DS](https://img.shields.io/badge/Salt_DS-1.71-0055b8.svg)](https://www.saltdesignsystem.com/)
[![Vite Module Federation](https://img.shields.io/badge/Federation-Vite-646CFF.svg)](https://github.com/originjs/vite-plugin-federation)

A production-grade architecture demonstrating how enterprise applications built on **Bootstrap 5** can seamlessly integrate **J.P. Morgan's Salt Design System (`@salt-ds/core`)** via Microfrontends (Module Federation).

---

## 🏛️ Architecture Overview

The workspace is structured as an npm monorepo with two decoupled applications:

```
bootstrap-salt-wrapper/
├── packages/
│   ├── bootstrap-host/        # Host Application (Port 3000)
│   │   ├── src/
│   │   │   ├── App.tsx        # Side-by-side parity dashboard
│   │   │   └── main.tsx
│   │   └── vite.config.ts     # Module Federation Consumer
│   │
│   └── salt-mfe/              # Salt Microfrontend (Port 3001)
│       ├── src/
│       │   ├── mfe/
│       │   │   ├── SaltWidget.tsx          # Remote entry component
│       │   │   └── SaltMicrofrontend.tsx   # Salt DS showcase suite
│       │   ├── styles/salt-bootstrap-bridge/
│       │   │   ├── _tokens.css             # Bootstrap ➔ Salt token bridge
│       │   │   ├── _typography.css         # Font-family & scale mapping
│       │   │   └── _component-overrides.css# Scoped component adaptations
│       │   └── components/SaltMFEWrapper.tsx
│       └── vite.config.ts     # Module Federation Provider
│
└── tests/                     # Playwright automated visual parity suites
    ├── test-all-components.mjs
    └── verify-tabs-dialog-accordion-metrics.mjs
```

### Module Federation Flow

```mermaid
graph LR
    subgraph Host ["Bootstrap Host (Port 3000)"]
        BSApp[Host App Dashboard]
        BSNative[Native Bootstrap 5 Column]
        RemoteContainer[Remote Component Container]
    end

    subgraph MFE ["Salt MFE (Port 3001)"]
        RemoteEntry[remoteEntry.js]
        SaltWidget[SaltWidget Component]
        CSSBridge[Scoped CSS Bridge (.salt-bootstrap-compat)]
        SaltCore[Salt DS Core & Icons]
    end

    RemoteEntry -.->|Federated Import| RemoteContainer
    RemoteContainer --> SaltWidget
    SaltWidget --> CSSBridge
    CSSBridge --> SaltCore
    BSApp --> BSNative
```

---

## 🌟 Key Features

### 1. Dual-Mode Behavior (Zero Style Leakage)
- **Standalone Mode (`http://localhost:3001/`):** Runs in **Pure Native Salt DS**. Renders with native Open Sans typography, uppercase buttons, Salt underline text inputs, and pure Salt modal scrims.
- **Integrated Host Mode (`http://localhost:3000/`):** Runs with the **CSS Bridge Active**. Dynamically adopts the Host's Bootstrap 5 theme, fonts, button styling, and input controls without altering `@salt-ds/core` package internals.

### 2. Comprehensive 4-Section Component Suite
Both columns provide identical functionality for 1-to-1 visual comparison:
1. **Forms & Inputs:** Text Inputs with adornment icons, Currency Dropdowns, Multiline Textareas, Range Sliders, 5-Star Ratings, Radio/Checkbox groups, and Primary/Secondary/CTA Buttons.
2. **Data Grid & Table:** Breadcrumb trails, Segmented filter bars, Search filters, Financial settlement data table, Risk tags, and Status badges.
3. **Dialog & Accordion:** Interactive modal dialog with backdrop scrim, header close button, and 3 collapsible accordion panels with matching active highlight tint (`#cfe2ff`).
4. **Metrics & System Health:** Daily clearing limit progress bar (77%), circular capacity meters (84%), WebSocket heartbeat animation, and 4 system status indicator cards.

### 3. Real-Time Dynamic Synchronization
- **Dark Mode Support:** Toggling Dark Mode switches Bootstrap (`data-bs-theme="dark"`) and Salt DS (`mode="dark"`) in sync.
- **Custom Accent Themes:** Real-time switching between **Blue** (`#0d6efd`), **Purple** (`#6f42c1`), and **Orange** (`#fd7e14`).
- **Synchronized Tab Switching:** `🔗 Sync Side-by-Side Tabs` header toggle synchronizes tab selection across both columns simultaneously.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/sivakannan/bootstrap-salt-wrapper.git
cd bootstrap-salt-wrapper
npm install
```

### Running Locally
Start both the Salt Microfrontend (Port 3001) and Bootstrap Host (Port 3000) concurrently:
```bash
npm start
```
- Open **`http://localhost:3000/`** for the Side-by-Side Visual Parity Dashboard.
- Open **`http://localhost:3001/`** for the Standalone Salt DS Microfrontend.

---

## 🧪 Automated Testing & Visual Parity

The repository includes end-to-end test suites powered by Playwright to verify visual parity, DOM computed values, and cross-application behavior:

```bash
# Run comprehensive 26-assertion component audit
npm test

# Run granular tabs, dialog, accordion, and metrics verification
npm run test:features
```

---

## 🛠️ How the CSS Bridge Works

The bridge translates Bootstrap design tokens into Salt design system variables using CSS Custom Properties:

```css
/* Mapping Bootstrap CSS variables to Salt Design System tokens */
.salt-bootstrap-compat {
  --salt-action-primary-background: var(--bs-primary);
  --salt-action-primary-background-hover: var(--bs-primary);
  --salt-palette-corner: var(--bs-border-radius);
  --salt-typography-fontFamily: var(--bs-body-font-family);
  --salt-typography-fontSize: var(--bs-body-font-size);
}

/* Scoped overrides ensure zero leakage outside the container */
.salt-bootstrap-compat.saltDialog {
  background-color: var(--bs-body-bg);
  border-radius: var(--bs-border-radius-lg);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
```

---

## 📚 Documentation

Detailed architectural specifications and audit reports are available in the [`docs/`](./docs) directory:
- 📊 **[Component Parity & Verification Audit](./docs/PARITY_AND_VERIFICATION_REPORT.md)**: Test results, DOM computed value comparisons, and key architectural findings.
- 📐 **[Low-Level Design (LLD)](./docs/design_review/salt-bootstrap-bridge-LLD.md)**: Deep architectural specifications for CSS variable token mapping.
- 🛠️ **[Implementation Guide](./docs/implementation_review/salt-bootstrap-bridge-implementation.md)**: Step-by-step developer onboarding, packaging, and integration guide.

---

## 📄 License
MIT © [sivakannan](https://github.com/sivakannan)

