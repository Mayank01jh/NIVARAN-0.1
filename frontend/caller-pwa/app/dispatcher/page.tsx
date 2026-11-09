"use client";
/**
 * NIVARAN (निवारण) — Dispatcher Command Centre Introductory Website
 * Faithful React/TypeScript implementation of Google Stitch Design:
 * nivaran_dispatcher_command_centre_introductory_website (tactical_operations_white)
 *
 * 60:30:10 Colour System:
 * - 60% Midnight Black: #0B0B0C
 * - 30% Pure White: #FFFFFF
 * - 10% Lime Green: #C6F432
 *
 * Primary CTA: Enter Command Centre -> https://nivaran-dispatcher.vercel.app/login
 */

import React, { useState } from "react";
import Link from "next/link";

const DISPATCH_FAQS = [
  {
    id: "cad-faq-1",
    q: "How does the CAD platform achieve sub-150ms incident ingestion?",
    a: "NIVARAN bypasses heavy synchronous REST gateways by deploying asynchronous WebSocket and UDP telemetry pipelines. Coordinates, caller audio descriptors, and device telemetry are ingested straight into high-throughput memory buffers with automatic failover.",
  },
  {
    id: "cad-faq-2",
    q: "How are Advanced Life Support (ALS) vs Basic Life Support (BLS) units matched?",
    a: "The recommendation engine checks clinical triage indicators (e.g. STEMI, acute respiratory distress, severe hemorrhagic trauma) against vehicle payload manifests, clinician certifications, and current GNSS proximity to dispatch ALS when required.",
  },
  {
    id: "cad-faq-3",
    q: "Can a unit be reassigned mid-route if a more critical emergency erupts?",
    a: "Yes. Dispatchers maintain real-time dynamic override authority. If a Code Black cardiac arrest triggers within 2km of an en-route unit attending a low-acuity call, the CAD engine highlights the critical delta and allows 1-click tactical rerouting.",
  },
  {
    id: "cad-faq-4",
    q: "How does the system coordinate with receiving hospital trauma bays?",
    a: "Every assigned transit continuously streams ETA countdowns and paramedic vitals into the Hospital ED console, verifying bed availability, cath lab readiness, and diversion status before patient handover.",
  },
];

