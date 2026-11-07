"use client";

import React, { useState } from "react";
import Link from "next/link";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "How does pre-arrival 12-lead ECG streaming operate over cellular networks?",
    answer:
      "Field paramedic telemetry units interface with NIVARAN via ultra-low-bandwidth adaptive streaming protocols. Even in fluctuating 3G/4G/5G mobile reception areas, telemetry data prioritizes diagnostic rhythm wave fidelity, ensuring the ER cardiologist receives clean ST-elevation tracings seconds after application."
  },
  {
    question: "Can hospital triage chiefs broadcast regional emergency diversion statuses?",
    answer:
      "Yes. Authorized clinical directors can issue structured diversion statuses (Full Divert, Trauma Bypass, or CT Down) with single-touch confirmation. Regional dispatch networks receive instant digital re-routing instructions, preventing overloaded trauma aprons."
  },
  {
    question: "How does Ayushman Bharat (ABHA) ID link patient medical records during transit?",
    answer:
      "When ambulance paramedics scan or enter a patient's ABHA identity number, NIVARAN queries authorized national health registries in real time. Critical flags—such as blood type, anticoagulation therapy, implanted pacemakers, and severe drug allergies—are highlighted directly on the receiving hospital console prior to bed assignment."
  },
  {
    question: "Is specialized proprietary hospital hardware required to run the console?",
    answer:
      "No proprietary hardware is required. The NIVARAN Emergency Console operates on standard hospital workstation browsers, dedicated ER wall-mounted monitors, and clinical tablets with strict zero-installation web standards and biometric single-sign-on (SSO)."
  }
];

