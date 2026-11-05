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
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

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

  // Real-time WebSocket connection to Hospital Channel
  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      const getWsBase = () => {
        if (typeof window !== "undefined") {
          const host = window.location.hostname;
          if (host === "localhost" || host === "127.0.0.1") return "ws://localhost:8000/api/v1";
        }
        return "wss://nivaran.onrender.com/api/v1";
      };

      ws = new WebSocket(`${getWsBase()}/hospitals/${selectedHospitalId}/ws`);
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.type === "pre_alert" && msg.data) {
            setPreAlerts((prev) => [msg.data, ...prev.filter((a) => a.alert_id !== msg.data.alert_id)]);
          }
        } catch {}
      };
      ws.onopen = () => {
        const ping = setInterval(() => {
          if (ws?.readyState === WebSocket.OPEN) ws.send("ping");
          else clearInterval(ping);
        }, 25000);
      };
    } catch (e) {
      console.warn("Hospital WS fallback:", e);
    }
    return () => {
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
    <div className="min-h-screen bg-[#FCF9F4] text-[#1C1C19] flex flex-col font-sans selection:bg-[#1F3D2B] selection:text-white">
      {/* ── Fixed Top Header (Stitch design specification) ────────────────── */}
      <header className="fixed top-0 inset-x-0 h-16 bg-white border-b border-[#E2DCD5] shadow-sm z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1F3D2B] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[24px]">emergency</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline font-extrabold text-[#082717] text-lg tracking-tight uppercase leading-none">
                  NIVARAN
                </span>
                <span className="bg-[#E9DDFF] text-[#5516BE] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  ED-COMMAND
                </span>
                <span className="text-xs text-[#64748B]">· Port 3002</span>
              </div>
              <span className="text-xs text-[#64748B] font-medium leading-none mt-1">
                {hospitalName} — Trauma Bay Unit
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-[#E2DCD5] hidden md:block"></div>

          {/* Acceptance Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F0EDE9] border border-[#E2DCD5]">
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                acceptanceStatus === "NORMAL"
                  ? "bg-[#10B981]"
                  : acceptanceStatus === "SURGE"
                  ? "bg-[#F59E0B]"
                  : "bg-[#BA1A1A]"
              }`}
            ></span>
            <span className="text-[11px] font-bold text-[#64748B] uppercase">Intake Status:</span>
            <span className="text-xs font-bold text-[#082717]">
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
                ? "bg-[#1F3D2B] text-white shadow-sm"
                : "text-[#424843] hover:text-[#082717] hover:bg-[#F0EDE9]"
            }`}
          >
            Inbound Casualty Radar ({preAlerts.length})
          </button>
          <button
            onClick={() => setActiveTab("capacity")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "capacity"
                ? "bg-[#1F3D2B] text-white shadow-sm"
                : "text-[#424843] hover:text-[#082717] hover:bg-[#F0EDE9]"
            }`}
          >
            Hospital Capacity & Beds
          </button>
          <button
            onClick={() => setActiveTab("telemetry")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "telemetry"
                ? "bg-[#1F3D2B] text-white shadow-sm"
                : "text-[#424843] hover:text-[#082717] hover:bg-[#F0EDE9]"
            }`}
          >
            Pre-Arrival Telemetry
          </button>
          <button
            onClick={() => setActiveTab("paramedic")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "paramedic"
                ? "bg-[#1F3D2B] text-white shadow-sm"
                : "text-[#424843] hover:text-[#082717] hover:bg-[#F0EDE9]"
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
              <span className="text-xs font-bold text-[#082717]">Dr. S. Nair</span>
              <span className="text-[10px] text-[#64748B]">Triage Chief · Duty Lead</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1F3D2B] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              SN
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Layout: Sidebar + Operational Body ───────────────────────── */}
      <div className="flex flex-1 pt-16">
        {/* Left Operational Sidebar */}
        <aside className="w-64 bg-[#F6F3EE] border-r border-[#E2DCD5] flex flex-col justify-between p-4 hidden md:flex shrink-0">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block px-2 mb-2">
                Operational Units
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("radar")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "radar" ? "bg-[#1F3D2B] text-white shadow-sm" : "text-[#424843] hover:bg-[#EBE8E3]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">radar</span>
                    <span>Casualty Radar</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    activeTab === "radar" ? "bg-white/20 text-white" : "bg-[#8455EF] text-white"
                  }`}>
                    {preAlerts.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("capacity")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "capacity" ? "bg-[#1F3D2B] text-white shadow-sm" : "text-[#424843] hover:bg-[#EBE8E3]"
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
                    activeTab === "telemetry" ? "bg-[#1F3D2B] text-white shadow-sm" : "text-[#424843] hover:bg-[#EBE8E3]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">monitor_heart</span>
                    <span>Vital Telemetry</span>
                  </div>
                  <span className="text-[10px] text-[#8455EF] font-bold">Live AI</span>
                </button>

                <button
                  onClick={() => setActiveTab("paramedic")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "paramedic" ? "bg-[#1F3D2B] text-white shadow-sm" : "text-[#424843] hover:bg-[#EBE8E3]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">airport_shuttle</span>
                    <span>Ambulance Fleet</span>
                  </div>
                  <span className="text-[10px] text-[#64748B]">4 Units</span>
                </button>
              </nav>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block px-2 mb-2">
                Clinical Readiness
              </span>
              <div className="space-y-1.5 px-2 text-xs">
                <div className="flex items-center justify-between py-1 text-[#424843]">
                  <span>Cath Lab Status</span>
                  <span className="font-bold text-[#10B981]">READY</span>
                </div>
                <div className="flex items-center justify-between py-1 text-[#424843]">
                  <span>Trauma Team Alpha</span>
                  <span className="font-bold text-[#10B981]">STANDBY</span>
                </div>
                <div className="flex items-center justify-between py-1 text-[#424843]">
                  <span>CT Scanner</span>
                  <span className="font-bold text-[#10B981]">OPERATIONAL</span>
                </div>
                <div className="flex items-center justify-between py-1 text-[#424843]">
                  <span>Blood Bank (O-Neg)</span>
                  <span className="font-bold text-[#10B981]">12 UNITS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Network Link pill */}
          <div className="p-3 bg-[#F0EDE9] rounded-xl border border-[#E2DCD5] space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#64748B] uppercase">Network Link</span>
              <span className="text-[#10B981] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                AIIMS-ED-01
              </span>
            </div>
            <span className="text-[10px] text-[#64748B] block">Encrypted Clinical Bridge · 24/7</span>
          </div>
        </aside>

        {/* Operational Workspace Body */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Subheader Banner */}
          <div className="bg-white p-5 rounded-2xl border border-[#E2DCD5] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="bg-[#C8EBD1] text-[#022111] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  COMMAND HUB · LEVEL-1 DISPATCH
                </span>
                <span className="text-xs text-[#64748B]">NODE: AIIMS-ND-TC-ER01</span>
                <span className="text-[#64748B]">·</span>
                <span className="text-xs text-[#10B981] font-semibold">SYNCHRONIZED WITH CAD 112/108</span>
              </div>
              <h1 className="font-headline text-2xl font-extrabold text-[#082717] tracking-tight">
                {hospitalName} — Emergency Medicine Department
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Real-time acute intake registry, paramedic telemetry bridge, and rapid trauma bay allocation matrix.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadInboundData}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F0EDE9] hover:bg-[#EBE8E3] text-[#082717] text-xs font-bold transition-all shadow-sm"
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
            <div className="bg-white p-4 rounded-2xl border border-[#E2DCD5] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B] uppercase">
                <span>Inbound Transports</span>
                <span className="material-symbols-outlined text-[#8455EF] text-[18px]">ambulance</span>
              </div>
              <div className="my-2">
                <span className="font-headline text-3xl font-extrabold text-[#082717]">
                  {preAlerts.length < 10 ? `0${preAlerts.length}` : preAlerts.length}
                </span>
                <span className="text-xs font-bold text-[#8455EF] ml-1.5">En Route</span>
              </div>
              <div className="w-full bg-[#F0EDE9] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#8455EF] h-full rounded-full" style={{ width: "75%" }}></div>
              </div>
              <span className="text-[10px] text-[#BA1A1A] font-bold mt-1.5">1 ETA &lt; 5m</span>
            </div>

            {/* Metric 2 */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2DCD5] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B] uppercase">
                <span>Trauma Bays</span>
                <span className="material-symbols-outlined text-[#1F3D2B] text-[18px]">meeting_room</span>
              </div>
              <div className="my-2">
                <span className="font-headline text-3xl font-extrabold text-[#082717]">
                  0{capacity.trauma_bays_available}
                </span>
                <span className="text-xs font-bold text-[#10B981] ml-1.5">Open / Ready</span>
              </div>
              <div className="w-full bg-[#F0EDE9] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#1F3D2B] h-full rounded-full" style={{ width: "66%" }}></div>
              </div>
              <span className="text-[10px] text-[#64748B] mt-1.5">Bay 1 & 2 Staged</span>
            </div>

            {/* Metric 3 */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2DCD5] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B] uppercase">
                <span>ICU Capacity</span>
                <span className="material-symbols-outlined text-[#10B981] text-[18px]">vital_signs</span>
              </div>
              <div className="my-2">
                <span className="font-headline text-3xl font-extrabold text-[#082717]">
                  0{capacity.icu_beds_available}
                </span>
                <span className="text-xs font-bold text-[#10B981] ml-1.5">Available</span>
              </div>
              <div className="w-full bg-[#F0EDE9] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#10B981] h-full rounded-full" style={{ width: "75%" }}></div>
              </div>
              <span className="text-[10px] text-[#64748B] mt-1.5">Surge reserve: 3</span>
            </div>

            {/* Metric 4 */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2DCD5] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B] uppercase">
                <span>General Acute ER</span>
                <span className="material-symbols-outlined text-[#64748B] text-[18px]">single_bed</span>
              </div>
              <div className="my-2">
                <span className="font-headline text-3xl font-extrabold text-[#082717]">
                  {capacity.er_beds_available}
                </span>
                <span className="text-xs font-bold text-[#10B981] ml-1.5">Available</span>
              </div>
              <div className="w-full bg-[#F0EDE9] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#1F3D2B] h-full rounded-full" style={{ width: "60%" }}></div>
              </div>
              <span className="text-[10px] text-[#64748B] mt-1.5">Cap: {capacity.er_beds_total} Total</span>
            </div>

            {/* Metric 5 */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2DCD5] shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B] uppercase">
                <span>Cath Lab / OR</span>
                <span className="material-symbols-outlined text-[#8455EF] text-[18px]">medical_services</span>
              </div>
              <div className="my-2">
                <span className="font-headline text-3xl font-extrabold text-[#082717]">READY</span>
              </div>
              <div className="w-full bg-[#F0EDE9] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#10B981] h-full rounded-full" style={{ width: "100%" }}></div>
              </div>
              <span className="text-[10px] text-[#10B981] font-bold mt-1.5">Team on Standby</span>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              TAB 1: INBOUND CASUALTY RADAR
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "radar" && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left Column: Live Pre-Alert Inbound Queue (7 Cols) */}
              <div className="xl:col-span-7 space-y-3.5">
                <div className="flex items-center justify-between px-1">
                  <span className="font-headline text-sm font-bold text-[#082717]">
                    Live Incoming Pre-Alert Queue ({preAlerts.length})
                  </span>
                  <span className="text-xs text-[#64748B]">Click card to inspect telemetry</span>
                </div>

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
                          ? "bg-white border-[#1F3D2B] shadow-md ring-2 ring-[#1F3D2B]/10"
                          : "bg-white border-[#E2DCD5] hover:border-[#1F3D2B]/40 shadow-sm"
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
                            <span className="font-mono text-xs font-bold text-[#082717]">
                              #{alert.alert_id}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                isRed ? "bg-[#FFDAD6] text-[#93000A]" : "bg-[#FEF3C7] text-[#D97706]"
                              }`}
                            >
                              {alert.triage_category} PRIORITY
                            </span>
                            <span className="text-xs text-[#64748B]">· {alert.ambulance_id}</span>
                          </div>

                          <h3 className="font-headline text-base font-extrabold text-[#082717]">
                            {alert.suspected_condition}
                          </h3>

                          <p className="text-xs text-[#64748B] line-clamp-1">{alert.notes}</p>
                        </div>

                        {/* ETA Badge */}
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <div className="px-2.5 py-1 rounded-xl bg-[#F0EDE9] border border-[#E2DCD5] text-right">
                            <span className="text-[10px] font-bold text-[#64748B] uppercase block leading-none">ETA</span>
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
                        <div className="mt-3 pt-2.5 border-t border-[#E2DCD5]/60 flex items-center gap-4 text-xs pl-2">
                          <span className="text-[#64748B]">
                            HR: <strong className="text-[#082717]">{alert.vitals.heart_rate} bpm</strong>
                          </span>
                          <span className="text-[#64748B]">
                            BP: <strong className="text-[#082717]">{alert.vitals.blood_pressure}</strong>
                          </span>
                          <span className="text-[#64748B]">
                            SpO2: <strong className="text-[#082717]">{alert.vitals.spo2_pct}%</strong>
                          </span>
                          <span className="text-[#64748B]">
                            GCS: <strong className="text-[#082717]">{alert.vitals.gcs}/15</strong>
                          </span>
                          <span className="ml-auto text-[11px] text-[#8455EF] font-bold">
                            Cath Lab Standby
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Pre-Arrival Telemetry & Staging Inspector (5 Cols) */}
              <div className="xl:col-span-5 space-y-4">
                {selectedAlert ? (
                  <div className="bg-white p-5 rounded-2xl border border-[#E2DCD5] shadow-sm space-y-4 sticky top-20">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E2DCD5]">
                      <div>
                        <span className="text-[10px] font-bold text-[#64748B] uppercase">Case Detail Inspector</span>
                        <h3 className="font-headline text-lg font-extrabold text-[#082717]">
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
                        <div className="p-3 rounded-xl bg-[#F6F3EE] border border-[#E2DCD5]">
                          <span className="text-[10px] text-[#64748B] block">Heart Rate</span>
                          <span className="font-headline text-xl font-extrabold text-[#BA1A1A]">
                            {selectedAlert.vitals.heart_rate} <span className="text-xs font-normal">BPM</span>
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#F6F3EE] border border-[#E2DCD5]">
                          <span className="text-[10px] text-[#64748B] block">Blood Pressure</span>
                          <span className="font-headline text-xl font-extrabold text-[#082717]">
                            {selectedAlert.vitals.blood_pressure} <span className="text-xs font-normal">mmHg</span>
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#F6F3EE] border border-[#E2DCD5]">
                          <span className="text-[10px] text-[#64748B] block">Pulse Oximetry (SpO2)</span>
                          <span className="font-headline text-xl font-extrabold text-[#10B981]">
                            {selectedAlert.vitals.spo2_pct}% <span className="text-xs font-normal">Room air</span>
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#F6F3EE] border border-[#E2DCD5]">
                          <span className="text-[10px] text-[#64748B] block">Glasgow Coma Scale</span>
                          <span className="font-headline text-xl font-extrabold text-[#082717]">
                            {selectedAlert.vitals.gcs} / 15
                          </span>
                        </div>
                      </div>
                    )}

                    {/* AI Clinical Triage Summary (With Mandatory Disclaimer) */}
                    <div className="p-3.5 rounded-xl bg-[#E9DDFF]/50 border border-[#8455EF]/30 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#5516BE]">
                        <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                        <span>AI Clinical Triage Summary</span>
                      </div>
                      <p className="text-xs text-[#1C1C19] font-medium leading-relaxed">
                        {selectedAlert.notes}
                      </p>
                      <div className="pt-2 border-t border-[#8455EF]/20 text-[10px] text-[#64748B] italic">
                        <strong>Clinical Decision Support:</strong> AI-generated triage insights to assist emergency physicians. Not a substitute for professional clinical judgment.
                      </div>
                    </div>

                    {/* Trauma Staging Checklist */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#082717] block">Facility Preparation Checklist</span>
                      <div className="space-y-1.5 text-xs">
                        <label className="flex items-center gap-2 p-2 rounded-lg bg-[#F6F3EE] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={stagedBays[selectedAlert.alert_id] || false}
                            onChange={(e) =>
                              setStagedBays({ ...stagedBays, [selectedAlert.alert_id]: e.target.checked })
                            }
                            className="rounded text-[#1F3D2B] focus:ring-[#1F3D2B]"
                          />
                          <span className="font-semibold text-[#082717]">Trauma Resuscitation Bay 1 Staged</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 rounded-lg bg-[#F6F3EE] cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded text-[#1F3D2B]" />
                          <span className="font-semibold text-[#082717]">Cath Lab Team Activated</span>
                        </label>
                        <label className="flex items-center gap-2 p-2 rounded-lg bg-[#F6F3EE] cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded text-[#1F3D2B]" />
                          <span className="font-semibold text-[#082717]">Type O-Negative Blood Crossmatched</span>
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
                  <div className="bg-white p-8 rounded-2xl border border-[#E2DCD5] text-center text-[#64748B] text-xs">
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
            <div className="bg-white p-6 rounded-2xl border border-[#E2DCD5] shadow-sm max-w-3xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#E2DCD5] pb-4">
                <div>
                  <h2 className="font-headline text-xl font-extrabold text-[#082717]">
                    Emergency Department Capacity & Resource Editor
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
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
                <div className="p-4 rounded-xl bg-[#F6F3EE] border border-[#E2DCD5] space-y-2">
                  <span className="text-xs font-bold text-[#082717]">General Acute ER Beds</span>
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="text-[10px] text-[#64748B] block">Available</label>
                      <input
                        type="number"
                        value={capacity.er_beds_available}
                        onChange={(e) =>
                          setCapacity({ ...capacity, er_beds_available: Number(e.target.value) })
                        }
                        className="w-20 px-2 py-1 rounded border border-[#E2DCD5] font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#64748B] block">Total Beds</label>
                      <input
                        type="number"
                        value={capacity.er_beds_total}
                        onChange={(e) =>
                          setCapacity({ ...capacity, er_beds_total: Number(e.target.value) })
                        }
                        className="w-20 px-2 py-1 rounded border border-[#E2DCD5] font-bold text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F6F3EE] border border-[#E2DCD5] space-y-2">
                  <span className="text-xs font-bold text-[#082717]">Critical ICU Beds</span>
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="text-[10px] text-[#64748B] block">Available</label>
                      <input
                        type="number"
                        value={capacity.icu_beds_available}
                        onChange={(e) =>
                          setCapacity({ ...capacity, icu_beds_available: Number(e.target.value) })
                        }
                        className="w-20 px-2 py-1 rounded border border-[#E2DCD5] font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#64748B] block">Total ICU</label>
                      <input
                        type="number"
                        value={capacity.icu_beds_total}
                        onChange={(e) =>
                          setCapacity({ ...capacity, icu_beds_total: Number(e.target.value) })
                        }
                        className="w-20 px-2 py-1 rounded border border-[#E2DCD5] font-bold text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F6F3EE] border border-[#E2DCD5] space-y-2">
                  <span className="text-xs font-bold text-[#082717]">Trauma Resuscitation Bays</span>
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="text-[10px] text-[#64748B] block">Open Bays</label>
                      <input
                        type="number"
                        value={capacity.trauma_bays_available}
                        onChange={(e) =>
                          setCapacity({ ...capacity, trauma_bays_available: Number(e.target.value) })
                        }
                        className="w-20 px-2 py-1 rounded border border-[#E2DCD5] font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#64748B] block">Total Bays</label>
                      <input
                        type="number"
                        value={capacity.trauma_bays_total}
                        onChange={(e) =>
                          setCapacity({ ...capacity, trauma_bays_total: Number(e.target.value) })
                        }
                        className="w-20 px-2 py-1 rounded border border-[#E2DCD5] font-bold text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F6F3EE] border border-[#E2DCD5] space-y-2">
                  <span className="text-xs font-bold text-[#082717]">Emergency Operating Theatres</span>
                  <div>
                    <label className="text-[10px] text-[#64748B] block">Open Theatres</label>
                    <input
                      type="number"
                      value={capacity.or_available}
                      onChange={(e) =>
                        setCapacity({ ...capacity, or_available: Number(e.target.value) })
                      }
                      className="w-20 px-2 py-1 rounded border border-[#E2DCD5] font-bold text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Critical Diagnostics & Teams Toggles */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#082717] block">Critical Facility Readiness</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F6F3EE] border border-[#E2DCD5] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={capacity.ct_scanner_operational}
                      onChange={(e) =>
                        setCapacity({ ...capacity, ct_scanner_operational: e.target.checked })
                      }
                      className="rounded text-[#1F3D2B]"
                    />
                    <span className="text-xs font-bold text-[#082717]">CT Scanner Active</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F6F3EE] border border-[#E2DCD5] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={capacity.cath_lab_operational}
                      onChange={(e) =>
                        setCapacity({ ...capacity, cath_lab_operational: e.target.checked })
                      }
                      className="rounded text-[#1F3D2B]"
                    />
                    <span className="text-xs font-bold text-[#082717]">Cath Lab Ready</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F6F3EE] border border-[#E2DCD5] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={capacity.trauma_team_standby}
                      onChange={(e) =>
                        setCapacity({ ...capacity, trauma_team_standby: e.target.checked })
                      }
                      className="rounded text-[#1F3D2B]"
                    />
                    <span className="text-xs font-bold text-[#082717]">Trauma Team Standby</span>
                  </label>
                </div>
              </div>

              {/* Diversion Mode Selector */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#082717] block">Hospital Intake & Diversion Policy</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setAcceptanceStatus("NORMAL")}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      acceptanceStatus === "NORMAL"
                        ? "bg-[#C8EBD1] border-[#10B981] text-[#022111]"
                        : "bg-[#F6F3EE] border-[#E2DCD5] text-[#424843]"
                    }`}
                  >
                    ● NORMAL (Open)
                    <span className="block text-[10px] font-normal text-[#64748B] mt-0.5">
                      Accepting all casualties
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAcceptanceStatus("SURGE")}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      acceptanceStatus === "SURGE"
                        ? "bg-[#FEF3C7] border-[#F59E0B] text-[#D97706]"
                        : "bg-[#F6F3EE] border-[#E2DCD5] text-[#424843]"
                    }`}
                  >
                    ● AMBER SURGE
                    <span className="block text-[10px] font-normal text-[#64748B] mt-0.5">
                      Critical trauma & cardiac only
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAcceptanceStatus("DIVERT")}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      acceptanceStatus === "DIVERT"
                        ? "bg-[#FFDAD6] border-[#BA1A1A] text-[#93000A]"
                        : "bg-[#F6F3EE] border-[#E2DCD5] text-[#424843]"
                    }`}
                  >
                    ● RED DIVERSION
                    <span className="block text-[10px] font-normal text-[#64748B] mt-0.5">
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
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 3: PRE-ARRIVAL TELEMETRY
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "telemetry" && selectedAlert && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2DCD5] shadow-sm max-w-4xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#E2DCD5] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#BA1A1A] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {selectedAlert.triage_category} PRIORITY
                    </span>
                    <span className="text-xs text-[#64748B]">Case ID: #{selectedAlert.incident_id}</span>
                  </div>
                  <h2 className="font-headline text-2xl font-extrabold text-[#082717] mt-1">
                    {selectedAlert.suspected_condition}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#64748B] block uppercase">Ambulance Unit</span>
                  <span className="font-headline text-lg font-bold text-[#082717]">{selectedAlert.ambulance_id}</span>
                </div>
              </div>

              {/* Complete Vitals telemetry block */}
              {selectedAlert.vitals && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#F6F3EE] border border-[#E2DCD5]">
                    <span className="text-[10px] text-[#64748B] uppercase block">Heart Rate</span>
                    <span className="font-headline text-2xl font-extrabold text-[#BA1A1A]">
                      {selectedAlert.vitals.heart_rate} <span className="text-xs font-normal">bpm</span>
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F6F3EE] border border-[#E2DCD5]">
                    <span className="text-[10px] text-[#64748B] uppercase block">Blood Pressure</span>
                    <span className="font-headline text-2xl font-extrabold text-[#082717]">
                      {selectedAlert.vitals.blood_pressure}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F6F3EE] border border-[#E2DCD5]">
                    <span className="text-[10px] text-[#64748B] uppercase block">Oxygen Sat (SpO2)</span>
                    <span className="font-headline text-2xl font-extrabold text-[#10B981]">
                      {selectedAlert.vitals.spo2_pct}%
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F6F3EE] border border-[#E2DCD5]">
                    <span className="text-[10px] text-[#64748B] uppercase block">Glasgow Coma</span>
                    <span className="font-headline text-2xl font-extrabold text-[#082717]">
                      {selectedAlert.vitals.gcs} / 15
                    </span>
                  </div>
                </div>
              )}

              {/* Clinical AI Guidance with Required Disclaimer */}
              <div className="p-4 rounded-xl bg-[#E9DDFF]/60 border border-[#8455EF]/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#5516BE]">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>AI Clinical Decision Support Assessment</span>
                </div>
                <p className="text-xs text-[#082717] font-medium leading-relaxed">
                  Patient presents with acute ischemic indicators. Rapid Door-to-Balloon target &lt; 90 min recommended. Continuous telemetry streaming through NIVARAN gateway.
                </p>
                <div className="pt-2 border-t border-[#8455EF]/20 text-[10px] text-[#64748B] italic">
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
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 4: PARAMEDIC COORDINATION
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "paramedic" && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2DCD5] shadow-sm max-w-4xl space-y-4">
              <h2 className="font-headline text-xl font-extrabold text-[#082717]">
                Field Telemetry & Paramedic Direct Bridge
              </h2>
              <p className="text-xs text-[#64748B]">
                Real-time communication and ETA synchronisation with incoming ambulance crews.
              </p>

              <div className="space-y-3 pt-2">
                {preAlerts.map((alert) => (
                  <div
                    key={alert.alert_id}
                    className="p-4 rounded-xl bg-[#F6F3EE] border border-[#E2DCD5] flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#082717]">{alert.ambulance_id}</span>
                        <span className="text-xs text-[#64748B]">· Case #{alert.incident_id}</span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">{alert.suspected_condition}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-extrabold text-[#BA1A1A]">
                        {formatEta(alert.eta_seconds)}
                      </span>
                      <button
                        onClick={() => handleCompleteHandover(alert)}
                        className="px-3 py-1.5 rounded-lg bg-[#1F3D2B] text-white text-xs font-bold hover:bg-[#082717] transition-all"
                      >
                        Handover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
