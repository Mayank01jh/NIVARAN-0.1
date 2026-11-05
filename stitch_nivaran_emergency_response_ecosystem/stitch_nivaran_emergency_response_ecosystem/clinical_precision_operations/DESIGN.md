---
name: Clinical Precision Operations
colors:
  surface: '#fcf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fcf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ee'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e5e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#424843'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#727972'
  outline-variant: '#c2c8c1'
  surface-tint: '#466551'
  primary: '#082717'
  on-primary: '#ffffff'
  primary-container: '#1f3d2b'
  on-primary-container: '#87a890'
  inverse-primary: '#accfb6'
  secondary: '#6b38d4'
  on-secondary: '#ffffff'
  secondary-container: '#8455ef'
  on-secondary-container: '#fffbff'
  tertiary: '#381a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#572c00'
  on-tertiary-container: '#ed861e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c8ebd1'
  primary-fixed-dim: '#accfb6'
  on-primary-fixed: '#022111'
  on-primary-fixed-variant: '#2f4d3a'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
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
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  metric-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.25rem
  margin: 1rem
  margin-desktop: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 1.75rem
---

## Brand & Style

This design system delivers a high-urgency, calm-execution interface tailored for trauma directors, triage charge nurses, and hospital operations dispatchers. The visual language rejects both sterile cold minimalism and chaotic emergency room alarmism in favor of structured clinical authority, immediate visual triage, and focused ergonomics.

The aesthetic fuses modern enterprise SaaS rigor with clinical operational clarity:
- **Calm Authority:** Deep forest greens establish an immovable, grounded institutional presence, reducing cognitive strain during high-stress operational shifts.
- **Warm Spatial Canvas:** Muted sand and warm mineral surfaces eliminate harsh screen glare under clinical fluorescent lighting while maintaining high contrast.
- **High-Velocity Interactive Signaling:** Electric purple directs operational momentum, isolating critical actions, live triage alerts, and active incoming telemetry without triggering visual panic.
- **Data-Dense Restraint:** Strictly no ornamental flourishes, rounded emojis, or decorative stickers. The interface relies entirely on crisp tabular density, monoline technical iconography, structured micro-badges, and calibrated hierarchy.

## Colors

The system operates exclusively in crisp light mode. Surfaces rely on organic mineral foundations, while foreground tokens maintain strict clinical legibility and instant situational triage.

### Palette Architecture
- **Primary (`#1F3D2B` - Deep Forest Green):** The institutional anchor. Used for primary navigation frames, structural headers, active tab indicators, verified patient states, and stable operational indicators.
- **Secondary (`#8B5CF6` - Electric Purple):** The interactive vanguard. Governs high-priority CTAs, real-time incoming transport indicators, active patient radar sweeps, and live telemetry badges.
- **Tertiary (`#D97706` - Clinical Amber):** Reserved strictly for delayed bed assignment warnings, pending labs, and critical diversion advisories.
- **Critical / Trauma Red (`#DC2626`):** Reserved exclusively for Level-1 Resuscitation alerts, coding events, and zero-capacity threshold triggers.
- **Neutral Canvas (`#FAF7F2` Base Off-White, `#F5F1E8` Surface Dim, `#E8DCC4` Sand Accent Border):** Form the layered light environment. Crisp, matte, anti-glare, non-fatiguing.
- **Text & Borders:** Text hierarchy is anchored by `#0F1E15` (Deep Pine Black) for primary labels, `#3E4D43` for metadata/secondary, and `#707D74` for tertiary metrics. Dividers and container borders utilize `#E2DDD2` and `#D3CBBF`.

## Typography

The typographic balance teams **Plus Jakarta Sans** for structural headers, operational metrics, and telemetry indicators with **Inter** for dense tabular records, patient history, and vital signage feeds.

- **Tabular Figures:** All numeric data—including trauma counters, GCS ratings, heart rates, blood pressure, and triage wait times—must explicitly render with proportional lining and tabular figures enabled (`font-variant-numeric: tabular-nums`).
- **Scannability Rules:** Section tags, status capsules, and clinical categories utilize `label-md` uppercase with a `+0.04em` tracking offset to guarantee readability under quick glance sweeps.
- **Hierarchy Separation:** Operational metrics use `metric-display` in deep forest green or alert tones to establish instant status confirmation from a 3-foot monitor distance.

## Layout & Spacing

The portal adheres to a modular 12-column layout engineered for high information density, rapid context switching, and continuous multi-stream surveillance.

### Layout Mechanics
- **Grid Architecture:** Multi-pane operational layout featuring a collapsed/expandable 64px–240px operational side rail, a central triage and patient intake command center spanning 8–9 columns, and a persistent 3–4 column telemetry radar and bay allocation dock.
- **Micro Spacing:** A 4px baseline matrix governs internal component spaces (`space-xs` = 4px, `space-sm` = 8px, `space-md` = 12px, `space-lg` = 20px, `space-xl` = 28px). Dense tables leverage condensed cell heights (40px default, 32px high-density mode) to ensure maximum visible patient records above the fold.
- **Responsive Adaptations:**
  - **Desktop (1440px+):** Tri-pane layout active; live radar and intake table simultaneously visible.
  - **Tablet (768px–1023px):** Persistent radar converts to a collapsible off-canvas drawer; tabular columns collapse secondary identifiers into expandable drawer records.
  - **Mobile / Bedside Terminal (360px–767px):** Single-column stacked triage cards; radar transforms into a pinned top status ticker.

