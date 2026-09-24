---
name: Davlat Ta'lim Standarti
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#43474e'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777f'
  outline-variant: '#c4c6d0'
  surface-tint: '#435f8a'
  primary: '#00244b'
  on-primary: '#ffffff'
  primary-container: '#1b3a63'
  on-primary-container: '#88a5d4'
  inverse-primary: '#abc8f9'
  secondary: '#1e6296'
  on-secondary: '#ffffff'
  secondary-container: '#8cc6ff'
  on-secondary-container: '#005284'
  tertiary: '#371e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#553100'
  on-tertiary-container: '#e09231'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#abc8f9'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2a4771'
  secondary-fixed: '#cfe5ff'
  secondary-fixed-dim: '#98cbff'
  on-secondary-fixed: '#001d33'
  on-secondary-fixed-variant: '#004a77'
  tertiary-fixed: '#ffdcbc'
  tertiary-fixed-dim: '#ffb86a'
  on-tertiary-fixed: '#2c1700'
  on-tertiary-fixed-variant: '#683d00'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  margin: 1.75rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.875rem
  space-lg: 1.25rem
  space-xl: 1.75rem
---

## Brand & Style

This design system establishes a high-trust, institutional, government-grade visual language for modern administrative platforms. The interface conveys statutory rigor, stability, and operational precision while avoiding archaic, bureaucratic weight. It embodies a contemporary digital government ethos: structured, accessible, transparent, and authoritative.

The visual style combines Corporate Modern architecture with refined institutional ergonomics:
- **Structural Integrity:** Heavy reliance on clear visual hierarchy, precision borders, and compartmentalized data views designed for dense operational processing.
- **Emotional Resonance:** Produces immediate confidence and security for regional inspectors, school directors, and ministry analysts. The mood is calm, objective, and dependable.
- **Linguistic Precision:** Specially tuned for official Uzbek Latin orthography (standardizing diacritic glyph rendering such as *oʻ*, *gʻ*, *sh*, and *ch*).

## Colors

The palette balances authoritative deep state navies with functional semantic indicators:

- **Primary (`#1b3a63` / `#16325c` / `#24406e`):** Anchor colors used for high-level structure—navigation rail, top header bar, primary action buttons, and dominant data headers.
- **Institutional Blue Accent (`#2f6fa3`):** Active interactive states, focused form controls, navigational selections, and links.
- **Amber Accent (`#d98c2b` / `#d97706`):** Dedicated to credential management, API key tokens, high-priority notifications, and transitional states.
- **Neutrals & Surfaces:** Pure white (`#ffffff`) for elevated workspace surfaces and analytical cards; light administrative tint (`#f7fafd`) for full-canvas canvas fills; structural sub-containers (`#eef5fc`).
- **Dividers & Borders:** Controlled hairline boundaries using `#cbd5e1` and `#d1d5db` to delineate tabular records without visual clutter.
- **Semantic Attendance Indicators:**
  - *Keldi (Present):* `#16a34a` with soft container tint `#f0fdf4` and border `#bbf7d0`.
  - *Kelmadi (Absent):* `#dc2626` with soft container tint `#fef2f2` and border `#fecaca`.
  - *Kechikdi (Late):* `#d97706` with soft container tint `#fffbeb` and border `#fde68a`.

## Typography

Typography prioritizes tabular legibility and precise rendering of Uzbek orthography. 

- **Primary Titles (`Plus Jakarta Sans`):** Delivers clean geometry for section headers, metric figures, and module labels, asserting modern administrative authority without being overly decorative.
- **Body and Administrative Controls (`Inter`):** Handles dense tabular records, form inputs, status chips, and metadata. Standardizes tabular numbers (`tnum`) for synchronized statistical columns.
- **Monospace Code (`JetBrains Mono`):** Applied exclusively to security access tokens, API hashes, cryptographic certificate identifiers, and device sync logs.
- **Orthographic Consistency:** All text uses uniform modifier characters for turned commas (`ʻ` U+02BB) across components (e.g., *Taʼlim*, *Oʻquvchi*, *Gʻoyib*).

## Layout & Spacing

The layout is optimized for desktop and tablet screens where administrative personnel review records, while providing a collapsed layout for on-site mobile audits:

- **Shell Architecture:**
  - **Fixed Institutional Sidebar:** `260px` fixed width containing navigation tree, organizational level indicators (e.g., *Viloyat*, *Tuman*, *Maktab*), and user roles. Collapsible to `68px` icon mode.
  - **Institutional Topbar:** `64px` fixed height containing global institutional search, academic calendar state, security status badge, and profile credentials.
  - **Main Viewport Canvas:** Employs a fluid workspace with a strict horizontal page margin of `1.75rem` (`28px`) and uniform card gutters of `1.25rem` (`20px`).
