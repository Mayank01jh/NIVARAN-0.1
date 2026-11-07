# NIVARAN (निवारण) — Cloud Deployment Guide (Render & Vercel)

This guide walks you through deploying the complete NIVARAN ecosystem to **Render** (Backend API & WebSockets) and **Vercel** (Frontends: Citizen PWA, Dispatcher CAD, and Hospital Console).

---

## Architecture Overview

```
                                      ┌─────────────────────────────────────────────────────────┐
                                      │                     VERCEL PROJECTS                     │
                                      │                                                         │
   ┌──────────────────────┐           │  1. Citizen Vision & PWA:  https://nivaran.vercel.app   │
   │  GitHub Repository   │───────────┼  2. Dispatcher CAD:        https://cad.vercel.app       │
   │ Mayank01jh/NIVARAN   │           │  3. Hospital Console:      https://er.vercel.app        │
   └──────────┬───────────┘           └────────────────────────────┬────────────────────────────┘
              │                                                    │
              │                                                    │ HTTPS / WSS
              │                       ┌────────────────────────────▼────────────────────────────┐
              │                       │                     RENDER SERVICE                      │
              └───────────────────────┼  FastAPI Backend Server:                                │
                                      │  https://nivaran-backend.onrender.com                   │
                                      └─────────────────────────────────────────────────────────┘
```

---

## PART 1 — Deploy Backend on Render

The backend is built with FastAPI and runs with Python 3.12 / Uvicorn. It handles all REST endpoints, WebSocket event streams, MongoDB collections, and Gemini AI triage.

### Option A: 1-Click Blueprint (Recommended)
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository: `Mayank01jh/NIVARAN-0.1`.
4. Render will automatically read the [`render.yaml`](./render.yaml) file in the repository.
5. In the environment variable prompts, enter:
   - `MONGO_URI`: `your_mongodb_connection_string`
   - `GEMINI_API_KEY`: `your_gemini_api_key`
   - `MAPBOX_ACCESS_TOKEN`: `your_mapbox_access_token`
6. Click **Apply**. Render will build and deploy the service.

---

### Option B: Manual Web Service Setup
If you prefer creating a Web Service manually:
1. In Render, click **New +** → **Web Service**.
2. Select your repository: `Mayank01jh/NIVARAN-0.1`.
3. Fill in the service configuration:
   - **Name**: `nivaran-backend` (or your chosen name)
   - **Region**: Oregon (US West) or Singapore / Frankfurt
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
4. Add the following **Environment Variables**:

| Variable | Description |
|---|---|
| `ENVIRONMENT` | `production` |
| `PYTHON_VERSION` | `3.12.0` |
| `MONGO_URI` | Your MongoDB connection string |
| `MONGO_DB` | `nivaran` |
| `REDIS_URL` | `redis://localhost:6379/0` *(or your managed Redis URL)* |
| `SECRET_KEY` | *(generate a random 64-char string or use default)* |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` |
| `GEMINI_API_KEY` | Your Google Gemini API Key |
| `MAPBOX_ACCESS_TOKEN` | Your Mapbox Public/Access Token |
| `CORS_ORIGINS` | `["*"]` |

5. Click **Create Web Service**.
6. Once deployed, copy your Render public URL (e.g., `https://nivaran-backend.onrender.com`).
7. Test the health endpoint in your browser:  
   `https://<your-render-url>/api/v1/voice/ivr-status` → should return `{"status":"HEALTHY","ivr_active":true,...}`.

---

## PART 2 — Deploy Frontends on Vercel

Because NIVARAN has three separate Next.js applications in `frontend/`, create **three separate projects** on Vercel from the same GitHub repository:

### Project 1: Citizen Emergency Platform (PWA & Vision Website)
1. Go to your [Vercel Dashboard](https://vercel.com/) and click **Add New...** → **Project**.
2. Select your repository `Mayank01jh/NIVARAN-0.1`.
3. In **Project Name**, enter: `nivaran-citizen` (or your preferred name).
4. Click **Edit** next to **Root Directory** and select:  
   `frontend/caller-pwa`
5. Leave Framework Preset as **Next.js**.
6. Expand **Environment Variables** and add:
   - `NEXT_PUBLIC_API_URL`: `https://<your-render-url>/api/v1`
   - `NEXT_PUBLIC_WS_URL`: `wss://<your-render-url>/api/v1`
   - `NEXT_PUBLIC_MAPBOX_TOKEN`: Your Mapbox Access Token
7. Click **Deploy**.

---

### Project 2: Dispatcher CAD & Ambulance Crew Terminal
1. In Vercel, click **Add New...** → **Project**.
2. Select `Mayank01jh/NIVARAN-0.1`.
3. **Project Name**: `nivaran-dispatcher`.
4. Click **Edit** next to **Root Directory** and select:  
   `frontend/dispatcher`
5. Leave Framework Preset as **Next.js**.
6. Expand **Environment Variables** and add:
   - `NEXT_PUBLIC_API_URL`: `https://<your-render-url>/api/v1`
   - `NEXT_PUBLIC_WS_URL`: `wss://<your-render-url>/api/v1`
   - `NEXT_PUBLIC_MAPBOX_TOKEN`: Your Mapbox Access Token
7. Click **Deploy**.

---

### Project 3: Hospital Emergency Ops Console
1. In Vercel, click **Add New...** → **Project**.
2. Select `Mayank01jh/NIVARAN-0.1`.
3. **Project Name**: `nivaran-hospital`.
4. Click **Edit** next to **Root Directory** and select:  
   `frontend/hospital`
5. Leave Framework Preset as **Next.js**.
6. Expand **Environment Variables** and add:
   - `NEXT_PUBLIC_API_URL`: `https://<your-render-url>/api/v1`
   - `NEXT_PUBLIC_WS_URL`: `wss://<your-render-url>/api/v1`
   - `NEXT_PUBLIC_MAPBOX_TOKEN`: Your Mapbox Access Token
7. Click **Deploy**.

---

## PART 3 — Verification & Production Checklist

Once Render and Vercel deployments are complete:

1. **Test Citizen Landing & Login**:
   - Navigate to `https://<your-citizen-project>.vercel.app/intro`
   - Click **Open Citizen Portal** → redirects to `/login`
   - Log in using demo OTP: `123456`
   - Verify that the SOS beacon loads with live location and the top header is clean with no overlapping badges.

2. **Test Dispatcher CAD & Ambulance Terminal**:
   - Navigate to `https://<your-dispatcher-project>.vercel.app/intro`
   - Click **Enter Command Centre** → redirects to `/login`
   - Log in with PIN: `1234`
   - Verify that the live incident queue and Mapbox vector maps render cleanly.
   - Test In-Cab Ambulance Terminal: `https://<your-dispatcher-project>.vercel.app/crew`.

3. **Test Hospital ED Console**:
   - Navigate to `https://<your-hospital-project>.vercel.app/intro`
   - Click **Access Hospital Console** → redirects to `/login`
   - Log in with TOTP: `123456`
   - Test clicking the **Clinical Readiness Toggles** (Cath Lab, Trauma Team, CT Scanner, Blood Bank) on the left sidebar to confirm they toggle smoothly and update state.

4. **Test Gemini Medical AI Triage**:
   - On the Citizen portal, trigger a Voice Triage simulation or hold the SOS button.
   - Verify that Gemini extracts severity (`CRITICAL`), suspected condition, and location to route to CAD.