export default function HospitalIntroductoryWebsite() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#1C1C19] font-sans antialiased selection:bg-[#E9DDFF] selection:text-[#23005C]">
      {/* ── Fixed Clinical Header ────────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 bg-[#FCF9F4]/90 backdrop-blur-xl border-b border-[#1F3D2B]/10 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#1F3D2B] flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-[24px]">emergency</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-[#082717] tracking-tight flex items-center gap-2">
                NIVARAN
                <span className="text-[10px] bg-[#1F3D2B]/10 text-[#1F3D2B] font-mono px-1.5 py-0.5 rounded border border-[#1F3D2B]/20 font-bold">
                  HOSPITAL OPS
                </span>
              </span>
              <span className="text-[11px] font-semibold text-[#424843] uppercase tracking-wider">
                Emergency Console
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-semibold">
            <a
              href="#overview"
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "overview"
                  ? "bg-[#EBE8E3] text-[#1C1C19]"
                  : "text-[#424843] hover:bg-[#F6F3EE] hover:text-[#1C1C19]"
              }`}
            >
              Overview
            </a>
            <a
              href="#coordination"
              onClick={() => setActiveTab("coordination")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "coordination"
                  ? "bg-[#EBE8E3] text-[#1C1C19]"
                  : "text-[#424843] hover:bg-[#F6F3EE] hover:text-[#1C1C19]"
              }`}
            >
              Clinical Coordination
            </a>
            <a
              href="#capabilities"
              onClick={() => setActiveTab("capabilities")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "capabilities"
                  ? "bg-[#EBE8E3] text-[#1C1C19]"
                  : "text-[#424843] hover:bg-[#F6F3EE] hover:text-[#1C1C19]"
              }`}
            >
              Capabilities
            </a>
            <a
              href="#trajectory"
              onClick={() => setActiveTab("trajectory")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "trajectory"
                  ? "bg-[#EBE8E3] text-[#1C1C19]"
                  : "text-[#424843] hover:bg-[#F6F3EE] hover:text-[#1C1C19]"
              }`}
            >
              Workflow Trajectory
            </a>
            <a
              href="#readiness"
              onClick={() => setActiveTab("readiness")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "readiness"
                  ? "bg-[#EBE8E3] text-[#1C1C19]"
                  : "text-[#424843] hover:bg-[#F6F3EE] hover:text-[#1C1C19]"
              }`}
            >
              Facility Readiness
            </a>
            <a
              href="#faq"
              onClick={() => setActiveTab("faq")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "faq"
                  ? "bg-[#EBE8E3] text-[#1C1C19]"
                  : "text-[#424843] hover:bg-[#F6F3EE] hover:text-[#1C1C19]"
              }`}
            >
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="http://localhost:3002/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6B38D4] hover:bg-[#8455EF] text-white font-bold text-xs uppercase tracking-wide transition-all shadow-md shadow-[#6B38D4]/25 hover:scale-[1.02] active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              <span>Access Hospital Console</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Main Introductory Content ────────────────────────────────────── */}
      <main className="w-full pt-20" id="overview">
        {/* Hero Section */}
        <section className="relative w-full pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Vision Copy & CTAs */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-[#EBE8E3] text-xs font-semibold shadow-sm border border-[#1F3D2B]/10">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] animate-ping"></span>
                <span className="font-mono text-[#082717] tracking-wider uppercase font-bold">
                  Pre-Hospital Telemetry Node Active
                </span>
                <span className="text-[#424843] hidden sm:inline">• Level-1 Regional Trauma Grid</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#082717] tracking-tight font-extrabold leading-[1.1]">
                Prepare Before the{" "}
                <span className="text-[#6B38D4] italic font-serif font-normal">Patient Arrives.</span>
              </h1>

              <p className="text-lg text-[#424843] max-w-2xl leading-relaxed">
                NIVARAN equips receiving trauma centres, emergency physicians, and triage coordinators with
                continuous real-time field telemetry, dynamic bay reservation locks, and direct paramedic communication
                while ambulances are en route.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="http://localhost:3002/login"
                  className="bg-[#082717] hover:bg-[#1F3D2B] text-white px-8 py-4 rounded-xl font-bold text-base shadow-xl transition-all inline-flex items-center gap-3 group active:scale-95"
                >
                  <span>Access Hospital Console</span>
                  <span className="material-symbols-outlined text-[20px] text-[#D0BCFF] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </a>

                <a
                  href="#coordination"
                  className="bg-[#F6F3EE] hover:bg-[#EBE8E3] text-[#082717] px-7 py-4 rounded-xl font-semibold text-base shadow-sm transition-all inline-flex items-center gap-2 border border-[#1F3D2B]/15"
                >
                  <span className="material-symbols-outlined text-[20px] text-[#6B38D4]">explore</span>
                  <span>Explore Clinical Coordination</span>
                </a>
              </div>

              {/* Micro Metrics Row */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="p-4 rounded-2xl bg-[#F6F3EE] border border-[#1F3D2B]/10 shadow-sm">
                  <span className="text-[11px] font-bold text-[#424843] uppercase tracking-wider block">
                    ETA Lead Window
                  </span>
                  <span className="text-3xl font-extrabold text-[#082717] block mt-1 font-mono">
                    14.6<span className="text-base text-[#6B38D4] font-sans">m</span>
                  </span>
                  <span className="text-xs text-[#424843] mt-0.5 block">Ahead of curbside arrival</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F6F3EE] border border-[#1F3D2B]/10 shadow-sm">
                  <span className="text-[11px] font-bold text-[#424843] uppercase tracking-wider block">
                    Telemetry Latency
                  </span>
                  <span className="text-3xl font-extrabold text-[#6B38D4] block mt-1 font-mono">
                    &lt;380<span className="text-base text-[#082717] font-sans">ms</span>
                  </span>
                  <span className="text-xs text-[#424843] mt-0.5 block">Continuous field sync</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F6F3EE] border border-[#1F3D2B]/10 shadow-sm">
                  <span className="text-[11px] font-bold text-[#424843] uppercase tracking-wider block">
                    Door-To-Balloon
                  </span>
                  <span className="text-3xl font-extrabold text-[#082717] block mt-1 font-mono">
                    -28%
                  </span>
                  <span className="text-xs text-[#424843] mt-0.5 block">Observed pre-activation</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity Clinical Hero Screen */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#6B38D4]/20 via-[#1F3D2B]/10 to-transparent blur-2xl rounded-3xl -z-10 pointer-events-none"></div>

              <div className="bg-white rounded-3xl p-6 shadow-2xl border border-[#1F3D2B]/15 relative flex flex-col gap-4">
                {/* Screen Header */}
                <div className="flex items-center justify-between pb-3 bg-[#F6F3EE] -mx-6 -mt-6 px-6 py-3.5 rounded-t-3xl border-b border-[#1F3D2B]/10">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#6B38D4] animate-pulse"></span>
                    <span className="font-extrabold text-sm text-[#082717] uppercase tracking-wider">
                      LIVE INBOUND DISPATCH
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#E9DDFF] text-[#23005C] font-mono text-xs font-bold tracking-wider">
                    UNIT MEDIC-09
                  </span>
                </div>

                {/* Priority & ETA Banner */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FFDAD6] text-[#93000A] border border-[#BA1A1A]/30">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[26px] text-[#BA1A1A]">warning</span>
                    <div>
                      <div className="text-sm font-extrabold text-[#BA1A1A] uppercase tracking-wider">
                        CRITICAL: STEMI ACUTE ALERT
                      </div>
                      <div className="text-xs text-[#93000A]/80">Inbound to Resus Bay #01 • Adult Male (58y)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#BA1A1A]">Apron ETA</div>
                    <div className="text-2xl font-extrabold text-[#BA1A1A] font-mono">07m 42s</div>
                  </div>
                </div>

                {/* Live 12-Lead ECG Stream Simulation */}
                <div className="p-4 rounded-2xl bg-[#082717] text-white flex flex-col gap-2 relative overflow-hidden shadow-inner">
                  <div className="flex items-center justify-between text-xs text-white/80 font-mono">
                    <span className="flex items-center gap-1.5 font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
                      LEAD II TELEMETRY • AMBULANCE TRANSIT
                    </span>
                    <span className="text-[#D0BCFF] font-bold">114 BPM • ST ELEVATION 2.4mm</span>
                  </div>

                  {/* Animated ECG Waveform */}
                  <div className="h-16 w-full relative flex items-center overflow-hidden">
                    <svg className="w-full h-full text-[#8B5CF6]" preserveAspectRatio="none" viewBox="0 0 500 80">
                      <path
                        className="opacity-95"
                        d="M 0,40 L 40,40 L 48,30 L 56,40 L 80,40 L 88,40 L 93,46 L 98,10 L 105,72 L 112,32 L 120,40 L 145,26 L 165,40 L 210,40 L 218,30 L 226,40 L 250,40 L 258,40 L 263,46 L 268,10 L 275,72 L 282,32 L 290,40 L 315,26 L 335,40 L 380,40 L 388,30 L 396,40 L 420,40 L 428,40 L 433,46 L 438,10 L 445,72 L 452,32 L 460,40 L 485,26 L 500,40"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                      />
                    </svg>
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#082717] to-transparent"></div>
                  </div>

                  {/* Paramedic Vitals Quad Grid */}
                  <div className="grid grid-cols-4 gap-2 pt-1 text-center font-mono text-xs">
                    <div className="bg-[#1F3D2B] py-1.5 rounded-lg border border-white/10">
                      <span className="text-white/60 text-[10px] block">BP</span>
                      <strong className="text-white">84/52</strong>
                    </div>
                    <div className="bg-[#1F3D2B] py-1.5 rounded-lg border border-white/10">
                      <span className="text-white/60 text-[10px] block">SpO2</span>
                      <strong className="text-white">91%</strong>
                    </div>
                    <div className="bg-[#1F3D2B] py-1.5 rounded-lg border border-white/10">
                      <span className="text-white/60 text-[10px] block">RR</span>
                      <strong className="text-white">26/m</strong>
                    </div>
                    <div className="bg-[#1F3D2B] py-1.5 rounded-lg border border-white/10">
                      <span className="text-white/60 text-[10px] block">GCS</span>
                      <strong className="text-[#D0BCFF]">14/15</strong>
                    </div>
                  </div>
                </div>

                {/* Interventional Bay Status Box */}
                <div className="p-4 rounded-2xl bg-[#F0EDE9] flex items-center justify-between border border-[#1F3D2B]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1F3D2B] flex items-center justify-center text-[#E9DDFF]">
                      <span className="material-symbols-outlined text-[22px]">medical_services</span>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#082717]">Cath Lab #2 Primed</div>
                      <div className="text-xs text-[#424843]">Dr. Aris Thorne (On-Apron Ready)</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#6B38D4] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                    Standby Verified
                  </span>
                </div>

                {/* Quick Link into App */}
                <a
                  href="http://localhost:3002/login"
                  className="w-full py-3 rounded-xl bg-[#082717] hover:bg-[#1F3D2B] text-white text-center text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span className="material-symbols-outlined text-[16px]">login</span>
                  <span>Enter Trauma Receiving Console</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Hospital Clinical Coordination (#coordination) ──────── */}
        <section className="w-full py-20 bg-[#F6F3EE] border-y border-[#1F3D2B]/10" id="coordination">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl flex flex-col gap-2">
                <span className="text-xs font-bold text-[#6B38D4] uppercase tracking-widest font-mono">
                  Bridging the Pre-Hospital Gap
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082717]">
                  Pre-Arrival Coordination: The Vital 15-Minute Horizon
                </h2>
                <p className="text-base text-[#424843] leading-relaxed">
                  When critical patients arrive unannounced, ER teams waste crucial minutes in scrambled triage.
                  NIVARAN connects emergency department directors, surgical teams, and telemetry leads directly to
                  ambulances while still en route.
                </p>
              </div>

              <div className="shrink-0">
                <span className="text-[11px] font-bold text-[#424843] uppercase tracking-wider block mb-1">
                  Grid Protocol
                </span>
                <span className="px-4 py-2.5 rounded-xl bg-white border border-[#1F3D2B]/15 text-sm font-bold text-[#082717] inline-flex items-center gap-2 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span>
                  Zero Intake Friction Mode
                </span>
              </div>
            </div>

            {/* 3 Clinical Role Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-7 rounded-3xl shadow-sm border border-[#1F3D2B]/10 flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-[#1F3D2B] text-[#D0BCFF] flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[28px]">stethoscope</span>
                </div>
                <h3 className="text-xl font-bold text-[#082717]">Emergency Department Physicians</h3>
                <p className="text-sm text-[#424843] leading-relaxed">
                  Review live pre-hospital waveforms, establish early diagnostic pathways, prescribe intermediate IV
                  medications to paramedics, and determine specific bay admissions before rubber meets hospital pavement.
                </p>
                <div className="mt-auto pt-4 border-t border-[#1F3D2B]/10 flex items-center justify-between text-[#6B38D4] text-xs font-bold">
                  <span>ACTIVE CLINICAL DIRECTIVE</span>
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
              </div>

              <div className="bg-white p-7 rounded-3xl shadow-sm border border-[#1F3D2B]/10 flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-[#1F3D2B] text-[#D0BCFF] flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[28px]">bed</span>
                </div>
                <h3 className="text-xl font-bold text-[#082717]">Triage Charge Coordinators</h3>
                <p className="text-sm text-[#424843] leading-relaxed">
                  Dynamically assign incoming trauma patients into resuscitation bays, lock negative pressure isolation
                  suites, and ensure respiratory therapists and phlebotomy teams are prepositioned in the bay corridor.
                </p>
                <div className="mt-auto pt-4 border-t border-[#1F3D2B]/10 flex items-center justify-between text-[#6B38D4] text-xs font-bold">
                  <span>CAPACITY LOCK TIMERS</span>
                  <span className="material-symbols-outlined text-[18px]">timelapse</span>
                </div>
              </div>

              <div className="bg-white p-7 rounded-3xl shadow-sm border border-[#1F3D2B]/10 flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-[#1F3D2B] text-[#D0BCFF] flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[28px]">monitor_heart</span>
                </div>
                <h3 className="text-xl font-bold text-[#082717]">Surgical &amp; Interventional Leads</h3>
                <p className="text-sm text-[#424843] leading-relaxed">
                  Trigger instant automated pages for the acute Cath Lab or Stroke CT suite. Bypassing ER registration
                  allows code STEMI and LVO stroke patients to be transferred directly to the intervention table.
                </p>
                <div className="mt-auto pt-4 border-t border-[#1F3D2B]/10 flex items-center justify-between text-[#6B38D4] text-xs font-bold">
                  <span>CATH LAB PRE-WARMING</span>
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: 9 Deep Bento Grid Capabilities (#capabilities) ────── */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-10" id="capabilities">
          <div className="flex flex-col gap-2 text-center items-center">
            <span className="text-xs font-bold text-[#6B38D4] uppercase tracking-widest font-mono">
              Clinical Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082717] max-w-xl">
              Engineered for Zero-Second Delay Resuscitation
            </h2>
            <p className="text-sm sm:text-base text-[#424843] max-w-2xl">
              Robust, deterministic coordination tools delivering end-to-end situational awareness across pre-hospital
              and receiving trauma systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#F6F3EE] p-6 rounded-3xl border border-[#1F3D2B]/10 flex flex-col gap-3 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-[30px] text-[#6B38D4]">speed</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span>
              </div>
              <h3 className="text-base font-bold text-[#082717]">Real-Time Inbound Notifications</h3>
              <p className="text-xs text-[#424843] leading-relaxed">
                Sub-second ETA countdown calculated with active traffic telemetry, turn-by-turn routing vectors, and
                vehicle telemetry tracking.
              </p>
            </div>

            <div className="bg-[#F6F3EE] p-6 rounded-3xl border border-[#1F3D2B]/10 flex flex-col gap-3 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-[30px] text-[#6B38D4]">vital_signs</span>
                <span className="px-2 py-0.5 rounded bg-[#E9DDFF] text-[#23005C] font-mono text-[10px] font-bold">
                  LIVE TELEMETRY
                </span>
              </div>
              <h3 className="text-base font-bold text-[#082717]">Pre-Arrival Vitals &amp; 12-Lead</h3>
              <p className="text-xs text-[#424843] leading-relaxed">
                Continuous streaming of SpO2, blood pressure cycles, capnography, and diagnostic 12-lead ECG strips
                straight into the ER workstation.
              </p>
            </div>

            <div className="bg-[#F6F3EE] p-6 rounded-3xl border border-[#1F3D2B]/10 flex flex-col gap-3 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-[30px] text-[#6B38D4]">meeting_room</span>
                <span className="text-[#424843] font-mono text-[11px] font-bold">BAY MGMT</span>
              </div>
              <h3 className="text-base font-bold text-[#082717]">Emergency Bed &amp; Bay Availability</h3>
              <p className="text-xs text-[#424843] leading-relaxed">
                Single-glance occupancy status for Resuscitation Bays 1–6 with automated reservation lockouts that prevent
                accidental double-booking.
              </p>
            </div>

            <div className="bg-[#F6F3EE] p-6 rounded-3xl border border-[#1F3D2B]/10 flex flex-col gap-3 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-[30px] text-[#6B38D4]">local_hospital</span>
                <span className="text-[#424843] font-mono text-[11px] font-bold">SURGE ACTIVE</span>
              </div>
              <h3 className="text-base font-bold text-[#082717]">ICU &amp; General Acute Capacity</h3>
              <p className="text-xs text-[#424843] leading-relaxed">
                Holistic cross-facility capacity visibility spanning Medical ICU, Neuro ICU, CCU, and floor step-downs to
                expedite downstream transfers.
              </p>
            </div>

            <div className="bg-[#F6F3EE] p-6 rounded-3xl border border-[#1F3D2B]/10 flex flex-col gap-3 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-[30px] text-[#6B38D4]">emergency_heat</span>
                <span className="px-2 py-0.5 rounded bg-[#E5E2DD] text-[#082717] font-mono text-[10px] font-bold">
                  PRE-WARM
                </span>
              </div>
              <h3 className="text-base font-bold text-[#082717]">Trauma Bay Automated Readiness</h3>
              <p className="text-xs text-[#424843] leading-relaxed">
                Automates room environment protocols: rapid blood warmer prep, massive transfusion protocol (MTP) paging,
                and scrub tech team callouts.
              </p>
            </div>

            <div className="bg-[#F6F3EE] p-6 rounded-3xl border border-[#1F3D2B]/10 flex flex-col gap-3 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-[30px] text-[#6B38D4]">radiology</span>
                <span className="px-2 py-0.5 rounded bg-[#6B38D4] text-white font-mono text-[10px] font-bold">
                  PRIORITY #1
                </span>
              </div>
              <h3 className="text-base font-bold text-[#082717]">Cath Lab &amp; Stroke CT Pre-Activation</h3>
              <p className="text-xs text-[#424843] leading-relaxed">
                Broadcast emergency alerts directly to neuro-interventionalists and interventional cardiologists to clear
                the CT scanner prior to arrival.
              </p>
            </div>

            <div className="bg-[#F6F3EE] p-6 rounded-3xl border border-[#1F3D2B]/10 flex flex-col gap-3 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-[30px] text-[#6B38D4]">alt_route</span>
                <span className="text-[#424843] font-mono text-[11px] font-bold">REGIONAL GRID</span>
              </div>
              <h3 className="text-base font-bold text-[#082717]">Hospital Acceptance &amp; Diversion Protocols</h3>
              <p className="text-xs text-[#424843] leading-relaxed">
                Broadcast authorized trauma diversion statuses with one-click administrative sign-off, instantly
                redirecting inbound field units across regional networks.
              </p>
            </div>

            <div className="bg-[#F6F3EE] p-6 rounded-3xl border border-[#1F3D2B]/10 flex flex-col gap-3 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-[30px] text-[#6B38D4]">headset_mic</span>
                <span className="text-[#424843] font-mono text-[11px] font-bold">ENCRYPTED</span>
              </div>
              <h3 className="text-base font-bold text-[#082717]">Direct Paramedic Tele-Medical Link</h3>
              <p className="text-xs text-[#424843] leading-relaxed">
                One-touch duplex audio and high-framerate field video enabling trauma directors to confirm intubation
                and ultrasound views.
              </p>
            </div>

            <div className="bg-[#F6F3EE] p-6 rounded-3xl border border-[#1F3D2B]/10 flex flex-col gap-3 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-[30px] text-[#6B38D4]">verified_user</span>
                <span className="text-[#424843] font-mono text-[11px] font-bold">AUDIT LOGGED</span>
              </div>
              <h3 className="text-base font-bold text-[#082717]">Digital Handover &amp; Audit Trail</h3>
              <p className="text-xs text-[#424843] leading-relaxed">
                Instant electronic signing and timestamped transfer of care logs, seamlessly archiving paramedic
                observations directly into hospital EHR systems.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 4: 5-Stage Chronological Trajectory (#trajectory) ─────── */}
        <section className="w-full py-20 bg-[#F6F3EE] border-y border-[#1F3D2B]/10" id="trajectory">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
            <div className="flex flex-col gap-2 text-center items-center">
              <span className="text-xs font-bold text-[#6B38D4] uppercase tracking-widest font-mono">
                Chronological Trajectory
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082717]">
                The 5-Stage Pre-Hospital to Resuscitation Protocol
              </h2>
              <p className="text-sm sm:text-base text-[#424843] max-w-xl">
                From the moment field EMS initiates transport to clinical handover in the hospital trauma suite.
              </p>
            </div>

            {/* 5 Stages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-2xl flex flex-col gap-3 shadow-sm border border-[#1F3D2B]/10">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 rounded bg-[#1F3D2B] text-white text-[10px] font-mono font-bold">
                    STAGE 01
                  </span>
                  <span className="material-symbols-outlined text-[#6B38D4] text-[20px]">near_me</span>
                </div>
                <h4 className="text-sm font-bold text-[#082717]">Vector Assigned</h4>
                <p className="text-xs text-[#424843] leading-relaxed">
                  Ambulance departs scene. GPS telemetry binds unit to the hospital receiving catchment sector.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl flex flex-col gap-3 shadow-sm border border-[#1F3D2B]/10">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 rounded bg-[#6B38D4] text-white text-[10px] font-mono font-bold">
                    STAGE 02
                  </span>
                  <span className="material-symbols-outlined text-[#6B38D4] text-[20px]">notifications_active</span>
                </div>
                <h4 className="text-sm font-bold text-[#082717]">Pre-Alert Broadcast</h4>
                <p className="text-xs text-[#424843] leading-relaxed">
                  ER charge console alerts with triage priority tier (ESI Level 1-5) and preliminary chief complaint.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl flex flex-col gap-3 shadow-sm border border-[#1F3D2B]/10">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 rounded bg-[#1F3D2B] text-white text-[10px] font-mono font-bold">
                    STAGE 03
                  </span>
                  <span className="material-symbols-outlined text-[#6B38D4] text-[20px]">ecg_heart</span>
                </div>
                <h4 className="text-sm font-bold text-[#082717]">Vitals &amp; ECG Review</h4>
                <p className="text-xs text-[#424843] leading-relaxed">
                  Physicians inspect 12-lead waveforms, verified ABHA records, and field interventions via live console.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl flex flex-col gap-3 shadow-sm border border-[#1F3D2B]/10">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 rounded bg-[#1F3D2B] text-white text-[10px] font-mono font-bold">
                    STAGE 04
                  </span>
                  <span className="material-symbols-outlined text-[#6B38D4] text-[20px]">task_alt</span>
                </div>
                <h4 className="text-sm font-bold text-[#082717]">Bay Lock Confirmed</h4>
                <p className="text-xs text-[#424843] leading-relaxed">
                  Trauma bay or Cath Lab confirms readiness; receiving bay is locked and scrub team is assembled.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl flex flex-col gap-3 shadow-sm border border-[#1F3D2B]/10">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 rounded bg-[#6B38D4] text-white text-[10px] font-mono font-bold">
                    STAGE 05
                  </span>
                  <span className="material-symbols-outlined text-[#6B38D4] text-[20px]">local_hospital</span>
                </div>
                <h4 className="text-sm font-bold text-[#082717]">Zero-Delay Handover</h4>
                <p className="text-xs text-[#424843] leading-relaxed">
                  Direct transfer into pre-warmed resuscitation bay with instant electronic chart sign-off.
                </p>
              </div>
            </div>

            {/* Curbside Elimination Metric Card */}
            <div className="w-full bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#1F3D2B]/10 flex flex-col lg:flex-row items-center gap-6">
              <div className="w-full lg:w-1/3 bg-[#1F3D2B] p-6 rounded-2xl text-white flex flex-col justify-between h-48 shadow-inner">
                <span className="text-[11px] font-bold text-[#D0BCFF] uppercase tracking-wider font-mono">
                  CLINICAL EFFICIENCY IMPACT
                </span>
                <div>
                  <span className="text-4xl font-extrabold text-[#C6F432] font-mono block">0 min</span>
                  <span className="text-xs text-white/80">Registration Delay at Curbside</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/90">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                  Direct Apron-to-Bay Transfer Protocol
                </div>
              </div>

              <div className="w-full lg:w-2/3 flex flex-col gap-3">
                <span className="text-xs font-bold text-[#6B38D4] uppercase tracking-wider font-mono">
                  Clinical Efficiency Metric
                </span>
                <h3 className="text-2xl font-extrabold text-[#082717]">
                  Eliminating Curbside Waiting Completely
                </h3>
                <p className="text-sm text-[#424843] leading-relaxed">
                  Traditional emergency handovers consume 18–35 minutes in triage corridors. With NIVARAN
                  pre-registration and clinical validation, patients bypass reception queues directly to assigned care units.
                </p>
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#8B5CF6]"></span>
                    <span className="text-xs font-bold text-[#082717]">Sub-380ms Telemetry Sync</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#1F3D2B]"></span>
                    <span className="text-xs font-bold text-[#082717]">100% EHR Audit Retention</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 5: Real-Time Facility Status & Capacity (#readiness) ───── */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-10" id="readiness">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-[#6B38D4] uppercase tracking-widest font-mono">
                Real-Time Facility Status
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082717]">
                Hospital Unit Allocation &amp; Capacity Monitor
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EBE8E3] text-[#082717] font-mono text-xs font-bold border border-[#1F3D2B]/10">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse"></span>
              AUTOSYNC: REFRESHED 2s AGO
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Module 1: Resuscitation Bays */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#1F3D2B]/10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-[#082717]">Resus Bays</span>
                <span className="px-2 py-0.5 rounded bg-[#E9DDFF] text-[#23005C] font-mono text-[10px] font-bold">
                  1 RESERVED
                </span>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#082717] font-mono">
                  3 <span className="text-sm font-normal text-[#424843]">/ 4 Available</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F0EDE9] mt-2 overflow-hidden flex">
                  <div className="h-full bg-[#1F3D2B] w-1/2"></div>
                  <div className="h-full bg-[#8B5CF6] w-1/4"></div>
                  <div className="h-full bg-[#E5E2DD] w-1/4"></div>
                </div>
              </div>
              <div className="space-y-1 text-xs text-[#424843]">
                <div className="flex justify-between py-1 bg-[#F6F3EE] px-2 rounded-lg">
                  <span>Bay 01:</span>
                  <span className="text-[#6B38D4] font-bold">Lock: Medic-09</span>
                </div>
                <div className="flex justify-between py-1 px-2">
                  <span>Bay 02:</span>
                  <span className="text-[#082717] font-bold">Ready / Standby</span>
                </div>
                <div className="flex justify-between py-1 px-2">
                  <span>Bay 03:</span>
                  <span className="text-[#082717] font-bold">Ready / Standby</span>
                </div>
              </div>
            </div>

            {/* Module 2: Cath Lab Suites */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#1F3D2B]/10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-[#082717]">Cath Lab Suites</span>
                <span className="px-2 py-0.5 rounded bg-[#6B38D4] text-white font-mono text-[10px] font-bold">
                  PRE-ACTIVATED
                </span>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#082717] font-mono">
                  1 <span className="text-sm font-normal text-[#424843]">/ 2 Standby</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F0EDE9] mt-2 overflow-hidden flex">
                  <div className="h-full bg-[#8B5CF6] w-1/2"></div>
                  <div className="h-full bg-[#1F3D2B] w-1/2"></div>
                </div>
              </div>
              <div className="space-y-1 text-xs text-[#424843]">
                <div className="flex justify-between py-1 bg-[#F6F3EE] px-2 rounded-lg">
                  <span>Lab 01:</span>
                  <span className="text-[#424843]">In Procedure (PCI)</span>
                </div>
                <div className="flex justify-between py-1 px-2">
                  <span>Lab 02:</span>
                  <span className="text-[#6B38D4] font-bold">Pre-Warmed (STEMI)</span>
                </div>
                <div className="flex justify-between py-1 px-2">
                  <span>Interventionalist:</span>
                  <span className="text-[#082717] font-bold">On Deck</span>
                </div>
              </div>
            </div>

            {/* Module 3: Trauma Operating Rooms */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#1F3D2B]/10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-[#082717]">Trauma OR</span>
                <span className="px-2 py-0.5 rounded bg-[#EBE8E3] text-[#082717] font-mono text-[10px] font-bold">
                  ACTIVE CAP
                </span>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#082717] font-mono">
                  2 <span className="text-sm font-normal text-[#424843]">/ 3 Open</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F0EDE9] mt-2 overflow-hidden flex">
                  <div className="h-full bg-[#1F3D2B] w-1/3"></div>
                  <div className="h-full bg-[#E5E2DD] w-2/3"></div>
                </div>
              </div>
              <div className="space-y-1 text-xs text-[#424843]">
                <div className="flex justify-between py-1 px-2">
                  <span>OR 01 (Trauma):</span>
                  <span className="text-[#082717] font-bold">Cleared &amp; Sterile</span>
                </div>
                <div className="flex justify-between py-1 px-2">
                  <span>OR 02 (Ortho):</span>
                  <span className="text-[#082717] font-bold">Cleared &amp; Sterile</span>
                </div>
                <div className="flex justify-between py-1 bg-[#F6F3EE] px-2 rounded-lg">
                  <span>OR 03 (Gen Surg):</span>
                  <span className="text-[#424843]">Occupied</span>
                </div>
              </div>
            </div>

            {/* Module 4: Stroke CT / Imaging */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#1F3D2B]/10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-[#082717]">Stroke CT</span>
                <span className="px-2 py-0.5 rounded bg-[#E9DDFF] text-[#23005C] font-mono text-[10px] font-bold">
                  CLEAR PATH
                </span>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#082717] font-mono">
                  READY <span className="text-sm font-normal text-[#424843]">Immediate</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F0EDE9] mt-2 overflow-hidden flex">
                  <div className="h-full bg-[#8B5CF6] w-full"></div>
                </div>
              </div>
              <div className="space-y-1 text-xs text-[#424843]">
                <div className="flex justify-between py-1 px-2">
                  <span>CT Scanner #1:</span>
                  <span className="text-[#6B38D4] font-bold">Holding for Acute</span>
                </div>
                <div className="flex justify-between py-1 px-2">
                  <span>MRI 3T:</span>
                  <span className="text-[#082717] font-bold">Routine Shift</span>
                </div>
                <div className="flex justify-between py-1 bg-[#F6F3EE] px-2 rounded-lg">
                  <span>Telestroke Link:</span>
                  <span className="text-[#082717] font-bold">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 6: Standards, Compliance & Clinical Integrity ────────── */}
        <section className="w-full py-20 bg-[#F6F3EE] border-y border-[#1F3D2B]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
            <div className="max-w-3xl flex flex-col gap-2">
              <span className="text-xs font-bold text-[#6B38D4] uppercase tracking-widest font-mono">
                Interoperability &amp; Safety
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082717]">
                Standards-Compliant Clinical Architecture
              </h2>
              <p className="text-base text-[#424843]">
                Built from the ground up to integrate cleanly into existing hospital electronic records and national
                digital health ecosystems without disrupting legacy workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-white rounded-3xl shadow-sm border border-[#1F3D2B]/10 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#6B38D4] text-[24px]">hub</span>
                  <span className="font-bold text-base text-[#082717]">HL7 / FHIR R4</span>
                </div>
                <p className="text-xs text-[#424843] leading-relaxed">
                  Full bi-directional synchronization with Epic, Cerner, and regional hospital information systems via open clinical data APIs.
                </p>
              </div>

              <div className="p-6 bg-white rounded-3xl shadow-sm border border-[#1F3D2B]/10 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#6B38D4] text-[24px]">badge</span>
                  <span className="font-bold text-base text-[#082717]">ABDM / ABHA ID</span>
                </div>
                <p className="text-xs text-[#424843] leading-relaxed">
                  Native integration with Ayushman Bharat Digital Mission identifiers for automated medical history and allergy cross-referencing.
                </p>
              </div>

              <div className="p-6 bg-white rounded-3xl shadow-sm border border-[#1F3D2B]/10 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#6B38D4] text-[24px]">security</span>
                  <span className="font-bold text-base text-[#082717]">HIPAA &amp; NDHM Ready</span>
                </div>
                <p className="text-xs text-[#424843] leading-relaxed">
                  End-to-end AES-256 data-in-transit encryption, granular role-based permissions, and localized regional cloud compliance.
                </p>
              </div>

              <div className="p-6 bg-white rounded-3xl shadow-sm border border-[#1F3D2B]/10 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#6B38D4] text-[24px]">history_edu</span>
                  <span className="font-bold text-base text-[#082717]">Clinical Audit Trails</span>
                </div>
                <p className="text-xs text-[#424843] leading-relaxed">
                  Immutable timestamping for diversion alerts, bay handovers, and telemetry reception for full medico-legal review integrity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 7: Frequently Asked Questions (#faq) ──────────────────── */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col gap-10" id="faq">
          <div className="text-center flex flex-col gap-2">
            <span className="text-xs font-bold text-[#6B38D4] uppercase tracking-widest font-mono">
              Clinical Clarifications
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082717]">Frequently Asked Questions</h2>
            <p className="text-sm sm:text-base text-[#424843]">
              Detailed operational parameters for hospital command centers, triage nurses, and medical directors.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#F6F3EE] rounded-2xl overflow-hidden border border-[#1F3D2B]/10 transition-colors shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 flex items-center justify-between text-left font-bold text-base text-[#082717] hover:text-[#6B38D4] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span
                      className={`material-symbols-outlined text-[24px] text-[#6B38D4] transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-0 text-[#424843] text-sm leading-relaxed border-t border-[#1F3D2B]/10 mt-2 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Section 8: Final Clinical Call-To-Action ─────────────────────── */}
        <section className="w-full py-24 bg-[#082717] text-white relative overflow-hidden">
          <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-[#6B38D4]/25 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-24 -top-24 w-96 h-96 rounded-full bg-[#6B38D4]/20 blur-3xl pointer-events-none"></div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F3D2B] text-[#D0BCFF] text-xs uppercase tracking-wider font-mono font-bold border border-white/10">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              Authorized Clinical Command Only
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white max-w-2xl leading-tight">
              Be Ready Before the Ambulance Arrives.
            </h2>

            <p className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed">
              Empowering receiving emergency departments, trauma chiefs, and triage coordinators with continuous
              pre-hospital telemetry.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <a
                href="http://localhost:3002/login"
                className="bg-white text-[#082717] hover:bg-[#8455EF] hover:text-white px-10 py-5 rounded-2xl font-bold text-base shadow-2xl transition-all duration-300 inline-flex items-center gap-3 group active:scale-95"
              >
                <span>Enter Hospital Console</span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </a>

              <a
                href="#coordination"
                className="text-white/90 hover:text-white px-8 py-5 rounded-2xl font-semibold text-base transition-colors flex items-center gap-2 border border-white/20"
              >
                <span>Review Specifications</span>
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </a>
            </div>

            <div className="pt-4 flex flex-wrap justify-center items-center gap-4 text-white/60 text-xs font-mono">
              <span>SECURE PROTOCOL 256-BIT</span>
              <span>•</span>
              <span>ISO 27001 CLINICAL ACCREDITED</span>
              <span>•</span>
              <span>EMERGENCY DISPATCH LIVE</span>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="w-full bg-[#F6F3EE] py-16 border-t border-[#1F3D2B]/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1F3D2B] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[18px]">emergency</span>
                </div>
                <span className="font-extrabold text-base text-[#082717]">NIVARAN</span>
              </div>
              <p className="text-xs text-[#424843] leading-relaxed">
                Advanced multi-facility clinical triage, trauma telemetry orchestration, and emergency operations control.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-[#424843]">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse"></span>
                <span>Emergency Telemetry Live: Node 04-HQ</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#082717] uppercase tracking-wider">Clinical Protocols</span>
              <ul className="flex flex-col gap-2 text-xs text-[#424843]">
                <li><a className="hover:text-[#082717] transition-colors" href="#">Trauma Level I-IV Ingestion</a></li>
                <li><a className="hover:text-[#082717] transition-colors" href="#">Surge Capacity &amp; Diversion</a></li>
                <li><a className="hover:text-[#082717] transition-colors" href="#">ESI Algorithmic Indexing</a></li>
                <li><a className="hover:text-[#082717] transition-colors" href="#">EMS Field Telemetry Link</a></li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#082717] uppercase tracking-wider">Cross-Portal Ecosystem</span>
              <ul className="flex flex-col gap-2 text-xs text-[#424843]">
                <li>
                  <Link className="hover:text-[#082717] transition-colors flex items-center gap-1" href="/intro">
                    Citizen Vision Website ↗
                  </Link>
                </li>
                <li>
                  <a className="hover:text-[#082717] transition-colors flex items-center gap-1" href="http://localhost:3001/intro">
                    Dispatcher CAD Website ↗
                  </a>
                </li>
                <li>
                  <a className="hover:text-[#082717] transition-colors flex items-center gap-1 font-bold text-[#6B38D4]" href="http://localhost:3002/login">
                    Hospital Staff Sign-In ↗
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#082717] uppercase tracking-wider">Hospital Command</span>
              <p className="text-xs text-[#424843]">Direct dispatcher hotline &amp; trauma room routing desk.</p>
              <div className="p-3 rounded-xl bg-white border border-[#1F3D2B]/10 flex flex-col gap-1 shadow-sm">
                <span className="text-[10px] font-bold text-[#424843] uppercase">24/7 Ops Dispatch</span>
                <span className="text-sm font-bold text-[#082717] font-mono">+1 (800) 843-NVN-ER</span>
                <span className="text-xs text-[#424843]">dispatch@nivaran-emergency.org</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-[#1F3D2B]/10 text-xs text-[#424843]">
            <span>© 2025 NIVARAN Health Technologies. ISO 27001 Certified Clinical Architecture.</span>
            <div className="flex items-center gap-6">
              <a className="hover:text-[#082717] transition-colors" href="#">Terms of Clinical Operation</a>
              <a className="hover:text-[#082717] transition-colors" href="#">Emergency Data Privacy</a>
              <a className="hover:text-[#082717] transition-colors" href="#">System Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

