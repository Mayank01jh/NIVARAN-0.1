"use client";
/**
 * NIVARAN (निवारण) — Official Hospital Emergency Receiving Console
 * Built faithfully from Google Stitch designs: clinical_precision_operations
 * 
 * Features:
 * 1. Screen A: Inbound Casualty Radar (Live incoming ambulances, ETAs, triage categories, pre-arrival ack)
 * 2. Screen B: Pre-Arrival Telemetry & AI Decision Support (HR, BP, SpO2, GCS, clinical triage disclaimer)
 * 3. Screen C: Hospital Capacity & Bed Management (Live editor for ICU, Acute, Trauma, Cath Lab, Diversion status)
 * 4. Screen D: Paramedic & Fleet Coordination (Live fleet telemetry, handover completion)
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { apiClient, type PreAlertData } from "../lib/apiClient";

type ActiveTab = "radar" | "capacity" | "telemetry" | "paramedic";

const INITIAL_PRE_ALERTS: PreAlertData[] = [
  {
    alert_id: "ALT-1081-STEMI",
    incident_id: "inc-demo-cardiac-01",
    ambulance_id: "DL-01-AMB-1081",
    triage_category: "RED",
    eta_seconds: 240,
    suspected_condition: "Acute Anterior STEMI / Cardiogenic Shock",
    vitals: {
      heart_rate: 118,
      blood_pressure: "85/55",
      spo2_pct: 91,
      respiratory_rate: 26,
      gcs: 14,
    },
    notes: "Aspirin 325mg and Heparin administered at 17:08. Severe diaphoresis. Cath lab activation and Trauma Bay 1 standby requested.",
    created_at: new Date(Date.now() - 120000).toISOString(),
    acknowledged_at: null,
  },
  {
    alert_id: "ALT-1082-TRAUMA",
    incident_id: "inc-demo-trauma-02",
    ambulance_id: "DL-02-AMB-1082",
    triage_category: "RED",
    eta_seconds: 380,
    suspected_condition: "High-Speed Vehicular Collision / Thoracic Trauma",
    vitals: {
      heart_rate: 126,
      blood_pressure: "95/60",
      spo2_pct: 94,
      respiratory_rate: 28,
      gcs: 13,
    },
    notes: "Bilateral needle thoracostomy performed in field. C-spine collar applied. Massive transfusion protocol standby requested.",
    created_at: new Date(Date.now() - 240000).toISOString(),
    acknowledged_at: new Date(Date.now() - 100000).toISOString(),
  },
  {
    alert_id: "ALT-1083-ASTHMA",
    incident_id: "inc-demo-asthma-03",
    ambulance_id: "DL-03-AMB-1083",
    triage_category: "YELLOW",
    eta_seconds: 520,
    suspected_condition: "Acute Asthmatic Attack / Inhaler Refractory",
    vitals: {
      heart_rate: 104,
      blood_pressure: "138/86",
      spo2_pct: 88,
      respiratory_rate: 32,
      gcs: 15,
    },
    notes: "Continuous Duoneb nebulization initiated. High-flow oxygen 10L. Resuscitation bay BiPAP requested.",
    created_at: new Date(Date.now() - 180000).toISOString(),
    acknowledged_at: null,
  },
  {
    alert_id: "ALT-1084-STROKE",
    incident_id: "inc-demo-fall-04",
    ambulance_id: "DL-04-AMB-1084",
    triage_category: "YELLOW",
    eta_seconds: 640,
    suspected_condition: "Elderly Fall / Right Wrist Deformity & Head Abrasion",
    vitals: {
      heart_rate: 82,
      blood_pressure: "130/80",
      spo2_pct: 98,
      respiratory_rate: 16,
      gcs: 15,
    },
    notes: "C-spine clearance pending. Splint applied to right wrist. Vitals stable.",
    created_at: new Date(Date.now() - 90000).toISOString(),
    acknowledged_at: null,
  },
];

export default function HospitalConsole() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("radar");
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>("hosp-aiims-01");
  const [hospitalName, setHospitalName] = useState<string>("AIIMS Apex Trauma Center");
  const [acceptanceStatus, setAcceptanceStatus] = useState<"NORMAL" | "SURGE" | "DIVERT">("NORMAL");

  // Inbound Pre-alerts
  const [preAlerts, setPreAlerts] = useState<PreAlertData[]>(INITIAL_PRE_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState<PreAlertData | null>(INITIAL_PRE_ALERTS[0]);
  const [stagedBays, setStagedBays] = useState<Record<string, boolean>>({
    "ALT-1081-STEMI": true,
  });

  // Capacity Editor State
  const [capacity, setCapacity] = useState({
    er_beds_total: 40,
    er_beds_available: 14,
    icu_beds_total: 24,
    icu_beds_available: 6,
    trauma_bays_total: 6,
    trauma_bays_available: 2,
    or_available: 2,
    ct_scanner_operational: true,
    cath_lab_operational: true,
    trauma_team_standby: true,
  });
  const [bloodBankNormal, setBloodBankNormal] = useState<boolean>(true);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Quick Clinical Readiness Toggles
  const toggleCathLab = () => {
    setCapacity((prev) => {
      const next = { ...prev, cath_lab_operational: !prev.cath_lab_operational };
      apiClient.updateCapacity(selectedHospitalId, next).catch(() => {});
      return next;
    });
  };

  const toggleTraumaTeam = () => {
    setCapacity((prev) => {
      const next = { ...prev, trauma_team_standby: !prev.trauma_team_standby };
      apiClient.updateCapacity(selectedHospitalId, next).catch(() => {});
      return next;
    });
  };

  const toggleCtScanner = () => {
    setCapacity((prev) => {
      const next = { ...prev, ct_scanner_operational: !prev.ct_scanner_operational };
      apiClient.updateCapacity(selectedHospitalId, next).catch(() => {});
      return next;
    });
  };

  const toggleBloodBank = () => {
    setBloodBankNormal((prev) => !prev);
  };

  // Poll backend for incoming pre-alerts and incidents
  const loadInboundData = useCallback(async () => {
    try {
      const liveAlerts = await apiClient.listPreAlerts(selectedHospitalId);
      if (liveAlerts && liveAlerts.length > 0) {
        setPreAlerts((prev) => {
          // Merge unique alerts
          const map = new Map<string, PreAlertData>();
          prev.forEach((a) => map.set(a.alert_id, a));
          liveAlerts.forEach((a) => map.set(a.alert_id, a));
          return Array.from(map.values());
        });
      }

      const inboundIncidents = await apiClient.listInboundCasualties();
      if (inboundIncidents && inboundIncidents.length > 0) {
        // Map any active incidents to pre-alerts if not already tracked
        setPreAlerts((prev) => {
          const existingIncIds = new Set(prev.map((a) => a.incident_id));
          const additions: PreAlertData[] = [];
          for (const inc of inboundIncidents) {
            if (!existingIncIds.has(inc._id)) {
              additions.push({
                alert_id: `ALT-${inc._id.slice(-6).toUpperCase()}`,
                incident_id: inc._id,
                ambulance_id: inc.assigned_unit_id || "DL-01-AMB-1081",
                triage_category: inc.severity === "CRITICAL" ? "RED" : "YELLOW",
                eta_seconds: inc.eta_seconds || 300,
                suspected_condition: inc.caller_info?.notes || "Inbound Emergency Case",
                vitals: {
                  heart_rate: 110,
                  blood_pressure: "115/75",
                  spo2_pct: 93,
                  respiratory_rate: 22,
                  gcs: 14,
                },
                notes: inc.caller_info?.notes || "Direct CAD Dispatch to AIIMS",
                created_at: inc.received_at || new Date().toISOString(),
                acknowledged_at: null,
              });
            }
          }
          return [...additions, ...prev];
        });
      }
    } catch (e) {
      console.warn("Could not sync live inbound data:", e);
    }
  }, [selectedHospitalId]);

  useEffect(() => {
    loadInboundData();
    const interval = setInterval(loadInboundData, 5000);
    return () => clearInterval(interval);
  }, [loadInboundData]);

  // Real-time WebSocket connection to Hospital Channel with reconnect
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectAttempts = 0;
    const maxAttempts = 5;
    let reconnectTimer: NodeJS.Timeout | null = null;
    let pingInterval: NodeJS.Timeout | null = null;
    let isMounted = true;

    const getWsBase = () => {
      if (typeof window !== "undefined") {
        const host = window.location.hostname;
        if (host === "localhost" || host === "127.0.0.1") return "ws://localhost:8000/api/v1";
      }
      return "wss://nivaran.onrender.com/api/v1";
    };

    const connect = () => {
      try {
        ws = new WebSocket(`${getWsBase()}/hospitals/${selectedHospitalId}/ws`);
        ws.onmessage = (e) => {
          try {
            const msg = JSON.parse(e.data);
            if (msg.type === "pre_alert" && msg.data) {
              setPreAlerts((prev) => [msg.data, ...prev.filter((a) => a.alert_id !== msg.data.alert_id)]);
            }
          } catch {}
          reconnectAttempts = 0;
        };

        ws.onopen = () => {
          reconnectAttempts = 0;
          if (pingInterval) clearInterval(pingInterval);
          pingInterval = setInterval(() => {
            if (ws?.readyState === WebSocket.OPEN) ws.send("ping");
          }, 25000);
        };

        ws.onclose = () => {
          if (pingInterval) clearInterval(pingInterval);
          if (!isMounted) return;
          if (reconnectAttempts < maxAttempts) {
            const delay = Math.min(2000 * Math.pow(2, reconnectAttempts), 32000);
            reconnectAttempts++;
            reconnectTimer = setTimeout(connect, delay);
          }
        };
      } catch (e) {
        console.warn("Hospital WS fallback:", e);
      }
    };

    connect();

    return () => {
      isMounted = false;
      if (pingInterval) clearInterval(pingInterval);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, [selectedHospitalId]);

  // ETA countdown tick
  useEffect(() => {
    const timer = setInterval(() => {
      setPreAlerts((prev) =>
        prev.map((a) => ({
          ...a,
          eta_seconds: Math.max(10, a.eta_seconds - 1),
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Acknowledge Pre-Alert
  const handleAcknowledge = async (alertId: string) => {
    try {
      await apiClient.acknowledgePreAlert(selectedHospitalId, alertId);
    } catch {}
    setPreAlerts((prev) =>
      prev.map((a) =>
        a.alert_id === alertId ? { ...a, acknowledged_at: new Date().toISOString() } : a
      )
    );
  };

  // Complete Patient Handover
  const handleCompleteHandover = async (alertItem: PreAlertData) => {
    try {
      await apiClient.completeHandover(alertItem.incident_id);
      setPreAlerts((prev) => prev.filter((a) => a.alert_id !== alertItem.alert_id));
      if (selectedAlert?.alert_id === alertItem.alert_id) {
        setSelectedAlert(null);
      }
    } catch (e) {
      console.warn("Handover failed:", e);
    }
  };

  // Save Capacity Changes
  const handleSaveCapacity = async () => {
    try {
      await apiClient.updateCapacity(selectedHospitalId, capacity);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.warn("Capacity save failed:", e);
    }
  };

  const formatEta = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#E8DCC4] text-[#1F3D2B] flex flex-col font-sans selection:bg-[#1F3D2B] selection:text-white">
      {/* ── Header (Stitch design specification) ────────────────── */}
      <header className="h-16 flex-shrink-0 bg-[#1F3D2B] border-b border-[#14281C] shadow-md z-30 flex items-center justify-between px-6 text-[#E8DCC4]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/nivaran-icon.png" alt="NIVARAN" className="w-10 h-10 object-contain rounded-xl shadow-sm bg-[#14281C] border border-white/20 p-0.5" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline font-extrabold text-[#E8DCC4] text-lg tracking-tight uppercase leading-none">
                  NIVARAN
                </span>
                <span className="bg-[#8B5CF6] text-[#FFFFFF] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  ED-COMMAND
                </span>
              </div>
              <span className="text-xs text-[#E8DCC4]/70 font-medium leading-none mt-1">
                {hospitalName} — Trauma Bay Unit
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-[#E2DCD5] hidden md:block"></div>

          {/* Acceptance Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#14281C] border border-[#1F3D2B]">
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                acceptanceStatus === "NORMAL"
                  ? "bg-[#10B981]"
                  : acceptanceStatus === "SURGE"
                  ? "bg-[#F59E0B]"
                  : "bg-[#BA1A1A]"
              }`}
            ></span>
            <span className="text-[11px] font-bold text-[#E8DCC4]/70 uppercase">Intake Status:</span>
            <span className="text-xs font-bold text-[#E8DCC4]">
              {acceptanceStatus === "NORMAL" && "NORMAL / ACTIVE"}
              {acceptanceStatus === "SURGE" && "AMBER SURGE (CRITICAL ONLY)"}
              {acceptanceStatus === "DIVERT" && "RED DIVERSION ACTIVE"}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-2">
          <button
            onClick={() => setActiveTab("radar")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "radar"
                ? "bg-[#8B5CF6] text-white shadow-sm"
                : "text-[#E8DCC4]/70 hover:text-[#E8DCC4] hover:bg-[#14281C]"
            }`}
          >
            Inbound Casualty Radar ({preAlerts.length})
          </button>
          <button
            onClick={() => setActiveTab("capacity")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "capacity"
                ? "bg-[#8B5CF6] text-white shadow-sm"
                : "text-[#E8DCC4]/70 hover:text-[#E8DCC4] hover:bg-[#14281C]"
            }`}
          >
            Hospital Capacity & Beds
          </button>
          <button
            onClick={() => setActiveTab("telemetry")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "telemetry"
                ? "bg-[#8B5CF6] text-white shadow-sm"
                : "text-[#E8DCC4]/70 hover:text-[#E8DCC4] hover:bg-[#14281C]"
            }`}
          >
            Pre-Arrival Telemetry
          </button>
          <button
            onClick={() => setActiveTab("paramedic")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "paramedic"
                ? "bg-[#8B5CF6] text-white shadow-sm"
                : "text-[#E8DCC4]/70 hover:text-[#E8DCC4] hover:bg-[#14281C]"
            }`}
          >
            Paramedic Coordination
          </button>
        </nav>

        {/* Action Controls & User */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const next = acceptanceStatus === "NORMAL" ? "SURGE" : acceptanceStatus === "SURGE" ? "DIVERT" : "NORMAL";
              setAcceptanceStatus(next);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFDAD6] hover:bg-[#BA1A1A] hover:text-white text-[#93000A] text-xs font-bold transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">e911_emergency</span>
            <span className="hidden sm:inline">Toggle Status</span>
          </button>

          <div className="h-6 w-px bg-[#E2DCD5]"></div>

          <div className="flex items-center gap-2.5">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-xs font-bold text-[#E8DCC4]">Dr. S. Nair</span>
              <span className="text-[10px] text-[#E8DCC4]/70">Triage Chief · Duty Lead</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              SN
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Layout: Sidebar + Operational Body ───────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Operational Sidebar */}
        <aside className="w-64 bg-[#14281C] border-r border-[#1F3D2B]/20 flex flex-col justify-between p-4 hidden md:flex shrink-0 overflow-y-auto">
          <div className="space-y-6">
            <div className="px-2 pt-1 pb-2 border-b border-[#1F3D2B]/40 flex items-center gap-2.5">
              <img src="/nivaran-icon.png" alt="NIVARAN" className="h-8 w-8 object-contain rounded-lg bg-[#1F3D2B] border border-white/20 p-0.5" />
              <div className="flex flex-col">
                <span className="font-headline font-bold text-xs text-[#E8DCC4] tracking-wider uppercase leading-none">
                  NIVARAN CLINICAL
                </span>
                <span className="text-[10px] text-[#8B5CF6] font-semibold mt-0.5">ED Pre-Arrival Network</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#E8DCC4]/60 uppercase tracking-wider block px-2 mb-2">
                Operational Units
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("radar")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "radar" ? "bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30" : "text-[#E8DCC4]/75 hover:bg-[#1F3D2B] hover:text-[#E8DCC4]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">radar</span>
                    <span>Casualty Radar</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    activeTab === "radar" ? "bg-[#14281C] text-white border border-white/20" : "bg-[#8B5CF6] text-white"
                  }`}>
                    {preAlerts.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("capacity")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "capacity" ? "bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30" : "text-[#E8DCC4]/75 hover:bg-[#1F3D2B] hover:text-[#E8DCC4]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">hotel</span>
                    <span>Bed Availability</span>
                  </div>
                  <span className="text-[10px] text-[#10B981] font-bold">
                    {capacity.icu_beds_available + capacity.er_beds_available} Open
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("telemetry")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "telemetry" ? "bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30" : "text-[#E8DCC4]/75 hover:bg-[#1F3D2B] hover:text-[#E8DCC4]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">monitor_heart</span>
                    <span>Vital Telemetry</span>
                  </div>
                  <span className="text-[10px] text-[#8B5CF6] font-bold">Live AI</span>
                </button>

                <button
                  onClick={() => setActiveTab("paramedic")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "paramedic" ? "bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30" : "text-[#E8DCC4]/75 hover:bg-[#1F3D2B] hover:text-[#E8DCC4]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">airport_shuttle</span>
                    <span>Ambulance Fleet</span>
                  </div>
                  <span className="text-[10px] text-[#E8DCC4]/70">4 Units</span>
                </button>
              </nav>
            </div>

            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[10px] font-bold text-[#E8DCC4] uppercase tracking-wider">
                  Clinical Readiness
                </span>
                <span className="text-[9px] text-[#E8DCC4]/80 font-mono">Click to toggle</span>
              </div>
              <div className="space-y-1.5 text-xs">
                {/* Cath Lab Toggle */}
                <button
                  type="button"
                  onClick={toggleCathLab}
                  className="w-full flex items-center justify-between py-2 px-2.5 rounded-lg bg-[#1F3D2B]/80 hover:bg-[#1F3D2B] border border-white/10 transition-all text-[#E8DCC4] active:scale-98 group cursor-pointer"
                  title="Click to toggle Cath Lab availability"
                >
                  <span className="font-semibold text-[#E8DCC4] group-hover:text-white">Cath Lab Status</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase flex items-center gap-1 transition-all ${
                      capacity.cath_lab_operational
                        ? "bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/40"
                        : "bg-[#BA1A1A]/25 text-[#F87171] border border-[#BA1A1A]/40"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        capacity.cath_lab_operational ? "bg-[#10B981] animate-pulse" : "bg-[#F87171]"
                      }`}
                    ></span>
                    {capacity.cath_lab_operational ? "READY" : "OFFLINE"}
                  </span>
                </button>

                {/* Trauma Team Alpha Toggle */}
                <button
                  type="button"
                  onClick={toggleTraumaTeam}
                  className="w-full flex items-center justify-between py-2 px-2.5 rounded-lg bg-[#1F3D2B]/80 hover:bg-[#1F3D2B] border border-white/10 transition-all text-[#E8DCC4] active:scale-98 group cursor-pointer"
                  title="Click to toggle Trauma Team status"
                >
                  <span className="font-semibold text-[#E8DCC4] group-hover:text-white">Trauma Team Alpha</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase flex items-center gap-1 transition-all ${
                      capacity.trauma_team_standby
                        ? "bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/40"
                        : "bg-[#D97706]/25 text-[#FBBF24] border border-[#D97706]/40"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        capacity.trauma_team_standby ? "bg-[#10B981] animate-pulse" : "bg-[#FBBF24]"
                      }`}
                    ></span>
                    {capacity.trauma_team_standby ? "STANDBY" : "ENGAGED"}
                  </span>
                </button>

                {/* CT Scanner Toggle */}
                <button
                  type="button"
                  onClick={toggleCtScanner}
                  className="w-full flex items-center justify-between py-2 px-2.5 rounded-lg bg-[#1F3D2B]/80 hover:bg-[#1F3D2B] border border-white/10 transition-all text-[#E8DCC4] active:scale-98 group cursor-pointer"
                  title="Click to toggle CT Scanner operational status"
                >
                  <span className="font-semibold text-[#E8DCC4] group-hover:text-white">CT Scanner</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase flex items-center gap-1 transition-all ${
                      capacity.ct_scanner_operational
                        ? "bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/40"
                        : "bg-[#BA1A1A]/25 text-[#F87171] border border-[#BA1A1A]/40"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        capacity.ct_scanner_operational ? "bg-[#10B981] animate-pulse" : "bg-[#F87171]"
                      }`}
                    ></span>
                    {capacity.ct_scanner_operational ? "OPERATIONAL" : "SERVICE"}
                  </span>
                </button>

                {/* Blood Bank Toggle */}
                <button
                  type="button"
                  onClick={toggleBloodBank}
                  className="w-full flex items-center justify-between py-2 px-2.5 rounded-lg bg-[#1F3D2B]/80 hover:bg-[#1F3D2B] border border-white/10 transition-all text-[#E8DCC4] active:scale-98 group cursor-pointer"
                  title="Click to toggle Blood Bank reserve status"
                >
                  <span className="font-semibold text-[#E8DCC4] group-hover:text-white">Blood Bank (O-Neg)</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase flex items-center gap-1 transition-all ${
                      bloodBankNormal
                        ? "bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/40"
                        : "bg-[#BA1A1A]/25 text-[#F87171] border border-[#BA1A1A]/40"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        bloodBankNormal ? "bg-[#10B981]" : "bg-[#F87171] animate-ping"
                      }`}
                    ></span>
                    {bloodBankNormal ? "12 UNITS" : "4 UNITS (LOW)"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Network Link pill */}
          <div className="p-3 bg-[#1F3D2B] rounded-xl border border-white/10 space-y-1 text-[#E8DCC4]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#E8DCC4]/70 uppercase">Network Link</span>
              <span className="text-[#10B981] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                AIIMS-ED-01
              </span>
            </div>
            <span className="text-[10px] text-[#E8DCC4]/70 block">Encrypted Clinical Bridge · 24/7</span>
          </div>
        </aside>

        {/* Operational Workspace Body */}
        <main className="flex-1 min-h-0 p-5 flex flex-col gap-4 overflow-hidden">
          {/* Subheader Banner */}
          <div className="flex-shrink-0 bg-[#F2EADA] p-4 rounded-2xl border border-[#1F3D2B]/20 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="bg-[#C8EBD1] text-[#022111] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  COMMAND HUB · LEVEL-1 DISPATCH
                </span>
                <span className="text-xs text-[#1F3D2B]/65">NODE: AIIMS-ND-TC-ER01</span>
                <span className="text-[#1F3D2B]/65">·</span>
                <span className="text-xs text-[#10B981] font-semibold">SYNCHRONIZED WITH CAD 112/108</span>
              </div>
              <h1 className="font-headline text-2xl font-extrabold text-[#1F3D2B] tracking-tight">
                {hospitalName} — Emergency Medicine Department
              </h1>
              <p className="text-xs text-[#1F3D2B]/65 mt-0.5">
                Real-time acute intake registry, paramedic telemetry bridge, and rapid trauma bay allocation matrix.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadInboundData}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E8DCC4] hover:bg-[#1F3D2B] hover:text-[#E8DCC4] text-[#1F3D2B] text-xs font-bold transition-all shadow-sm"
                title="Refresh Live Data"
              >
                <span className="material-symbols-outlined text-[16px]">sync</span>
                <span>Refresh Live</span>
              </button>
            </div>
          </div>

          {/* 5-Column Operational Metrics Grid (Stitch design specification) */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {/* Metric 1 */}
            <div className="bg-[#F2EADA] p-4 rounded-2xl border border-[#1F3D2B]/20 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#1F3D2B]/65 uppercase">
                <span>Inbound Transports</span>
                <span className="material-symbols-outlined text-[#8B5CF6] text-[18px]">ambulance</span>
              </div>
              <div className="my-2">
                <span className="font-headline text-3xl font-extrabold text-[#1F3D2B]">
                  {preAlerts.length < 10 ? `0${preAlerts.length}` : preAlerts.length}
                </span>
                <span className="text-xs font-bold text-[#8B5CF6] ml-1.5">En Route</span>
              </div>
              <div className="w-full bg-[#E8DCC4] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#8B5CF6] h-full rounded-full w-3/4"></div>
              </div>
              <span className="text-[10px] text-[#BA1A1A] font-bold mt-1.5">1 ETA &lt; 5m</span>
            </div>

            {/* Metric 2 */}
            <div className="bg-[#F2EADA] p-4 rounded-2xl border border-[#1F3D2B]/20 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#1F3D2B]/65 uppercase">
                <span>Trauma Bays</span>
                <span className="material-symbols-outlined text-[#1F3D2B] text-[18px]">meeting_room</span>
              </div>
              <div className="my-2">
                <span className="font-headline text-3xl font-extrabold text-[#1F3D2B]">
                  0{capacity.trauma_bays_available}
                </span>
                <span className="text-xs font-bold text-[#10B981] ml-1.5">Open / Ready</span>
              </div>
              <div className="w-full bg-[#E8DCC4] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#1F3D2B] h-full rounded-full w-2/3"></div>
              </div>
              <span className="text-[10px] text-[#1F3D2B]/65 mt-1.5">Bay 1 & 2 Staged</span>
            </div>

            {/* Metric 3 */}
            <div className="bg-[#F2EADA] p-4 rounded-2xl border border-[#1F3D2B]/20 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#1F3D2B]/65 uppercase">
                <span>ICU Capacity</span>
                <span className="material-symbols-outlined text-[#10B981] text-[18px]">vital_signs</span>
              </div>
              <div className="my-2">
                <span className="font-headline text-3xl font-extrabold text-[#1F3D2B]">
                  0{capacity.icu_beds_available}
                </span>
                <span className="text-xs font-bold text-[#10B981] ml-1.5">Available</span>
              </div>
              <div className="w-full bg-[#E8DCC4] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#10B981] h-full rounded-full w-3/4"></div>
              </div>
              <span className="text-[10px] text-[#1F3D2B]/65 mt-1.5">Surge reserve: 3</span>
            </div>

            {/* Metric 4 */}
            <div className="bg-[#F2EADA] p-4 rounded-2xl border border-[#1F3D2B]/20 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#1F3D2B]/65 uppercase">
                <span>General Acute ER</span>
                <span className="material-symbols-outlined text-[#1F3D2B]/65 text-[18px]">single_bed</span>
              </div>
              <div className="my-2">
                <span className="font-headline text-3xl font-extrabold text-[#1F3D2B]">
                  {capacity.er_beds_available}
                </span>
                <span className="text-xs font-bold text-[#10B981] ml-1.5">Available</span>
              </div>
              <div className="w-full bg-[#E8DCC4] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#1F3D2B] h-full rounded-full w-3/5"></div>
              </div>
              <span className="text-[10px] text-[#1F3D2B]/65 mt-1.5">Cap: {capacity.er_beds_total} Total</span>
            </div>

            {/* Metric 5 */}
            <div 
              onClick={toggleCathLab}
              className="bg-[#F2EADA] p-4 rounded-2xl border border-[#1F3D2B]/20 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1 cursor-pointer hover:border-[#8B5CF6] transition-all group"
              title="Click to toggle Cath Lab Readiness"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-[#1F3D2B]/65 uppercase">
                <span className="group-hover:text-[#8B5CF6] transition-colors">Cath Lab / OR</span>
                <span className="material-symbols-outlined text-[#8B5CF6] text-[18px]">medical_services</span>
              </div>
              <div className="my-2">
                <span className={capacity.cath_lab_operational ? "font-headline text-3xl font-extrabold text-[#1F3D2B]" : "font-headline text-3xl font-extrabold text-[#BA1A1A]"}>
                  {capacity.cath_lab_operational ? "READY" : "OFFLINE"}
                </span>
              </div>
              <div className="w-full bg-[#E8DCC4] h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    capacity.cath_lab_operational ? "bg-[#10B981] w-full" : "bg-[#BA1A1A] w-1/4"
                  }`}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className={capacity.cath_lab_operational ? "text-[10px] font-bold text-[#10B981]" : "text-[10px] font-bold text-[#BA1A1A]"}>
                  {capacity.cath_lab_operational ? "Team on Standby" : "Maintenance"}
                </span>
                <span className="text-[9px] text-[#1F3D2B]/40 font-mono">Toggle</span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              TAB 1: INBOUND CASUALTY RADAR
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "radar" && (
            <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-5 overflow-hidden">
              {/* Left Column: Live Pre-Alert Inbound Queue (7 Cols) */}
              <div className="xl:col-span-7 flex flex-col min-h-0 gap-3 overflow-hidden">
                <div className="flex-shrink-0 flex items-center justify-between px-1">
                  <span className="font-headline text-sm font-bold text-[#1F3D2B]">
                    Live Incoming Pre-Alert Queue ({preAlerts.length})
                  </span>
                  <span className="text-xs text-[#1F3D2B]/65">Click card to inspect telemetry</span>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">

                {preAlerts.map((alert) => {
                  const isSelected = selectedAlert?.alert_id === alert.alert_id;
                  const isRed = alert.triage_category === "RED";
                  const isAck = !!alert.acknowledged_at;

                  return (
                    <div
                      key={alert.alert_id}
                      onClick={() => setSelectedAlert(alert)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? "bg-[#EDE4D0] border-2 border-[#8B5CF6] shadow-md ring-2 ring-[#8B5CF6]/30"
                          : "bg-[#F2EADA] border border-[#1F3D2B]/20 hover:border-[#8B5CF6] shadow-sm"
                      }`}
                    >
                      {/* Priority left indicator bar */}
                      <div
                        className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r ${
                          isRed ? "bg-[#BA1A1A]" : "bg-[#F59E0B]"
                        }`}
                      ></div>

                      <div className="flex items-start justify-between gap-3 pl-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-[#1F3D2B]">
                              #{alert.alert_id}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                isRed ? "bg-[#FFDAD6] text-[#93000A]" : "bg-[#FEF3C7] text-[#D97706]"
                              }`}
                            >
                              {alert.triage_category} PRIORITY
                            </span>
                            <span className="text-xs text-[#1F3D2B]/65">· {alert.ambulance_id}</span>
                          </div>

                          <h3 className="font-headline text-base font-extrabold text-[#1F3D2B]">
                            {alert.suspected_condition}
                          </h3>

                          <p className="text-xs text-[#1F3D2B]/65 line-clamp-1">{alert.notes}</p>
                        </div>

                        {/* ETA Badge */}
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <div className="px-2.5 py-1 rounded-xl bg-[#F2EADA] border border-[#1F3D2B]/20 text-right">
                            <span className="text-[10px] font-bold text-[#1F3D2B]/65 uppercase block leading-none">ETA</span>
                            <span className="font-headline text-base font-extrabold text-[#BA1A1A] leading-tight">
                              {formatEta(alert.eta_seconds)}
                            </span>
                          </div>
                          {isAck ? (
                            <span className="text-[10px] text-[#10B981] font-bold flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[12px]">done_all</span>
                              ACKNOWLEDGED
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcknowledge(alert.alert_id);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#1F3D2B] hover:bg-[#082717] text-white text-[10px] font-bold uppercase transition-all shadow-sm active:scale-95"
                            >
                              Ack Alert
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Vitals Quick Strip */}
                      {alert.vitals && (
                        <div className="mt-3 pt-2.5 border-t border-[#1F3D2B]/20/60 flex items-center gap-4 text-xs pl-2">
                          <span className="text-[#1F3D2B]/65">
                            HR: <strong className="text-[#1F3D2B]">{alert.vitals.heart_rate} bpm</strong>
                          </span>
                          <span className="text-[#1F3D2B]/65">
                            BP: <strong className="text-[#1F3D2B]">{alert.vitals.blood_pressure}</strong>
                          </span>
                          <span className="text-[#1F3D2B]/65">
                            SpO2: <strong className="text-[#1F3D2B]">{alert.vitals.spo2_pct}%</strong>
                          </span>
                          <span className="text-[#1F3D2B]/65">
                            GCS: <strong className="text-[#1F3D2B]">{alert.vitals.gcs}/15</strong>
                          </span>
                          <span className="ml-auto text-[11px] text-[#8B5CF6] font-bold">
                            Cath Lab Standby
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
                </div>
              </div>

              {/* Right Column: Pre-Arrival Telemetry & Staging Inspector (5 Cols) */}
              <div className="xl:col-span-5 flex flex-col min-h-0 overflow-hidden">
                {selectedAlert ? (
                  <div className="flex-1 min-h-0 bg-[#F2EADA] p-5 rounded-2xl border border-[#1F3D2B]/20 shadow-sm space-y-4 overflow-y-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-[#1F3D2B]/20">
                      <div>
                        <span className="text-[10px] font-bold text-[#1F3D2B]/65 uppercase">Case Detail Inspector</span>
                        <h3 className="font-headline text-lg font-extrabold text-[#1F3D2B]">
                          #{selectedAlert.incident_id}
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#1F3D2B] text-white text-xs font-bold">
                        ETA {formatEta(selectedAlert.eta_seconds)}
                      </span>
                    </div>

                    {/* Vitals Grid */}
                    {selectedAlert.vitals && (
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="p-3 rounded-xl bg-[#14281C] border border-white/10">
                          <span className="text-[10px] text-[#E8DCC4]/70 block font-bold">Heart Rate</span>
                          <span className="font-headline text-xl font-extrabold text-[#F87171]">
                            {selectedAlert.vitals.heart_rate} <span className="text-xs font-normal">BPM</span>
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#14281C] border border-white/10">
                          <span className="text-[10px] text-[#E8DCC4]/70 block font-bold">Blood Pressure</span>
                          <span className="font-headline text-xl font-extrabold text-[#E8DCC4]">
                            {selectedAlert.vitals.blood_pressure} <span className="text-xs font-normal">mmHg</span>
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#14281C] border border-white/10">
                          <span className="text-[10px] text-[#E8DCC4]/70 block font-bold">Pulse Oximetry (SpO2)</span>
                          <span className="font-headline text-xl font-extrabold text-[#4ADE80]">
                            {selectedAlert.vitals.spo2_pct}% <span className="text-xs font-normal">Room air</span>
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#14281C] border border-white/10">
                          <span className="text-[10px] text-[#E8DCC4]/70 block font-bold">Glasgow Coma Scale</span>
                          <span className="font-headline text-xl font-extrabold text-[#E8DCC4]">
                            {selectedAlert.vitals.gcs} / 15
                          </span>
                        </div>
                      </div>
                    )}

                    {/* AI Clinical Triage Summary (With Mandatory Disclaimer) */}
                    <div className="p-4 rounded-xl bg-[#8B5CF6] border border-[#7C3AED]/40 space-y-2 text-white shadow-sm">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                        <span>AI Clinical Triage Summary</span>
                      </div>
                      <p className="text-xs text-white/95 font-medium leading-relaxed">
                        {selectedAlert.notes}
                      </p>
                      <div className="pt-2 border-t border-white/20 text-[10px] text-white/80 italic">
                        <strong>Clinical Decision Support:</strong> AI-generated triage insights to assist emergency physicians. Not a substitute for professional clinical judgment.
                      </div>
                    </div>

                    {/* Trauma Staging Checklist */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#1F3D2B] block">Facility Preparation Checklist</span>
                      <div className="space-y-1.5 text-xs">
                        <label className="flex items-center gap-2 p-2 rounded-lg bg-[#14281C] border border-white/10 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={stagedBays[selectedAlert.alert_id] || false}
                            onChange={(e) =>
                              setStagedBays({ ...stagedBays, [selectedAlert.alert_id]: e.target.checked })
                            }
                            className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6]"
                          />
                          <span className="font-semibold text-[#E8DCC4]">Trauma Resuscitation Bay 1 Staged</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 rounded-lg bg-[#14281C] border border-white/10 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded text-[#8B5CF6]" />
                          <span className="font-semibold text-[#E8DCC4]">Cath Lab Team Activated</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 rounded-lg bg-[#14281C] border border-white/10 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded text-[#8B5CF6]" />
                          <span className="font-semibold text-[#E8DCC4]">Type O-Negative Blood Crossmatched</span>
                        </label>
                      </div>
                    </div>

                    {/* Complete Handover Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleCompleteHandover(selectedAlert)}
                        className="w-full py-3 rounded-xl bg-[#1F3D2B] hover:bg-[#082717] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
                      >
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        <span>Complete Patient Handover & Resolve Case</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#F2EADA] p-8 rounded-2xl border border-[#1F3D2B]/20 text-center text-[#1F3D2B]/65 text-xs">
                    Select an inbound casualty from the queue to inspect full telemetry.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 2: HOSPITAL CAPACITY & BED MANAGEMENT
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "capacity" && (
            <div className="flex-1 min-h-0 overflow-y-auto pr-1">
              <div className="bg-[#F2EADA] p-6 rounded-2xl border border-[#1F3D2B]/20 shadow-sm max-w-3xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#1F3D2B]/20 pb-4">
                <div>
                  <h2 className="font-headline text-xl font-extrabold text-[#1F3D2B]">
                    Emergency Department Capacity & Resource Editor
                  </h2>
                  <p className="text-xs text-[#1F3D2B]/65 mt-0.5">
                    Changes sync in real time to the Dispatcher CAD and ambulance routing engine.
                  </p>
                </div>
                {saveSuccess && (
                  <span className="bg-[#E6F8F1] text-[#10B981] font-bold text-xs px-3 py-1 rounded-full animate-fade-in flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Saved to Network
                  </span>
                )}
              </div>

              {/* Beds Numbers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#F2EADA] border border-[#1F3D2B]/15 space-y-2">
                  <span className="text-xs font-bold text-[#1F3D2B]">General Acute ER Beds</span>
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="text-[10px] text-[#1F3D2B]/70 block font-bold">Available</label>
                      <input
                        type="number"
                        value={capacity.er_beds_available}
                        onChange={(e) =>
                          setCapacity({ ...capacity, er_beds_available: Number(e.target.value) })
                        }
                        className="w-20 px-2 py-1 rounded bg-[#EDE4D0] text-[#1F3D2B] border border-[#1F3D2B]/20 font-bold text-sm focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#1F3D2B]/70 block font-bold">Total Beds</label>
                      <input
                        type="number"
                        value={capacity.er_beds_total}
                        onChange={(e) =>
                          setCapacity({ ...capacity, er_beds_total: Number(e.target.value) })
                        }
                        className="w-20 px-2 py-1 rounded bg-[#EDE4D0] text-[#1F3D2B] border border-[#1F3D2B]/20 font-bold text-sm focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F2EADA] border border-[#1F3D2B]/15 space-y-2">
                  <span className="text-xs font-bold text-[#1F3D2B]">Critical ICU Beds</span>
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="text-[10px] text-[#1F3D2B]/70 block font-bold">Available</label>
                      <input
                        type="number"
                        value={capacity.icu_beds_available}
                        onChange={(e) =>
                          setCapacity({ ...capacity, icu_beds_available: Number(e.target.value) })
                        }
                        className="w-20 px-2 py-1 rounded bg-[#EDE4D0] text-[#1F3D2B] border border-[#1F3D2B]/20 font-bold text-sm focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#1F3D2B]/70 block font-bold">Total ICU</label>
                      <input
                        type="number"
                        value={capacity.icu_beds_total}
                        onChange={(e) =>
                          setCapacity({ ...capacity, icu_beds_total: Number(e.target.value) })
                        }
                        className="w-20 px-2 py-1 rounded bg-[#EDE4D0] text-[#1F3D2B] border border-[#1F3D2B]/20 font-bold text-sm focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F2EADA] border border-[#1F3D2B]/15 space-y-2">
                  <span className="text-xs font-bold text-[#1F3D2B]">Trauma Resuscitation Bays</span>
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="text-[10px] text-[#1F3D2B]/70 block font-bold">Open Bays</label>
                      <input
                        type="number"
                        value={capacity.trauma_bays_available}
                        onChange={(e) =>
                          setCapacity({ ...capacity, trauma_bays_available: Number(e.target.value) })
                        }
                        className="w-20 px-2 py-1 rounded bg-[#EDE4D0] text-[#1F3D2B] border border-[#1F3D2B]/20 font-bold text-sm focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#1F3D2B]/70 block font-bold">Total Bays</label>
                      <input
                        type="number"
                        value={capacity.trauma_bays_total}
                        onChange={(e) =>
                          setCapacity({ ...capacity, trauma_bays_total: Number(e.target.value) })
                        }
                        className="w-20 px-2 py-1 rounded bg-[#EDE4D0] text-[#1F3D2B] border border-[#1F3D2B]/20 font-bold text-sm focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F2EADA] border border-[#1F3D2B]/15 space-y-2">
                  <span className="text-xs font-bold text-[#1F3D2B]">Emergency Operating Theatres</span>
                  <div>
                    <label className="text-[10px] text-[#1F3D2B]/70 block font-bold">Open Theatres</label>
                    <input
                      type="number"
                      value={capacity.or_available}
                      onChange={(e) =>
                        setCapacity({ ...capacity, or_available: Number(e.target.value) })
                      }
                      className="w-20 px-2 py-1 rounded bg-[#EDE4D0] text-[#1F3D2B] border border-[#1F3D2B]/20 font-bold text-sm focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                </div>
              </div>

              {/* Critical Diagnostics & Teams Toggles */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#1F3D2B] block">Critical Facility Readiness</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F2EADA] border border-[#1F3D2B]/15 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={capacity.ct_scanner_operational}
                      onChange={(e) =>
                        setCapacity({ ...capacity, ct_scanner_operational: e.target.checked })
                      }
                      className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6]"
                    />
                    <span className="text-xs font-bold text-[#1F3D2B]">CT Scanner Active</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F2EADA] border border-[#1F3D2B]/15 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={capacity.cath_lab_operational}
                      onChange={(e) =>
                        setCapacity({ ...capacity, cath_lab_operational: e.target.checked })
                      }
                      className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6]"
                    />
                    <span className="text-xs font-bold text-[#1F3D2B]">Cath Lab Ready</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F2EADA] border border-[#1F3D2B]/15 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={capacity.trauma_team_standby}
                      onChange={(e) =>
                        setCapacity({ ...capacity, trauma_team_standby: e.target.checked })
                      }
                      className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6]"
                    />
                    <span className="text-xs font-bold text-[#1F3D2B]">Trauma Team Standby</span>
                  </label>
                </div>
              </div>

              {/* Diversion Mode Selector */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#1F3D2B] block">Hospital Intake & Diversion Policy</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setAcceptanceStatus("NORMAL")}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      acceptanceStatus === "NORMAL"
                        ? "bg-[#C8EBD1] border-[#10B981] text-[#022111]"
                        : "bg-[#F2EADA] border-[#1F3D2B]/20 text-[#1F3D2B] hover:bg-[#E8DCC4]"
                    }`}
                  >
                    ● NORMAL (Open)
                    <span className="block text-[10px] font-normal text-[#1F3D2B]/70 mt-0.5">
                      Accepting all casualties
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAcceptanceStatus("SURGE")}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      acceptanceStatus === "SURGE"
                        ? "bg-[#FEF3C7] border-[#F59E0B] text-[#D97706]"
                        : "bg-[#F2EADA] border-[#1F3D2B]/20 text-[#1F3D2B] hover:bg-[#E8DCC4]"
                    }`}
                  >
                    ● AMBER SURGE
                    <span className="block text-[10px] font-normal text-[#1F3D2B]/70 mt-0.5">
                      Critical trauma & cardiac only
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAcceptanceStatus("DIVERT")}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      acceptanceStatus === "DIVERT"
                        ? "bg-[#FFDAD6] border-[#BA1A1A] text-[#93000A]"
                        : "bg-[#F2EADA] border-[#1F3D2B]/20 text-[#1F3D2B] hover:bg-[#E8DCC4]"
                    }`}
                  >
                    ● RED DIVERSION
                    <span className="block text-[10px] font-normal text-[#1F3D2B]/70 mt-0.5">
                      Reroute to secondary facility
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveCapacity}
                className="w-full py-3.5 rounded-xl bg-[#1F3D2B] hover:bg-[#082717] text-white font-headline text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-98"
              >
                Broadcast Capacity Update to Dispatch Network
              </button>
            </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 3: PRE-ARRIVAL TELEMETRY
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "telemetry" && selectedAlert && (
            <div className="flex-1 min-h-0 overflow-y-auto pr-1">
              <div className="bg-[#F2EADA] p-6 rounded-2xl border border-[#1F3D2B]/20 shadow-sm max-w-4xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#1F3D2B]/20 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#BA1A1A] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {selectedAlert.triage_category} PRIORITY
                    </span>
                    <span className="text-xs text-[#1F3D2B]/65">Case ID: #{selectedAlert.incident_id}</span>
                  </div>
                  <h2 className="font-headline text-2xl font-extrabold text-[#1F3D2B] mt-1">
                    {selectedAlert.suspected_condition}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#1F3D2B]/65 block uppercase">Ambulance Unit</span>
                  <span className="font-headline text-lg font-bold text-[#1F3D2B]">{selectedAlert.ambulance_id}</span>
                </div>
              </div>

              {/* Complete Vitals telemetry block */}
              {selectedAlert.vitals && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#14281C] border border-white/10">
                    <span className="text-[10px] text-[#E8DCC4]/70 uppercase block font-bold">Heart Rate</span>
                    <span className="font-headline text-2xl font-extrabold text-[#F87171]">
                      {selectedAlert.vitals.heart_rate} <span className="text-xs font-normal">bpm</span>
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#14281C] border border-white/10">
                    <span className="text-[10px] text-[#E8DCC4]/70 uppercase block font-bold">Blood Pressure</span>
                    <span className="font-headline text-2xl font-extrabold text-[#E8DCC4]">
                      {selectedAlert.vitals.blood_pressure}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#14281C] border border-white/10">
                    <span className="text-[10px] text-[#E8DCC4]/70 uppercase block font-bold">Oxygen Sat (SpO2)</span>
                    <span className="font-headline text-2xl font-extrabold text-[#4ADE80]">
                      {selectedAlert.vitals.spo2_pct}%
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#14281C] border border-white/10">
                    <span className="text-[10px] text-[#E8DCC4]/70 uppercase block font-bold">Glasgow Coma</span>
                    <span className="font-headline text-2xl font-extrabold text-[#E8DCC4]">
                      {selectedAlert.vitals.gcs} / 15
                    </span>
                  </div>
                </div>
              )}

              {/* Clinical AI Guidance with Required Disclaimer */}
              <div className="p-4 rounded-xl bg-[#8B5CF6] border border-[#8B5CF6]/40 space-y-2 text-white shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>AI Clinical Decision Support Assessment</span>
                </div>
                <p className="text-xs text-white/95 font-medium leading-relaxed">
                  Patient presents with acute ischemic indicators. Rapid Door-to-Balloon target &lt; 90 min recommended. Continuous telemetry streaming through NIVARAN gateway.
                </p>
                <div className="pt-2 border-t border-white/20 text-[10px] text-white/80 italic">
                  <strong>Clinical Decision Support Disclaimer:</strong> AI-generated triage insights to assist emergency physicians. Not a substitute for professional clinical judgment.
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => handleCompleteHandover(selectedAlert)}
                  className="px-6 py-2.5 rounded-xl bg-[#1F3D2B] hover:bg-[#082717] text-white text-xs font-bold uppercase transition-all shadow-md active:scale-95"
                >
                  Confirm Arrival & Handover
                </button>
              </div>
            </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 4: PARAMEDIC COORDINATION
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "paramedic" && (
            <div className="flex-1 min-h-0 overflow-y-auto pr-1">
              <div className="bg-[#F2EADA] p-6 rounded-2xl border border-[#1F3D2B]/20 shadow-sm max-w-4xl space-y-4">
              <h2 className="font-headline text-xl font-extrabold text-[#1F3D2B]">
                Field Telemetry & Paramedic Direct Bridge
              </h2>
              <p className="text-xs text-[#1F3D2B]/65">
                Real-time communication and ETA synchronisation with incoming ambulance crews.
              </p>

              <div className="space-y-3 pt-2">
                {preAlerts.map((alert) => (
                  <div
                    key={alert.alert_id}
                    className="p-4 rounded-xl bg-[#F2EADA] border border-[#1F3D2B]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1F3D2B]">{alert.ambulance_id}</span>
                        <span className="text-xs text-[#1F3D2B]/65">· Case #{alert.incident_id}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#8B5CF6] text-white">
                          En Route
                        </span>
                      </div>
                      <p className="text-xs text-[#1F3D2B]/80 font-medium mt-1">{alert.suspected_condition}</p>

                      {/* Physician Quick Directives */}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className="text-[10px] font-bold text-[#1F3D2B]/60 uppercase">Directives:</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1F3D2B]/10 text-[#1F3D2B]">
                          Trauma Bay 1 Ready
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1F3D2B]/10 text-[#1F3D2B]">
                          O-Neg Blood Staged
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-[#1F3D2B]/65 block">ETA</span>
                        <span className="font-mono text-sm font-extrabold text-[#BA1A1A]">
                          {formatEta(alert.eta_seconds)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCompleteHandover(alert)}
                        className="px-3.5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#4C1D95] text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[15px]">how_to_reg</span>
                        <span>Confirm Handover</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
