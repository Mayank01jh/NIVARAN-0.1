# NIVARAN — Google Stitch Design Integration & Architecture Specification

This document details the architectural integration of the exported Google Stitch designs (`stitch_nivaran_emergency_response_ecosystem (1)`) into the production NIVARAN emergency response platform.

---

## 1. System Mapping Overview

| Exported Stitch Design Folder | Target Platform & Audience | Implemented Landing Routes | Destination Working Application & Auth | Established 60:30:10 Design Palette |
|---|---|---|---|---|
| `nivaran_citizen_vision_introductory_website` | **NIVARAN Citizen Platform** (Civilians, SOS callers, bystanders) | `http://localhost:3000/intro`<br>`http://localhost:3000/citizen` | **Citizen Emergency SOS**<br>`http://localhost:3000/login` → `http://localhost:3000/` | **60% Cream** (`#F4EDE0`)<br>**30% Navy** (`#14213D`)<br>**10% Coral** (`#FF6B5B`) |
| `nivaran_dispatcher_command_centre_introductory_website` | **CAD Command Centre** (112 dispatchers, tactical supervisors) | `http://localhost:3001/intro`<br>`http://localhost:3001/dispatcher`<br>`http://localhost:3000/dispatcher` | **Tactical CAD Queue & Live Map**<br>`http://localhost:3001/login` → `http://localhost:3001/` | **60% Midnight Black** (`#0B0B0C`)<br>**30% Pure White** (`#FFFFFF`)<br>**10% Lime Green** (`#C6F432`) |
| `nivaran_hospital_emergency_console_introductory_website` | **Hospital ED Console** (Triage directors, trauma leads, Cath Lab) | `http://localhost:3002/intro`<br>`http://localhost:3002/hospital`<br>`http://localhost:3000/hospital` | **Emergency Ops Console & Pre-Alerts**<br>`http://localhost:3002/login` → `http://localhost:3002/` | **60% Sand Beige** (`#E8DCC4` / `#FCF9F4`)<br>**30% Forest Green** (`#1F3D2B`)<br>**10% Electric Purple** (`#8B5CF6`) |
| `nivaran_cad_ambulance_crew_terminal_in_cab` | **Ambulance In-Cab Terminal** (Field EMTs, paramedics) | Integrated into CAD ecosystem | **12-Step In-Cab Terminal**<br>`http://localhost:3001/login` → `http://localhost:3001/crew` | **60% Midnight Black** (`#0B0B0C`)<br>**30% Pure White** (`#FFFFFF`)<br>**10% Lime Green** (`#C6F432`) |

---

## 2. Port & Service Topology

| Port | Service | Tech Stack | Role & Guard Policy |
|---|---|---|---|
| `8000` | **FastAPI Backend Server** | Python 3.11, FastAPI, WebSockets, Uvicorn | Dispatches active incidents, manages ambulance fleet telemetry, coordinates hospital pre-alerts and capacity. |
| `3000` | **Citizen PWA & Vision Website** | Next.js 16 (App Router), React 19, Tailwind CSS | Public landing (`/intro`, `/citizen`), compulsory secure OTP sign-in (`/login`), and 1-tap emergency SOS console (`/`). |
| `3001` | **Dispatcher CAD & Crew Terminal** | Next.js 16 (App Router), React 19, Tailwind CSS | Tactical operations intro (`/intro`, `/dispatcher`), 4-digit PIN authentication (`/login`), live dispatch queue (`/`), and in-cab mobile terminal (`/crew`). |
| `3002` | **Hospital ED Console & Ops Website** | Next.js 16 (App Router), React 19, Tailwind CSS | Clinical console intro (`/intro`, `/hospital`), 2-step TOTP password sign-in (`/login`), and trauma receiving board (`/`). |

---

## 3. Design System & Visual Implementation

### A. Citizen Platform (`warm_editorial_healthcare`)
- **Dominant Base (60%)**: Warm Cream (`#F4EDE0`), surface containers (`#FAF5EC`).
- **Structure & Typography (30%)**: Deep Navy (`#14213D`), slate body text (`#334155`).
- **Accent (10%)**: Emergency Coral (`#FF6B5B`), active alerts, pulsing beacon rings.
- **Typography**: Playfair Display (editorial authority headlines), Inter / Plus Jakarta Sans (functional body & UI).
- **Core Components**:
  - Golden Hour Protocol live status badge.
  - Sub-380ms end-to-end latency metric ticker.
  - Live continuum matrix diagram (Citizen SOS → CAD Router → Mobile ICU → Trauma ER).
  - 3 solved friction pillars (Location Articulation, Manual Dispatch, Hospital Vacuum).
  - 4-stage continuum timeline with interactive node telemetry switcher.
  - 6 capability highlight cards with direct portal action buttons.
  - FAQ accordion and statutory emergency footer.