- **Dense Data Grid:** Tabular structures utilize a condensed row vertical height (`40px` to `48px`) to maximize row exposure above the fold without compromising touch targets or scan speeds.

## Elevation & Depth

This system avoids floating or glassy consumer effects in favor of structured architectural depth and high-contrast boundaries:

- **Surface Levels:**
  - **Canvas Base:** Soft institutional background (`#f7fafd`) ensures long-session eye comfort.
  - **Cards & Data Modules:** Pure white (`#ffffff`) surfaces paired with a strict `1px` border (`#cbd5e1`).
  - **Hover & Active Panels:** Elevated with a subtle, non-intrusive administrative drop-shadow: `0 1px 3px 0 rgba(22, 50, 92, 0.06), 0 1px 2px -1px rgba(22, 50, 92, 0.04)`.
- **Security & Inspection Overlays:**
  - Critical modals (API key management, sensitive record modifications) utilize an opaque backdrop dimming (`#0f172a` at 45% opacity) and an elevated container with a sharp edge perimeter and direct shadow: `0 20px 25px -5px rgba(22, 50, 92, 0.1), 0 8px 10px -6px rgba(22, 50, 92, 0.06)`.

## Shapes

The interface employs a disciplined, "Soft" geometric profile (`roundedness: 1`):
- Standard interactive elements (buttons, inputs, select triggers, data pills) use a uniform `4px` (`0.25rem`) border radius.
- Structural modular panels, analytical metric containers, and modal dialogs adopt an `8px` (`0.5rem`) corner radius.
- Status indicator tags and attendance badge capsules use a subtle `4px` or `6px` radius—never fully circular or pill-shaped—to preserve their document-like, official character.

## Components

### 1. Tugmalar (Buttons)
- **Asosiy Tugma (Primary):** Solid deep navy (`#1b3a63`) background, white text (`#ffffff`), `0.25rem` radius, bold label. Hover: `#16325c`. Active: `#24406e`.
- **Ikkilamchi Tugma (Secondary):** Crisp outline with `#cbd5e1` border, white background, navy text (`#1b3a63`). Hover: `#eef5fc`.
- **Ogohlantirish / Xavfsizlik Tugmasi (Warning/Security):** Solid amber (`#d98c2b`) background with white text, utilized for credential revoking and key regeneration.
- **Xavfli Amallar Tugmasi (Destructive):** Red (`#dc2626`) background for record deletions or blacklist actions.

### 2. Davomat Holati Belgilari (Attendance Status Badges)
Compact status capsules featuring a 1px border, 12px medium text, and unified spacing:
- **Keldi (Present):** Text `#15803d`, background `#f0fdf4`, border `#bbf7d0`. Accompanied by a solid check indicator.
- **Kelmadi (Absent):** Text `#b91c1c`, background `#fef2f2`, border `#fecaca`. Accompanied by a cross indicator.
- **Kechikdi (Late):** Text `#b45309`, background `#fffbeb`, border `#fde68a`. Displays duration metadata (e.g., *+15 daq*).

### 3. Maʼlumotlar Jadvallari (Data Tables)
- **Header:** Sticky header with `#eef5fc` fill, `#1b3a63` uppercase 11px micro-labels, and explicit sorting arrows.
- **Rows:** Alternating subtle row hover (`#f8fafc`), height `44px`, bordered horizontally with `#e2e8f0`.
- **Cell Types:** Monospace aligned columns for Student ID (*Oʻquvchi ID*), full name text column with photo thumbnail avatar, fixed status column, and action icons.

### 4. Metrika Kartalari (Metric Cards)
- Elevated white containers with `1px` `#cbd5e1` border.
- Structured with micro-label (*Koʻrsatkich*), large tabular display metric (`30px` bold Plus Jakarta Sans), and an integrated trend indicator comparing with the previous period (*Oʻtgan haftaga nisbatan +2.4%*).

### 5. API Kalitini Ochish Modali (Security API Key Reveal Modal)
- Explicit security header with a protective amber badge (*Xavfsizlik darajasi: Yuqori*).
- Obfuscated key view utilizing monospaced asterisks with a timed 30-second reveal toggle.
- Institutional audit warning text in Uzbek explaining automated logging of key exposures (*Ushbu amal tizim jurnalida qayd etiladi*).
- Copy-to-clipboard action with inline visual confirmation.

### 6. Filtr va Qidiruv Paneli (Filter & Search Controls)
- Unified horizontal bar linking textual input with cascading multi-select filters for *Tuman*, *Maktab*, *Sinf*, and *Sana*.
- Input fields feature a `#cbd5e1` rest border and an institutional blue (`#2f6fa3`) 2px focus ring.