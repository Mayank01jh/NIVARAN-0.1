---
name: Tactical Operations White
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3f493f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6f7a6e'
  outline-variant: '#becabc'
  surface-tint: '#006d30'
  primary: '#00652c'
  on-primary: '#ffffff'
  primary-container: '#15803d'
  on-primary-container: '#d3ffd5'
  inverse-primary: '#79db8d'
  secondary: '#416900'
  on-secondary: '#ffffff'
  secondary-container: '#acf847'
  on-secondary-container: '#457000'
  tertiary: '#4f576d'
  on-tertiary: '#ffffff'
  tertiary-container: '#676f86'
  on-tertiary-container: '#f2f3ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#95f8a7'
  primary-fixed-dim: '#79db8d'
  on-primary-fixed: '#00210a'
  on-primary-fixed-variant: '#005323'
  secondary-fixed: '#acf847'
  secondary-fixed-dim: '#91db2a'
  on-secondary-fixed: '#102000'
  on-secondary-fixed-variant: '#304f00'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 22px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-data-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  label-data-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-data-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  label-ui:
    fontFamily: Plus Jakarta Sans
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
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style
The design system embodies an ultra-precise, mission-critical public safety interface tailored for rapid-response ambulance dispatchers, command operators, and clinical triage controllers. The identity prioritizes cognitive clarity under high adrenaline and cognitive load. The aesthetic rejects decorative clutter, consumer-oriented gamification, stickers, and emojis in favor of razor-sharp data density, decisive hierarchy, and clinical authority.

Visual cues combine high-density SaaS efficiency with public-safety command architecture: stark architectural frames, subtle structural borders, and electric high-visibility lime green accents that command immediate visual fixation for active dispatches, live fleet trajectories, and critical triage confirmations. The mood is calm, instantaneous, authoritative, and relentlessly focused on operational life safety.

## Colors
The system operates exclusively on an engineered, high-contrast light mode designed for bright operations rooms and field console tablets. 

- **Primary Canvas & Surfaces**: Pure clinical white (`#FFFFFF`) forms the primary interaction cards, split-screen data desks, and active dispatch drawers. Structural workspace recesses use soft technical slates (`#F8FAFC` and `#F1F5F9`) to demarcate viewport boundaries without visual heaviness.
- **Structural Text & Onyx Cadre**: Primary typographic hierarchies, structural window boundaries, and map overlays utilize deep Onyx and rich Slate (`#0B0B0C`, `#0F172A`, and `#1E293B`) ensuring a strict contrast ratio above 12:1 against light surfaces.
- **Operational Lime Accents**: Mission-critical cues utilize high-visibility tactical Lime (`#84CC16` base, with `#A3E635` for active hover rings, `#C6F432` for high-alert dispatch callouts, and `#15803D` / `#365314` for accessible high-contrast text tags). This fluorescent palette is strictly reserved for live ambulance fleet tracking, geofence breaches, confirmed routes, and urgent triage triggers.
- **Auxiliary Safety Codes**: Standard emergency red (`#DC2626`) for Code-Black/Cardiac arrest alerts, technical amber (`#D97706`) for units en-route with delays, and cobalt blue (`#2563EB`) for inter-hospital logistics.

## Typography
Typographic rules establish instant legibility across varying view distances and high-stress scenarios.

- **Primary Interface Type**: **Plus Jakarta Sans** is employed across titles, emergency narratives, caller notes, and administrative UI controls. Its geometry provides rapid word-shape recognition while remaining clean and corporate.
- **Monospaced Operational Metrics**: **JetBrains Mono** is enforced for vehicle callsigns (e.g., `AMB-104-BLS`), GPS coordinates (`12.9716° N, 77.5946° E`), timestamps (`04:18:22Z`), telemetry, and patient vitals. Tabular numbers ensure zero horizontal shift during real-time countdowns and live telemetry streams.
- **Letter Spacing & Casing**: Micro-labels, dispatch status badges, and column headers use uppercase casing with an expanded tracking of `+0.05em` to `+0.08em` for rapid scanning.

## Layout & Spacing
The layout model follows a high-density, multi-pane command workstation architecture designed for wide monitors and multi-display setups, with graceful fallback to tablet dispatch screens.

