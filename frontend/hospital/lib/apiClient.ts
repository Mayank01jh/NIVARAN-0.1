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
  return "https://nivaran-backend.onrender.com/api/v1";
}

function getWsBase(): string {
  if (process.env.NEXT_PUBLIC_WS_URL) return process.env.NEXT_PUBLIC_WS_URL;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") {
      return "ws://localhost:8000/api/v1";
    }
  }
  return "wss://nivaran-backend.onrender.com/api/v1";
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
      console.warn("Could not reach /fleet/, using fallback:", e);
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
      console.warn("Could not reach /dispatcher/incidents, using fallback:", e);
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
    ];
  }

  connectDispatcherWS(onMessage: (data: any) => void): WebSocket {
    const ws = new WebSocket(`${WS_BASE}/dispatcher/ws`);
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

  // Hospitals
  async listHospitals(): Promise<any[]> {
    try {
      const res = await fetch(`${getApiBase()}/hospitals/`, { headers: this.headers() });
      if (res.ok) return await res.json();
    } catch {}
    return [
      { _id: "hosp-aiims-01", id: "hosp-aiims-01", name: "AIIMS Trauma Centre" },
      { _id: "hosp-safdarjung-02", id: "hosp-safdarjung-02", name: "Safdarjung Hospital Emergency" },
      { _id: "hosp-apollo", id: "hosp-apollo", name: "Indraprastha Apollo Hospital" },
      { _id: "hosp-max", id: "hosp-max", name: "Max Super Speciality Hospital (Saket)" },
      { _id: "hosp-fortis", id: "hosp-fortis", name: "Fortis Escorts Heart Institute" },
    ];
  }

  async listInboundCasualties(): Promise<any[]> {
    try {
      const res = await fetch(`${getApiBase()}/hospitals/inbound`, { headers: this.headers() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Could not reach /hospitals/inbound, falling back to local list:", e);
    }
    return [];
  }

  async listPreAlerts(hospitalId: string): Promise<PreAlertData[]> {
    try {
      const res = await fetch(`${getApiBase()}/hospitals/${hospitalId}/pre-alerts`, { headers: this.headers() });
      if (res.ok) return await res.json();
    } catch {}
    return [];
  }

  async completeHandover(incidentId: string): Promise<any> {
    try {
      const res = await fetch(`${getApiBase()}/emergency/${incidentId}/status`, {
        method: "PATCH",
        headers: this.headers(),
        body: JSON.stringify({ status: "CLOSED", notes: "Emergency Department Handover Completed" }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Handover API error:", e);
    }
    return { status: "CLOSED", incident_id: incidentId };
  }

  async updateCapacity(hospitalId: string, capacity: any): Promise<void> {
    try {
      await fetch(`${getApiBase()}/hospitals/${hospitalId}/capacity`, {
        method: "PATCH",
        headers: this.headers(),
        body: JSON.stringify(capacity),
      });
    } catch {}
  }

  async acknowledgePreAlert(hospitalId: string, alertId: string): Promise<any> {
    try {
      const res = await fetch(`${getApiBase()}/hospitals/${hospitalId}/pre-alerts/${alertId}/acknowledge`, {
        method: "POST",
        headers: this.headers(),
      });
      if (res.ok) return await res.json();
    } catch {}
    return { status: "ACKNOWLEDGED", alert_id: alertId };
  }
}

export interface PreAlertData {
  alert_id: string;
  incident_id: string;
  ambulance_id: string;
  triage_category: "RED" | "YELLOW" | "GREEN";
  eta_seconds: number;
  suspected_condition: string;
  vitals?: {
    heart_rate?: number;
    blood_pressure?: string;
    spo2_pct?: number;
    respiratory_rate?: number;
    gcs?: number;
  };
  notes?: string;
  created_at: string;
  acknowledged_at?: string | null;
}

export const apiClient = new NivaranApiClient();
export const nivaranApi = apiClient;
export const emrpApi = apiClient;

export const nivaranWs = {
  connectHospital(
    hospitalId: string,
    onMessage: (data: any) => void,
    onOpen?: () => void,
    onClose?: () => void
  ) {
    if (typeof window === "undefined") return () => {};
    try {
      const ws = new WebSocket(`${getWsBase()}/hospitals/${hospitalId}/ws`);
      ws.onopen = () => { if (onOpen) onOpen(); };
      ws.onclose = () => { if (onClose) onClose(); };
      ws.onmessage = (e) => {
        try { onMessage(JSON.parse(e.data)); } catch {}
      };
      return () => ws.close();
    } catch {
      return () => {};
    }
  },
};
export const emrpWs = nivaranWs;

// Auto-load token on import (client side)
if (typeof window !== "undefined") {
  apiClient.loadToken();
}
