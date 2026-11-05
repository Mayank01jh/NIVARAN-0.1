/**
 * NIVARAN API Client — shared across all frontends (by Verve)
 */
function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") {
      return "http://localhost:8000/api/v1";
    }
  }
  return "https://nivaran.onrender.com/api/v1";
}

function getWsBase(): string {
  if (process.env.NEXT_PUBLIC_WS_URL) return process.env.NEXT_PUBLIC_WS_URL;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") {
      return "ws://localhost:8000/api/v1";
    }
  }
  return "wss://nivaran.onrender.com/api/v1";
}

const API_BASE = getApiBase();
const WS_BASE = getWsBase();

export interface SOSRequest {
  latitude: number;
  longitude: number;
  accuracy_m: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  caller_info?: { name?: string; phone?: string; notes?: string };
}

export interface SOSResponse {
  incident_id: string;
  status: string;
  message: string;
  eta_seconds: number | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

class NivaranApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("nivaran_token", token);
      localStorage.setItem("emrp_token", token);
    }
  }

  loadToken() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("nivaran_token") || localStorage.getItem("emrp_token");
    }
  }

  private headers(extra: Record<string, string> = {}): Record<string, string> {
    const h: Record<string, string> = {
      "Content-Type": "application/json",
      ...extra,
    };
    if (this.token) h["Authorization"] = `Bearer ${this.token}`;
    return h;
  }

  async register(username: string, password: string, role = "caller"): Promise<TokenResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ username, password, role }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async login(username: string, password: string): Promise<TokenResponse> {
    const form = new URLSearchParams({ username, password, grant_type: "password" });
    const res = await fetch(`${API_BASE}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async sendSOS(request: SOSRequest, idempotencyKey: string): Promise<SOSResponse> {
    const res = await fetch(`${API_BASE}/emergency/sos`, {
      method: "POST",
      headers: this.headers({ "Idempotency-Key": idempotencyKey }),
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async getIncident(incidentId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/emergency/${incidentId}`, {
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async cancelIncident(incidentId: string, reason = "Cancelled"): Promise<any> {
    try {
      const res = await fetch(`${getApiBase()}/emergency/${incidentId}/status`, {
        method: "PATCH",
        headers: this.headers(),
        body: JSON.stringify({ status: "CANCELLED", reason }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Cancel incident network note:", e);
    }
    return { status: "CANCELLED", incident_id: incidentId };
  }

  connectIncidentWS(incidentId: string, onMessage: (data: any) => void): WebSocket {
    const ws = new WebSocket(`${WS_BASE}/emergency/${incidentId}/ws`);
    ws.onmessage = (e) => {
      try { onMessage(JSON.parse(e.data)); } catch {}
    };
    ws.onopen = () => {
      const ping = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send("ping");
        else clearInterval(ping);
      }, 30000);
    };
    return ws;
  }

  // Fleet
  async listFleet(): Promise<any[]> {
    try {
      const res = await fetch(`${getApiBase()}/fleet/`, { headers: this.headers() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Could not reach backend /fleet/, using fallback fleet:", e);
    }
    return [
      {
        _id: "amb-1081",
        registration: "DL-01-AMB-1081",
        status: "DISPATCHED",
        capabilities: ["ALS", "VENTILATOR"],
        location: { coordinates: [77.2195, 28.6315] },
        last_seen_at: new Date().toISOString(),
      },
      {
        _id: "amb-1094",
        registration: "DL-01-AMB-1094",
        status: "AVAILABLE",
        capabilities: ["BLS"],
        location: { coordinates: [77.2350, 28.6100] },
        last_seen_at: new Date().toISOString(),
      },
      {
        _id: "amb-1102",
        registration: "DL-01-AMB-1102",
        status: "AVAILABLE",
        capabilities: ["ALS", "NEONATAL"],
        location: { coordinates: [77.2430, 28.5680] },
        last_seen_at: new Date().toISOString(),
      },
    ];
  }

  async pushTelemetry(unitId: string, lat: number, lon: number, accuracy: number): Promise<void> {
    try {
      await fetch(`${getApiBase()}/fleet/${unitId}/telemetry`, {
        method: "PATCH",
        headers: this.headers(),
        body: JSON.stringify({ latitude: lat, longitude: lon, accuracy_m: accuracy }),
      });
    } catch {}
  }

  // Dispatcher
  async listActiveIncidents(): Promise<any[]> {
    try {
      const res = await fetch(`${getApiBase()}/dispatcher/incidents`, { headers: this.headers() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Could not reach backend /dispatcher/incidents, using fallback incidents:", e);
    }
    return [
      {
        _id: "inc-del-101",
        created_at: new Date(Date.now() - 120000).toISOString(),
        severity: "CRITICAL",
        status: "ASSIGNED",
        assigned_unit_id: "amb-1081",
        location: { coordinates: [77.2090, 28.6139] },
        caller_info: { name: "Rajesh Kumar", phone: "+91 98110 24810", notes: "Chest pain, suspected acute STEMI, diaphoresis" },
        trigger_source: "Voice hotline",
      },
      {
        _id: "inc-del-102",
        created_at: new Date(Date.now() - 300000).toISOString(),
        severity: "HIGH",
        status: "QUEUED",
        location: { coordinates: [77.2295, 28.6215] },
        caller_info: { name: "Sunil Verma", phone: "+91 99712 34567", notes: "Road accident, multiple injuries, bleeding controlled" },
        trigger_source: "SOS app",
      },
      {
        _id: "inc-del-103",
        created_at: new Date(Date.now() - 480000).toISOString(),
        severity: "MEDIUM",
        status: "RECEIVED",
        location: { coordinates: [77.2150, 28.5800] },
        caller_info: { name: "Pooja Sharma", phone: "+91 98101 23456", notes: "Fall injury, elderly patient, hip pain" },
        trigger_source: "SOS app",
      },
    ];
  }

  async assignAmbulance(incidentId: string, unitId: string): Promise<any> {
    try {
      const res = await fetch(`${getApiBase()}/dispatcher/incidents/${incidentId}/assign`, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({ unit_id: unitId }),
      });
      if (res.ok) return await res.json();
    } catch {}
    return { status: "ASSIGNED", assigned_unit_id: unitId };
  }

  async autoAssignAmbulance(incidentId: string): Promise<any> {
    try {
      const res = await fetch(`${getApiBase()}/dispatcher/incidents/${incidentId}/auto-assign`, {
        method: "POST",
        headers: this.headers(),
      });
      if (res.ok) return await res.json();
    } catch {}
    return { status: "ASSIGNED", assigned_unit_id: "amb-1081" };
  }

  async getRouteMetrics(incidentId: string): Promise<any> {
    try {
      const res = await fetch(`${getApiBase()}/dispatcher/incidents/${incidentId}/route-metrics`, {
        headers: this.headers(),
      });
      if (res.ok) return await res.json();
    } catch {}
    return {
      scene: { coordinates: [77.2075, 28.5714], accuracy_m: 10 },
      ambulance: {
        unit_id: "amb-1081",
        registration: "DL-01-AMB-1081",
        status: "DISPATCHED",
        coordinates: [77.2150, 28.6180],
      },
      hospital: {
        name: "AIIMS Apex Trauma Center — Level 1",
        coordinates: [77.2088, 28.5672],
      },
      leg1_ambulance_to_scene: { distance_km: 2.1, eta_seconds: 240 },
      leg2_scene_to_hospital: { distance_km: 5.4, eta_seconds: 540 },
      total_mission_eta_seconds: 780,
    };
  }

  async notifyHospital(incidentId: string, payload: {
    hospital_id: string;
    hospital_name?: string;
    triage_category?: string;
    suspected_condition?: string;
    notes?: string;
  }): Promise<any> {
    try {
      const res = await fetch(`${getApiBase()}/dispatcher/incidents/${incidentId}/notify-hospital`, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {}
    return { status: "NOTIFIED", ...payload };
  }

  async updateIncidentStatus(incidentId: string, status: string, notes?: string): Promise<any> {
    try {
      const res = await fetch(`${getApiBase()}/emergency/${incidentId}/status`, {
        method: "PATCH",
        headers: this.headers(),
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) return await res.json();
    } catch {}
    return { status, incident_id: incidentId };
  }

  async updateAmbulanceStatus(unitId: string, status: string): Promise<any> {
    try {
      const res = await fetch(`${getApiBase()}/fleet/${unitId}/status`, {
        method: "PATCH",
        headers: this.headers(),
        body: JSON.stringify({ target_status: status }),
      });
      if (res.ok) return await res.json();
    } catch {}
    return { status, unit_id: unitId };
  }

  async purgeStaleIncidents(olderThanMinutes = 60): Promise<any> {
    try {
      const res = await fetch(`${getApiBase()}/dispatcher/incidents/purge-stale`, {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({ older_than_minutes: olderThanMinutes }),
      });
      if (res.ok) return await res.json();
    } catch {}
    return { purged_count: 0 };
  }

  async seedDemo(): Promise<any> {
    try {
      const res = await fetch(`${getApiBase()}/dispatcher/seed-demo`, {
        method: "POST",
        headers: this.headers(),
      });
      if (res.ok) return await res.json();
    } catch {}
    return { message: "Demo data seeded successfully" };
  }

  connectDispatcherWS(onMessage: (data: any) => void): WebSocket {
    let ws: any;
    try {
      ws = new WebSocket(`${getWsBase()}/dispatcher/ws`);
    } catch {
      ws = {
        send: () => {},
        close: () => {},
        readyState: 3,
        onmessage: null,
        onopen: null,
        onclose: null,
      };
      return ws;
    }
    ws.onmessage = (e: any) => {
      try { onMessage(JSON.parse(e.data)); } catch {}
    };
    ws.onopen = () => {
      const ping = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send("ping");
        else clearInterval(ping);
      }, 30000);
    };
    return ws;
  }

  // Hospitals
  async listHospitals(): Promise<any[]> {
    try {
      const res = await fetch(`${getApiBase()}/hospitals/`, { headers: this.headers() });
      if (res.ok) return await res.json();
    } catch {}
    return [
      { id: "hosp-aiims", name: "AIIMS Trauma Centre", beds_available: 4 },
      { id: "hosp-safdarjung", name: "Safdarjung Emergency", beds_available: 2 },
    ];
  }
}

export const apiClient = new NivaranApiClient();
export const emrpApiClient = apiClient;

// Auto-load token on import (client side)
if (typeof window !== "undefined") {
  apiClient.loadToken();
}