export default function DispatcherIntroWebsite() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<string | null>("cad-faq-1");

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white font-sans antialiased selection:bg-[#C6F432] selection:text-[#0B0B0C]">
      {/* ── Fixed Command Header ────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 bg-[#121316]/95 backdrop-blur-md border-b border-white/10 shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
        <div className="h-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#181A1F] px-2.5 py-1 rounded-lg border border-white/10">
              <img
                src="/nivaran-icon.png"
                alt="NIVARAN"
                className="w-7 h-7 object-contain rounded bg-[#0B0B0C] p-0.5"
              />
              <span className="font-mono text-xs font-extrabold text-[#C6F432] tracking-wider uppercase">
                NIVARAN // CAD
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#C6F432]/10 rounded border border-[#C6F432]/30">
              <span className="w-2 h-2 rounded-full bg-[#C6F432] animate-pulse"></span>
              <span className="font-mono text-[10px] text-[#C6F432] uppercase font-bold tracking-tight">
                OP-READY // ACTIVE
              </span>
            </div>
          </div>

          <nav className="hidden xl:flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
            <a href="#overview" className="px-3 py-1.5 rounded bg-white/10 text-white">
              Overview
            </a>
            <a href="#capabilities" className="px-3 py-1.5 rounded text-white/60 hover:text-white hover:bg-white/5 transition-colors">
              Capabilities
            </a>
            <a href="#workflow" className="px-3 py-1.5 rounded text-white/60 hover:text-white hover:bg-white/5 transition-colors">
              Workflow
            </a>
            <a href="#network" className="px-3 py-1.5 rounded text-white/60 hover:text-white hover:bg-white/5 transition-colors">
              Fleet Network
            </a>
            <a href="#faq" className="px-3 py-1.5 rounded text-white/60 hover:text-white hover:bg-white/5 transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Primary CTA */}
            <a
              href="https://nivaran-dispatcher.vercel.app/login"
              className="px-4 py-2 bg-[#C6F432] hover:bg-[#AEE01E] text-[#0B0B0C] font-headline text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              <span>Enter Command Centre</span>
            </a>

            <a
              href="https://nivaran-dispatcher.vercel.app/login"
              className="w-8 h-8 rounded-full bg-[#181A1F] border border-white/10 flex items-center justify-center text-[#C6F432] hover:bg-white/10 transition-colors"
              title="CAD Desk Sign In"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <main className="w-full pt-16" id="overview">
        {/* HERO COMMAND MODULE */}
        <section className="relative w-full bg-[#121316] text-white pt-14 pb-20 border-b border-white/10 overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #C6F432 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          ></div>
          <div className="absolute -top-32 right-10 w-96 h-96 bg-[#C6F432]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Status Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#181A1F] rounded-lg border border-white/10 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#C6F432] animate-ping"></span>
                <span className="font-mono text-xs text-[#C6F432] tracking-wider uppercase font-bold">
                  SECTOR_ALPHA // DISPATCH GRID ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-4 font-mono text-xs text-white/60">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-[#C6F432]">satellite_alt</span>
                  GNSS LOCK: 12-SAT
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-[#C6F432]">bolt</span>
                  LATENCY: 34ms
                </span>
              </div>
            </div>

            {/* Hero Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-12">
              <div className="lg:col-span-7 space-y-6">
                <div className="text-xs uppercase tracking-widest text-[#C6F432] font-mono font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">sensors</span>
                  TACTICAL EMERGENCY OPERATING SYSTEM
                </div>

                <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  One Command Centre. <br />
                  <span className="text-[#C6F432]">Every Emergency Connected.</span>
                </h1>

                <p className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed">
                  Coordinate critical incidents, dynamically deploy Advanced Life Support vectors, and synchronize level-1 trauma suites via a unified, zero-latency computer-aided dispatch framework.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="https://nivaran-dispatcher.vercel.app/login"
                    className="bg-[#C6F432] hover:bg-[#AEE01E] text-[#0B0B0C] px-8 py-4 rounded-xl font-headline text-sm font-extrabold uppercase tracking-wider shadow-xl transition-all inline-flex items-center gap-3 transform hover:-translate-y-0.5 active:scale-95"
                  >
                    <span>Enter Command Centre</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </a>

                  <a
                    href="#workflow"
                    className="bg-[#181A1F] hover:bg-[#22252C] text-white px-8 py-4 rounded-xl font-headline text-sm font-bold tracking-wider uppercase border border-white/10 transition-all inline-flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">account_tree</span>
                    <span>Explore CAD Architecture</span>
                  </a>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 pt-4 max-w-lg">
                  <div className="p-3.5 bg-[#181A1F] rounded-xl border border-white/10">
                    <div className="font-mono text-[#C6F432] font-bold text-lg">&lt; 150 ms</div>
                    <div className="font-mono text-white/50 uppercase text-[10px]">SOS Ingestion</div>
                  </div>
                  <div className="p-3.5 bg-[#181A1F] rounded-xl border border-white/10">
                    <div className="font-mono text-[#C6F432] font-bold text-lg">99.999%</div>
                    <div className="font-mono text-white/50 uppercase text-[10px]">Failover Uptime</div>
                  </div>
                  <div className="p-3.5 bg-[#181A1F] rounded-xl border border-white/10">
                    <div className="font-mono text-[#C6F432] font-bold text-lg">18 / 26</div>
                    <div className="font-mono text-white/50 uppercase text-[10px]">Active Units Free</div>
                  </div>
                </div>
              </div>

              {/* Simulated Tactical Map Screen */}
              <div className="lg:col-span-5 relative">
                <div className="bg-[#181A1F] rounded-2xl border border-white/10 shadow-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#BA1A1A]"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C6F432]"></span>
                      <span className="font-mono text-xs text-white tracking-widest uppercase font-bold ml-1">
                        GIS_MATRIX // VECTOR MONITOR
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#C6F432] px-2 py-0.5 bg-[#C6F432]/10 rounded font-bold">
                      AUTO_REFRESH: 1Hz
                    </span>
                  </div>

                  <div className="relative w-full h-72 bg-[#0B0B0C] rounded-xl border border-white/10 p-3 flex flex-col justify-between overflow-hidden">
                    {/* Concentric Radar Rings */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                      <div className="w-64 h-64 rounded-full border border-[#C6F432] absolute"></div>
                      <div className="w-44 h-44 rounded-full border border-[#C6F432] absolute"></div>
                      <div className="w-24 h-24 rounded-full border border-[#C6F432] absolute"></div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-white/80">
                      <span className="bg-[#181A1F] px-2 py-0.5 rounded border border-white/10">
                        ZONE: DELHI NCR METRO
                      </span>
                      <span className="text-[#C6F432] font-bold">14 DISPATCHES RESOLVED</span>
                    </div>

                    {/* Nodes */}
                    <div className="relative z-10 space-y-2.5">
                      <div className="p-3 bg-[#BA1A1A]/20 border border-[#BA1A1A]/50 rounded-xl flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[20px] text-[#F87171] shrink-0 animate-pulse">
                          crisis_alert
                        </span>
                        <div>
                          <div className="font-mono text-[10px] text-[#F87171] uppercase font-bold">
                            P1 // STEMI CODE BLACK · CONNAUGHT PLACE
                          </div>
                          <div className="text-xs text-white font-medium">
                            UNIT-1081 ALS EN ROUTE (ETA: 2m 14s)
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-[#181A1F] border border-white/15 rounded-xl flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[20px] text-[#C6F432] shrink-0">
                          car_crash
                        </span>
                        <div>
                          <div className="font-mono text-[10px] text-[#C6F432] uppercase font-bold">
                            P2 // HIGHWAY COLLISION · RING ROAD
                          </div>
                          <div className="text-xs text-white/80 font-medium">
                            UNIT-1082 ALS DISPATCH ACKNOWLEDGED
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-white/50 pt-2 border-t border-white/10">
                      <span>TELEMETRY: GREEN-WAVE LOCKED</span>
                      <span className="text-[#C6F432]">AI CORRIDOR CLEAR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 9 CORE PILLARS OF CAD OPERATIONS (#capabilities) ────── */}
        <section className="w-full py-20 bg-[#0B0B0C] border-b border-white/10" id="capabilities">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#181A1F] rounded border border-white/10">
                <span className="material-symbols-outlined text-[16px] text-[#C6F432]">tune</span>
                <span className="font-mono text-xs uppercase tracking-wider text-white">
                  Integrated CAD Suite
                </span>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Nine Core Pillars of Mission-Critical Operations
              </h2>
              <p className="text-base text-white/70">
                Built for zero-failure public safety operations. Each capability functions autonomously and synchronizes instantaneously across the state-wide emergency fabric.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  code: "CAP-01 // INGESTION",
                  title: "Centralized Incident Monitoring",
                  desc: "Real-time telemetry aggregation across telephonic SOS, emergency citizen apps, automatic crash sensors, and regional panic relays.",
                  stat: "< 150ms Ingestion Latency",
                  icon: "hub",
                },
                {
                  code: "CAP-02 // QUEUE ENGINE",
                  title: "Dynamic Priority Queue",
                  desc: "Auto-sorting incident hopper governed by clinical triage markers, respiratory distress levels, and traumatic arrest indicators.",
                  stat: "Deterministic Triaging",
                  icon: "view_timeline",
                },
                {
                  code: "CAP-03 // GEOSPATIAL",
                  title: "GNSS Fleet Telemetry",
                  desc: "Continuous sub-meter position streams from vehicle in-cab terminals, monitoring velocity, fuel levels, and current crew operational readiness.",
                  stat: "High-Precision Kinematics",
                  icon: "satellite_alt",
                },
                {
                  code: "CAP-04 // INTELLIGENCE",
                  title: "Dynamic Unit Reassignment",
                  desc: "Intelligent redirection of staging units if higher-tier P1 cardiac emergencies erupt in adjacent sectors while en-route to minor calls.",
                  stat: "Dynamic Sector Optimization",
                  icon: "alt_route",
                },
                {
                  code: "CAP-05 // MATCHING",
                  title: "Algorithmic ALS / BLS Matching",
                  desc: "Automatically matches pediatric, cardiac, or neuro trauma events to ambulances certified with appropriate medical payloads and licensed staff.",
                  stat: "Protocol-Level Matching",
                  icon: "medical_services",
                },
                {
                  code: "CAP-06 // RECEIVING",
                  title: "Hospital Trauma Bay Selection",
                  desc: "Live telemetry query into receiving facility capacity: cath-lab availability, CT scanner uptime, ICU bed readiness, and divert status.",
                  stat: "Direct Diversion Avoidance",
                  icon: "domain_add",
                },
                {
                  code: "CAP-07 // CORRIDORS",
                  title: "Green Wave Signal Interlock",
                  desc: "Real-time interface with municipal ITS traffic signaling engines to clear intersection vectors ahead of high-speed code-3 convoys.",
                  stat: "ITS Traffic Preemption",
                  icon: "traffic",
                },
                {
                  code: "CAP-08 // IN-CAB TERMINAL",
                  title: "Paramedic In-Cab Workflow",
                  desc: "Ruggedized touch interface for paramedics to acknowledge dispatch, navigate curbside, record vitals, and execute clinical handovers.",
                  stat: "End-to-End Digital Audit",
                  icon: "tablet_mac",
                },
                {
                  code: "CAP-09 // AUDIT & COMPLIANCE",
                  title: "APCO / NENA Audit Trail",
                  desc: "Immutable cryptographic logging of every operator keystroke, dispatch timestamp, unit response delta, and voice call recording.",
                  stat: "Legal & Clinical Compliance",
                  icon: "security",
                },
              ].map((cap, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-[#121316] rounded-2xl border border-white/10 hover:border-[#C6F432]/60 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#181A1F] border border-white/10 flex items-center justify-center text-[#C6F432] group-hover:bg-[#C6F432] group-hover:text-[#0B0B0C] transition-colors">
                      <span className="material-symbols-outlined text-[24px]">{cap.icon}</span>
                    </div>
                    <div className="font-mono text-[10px] text-white/50 uppercase tracking-wider">
                      {cap.code}
                    </div>
                    <h3 className="font-headline text-lg font-bold text-white">{cap.title}</h3>
                    <p className="text-xs text-white/70 leading-relaxed">{cap.desc}</p>
                  </div>
                  <div className="pt-5 font-mono text-[11px] text-[#C6F432] font-bold uppercase flex items-center gap-1 border-t border-white/5 mt-4">
                    <span>{cap.stat}</span>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CAD WORKFLOW TIMELINE (#workflow) ────────────────────── */}
        <section className="w-full py-20 bg-[#121316] text-white border-b border-white/10" id="workflow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs uppercase font-bold text-[#C6F432] font-mono tracking-widest">
                Life-Saving Execution Sequence
              </span>
              <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white">
                Deterministic 5-Step CAD Lifecycle
              </h2>
              <p className="text-sm sm:text-base text-white/70">
                Every emergency follows an uncompromising sequence from caller beacon to hospital bay.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { step: "01", name: "Beacon Ingestion", detail: "Sub-second GPS & voice triage tagged into active queue." },
                { step: "02", name: "Algorithmic Match", detail: "Haversine matrix isolates nearest certified ALS unit." },
                { step: "03", name: "Crew Alert & En Route", detail: "In-cab terminal rings, crew acknowledges and begins route." },
                { step: "04", name: "Curbside & Telemetry", detail: "Paramedics stabilize patient, stream 12-lead vitals to ED." },
                { step: "05", name: "Trauma Handover", detail: "Direct wheel-in to pre-staged trauma bay without re-triage delay." },
              ].map((item, idx) => (
                <div key={idx} className="p-5 bg-[#181A1F] rounded-2xl border border-white/10 space-y-2">
                  <span className="font-mono text-2xl font-black text-[#C6F432]">{item.step}</span>
                  <h4 className="font-headline font-bold text-sm text-white">{item.name}</h4>
                  <p className="text-xs text-white/60 leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FREQUENTLY ASKED QUESTIONS (#faq) ───────────────────── */}
        <section className="w-full bg-[#0B0B0C] py-20 border-b border-white/10" id="faq">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-bold text-[#C6F432] font-mono tracking-widest">
                Operations &amp; Compliance
              </span>
              <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white">
                Dispatch Protocol FAQ
              </h2>
            </div>

            <div className="space-y-3">
              {DISPATCH_FAQS.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-[#121316] rounded-2xl border border-white/10 overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="w-full text-left p-5 flex justify-between items-center gap-4 cursor-pointer"
                    >
                      <span className="font-headline font-bold text-sm sm:text-base text-white">{faq.q}</span>
                      <span
                        className={`material-symbols-outlined text-[#C6F432] text-[20px] transition-transform duration-200 shrink-0 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-white/70 leading-relaxed border-t border-white/5 pt-3 animate-fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FINAL CALL TO ACTION ─────────────────────────────────── */}
        <section className="w-full py-20 bg-[#121316] text-center border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs uppercase font-bold text-[#C6F432] font-mono tracking-widest">
              Live Gateway Access
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
              Step Into the CAD Command Centre
            </h2>
            <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto leading-relaxed">
              Launch the live dispatcher console or authenticate an ambulance crew terminal to manage real-time incident queues across Delhi NCR.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href="https://nivaran-dispatcher.vercel.app/login"
                className="px-8 py-4 rounded-xl bg-[#C6F432] hover:bg-[#AEE01E] text-[#0B0B0C] font-headline text-sm font-extrabold uppercase tracking-wider shadow-xl transition-all inline-flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">terminal</span>
                <span>Enter Command Centre</span>
              </a>

              <Link
                href="/login"
                className="px-6 py-4 rounded-xl bg-[#181A1F] hover:bg-[#22252C] text-white font-headline text-xs font-bold uppercase tracking-wider border border-white/10 transition-all inline-flex items-center gap-2"
              >
                <span>Citizen Portal ↗</span>
              </Link>

              <a
                href="https://nivaran-hospital.vercel.app/login"
                className="px-6 py-4 rounded-xl bg-[#181A1F] hover:bg-[#22252C] text-white font-headline text-xs font-bold uppercase tracking-wider border border-white/10 transition-all inline-flex items-center gap-2"
              >
                <span>Hospital Console ↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="w-full bg-[#0B0B0C] py-12 border-t border-white/10 text-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <img
                  src="/nivaran-icon.png"
                  alt="NIVARAN"
                  className="w-7 h-7 object-contain rounded bg-[#181A1F] p-0.5"
                />
                <span className="font-mono text-sm font-bold text-white uppercase">NIVARAN // CAD</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                High-velocity computer-aided dispatch workstation for mission-critical telemetry, GIS situational matrices, and clinical rapid response.
              </p>
              <div className="font-mono text-[10px] text-[#C6F432]">GATEWAY: CAD-LOCAL-3001</div>
            </div>

            <div className="space-y-2">
              <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-white">Operations</h4>
              <ul className="space-y-1.5 text-xs text-white/60">
                <li><a href="#overview" className="hover:text-white transition-colors">Overview</a></li>
                <li><a href="#capabilities" className="hover:text-white transition-colors">Tactical Capabilities</a></li>
                <li><a href="#workflow" className="hover:text-white transition-colors">5-Step CAD Lifecycle</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-white">Architecture</h4>
              <ul className="space-y-1.5 text-xs text-white/60">
                <li><a href="#workflow" className="hover:text-white transition-colors">Triage &amp; Dispatch Engine</a></li>
                <li><a href="#network" className="hover:text-white transition-colors">Fleet Telemetry Grid</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">Dispatch Protocol FAQ</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-white">Terminal Link</h4>
              <div className="p-3 bg-[#181A1F] rounded-xl border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>SYS_PORT</span>
                  <span className="text-[#C6F432] font-bold">:3001</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>HEARTBEAT</span>
                  <span className="text-[#C6F432] font-bold">SYNCHRONIZED</span>
                </div>
                <a
                  href="https://nivaran-dispatcher.vercel.app/login"
                  className="w-full py-2 bg-[#0B0B0C] hover:bg-black text-[#C6F432] font-mono text-[11px] font-bold uppercase rounded-lg border border-[#C6F432]/30 flex items-center justify-center transition-all"
                >
                  Direct Gateway Auth
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-white/40">
            <div>SEC-ID: CAD-OPS-LEVEL4 · PROTOCOL: APCO/NENA COMPLIANT</div>
            <div>© 2026 NIVARAN EMERGENCY TELEMETRY &amp; DISPATCH SYSTEMS.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