- **Grid Architecture**: Multi-column docked flex-grid with fixed-width tactical sidebars (e.g., 380px Call Queue, 420px Dispatch Engine) flanking an expansive, fluid central GIS tactical map and operational timeline.
- **Spacing Rhythm**: Governed by an uncompromising 4px/8px micro-grid. In high-density queue tables and active triage matrices, `space-xs` (4px) and `space-sm` (8px) prevent wasted spatial overhead, keeping vital incident indicators above the fold.
- **Responsive Handling**:
  - **Desktop (1440px+)**: Tri-pane simultaneous workspace (Incident Queue / Dynamic Vector Map / Fleet Telemetry Panel).
  - **Tablet Console (768px - 1439px)**: Split-screen layout with an interactive bottom sheet or collapsible side tray for unit status controls.
  - **Mobile Dispatcher (< 768px)**: Stacked single-column views with sticky bottom operational actions (One-Tap Dispatch, Status Toggle).

## Elevation & Depth
Elevation eschews heavy shadows, skeuomorphism, and blurred frosted glass in favor of clean architectural planes, precise border offsets, and disciplined edge delineation.

- **Planar Depth via Borders**: Spatial separation is primarily handled via hairline high-contrast borders: `1px solid #E2E8F0` for neutral dividers, switching to `1px solid #0F172A` for active card containers and command modules.
- **Surface Tiers**:
  - **Base Canvas**: Technical surface (`#F8FAFC`).
  - **Operational Panels**: Pristine White (`#FFFFFF`).
  - **Selected / Focused Dispatch Nodes**: Highlighted with an active `2px` left border in `#84CC16` (Vibrant Lime) or surrounded by an inset ring `rgba(132, 204, 22, 0.35)`.
- **Command Overlays**: Modals, alert banners, and floating tooltips employ a crisp, micro-offset tactical shadow: `0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.04)`, framed with a distinct `1px solid #CBD5E1` boundary.

## Shapes
Geometry emphasizes precision, speed, and modern instrumentation. Border radii are tightly calibrated to a crisp 6px-8px range:

- **Base Components**: Inputs, data cards, list cells, buttons, and alert tiles adhere strictly to `roundedness: 1` (4px to 6px corner radius). This creates an instrument-panel feel that avoids both blunt brutalism and overly soft consumer curves.
- **Tactical Chips & Indicators**: Status pills and live unit tags carry a tight `4px` radius to preserve internal badge density.
- **Map Overlays & Pins**: Square or octagonal geometry with clipped corners or 4px radii, paired with vibrant lime locator halos.

## Components

### Buttons & Dispatch Actions
- **Primary Operational Action ("DISPATCH UNIT", "ACCEPT CALL")**: Background `#84CC16` with text `#0B0B0C` (Plus Jakarta Sans 600). Hover shifts to `#A3E635`. Active state applies a crisp 1px inward inset outline. Focus ring is a clean 2px `#84CC16` offset by 2px white.
- **Secondary Action**: Background `#FFFFFF`, border `1px solid #0F172A`, text `#0F172A`. Hover transitions background to `#F1F5F9`.
- **Critical Action ("ABORT", "CODE BLACK")**: Background `#DC2626`, text `#FFFFFF`, 0px outer glow, strictly functional.

### Chips & Status Badges
- **Active Unit / Available**: Border `1px solid #84CC16`, background `#F7FEE7`, text `#365314`, prefixed by a solid pulsating 6px dot in `#65A30D`.
- **En-Route / Dispatched**: Background `#0F172A`, text `#C6F432`, font `JetBrains Mono 11px`.
- **Critical Priority (P1/Triage 1)**: Background `#FEF2F2`, border `1px solid #F87171`, text `#991B1B`.

### Lists & Queue Tables
- Fixed header rows in `#F8FAFC` with bottom hairline divider `#E2E8F0`. Column headers in uppercase `JetBrains Mono` 11px, color `#64748B`.
- Row height fixed at 44px for standard triage scanning; selected row features a 3px active bar in `#84CC16` on the far left edge with background `#F8FAFC`.
- No zebra-striping. Contrast is maintained entirely through crisp cell separation and typography.

### Form Inputs & Emergency Call Pads
- Inputs feature a `#FFFFFF` base, `1px solid #CBD5E1` boundary, and 6px border radius.
- Focus state instantly snaps to `1.5px solid #0F172A` with an ambient ring in `#84CC16` (opacity 30%).
- Monospace input mode toggle for phone numbers, timestamps, and caller location coordinates.

### Cards & Dispatch Panels
- White background (`#FFFFFF`) framed by `1px solid #E2E8F0`. 
- Header section utilizes an integrated utility ribbon showing status badge, live UTC time, and rapid action trigger.

### Tactical Map Overlay Widgets
- Semi-solid crisp white cards (`rgba(255, 255, 255, 0.98)`) with `1px solid #0F172A` border and 6px radius.
- Vehicle telemetry pins: Onyx circular boundary (`#0F172A`) enclosing a vibrant lime core (`#84CC16`) and unit callsign rendered in JetBrains Mono.