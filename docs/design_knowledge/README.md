# Design Knowledge Base: Bootstrap 5 & Salt Design System

Welcome to the Design Knowledge Base for the **Bootstrap 5 + Salt Design System Microfrontend Bridge** project.

This directory contains comprehensive architectural reference guides, token documentation, component taxonomies, and cross-framework integration patterns.

---

## 📑 Knowledge Guides

### 1. 📘 [Bootstrap 5 Design System Guide](./bootstrap-design-system.md)
Detailed architecture of Bootstrap 5.3+:
- Core design tokens (`--bs-*`)
- 12-column responsive flexbox grid & breakpoints
- Typography and font stack specifications
- Component architectures (Forms, Buttons, Modals, Accordions, Tables, Progress)
- Color modes & Dark Mode (`data-bs-theme="dark"`)

### 2. 🛡️ [Salt Design System Guide (J.P. Morgan)](./salt-design-system.md)
Deep dive into J.P. Morgan's enterprise design system:
- Characteristic token architecture (Action, Container, Separable, Status, Track, Palette)
- 4-level density control engine (`touch`, `low`, `medium`, `high`)
- Provider hierarchy (`<SaltProvider>`)
- High-density financial component catalog
- Accessibility standards (WCAG 2.1 AA) and required web fonts (Open Sans, PT Mono)

### 3. 🌉 [Bridge Patterns & Comparative Architecture](./bridge-patterns-and-comparison.md)
Cross-framework integration blueprints:
- High-level architectural comparison matrix
- Token remapping formula (`--bs-*` ➔ `--salt-*`)
- Critical implementation patterns (Portaled modals isolation, Accordion active tinting, Full-border inputs)
- Dual-mode microfrontend federation best practices

---

## 🎯 Quick Navigation

- Want to understand Bootstrap's CSS variables? 👉 [Read the Bootstrap Guide](./bootstrap-design-system.md)
- Want to understand Salt's density and characteristic tokens? 👉 [Read the Salt Guide](./salt-design-system.md)
- Want to see how the bridge makes them look identical? 👉 [Read the Bridge Patterns Guide](./bridge-patterns-and-comparison.md)
- Want to view the automated test parity results? 👉 [Read the Parity & Verification Audit](../PARITY_AND_VERIFICATION_REPORT.md)
