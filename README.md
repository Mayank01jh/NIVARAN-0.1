# 🚨 NIVARAN (निवारण) — Integrated Emergency Medical Response Platform

**NIVARAN** is a high-availability, mission-critical Emergency Medical Response & Dispatch Platform built to eliminate fatal response delays during acute emergencies across India. One tap links the citizen in distress, citywide CAD dispatchers, nearest Advanced/Basic Life Support (ALS/BLS) ambulances, and the receiving hospital emergency department (ED) into a synchronized live telemetry thread.

---

## 🏛️ Ecosystem Architecture & Applications

NIVARAN operates as a unified four-part application suite powered by a high-throughput FastAPI backend and real-time MongoDB Atlas & WebSocket architecture:

```
NIVARAN 0.1/
├── backend/                   # FastAPI + MongoDB Atlas + WebSockets + Gemini AI + Arq
│   ├── app/
│   │   ├── core/              # Config, MongoDB, Redis, Security, Logging
│   │   ├── models/            # Pydantic v2 schemas + MongoDB GeoJSON documents
│   │   ├── state_machines/    # Incident & Fleet Lifecycle FSMs
│   │   ├── services/          # Business logic (incident, dispatch, Gemini AI triage, route metrics)
│   │   ├── routers/           # REST endpoints (emergency, fleet, hospitals, dispatcher, auth, voice)
│   │   ├── websockets/        # Multi-channel WebSocket ConnectionManager (caller, dispatcher, hospital, unit)
│   │   └── main.py            # FastAPI main entry with lifespan & offline fallback
│   ├── seed_live_demo.py      # Demo seed script for live Delhi NCR ambulances & hospitals
│   └── tests/
├── frontend/
│   ├── caller-pwa/            # [PORT 3000] Citizen Emergency PWA (Stitch: NIVARAN Lifeline)
│   ├── dispatcher/            # [PORT 3001] Dispatcher CAD & In-Cab Terminal (Stitch: Tactical Operations White)
│   │   └── app/crew/          # [PORT 3001/crew] Mobile-First Ambulance Crew Terminal
│   └── hospital/              # [PORT 3002] Hospital Emergency Portal (Stitch: Clinical Precision Operations)
├── scripts/
│   └── test_e2e_simulation.py # Comprehensive 12-step end-to-end simulation test suite
├── start_localhost.bat       # Single-click launcher for all 4 local microservices
└── .env                       # Pre-configured MongoDB Atlas cluster connection
```

---

## 🎨 Google Stitch Design System Implementation

All three frontends have been faithfully implemented using the authentic Google Stitch design systems and production assets:

### 1. Citizen Emergency PWA (`frontend/caller-pwa` — Port 3000)
* **Design Identity**: *NIVARAN Lifeline* (`#14213D` Navy, `#F4EDE0` Cream, `#FF6B5B` Coral)
* **Screens Implemented**:
  * **Emergency Home**: High-contrast branding, GPS geolocation lock with accuracy ring, urgency severity pills, **1-Second Hold-to-SOS** with animated SVG circular countdown, direct 112 dialing, AI Voice Hotline entry.
  * **AI Voice Hotline**: Bilingual (Hindi/English) live speech recognition, real-time clinical entity & symptom tag extraction, auto-attached GPS coordinates, instant dispatch.
  * **Live Ambulance Tracking**: Interactive Leaflet geospatial map, live ambulance telemetry, road-network route polyline, 4-stage emergency progression stepper (`DISPATCHED` → `EN_ROUTE` → `ON_SCENE` → `TRANSPORTING`), crew contact card, receiving hospital badge.
  * **Profile & Medical ID**: Emergency contacts, language preferences, blood group, chronic conditions, and privacy settings.

### 2. Ambulance & Dispatcher Command Centre (`frontend/dispatcher` — Port 3001)
* **Design Identity**: *Tactical Operations White* (`#0B0B0C` Midnight Black, `#FFFFFF` White, `#C6F432` Lime Green)
* **Screens Implemented**:
  * **Operational Command Strip**: Real-time counter cards for active emergencies, available ambulances, median response ETA, and hospitals online.
  * **High-Density Incident Queue**: Severity badges (CRITICAL, HIGH, MEDIUM, LOW), audio alert cues, multi-criteria filtering, search bar, and incident inspection pane.
  * **Intelligent Ambulance Recommender**: Scores available fleet based on road-network proximity, ALS/BLS capability match, equipment readiness, and generates clinical recommendation rationale.
  * **Hospital Coordination & Pre-Alerts**: One-click hospital dispatch, transmitting patient condition and triage level directly to hospital emergency departments.

### 3. Ambulance In-Cab Terminal (`frontend/dispatcher/app/crew` — Port 3001/crew)
* **Design Identity**: Mobile-first tactical crew interface with high-contrast, oversized touch targets for field paramedics.
* **12-Step Progressive Workflow**:
  `Login / Unit Selection` → `Incoming Dispatch Modal` → `Accept Assignment` → `Navigate to Patient (EN_ROUTE)` → `Mark Arrived at Scene (ON_SCENE)` → `Patient Onboard & Stabilised` → `Transmit Hospital Pre-Alert` → `Transporting to Hospital` → `Mark Arrived at Hospital` → `Clinical Handover Complete (HANDED_OVER)` → `Close Incident & Release Unit (CLOSED)`.