### B. Dispatcher CAD Command Centre (`tactical_operations_white`)
- **Dominant Base (60%)**: Midnight Black (`#0B0B0C`), tactical surfaces (`#121316`, `#181A1F`).
- **Readable Structure (30%)**: Pure White (`#FFFFFF`), high-contrast table typography (`#FFFFFF` on `#121316`).
- **High-Alert Accent (10%)**: Tactical Lime Green (`#C6F432`), live status indicators, radar sweeps, active dispatch locks.
- **Typography**: Plus Jakarta Sans, monospace coordinates (`font-mono`), high-density operational grid.
- **Core Components**:
  - Sector Alpha live telemetry header with 12-sat GNSS lock indicator.
  - Tactical terminal radar vector screen with STEMI and highway collision incident pins.
  - 9 core pillars of tactical CAD operations (CAP-01 through CAP-09).
  - 5-step CAD lifecycle timeline (01 Vector Call to 05 Apron Handoff).
  - Operations & compliance FAQ accordion.
  - Terminal connection heartbeat box with direct gateway link to `/login`.

### C. Hospital Emergency Console (`clinical_precision_operations`)
- **Dominant Base (60%)**: Sand Beige (`#E8DCC4` / `#FCF9F4`), container surfaces (`#F6F3EE`, `#F0EDE9`).
- **Clinical Structure (30%)**: Deep Forest Green (`#1F3D2B`, `#082717`), triage cards, operational tables.
- **Clinical Accent (10%)**: Electric Purple (`#8B5CF6`, `#6B38D4`), pre-arrival alerts, interventional notifications.
- **Typography**: Plus Jakarta Sans, Inter, clinical monospace stats.
- **Core Components**:
  - Hero section featuring real-time casualty radar, ST-elevation 12-lead ECG stream simulation, and Cath Lab primed status.
  - 15-minute pre-arrival coordination section with 3 clinical role profiles (ED Physicians, Triage Charge Coordinators, Surgical & Interventional Leads).
  - 9 clinical bento grid capability cards.
  - 5-stage pre-hospital to resuscitation protocol timeline.
  - Real-time facility allocation & capacity monitor (Resus Bays, Cath Lab Suites, Trauma ORs, Stroke CT scanner).
  - Standards and compliance section (HL7/FHIR R4, ABDM/ABHA ID, HIPAA/NDHM, clinical audit trails).
  - Interactive FAQ accordion and clinical command footer.

### D. Interactive Clinical Readiness Toggles (Hospital Portal)
- On `http://localhost:3002/` (Hospital ED Console):
  - **Cath Lab Status**: Toggle between `READY` (pulsing green) and `OFFLINE` (red).
  - **Trauma Team Alpha**: Toggle between `STANDBY` (pulsing green) and `ENGAGED` (amber).
  - **CT Scanner**: Toggle between `OPERATIONAL` (pulsing green) and `SERVICE` (red).
  - **Blood Bank (O-Neg)**: Toggle between `12 UNITS` (green) and `4 UNITS (LOW)` (alerting red).
  - State updates are immediately synced via REST API to the backend hospital capacity model (`/api/v1/hospitals/{hospital_id}/capacity`).

---

## 4. Compulsory Authentication & Demo Credentials

Each application includes a dedicated, compulsory login guard (`/login`) styled with its respective portal identity. Unauthenticated visitors accessing the root `/` or protected sub-routes are automatically redirected to `/login`:

| Portal | Route | Input Required | Demo Credentials | Lockout Protection |
|---|---|---|---|---|
| **Citizen Emergency** | `localhost:3000/login` | Mobile Phone (10 digits) + 6-digit OTP | OTP: `123456` | 3 incorrect attempts → 15-second lockout with shake animation |
| **Dispatcher / Crew CAD** | `localhost:3001/login` | Unit Selector (`DL-01-AMB-1081` or CAD Desk) + 4-digit PIN | PIN: `1234` | 3 incorrect PINs → 15-second lockout with tactile keypad feedback |
| **Hospital Console** | `localhost:3002/login` | Facility ID + Staff ID + Password (8+ chars) + 6-digit TOTP | Password: any 8+ chars<br>TOTP: `123456` | 3 incorrect codes → 15-second lockout with 30s countdown ring |

---

## 5. How to Run the Entire Ecosystem

### Prerequisites
- Node.js 18+ (tested on Node 20 / Next.js 16)
- Python 3.10+ with `fastapi`, `uvicorn`, `pydantic`

### Step 1: Start Backend Server
```powershell
cd "backend"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 2: Start Citizen PWA
```powershell
cd "frontend\caller-pwa"
npm run dev -- -p 3000
```

### Step 3: Start Dispatcher CAD
```powershell
cd "frontend\dispatcher"
npm run dev -- -p 3001
```

### Step 4: Start Hospital ED Console
```powershell
cd "frontend\hospital"
npm run dev -- -p 3002
```

### Step 5: Test & Verify
Open your browser to:
- **Citizen Vision Landing**: `http://localhost:3000/intro`
- **Dispatcher CAD Landing**: `http://localhost:3001/intro`
- **Hospital Console Landing**: `http://localhost:3002/intro`
- **Working Login Pages**:
  - Citizen: `http://localhost:3000/login`
  - Dispatcher / Crew: `http://localhost:3001/login`
  - Hospital: `http://localhost:3002/login`