## Elevation & Depth

Visual hierarchy uses architectural tonal planes and precision borders rather than heavy ambient drop shadows, maintaining an authentic medical workstation aesthetic.

- **Surface Tiers:**
  - **Level 0 (Canvas Base):** `#FAF7F2` (Warm linen base).
  - **Level 1 (Card & Module Foundation):** `#FFFFFF` bordered with 1px solid `#E2DDD2`.
  - **Level 2 (Active Focus & Modal Surface):** `#FFFFFF` paired with an elevated perimeter: `0 4px 12px -2px rgba(31, 61, 43, 0.06), 0 2px 6px -1px rgba(31, 61, 43, 0.04)`.
- **Radar & Critical Focus Overlays:** Active triage selection and radar pulse markers introduce a specialized 2px offset ring rendered in `#8B5CF6` accompanied by an ultra-soft electric purple glow: `0 0 0 3px rgba(139, 92, 246, 0.18)`.
- **Divider Treatment:** Sub-sections and internal cell borders never use pure black or grey; they use warm stone hairline rules (`#EDE7DC`).

## Shapes

The interface embraces a precise, clinical, and disciplined shape rhythm. A roundedness factor of `1` (Soft: 4px base border radius) maintains crisp spatial orientation across data tables, trauma capacity counters, and alert panels.

- **Component Standard (`4px` / `0.25rem`):** Buttons, form inputs, table rows, radar track cards, and telemetry containers.
- **Containers & Flyouts (`8px` / `0.5rem`):** Main operational panels, modal dialogs, and drawer containers.
- **Pill Exceptions (`9999px`):** Reserved exclusively for live operational indicators, triage category markers (ESI 1–5 badges), and capacity threshold meters to visually contrast data containers.

## Components

### Buttons
- **Primary CTA (Action / Dispatch):** Electric Purple background (`#8B5CF6`), crisp white text, 4px border radius, 36px standard height (`label-lg`). Hover state deepens to `#7C3AED`. Active state scales subtly without spring motion.
- **Operational / Administrative:** Deep Forest Green (`#1F3D2B`), crisp white text. Used for "Admit Patient," "Confirm Bed Transfer," and "Finalize Intake."
- **Secondary / Ghost:** Transparent background, 1px solid `#D3CBBF`, text `#1F3D2B`. Hover state applies `#F5F1E8`.
- **Destructive / Diversion:** Pure crimson outline (`#DC2626`) on `#FFF5F5`, text `#DC2626`.

### Chips & Triage Badges
- **Triage Priority Badges (ESI System):** Pill-shaped, 20px height, uppercase `label-md`.
  - **Immediate / Level 1:** Background `#FEE2E2`, border `#FCA5A5`, text `#991B1B`.
  - **Emergent / Level 2:** Background `#FEF3C7`, border `#FCD34D`, text `#92400E`.
  - **Urgent / Level 3:** Background `#F5F3FF`, border `#DDD6FE`, text `#6D28D9` (Electric Purple variant).
  - **Standard / Level 4–5:** Background `#EBF3EE`, border `#C6DCCE`, text `#1F3D2B`.
- **Filter Chips:** 28px height, 4px border radius. Unselected: `#F5F1E8` with `#0F1E15` text. Active: `#1F3D2B` fill with `#FAF7F2` text.

### Patient Radar Cards & Feeds
- **Card Anatomy:** White base, 1px perimeter `#E2DDD2`, 12px inner padding. Left edge features a 3px color bar indicating triage urgency.
- **Live Sweep Indicator:** An Electric Purple live pulse dot (8px diameter with a pulsing 16px soft purple boundary) indicates real-time inbound ambulances or incoming critical transports.

### Trauma Capacity Counters
- **Counter Modules:** Structured blocks with a Sand Beige tinted background (`#F5F1E8`), featuring a top micro-label (`label-md`), an oversized metric (`metric-display`), and a low-profile segmented progress line depicting Bed Occupancy vs. Surge Capacity.

### Data Tables
- **Header:** Background `#EFEAE0`, text `#3E4D43`, `label-md` uppercase, 36px height, bottom edge 1px solid `#D3CBBF`.
- **Rows:** Alternating rows using `#FFFFFF` and `#FAF7F2`. 40px default height. Cells feature tabular aligned typography. Hover state applies an accent wash of `rgba(139, 92, 246, 0.05)` with a left highlight indicator in Electric Purple.

### Input Fields & Controls
- **Inputs:** 36px height, background `#FFFFFF`, border 1px solid `#D3CBBF`, corner radius 4px. Focus state triggers border `#8B5CF6` with a `0 0 0 3px rgba(139, 92, 246, 0.15)` ring.
- **Checkboxes & Radios:** 16px square/circle, `#1F3D2B` active fill with white checkmark glyph. Neutral state borders match `#707D74`.