* **Safe-Driving Lockout**: Fullscreen distraction-free navigation HUD with voice cues and large single-action status levers.

### 4. Hospital Emergency Portal (`frontend/hospital` — Port 3002)
* **Design Identity**: *Clinical Precision Operations* (`#1F3D2B` Forest Green, `#E8DCC4` Sand Beige, `#8B5CF6` Electric Purple)
* **Screens Implemented**:
  * **Inbound Casualty Radar**: Live incoming patient queue with color-coded triage categories (RED, YELLOW, GREEN), inbound ambulance callsigns, and countdown ETAs.
  * **Pre-Arrival Clinical Telemetry**: Patient vitals (BP, HR, SpO2, RR, GCS), AI Clinical Decision Support triage summary (explicitly disclaimed for clinical decision support), and one-click ED team acknowledgement.
  * **Capacity Management Matrix**: Real-time bed and facility tracker for ICU beds, Trauma Bays, General Acute Beds, and Cath Lab readiness with live diversion toggle.
  * **Paramedic Handover**: Digital sign-off and trauma intake recording.

---

## ⚡ Quick Start — Single-Click Launch

Double-click `start_localhost.bat` or run:

```bat
start_localhost.bat
```

This concurrently launches all four services:
1. **FastAPI Backend**: [http://localhost:8000](http://localhost:8000) (Swagger: [http://localhost:8000/api/docs](http://localhost:8000/api/docs))
2. **Citizen Caller PWA**: [http://localhost:3000](http://localhost:3000)
3. **Dispatcher Command Centre**: [http://localhost:3001](http://localhost:3001)
4. **Ambulance In-Cab Terminal**: [http://localhost:3001/crew](http://localhost:3001/crew)
5. **Hospital Emergency Portal**: [http://localhost:3002](http://localhost:3002)

---

## 🧪 End-to-End Simulation & Verification

NIVARAN includes a comprehensive end-to-end integration test simulating the entire 12-step emergency lifecycle against the live database:

```bash
python scripts/test_e2e_simulation.py
```

### Verified Lifecycle Stages:
1. **Citizen SOS Submission** (`POST /api/v1/emergency/sos` with `Idempotency-Key`)
2. **Dispatcher CAD Ingestion** (`GET /api/v1/dispatcher/incidents`)
3. **Fleet & Route Metrics Calculation** (`GET /api/v1/dispatcher/fleet` & `route-metrics`)
4. **Ambulance Assignment** (`POST /api/v1/dispatcher/incidents/{id}/assign`)
5. **Paramedic Response / En Route** (`PATCH /api/v1/emergency/{id}/status` -> `EN_ROUTE`)
6. **On-Scene Arrival** (`PATCH /api/v1/emergency/{id}/status` -> `ON_SCENE`)
7. **Patient Onboard & Transport** (`PATCH /api/v1/emergency/{id}/status` -> `TRANSPORTING`)
8. **Hospital Pre-Alert Notification** (`POST /api/v1/dispatcher/incidents/{id}/notify-hospital`)
9. **Hospital Acceptance & Acknowledgement** (`POST /api/v1/hospitals/{id}/pre-alerts/{alert_id}/acknowledge`)
10. **Trauma Bay Arrival & Clinical Handover** (`PATCH /api/v1/emergency/{id}/status` -> `HANDED_OVER`)
11. **Incident Resolution & Unit Release** (`PATCH /api/v1/emergency/{id}/status` -> `CLOSED`)
12. **Database Verification & Audit Trail** (`GET /api/v1/emergency/{id}`)

---

## 🛰️ Real-Time WebSocket Specifications

All frontends connect via real-time WebSockets with automatic ping/heartbeat and reconnection:

| Channel | Endpoint | Purpose |
|---|---|---|
| **Citizen** | `ws://localhost:8000/api/v1/emergency/{incident_id}/ws` | Live ambulance location, road ETA countdown, unit assignment, hospital updates |
| **Dispatcher** | `ws://localhost:8000/api/v1/dispatcher/ws` | Live emergency queue changes, fleet telemetry, hospital notifications |
| **Hospital** | `ws://localhost:8000/api/v1/hospitals/{hospital_id}/ws` | Inbound casualty pre-alerts, live ETA countdown, bed reservation requests |

---

## 📦 Database & Demo Data

The platform connects to MongoDB Atlas (pre-configured in `.env` and `backend/.env`). To re-seed live demo ambulances and hospitals in Delhi NCR:

```bash
python backend/seed_live_demo.py
```

---

## 🛡️ License & Attributions

Developed for the **NIVARAN Emergency Medical Response Platform** (powered by Verve). Built with FastAPI, Next.js, Leaflet, and Google Stitch design specifications.
