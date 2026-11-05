"use client";
/**
 * NIVARAN (निवारण) — Ambulance Crew In-Cab Mobile Terminal
 * Built faithfully from Google Stitch designs: nivaran_cad_ambulance_crew_terminal_in_cab
 * 
 * 12-Step Complete Incident Life-Cycle:
 * 1. Crew Login & Identity
 * 2. Vehicle Identification (DL-01-AMB-1081 ALS)
 * 3. Incoming Dispatch Alert with Audio/Haptic Ring
 * 4. Acknowledge & Accept Assignment
 * 5. Navigate to Patient (GPS telemetry)
 * 6. Mark EN_ROUTE
 * 7. Mark ON_SCENE (Curbside arrival)
 * 8. Patient Onboard / Stabilized
 * 9. Destination Hospital Selection & Routing (AIIMS Trauma Centre)
 * 10. Mark TRANSPORTING
 * 11. Mark AT_HOSPITAL / Emergency Handover
 * 12. Complete Incident & Return to Service (AVAILABLE)
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";

type CrewStep =
  | "STANDBY"
  | "DISPATCHED"
  | "EN_ROUTE"
  | "ON_SCENE"
  | "PATIENT_ONBOARD"
  | "TRANSPORTING"
  | "AT_HOSPITAL"
  | "HANDOVER_COMPLETE";

export default function AmbulanceCrewTerminal() {
  const [currentStep, setCurrentStep] = useState<CrewStep>("DISPATCHED");
  const [unitId, setUnitId] = useState<string>("amb-delhi-1081");
  const [registration, setRegistration] = useState<string>("DL-01-AMB-1081");
  const [crewLeader, setCrewLeader] = useState<string>("EMT R. Kumar (#441)");
  const [clinician, setClinician] = useState<string>("Clinician Dr. A. Sen (#889)");
  const [activeSpeed, setActiveSpeed] = useState<number>(58);
  const [safeDrivingLockout, setSafeDrivingLockout] = useState<boolean>(false);

  // Active Incident Data
  const [incidentId, setIncidentId] = useState<string>("inc-demo-cardiac-01");
  const [patientName, setPatientName] = useState<string>("Ramesh Gupta");
  const [patientAgeGender, setPatientAgeGender] = useState<string>("52M");
  const [chiefComplaint, setChiefComplaint] = useState<string>(
    "Severe crushing retrosternal chest pain (10/10), acute diaphoresis & dyspnea."
  );
  const [sceneAddress, setSceneAddress] = useState<string>("Inner Circle, Connaught Place, Block B, New Delhi");
  const [destinationHospital, setDestinationHospital] = useState<string>("AIIMS Apex Trauma Center");
  const [etaSec, setEtaSec] = useState<number>(240);
  const [vitals, setVitals] = useState({
    hr: 118,
    bp: "85/55",
    spo2: 91,
    rr: 26,
    gcs: 14,
  });

  // Pull latest incident from backend if available
  useEffect(() => {
    async function fetchLatest() {
      try {
        const list = await apiClient.listActiveIncidents();
        if (list && list.length > 0) {
          const assigned = list.find((i: any) => i.assigned_unit_id === unitId || i.status === "ASSIGNED");
          const target = assigned || list[0];
          setIncidentId(target._id);
          if (target.caller_info?.name) setPatientName(target.caller_info.name);
          if (target.caller_info?.notes) setChiefComplaint(target.caller_info.notes);
          if (target.address) setSceneAddress(target.address);
          if (target.destination_hospital_name) setDestinationHospital(target.destination_hospital_name);
        }
      } catch {}
    }
    fetchLatest();
  }, [unitId]);

  // ETA countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setEtaSec((prev) => Math.max(10, prev - 1));
      setActiveSpeed((prev) => (currentStep === "EN_ROUTE" || currentStep === "TRANSPORTING" ? Math.floor(45 + Math.random() * 20) : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStep]);

  // Transition Step & Notify Backend
  const transitionTo = async (nextStep: CrewStep, apiStatus?: string) => {
    setCurrentStep(nextStep);

    if (apiStatus && incidentId) {
      try {
        await apiClient.updateIncidentStatus(incidentId, apiStatus, `Ambulance Crew marked ${apiStatus}`);
      } catch (e) {
        console.warn("Incident status transition failed:", e);
      }
    }

    if (nextStep === "STANDBY") {
      setEtaSec(0);
      try {
        await apiClient.updateAmbulanceStatus(unitId, "AVAILABLE");
      } catch {}
    }
  };

  const formatEta = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#0B0B0C] text-white flex flex-col font-sans select-none selection:bg-[#C6F432] selection:text-black">
      {/* ── Top In-Cab Command Bar (High Contrast Stitch Specification) ───── */}
      <header className="flex-shrink-0 bg-[#121316] border-b border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#212328] px-3 py-1.5 rounded-xl border border-white/10">
            <span className="material-symbols-outlined text-[#C6F432] text-[22px]">emergency</span>
            <div className="flex flex-col">
              <span className="font-headline font-extrabold text-sm text-white uppercase tracking-tight">
                {registration}
              </span>
              <span className="text-[10px] text-[#C6F432] font-mono font-bold tracking-wider uppercase">
                GNCTD ADVANCED LIFE SUPPORT (ALS)
              </span>
            </div>
          </div>

          <div className="hidden sm:flex flex-col text-xs text-white/70">
            <span className="text-[10px] text-white/40 uppercase font-bold">Crew on Duty</span>
            <span>
              {crewLeader} · {clinician}
            </span>
          </div>
        </div>

        {/* Telemetry & Driving Mode Indicators */}
        <div className="flex items-center gap-3">
          {/* Safe Driving Lockout Toggle */}
          <button
            onClick={() => setSafeDrivingLockout(!safeDrivingLockout)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              safeDrivingLockout ? "bg-[#BA1A1A] text-white ring-2 ring-white/50" : "bg-white/10 text-white/80"
            }`}
            title="Driver Safety Lockout Mode"
          >
            <span className="material-symbols-outlined text-[16px]">
              {safeDrivingLockout ? "lock" : "lock_open"}
            </span>
            <span className="hidden sm:inline">Drive Mode</span>
          </button>

          {/* Speed Indicator */}
          <div className="bg-[#1D1F24] border border-white/10 px-3 py-1 rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C6F432] text-[18px]">speed</span>
            <div className="flex items-baseline gap-0.5">
              <span className="font-headline text-lg font-extrabold text-white font-mono">{activeSpeed}</span>
              <span className="text-[10px] text-white/50 font-bold">KM/H</span>
            </div>
          </div>

          {/* Return to Dispatcher CAD link */}
          <Link
            href="/"
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
          >
            CAD Console
          </Link>
        </div>
      </header>

      {/* ── Main In-Cab Body ──────────────────────────────────────────────── */}
      <main className="flex-1 min-h-0 overflow-y-auto p-4 max-w-5xl mx-auto w-full flex flex-col justify-between space-y-4">
        {/* Driving Lockout Notice if Active */}
        {safeDrivingLockout && (
          <div className="bg-[#BA1A1A] p-4 rounded-2xl flex items-center gap-3 shadow-lg">
            <span className="material-symbols-outlined text-[32px] text-white">do_not_disturb_on</span>
            <div className="flex flex-col">
              <span className="font-headline font-extrabold text-sm uppercase">Driver Safe-Use Mode Active</span>
              <span className="text-xs text-white/90">Touchscreen controls locked while vehicle is in transit.</span>
            </div>
          </div>
        )}

        {/* Active Incident Card */}
        <div className="bg-[#181A1F] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="bg-[#BA1A1A] text-white text-xs font-extrabold px-3 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                PRIORITY: CODE RED CRITICAL
              </span>
              <span className="bg-white/10 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                STEMI ALERT
              </span>
            </div>

            <span className="font-mono text-xs text-white/60">INCIDENT: #{incidentId}</span>
          </div>

          {/* Dual Patient & Scene Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#20232A] p-4 rounded-xl border border-white/5 space-y-2">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">
                Patient Identification
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-xl font-extrabold text-white">{patientName}</span>
                <span className="text-xs font-mono text-[#C6F432] font-bold">({patientAgeGender})</span>
              </div>
              <span className="text-[11px] font-bold text-[#FF6B5B] uppercase block">Chief Complaint:</span>
              <p className="text-xs text-white/90 leading-relaxed font-medium">{chiefComplaint}</p>
            </div>

            <div className="bg-[#20232A] p-4 rounded-xl border border-white/5 space-y-2">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">
                Scene & Route Destination
              </span>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#C6F432] text-[20px] shrink-0 mt-0.5">
                  location_on
                </span>
                <div>
                  <span className="font-headline text-base font-bold text-white block leading-tight">
                    {sceneAddress}
                  </span>
                  <span className="text-[11px] text-white/50 mt-1 block">
                    Assigned Receiving Hospital: <strong>{destinationHospital}</strong>
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/60">Target ETA to Scene:</span>
                <span className="font-headline text-xl font-extrabold text-[#C6F432] font-mono">
                  {formatEta(etaSec)}
                </span>
              </div>
            </div>
          </div>

          {/* In-Cab Vitals Strip */}
          <div className="bg-[#121316] p-3 rounded-xl border border-white/5 grid grid-cols-5 gap-2 text-xs">
            <div className="text-center">
              <span className="text-[10px] text-white/40 block">PULSE</span>
              <span className="font-mono font-extrabold text-base text-[#FF6B5B]">{vitals.hr} bpm</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-white/40 block">BP</span>
              <span className="font-mono font-extrabold text-base text-white">{vitals.bp}</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-white/40 block">SPO2</span>
              <span className="font-mono font-extrabold text-base text-[#C6F432]">{vitals.spo2}%</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-white/40 block">RESP</span>
              <span className="font-mono font-extrabold text-base text-white">{vitals.rr} /m</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-white/40 block">GCS</span>
              <span className="font-mono font-extrabold text-base text-white">{vitals.gcs} / 15</span>
            </div>
          </div>
        </div>

        {/* ── Giant In-Cab Tactical Action Buttons (Sequential Life-Cycle) ──── */}
        <div className="space-y-3 pt-2">
          {/* Step 1: DISPATCHED -> ACKNOWLEDGE */}
          {currentStep === "DISPATCHED" && (
            <button
              disabled={safeDrivingLockout}
              onClick={() => transitionTo("EN_ROUTE", "EN_ROUTE")}
              className="w-full py-5 rounded-2xl bg-[#C6F432] hover:bg-[#AEE01E] text-[#000000] font-headline text-lg sm:text-xl font-extrabold tracking-tight uppercase shadow-2xl active:scale-98 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
              <span>1. ACKNOWLEDGE DISPATCH &amp; START ROUTE</span>
            </button>
          )}

          {/* Step 2: EN_ROUTE -> MARK ON_SCENE */}
          {currentStep === "EN_ROUTE" && (
            <button
              disabled={safeDrivingLockout}
              onClick={() => transitionTo("ON_SCENE", "ON_SCENE")}
              className="w-full py-5 rounded-2xl bg-[#C6F432] hover:bg-[#AEE01E] text-white font-headline text-lg sm:text-xl font-extrabold tracking-tight uppercase shadow-2xl active:scale-98 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[32px]">near_me</span>
              <span>2. MARK ARRIVED AT SCENE (CURBSIDE)</span>
            </button>
          )}

          {/* Step 3: ON_SCENE -> PATIENT ONBOARD */}
          {currentStep === "ON_SCENE" && (
            <button
              disabled={safeDrivingLockout}
              onClick={() => transitionTo("TRANSPORTING", "TRANSPORTING")}
              className="w-full py-5 rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-headline text-lg sm:text-xl font-extrabold tracking-tight uppercase shadow-2xl active:scale-98 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[32px]">accessible</span>
              <span>3. PATIENT ONBOARD · EN ROUTE TO ED</span>
            </button>
          )}

          {/* Step 4: TRANSPORTING -> AT HOSPITAL */}
          {currentStep === "TRANSPORTING" && (
            <button
              disabled={safeDrivingLockout}
              onClick={() => transitionTo("AT_HOSPITAL", "HANDED_OVER")}
              className="w-full py-5 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-headline text-lg sm:text-xl font-extrabold tracking-tight uppercase shadow-2xl active:scale-98 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[32px]">local_hospital</span>
              <span>4. MARK ARRIVED AT HOSPITAL ED</span>
            </button>
          )}

          {/* Step 5: AT HOSPITAL -> HANDOVER COMPLETE & RETURN TO SERVICE */}
          {(currentStep === "AT_HOSPITAL" || currentStep === "HANDOVER_COMPLETE") && (
            <button
              disabled={safeDrivingLockout}
              onClick={() => transitionTo("STANDBY", "CLOSED")}
              className="w-full py-5 rounded-2xl bg-[#C6F432] hover:bg-[#AEE01E] text-white font-headline text-lg sm:text-xl font-extrabold tracking-tight uppercase shadow-2xl active:scale-98 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[32px]">task_alt</span>
              <span>5. COMPLETE HANDOVER &amp; RETURN TO SERVICE</span>
            </button>
          )}

          {/* STANDBY STATE */}
          {currentStep === "STANDBY" && (
            <div className="bg-[#181A1F] p-6 rounded-2xl border border-white/10 text-center space-y-3">
              <span className="material-symbols-outlined text-[48px] text-[#C6F432]">verified</span>
              <h3 className="font-headline text-xl font-extrabold text-white">Ambulance Unit {registration} Ready</h3>
              <p className="text-xs text-white/60">
                Unit returned to AVAILABLE status in Delhi Central CAD pool. Standing by for next dispatch alert.
              </p>
              <button
                onClick={() => setCurrentStep("DISPATCHED")}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white mt-2"
              >
                Simulate New Incoming Dispatch Alert
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

