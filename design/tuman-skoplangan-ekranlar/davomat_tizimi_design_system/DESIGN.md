---
name: Davomat Tizimi Design System
colors:
  surface: '#f7f9ff'
  surface-dim: '#d1dbe7'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ecf4ff'
  surface-container: '#e5effb'
  surface-container-high: '#dfe9f5'
  surface-container-highest: '#dae3f0'
  on-surface: '#131d25'
  on-surface-variant: '#44474f'
  inverse-surface: '#28313b'
  inverse-on-surface: '#e8f2fe'
  outline: '#747780'
  outline-variant: '#c4c6d0'
  surface-tint: '#455f8b'
  primary: '#001d42'
  on-primary: '#ffffff'
  primary-container: '#16325c'
  on-primary-container: '#829bcb'
  inverse-primary: '#aec7fa'
  secondary: '#1e6296'
  on-secondary: '#ffffff'
  secondary-container: '#8cc6ff'
  on-secondary-container: '#005284'
  tertiary: '#2e1800'
  on-tertiary: '#ffffff'
  tertiary-container: '#4b2b00'
  on-tertiary-container: '#d68a29'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e3ff'
  primary-fixed-dim: '#aec7fa'
  on-primary-fixed: '#001b3f'
  on-primary-fixed-variant: '#2d4772'
  secondary-fixed: '#cfe5ff'
  secondary-fixed-dim: '#98cbff'
  on-secondary-fixed: '#001d33'
  on-secondary-fixed-variant: '#004a77'
  tertiary-fixed: '#ffdcbc'
  tertiary-fixed-dim: '#ffb86a'
  on-tertiary-fixed: '#2c1700'
  on-tertiary-fixed-variant: '#683d00'
  background: '#f7f9ff'
  on-background: '#131d25'
  surface-variant: '#dae3f0'
typography:
  headline-xl:
    fontFamily: Public Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Public Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Public Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-md:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Public Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  tabular-data:
    fontFamily: Public Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  code-key:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  badge-label:
    fontFamily: Public Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an authoritative, institutional, and highly accountable digital environment tailored for the District Education Department ("Tuman Ta'lim Boshqarmasi"). The interface conveys official legitimacy, computational rigor, and absolute clarity. It balances state-grade gravitas with intuitive daily operational efficiency for school directors, district inspectors, and administrative personnel.

The visual style is **Corporate / Modern Institutional** fused with **Precision Data Ergonomics**:
- **Official & Constitutional:** Evoking national administrative weight through deep state-navy foundations, crisp cool slate separators, and gold sovereign insignia accents.
- **Utilitarian & Legible:** Prioritizing dense administrative workflows, high-speed attendance auditing, and zero-ambiguity status reporting.
- **Security-First:** Emphasizing encrypted token validation, tamper-evident audit logs, and hardware key confirmations with distinct warning and verification metaphors.
- **Tone:** Unflinching, trustworthy, methodical, and accessible across public school network hardware.

## Colors

The palette balances administrative authority, operational clarity, and strict semantic governance.

### Core Palette
- **Primary Navy (`#16325C` / Variant `#1B3A63`):** Symbolizes public authority and structural integrity. Applied to app headers, institutional mastheads, primary actions, and top-tier metrics.
- **Secondary Slate Blue (`#2F6FA3`):** Guides interactive navigation, tab transitions, analytical selections, and informational indicators.
- **Tertiary Amber Gold (`#D98C2B`):** Denotes state emblems, authorized security tokens, two-factor challenges, and high-priority departmental notifications.
- **Neutral Slate Framework (`#CBD5E1` / Light `#DBEAFE`):** Provides sharp, structural grid lines and containment without visual fatigue.

### Canvas & Surface Layers
- **Base Canvas (`#EEF5FC`):** Soft, cool background preventing eye strain during extensive data entry shifts.
- **Elevated Canvas (`#F7FAFD`):** Subtle card and workspace surface for secondary data grouping.
- **Pure Surface (`#FFFFFF`):** High-contrast background for primary data tables, active forms, and modal dialogs.

### Semantic Attendance Spectrum
- **Present ('Keldi'):** `#16A34A` text and glyphs with `#DCFCE7` soft container.
- **Absent ('Kelmadi'):** `#DC2626` text and glyphs with `#FEE2E2` soft container.
- **Late ('Kechikdi'):** `#D97706` text and glyphs with `#FEF3C7` soft container.
- **Excused / System Notice:** `#2563EB` text and glyphs with `#EFF6FF` container.

## Typography

The typographic hierarchy uses **Public Sans** for all narrative, tabular, and structural content. Public Sans delivers exceptional institutional authority, wide character recognition, and robust rendering across variable display resolutions.

- **Tabular Figures:** Numbers within tables, registers, counts, and statistical percentages must enforce OpenType tabular figures (`tnum`) to maintain pristine vertical alignment across dense rows.
- **Monospace Integration:** **JetBrains Mono** is strictly reserved for API security keys, student biometric identifiers, hardware hashes, and sync session IDs.
- **Letter Spacing:** All uppercase administrative tags, badges, and table column headers must leverage slight positive tracking (`+0.04em` to `+0.06em`) for rapid scannability under high-stress auditing conditions.

## Layout & Spacing

This design system uses a strict **12-column fluid grid system** with rigid proportional bounds, built for high-density administrative software.

### Canvas Grid Model
- **Desktop (1200px+):** 12-column fluid grid with `2rem` outer canvas margin and `1.5rem` gutters. Maximum layout constraint capped at `1600px` to maintain comfortable eye travel on ultrawide enterprise monitors.
- **Tablet (768px - 1199px):** 8-column layout with `1.5rem` margins and `1rem` gutters. Side navigation drawers collapse to icons or sheet overlays.
- **Mobile (< 768px):** 4-column layout with `1rem` edge margins and `0.75rem` gutters. Tables reflow into structured card stacks with preserved status chips.

### Density & Rhythms
The vertical rhythm standardizes on an 8px base grid, tightening to a 4px sub-grid for data-dense tables and input groups. Form fields and table rows utilize condensed vertical padding (`0.5rem` to `0.75rem`) to maximize screen efficiency, enabling district controllers to view full classroom rosters without excessive pagination.

## Elevation & Depth

Visual hierarchy relies on **crisp structural containment, tinted ambient depth, and tonal surface separation** rather than heavy drop shadows.

- **Flat/Subtle Boundary (Level 0):** Background layers (`#EEF5FC`, `#F7FAFD`) segmented cleanly by 1px solid borders (`#CBD5E1` or `#DBEAFE`). No shadow. Used for base canvas panels, nested lists, and data table headers.
- **Panel & Card Elevation (Level 1):** Main administrative cards and dashboard widgets utilize a crisp border (`1px solid #DBEAFE`) alongside an ambient navy-tinted shadow: `0 1px 3px 0 rgba(22, 50, 92, 0.05), 0 1px 2px -1px rgba(22, 50, 92, 0.03)`.
- **Dropdown & Flyout Elevation (Level 2):** Context menus, date pickers, and multi-school selectors: `0 4px 12px 0 rgba(22, 50, 92, 0.08), 0 2px 4px -1px rgba(22, 50, 92, 0.04)`, framed with a 1px border (`#CBD5E1`).
- **Security Modals & Critical Overlays (Level 3):** Verification prompts, signature confirmation dialogs, and token regeneration panels: `0 20px 25px -5px rgba(22, 50, 92, 0.12), 0 8px 10px -6px rgba(22, 50, 92, 0.08)`. Backdrops use a semi-opaque navy wash: `rgba(22, 50, 92, 0.45)` with a 2px backdrop blur.

## Shapes

The design system maintains a **Soft Institutional (Level 1)** geometry. 

- **Containers & Cards:** `0.25rem` (`4px`) default border radius for standard components, expanding to `0.5rem` (`8px`) for outer structural cards and modal shells.
- **Inputs & Controls:** `0.25rem` (`4px`) provides a disciplined, precise, non-playful silhouette suited for formal governmental registers.
- **Chips & Status Badges:** Compact micro-radii (`0.25rem`) ensure attendance status pills maintain high scannability inside tabular rows without circular distortion. Full pills are strictly reserved for live connection state dots or active biometric capture indicators.

## Components

### Buttons
- **Primary Government Action:** Solid `#16325C` fill, pure white text, 1px `#16325C` border. On hover: `#1B3A63`. On focus: 2px offset ring in `#2F6FA3`.
- **Secondary Administrative Action:** Surface white `#FFFFFF`, border 1px solid `#CBD5E1`, text `#16325C`. On hover: `#EEF5FC`.
- **Security / Amber Trigger:** `#D98C2B` background with white bold text for key generation, batch signing, and system exports.
- **Destructive:** Solid `#DC2626` or 1px border `#DC2626` with red text on hover `#FEE2E2`.

### Status Badges & Chips
- **Presence Chips:** Uniform format: 11px uppercase bold, `0.25rem` radius, `0.25rem 0.5rem` padding.
  - *Keldi (Present):* Text `#16A34A`, background `#DCFCE7`, border 1px solid rgba(22, 163, 74, 0.2).
  - *Kelmadi (Absent):* Text `#DC2626`, background `#FEE2E2`, border 1px solid rgba(220, 38, 38, 0.2).
  - *Kechikdi (Late):* Text `#D97706`, background `#FEF3C7`, border 1px solid rgba(217, 119, 6, 0.2).

### Tabular Registers & Data Grids
- **Header Rows:** `#F7FAFD` background with 1px bottom border `#CBD5E1`. 11px uppercase tracking for column titles.
- **Data Rows:** `#FFFFFF` background, alternating subtle tint `#FBFDFF`. Row height locked to 44px for compact data density.
- **Interactive Rows:** Hover background `#EEF5FC` transition (120ms linear).

### Security Credentials & API Displays
- **Monospace Token Containers:** `#F7FAFD` background, 1px dashed or solid border `#CBD5E1`, font JetBrains Mono. Equipped with quick copy triggers, checksum markers, and dynamic masking for sensitive staff identity numbers.

### Input Fields & Selectors
- **Default State:** Pure white surface, 1px solid `#CBD5E1`, text `#16325C`, 38px standard height, `0.25rem` radius.
- **Focus State:** 1px solid `#2F6FA3` with a subtle outline glow `rgba(47, 111, 163, 0.15)`.
- **Error State:** 1px solid `#DC2626` with error text in `#DC2626` at 12px.

### Cards & Institutional Banners
- **Dashboard Metric Cards:** Crisp `#FFFFFF` container with a top 3px accent stroke: `#16325C` for total enrollment, `#16A34A` for present rate, `#DC2626` for critical absences, and `#D98C2B` for verification audits.
- **Departmental Header:** Displays official crest placement at 40x40px, institutional name in bold `#16325C`, district breadcrumbs, and live server synchronization state.