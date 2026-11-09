"use client";
/**
 * NIVARAN (निवारण) — Official Citizen Vision & Platform Introductory Website
 * Faithful React/TypeScript implementation of Google Stitch Design:
 * nivaran_citizen_vision_introductory_website (warm_editorial_healthcare)
 *
 * 60:30:10 Colour System:
 * - 60% Cream: #F4EDE0
 * - 30% Navy: #14213D
 * - 10% Coral: #FF6B5B
 *
 * Primary CTA: Open Citizen Portal -> /login
 */

import React, { useState } from "react";
import Link from "next/link";

interface EcosystemNodeDetail {
  tag: string;
  title: string;
  description: string;
  protocol: string;
  latency: string;
}

const NODE_DETAILS: Record<string, EcosystemNodeDetail> = {
  citizen: {
    tag: "CITIZEN SOS BEACON TERMINAL",
    title: "1-Second Continuous Hold & Hands-Free AI Voice Triage",
    description: "Broadcasts sub-meter GNSS coordinates and encrypted medical emergency tokens directly to CAD within 380ms. Operates with zero login friction.",
    protocol: "WSS / HTTPS E2EE (AES-256)",
    latency: "< 380ms",
  },
  dispatch: {
    tag: "CENTRAL CAD COMMAND ENGINE",
    title: "Haversine Distance Matching & Nearest ALS Unit Deployment",
    description: "Evaluates Delhi NCR fleet topology, traffic corridor congestion, and unit capability matrices to auto-assign the optimal advanced life support vehicle in seconds.",
    protocol: "CAD Inter-Agency API",
    latency: "< 150ms",
  },
  ambulance: {
    tag: "MOBILE ICU PARAMEDIC FLEET",
    title: "En-Route Vitals Streaming & Turn-by-Turn Telemetry",
    description: "Transmits real-time 12-lead ECG, blood pressure, SpO2, and respiratory metrics directly to receiving hospital trauma bay while following AI green-wave corridors.",
    protocol: "Cellular 5G M2M Bridge",
    latency: "500ms intervals",
  },
  hospital: {
    tag: "LEVEL-1 TRAUMA RECEIVING SUITE",
    title: "Cath Lab, OR & Resuscitation Bay Pre-Arrival Activation",
    description: "Emergency surgical teams review live incoming casualty telemetry, prepare O-negative blood reserves, and stage trauma bays before curbside ambulance arrival.",
    protocol: "HL7 / FHIR Clinical Sync",
    latency: "Real-time sync",
  },
};

const FAQS = [
  {
    id: "faq-1",
    q: "Do I need an account or login to call for emergency help?",
    a: "No. NIVARAN enforces a strict zero-barrier emergency policy. During an acute crisis, seconds cannot be wasted remembering passwords, recovering accounts, or entering credentials. Trigger the SOS hold button or bilingual voice hotline directly, and coordinates are routed to CAD immediately.",
  },
  {
    id: "faq-2",
    q: "How does the 1-second hold prevent accidental triggers?",
    a: "Pocket dials cause immense strain on public emergency dispatchers. NIVARAN uses a continuous 1-second physical or screen hold accompanied by an animated haptic pulse. If pressure is released before 1.0 second, the trigger immediately cancels without alerting dispatch.",
  },
  {
    id: "faq-3",
    q: "Does NIVARAN work without high-speed mobile internet?",
    a: "Yes. When high-bandwidth cellular data is unavailable or spotty, the NIVARAN engine automatically packages coordinates and triage tags into an encrypted fallback SMS payload and cellular tower signaling, ensuring your location reaches CAD even on 2G edge networks.",
  },
  {
    id: "faq-4",
    q: "How are my medical profile and location protected?",
    a: "All patient identifiers, blood group information, and coordinates are encrypted using AES-256 in transit and at rest. Data is shared exclusively with accredited dispatchers, assigned paramedics, and receiving trauma hospitals for the duration of the emergency call.",
  },
];

export default function CitizenIntroWebsite() {
  const [selectedNode, setSelectedNode] = useState<string>("citizen");
  const [openFaq, setOpenFaq] = useState<string | null>("faq-1");

  const currentNode = NODE_DETAILS[selectedNode];

  return (
    <div className="min-h-screen bg-[#FFF9EE] text-[#1E1B14] font-sans antialiased selection:bg-[#FF6B5B] selection:text-white">
      {/* ── Fixed Header ────────────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 bg-[#FFF9EE]/90 backdrop-blur-xl border-b border-[#14213D]/10 shadow-[0_1px_8px_rgba(20,33,61,0.04)]">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/nivaran-icon.png"
              alt="NIVARAN"
              className="w-10 h-10 object-contain rounded-xl shadow-sm bg-[#14213D] border border-white/20 p-1"
            />
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl text-[#000A24] tracking-tight leading-none">
                NIVARAN
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#45464D] font-bold mt-1">
                National Trauma Continuum
              </span>
            </div>
          </div>

          <nav className="hidden xl:flex items-center gap-1.5 text-xs font-semibold">
            <a href="#hero" className="px-3.5 py-2 rounded-lg bg-[#14213D] text-white transition-colors">
              Home
            </a>
            <a href="#vision" className="px-3.5 py-2 rounded-lg text-[#45464D] hover:text-[#000A24] hover:bg-[#F4EDE0] transition-colors">
              Our Vision
            </a>
            <a href="#how-it-works" className="px-3.5 py-2 rounded-lg text-[#45464D] hover:text-[#000A24] hover:bg-[#F4EDE0] transition-colors">
              How It Works
            </a>
            <a href="#features" className="px-3.5 py-2 rounded-lg text-[#45464D] hover:text-[#000A24] hover:bg-[#F4EDE0] transition-colors">
              Features
            </a>
            <a href="#ecosystem" className="px-3.5 py-2 rounded-lg text-[#45464D] hover:text-[#000A24] hover:bg-[#F4EDE0] transition-colors">
              Ecosystem
            </a>
            <a href="#faq" className="px-3.5 py-2 rounded-lg text-[#45464D] hover:text-[#000A24] hover:bg-[#F4EDE0] transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Primary CTA */}
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[#AE3026] hover:bg-[#8C1712] text-white text-xs font-bold rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              Open Citizen Portal
            </Link>

            <Link
              href="/login"
              className="w-9 h-9 rounded-full bg-[#14213D] flex items-center justify-center text-white shadow-sm hover:bg-[#000A24] transition-colors"
              title="Citizen Sign In"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Body ──────────────────────────────────────────────── */}
      <main className="w-full pt-20" id="hero">
        {/* HERO SECTION */}
        <section className="relative w-full bg-[#F4EDE0] py-16 lg:py-24 overflow-hidden border-b border-[#14213D]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Editorial Headline & Actions */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9E2D5] border border-[#14213D]/10 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#AE3026] animate-ping"></span>
                  <span className="text-[11px] text-[#000A24] uppercase font-bold tracking-widest">
                    National Golden Hour Protocol
                  </span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#000A24] leading-[1.08] tracking-tight">
                  When Every Second Matters,{" "}
                  <span className="text-[#AE3026] italic font-normal">NIVARAN</span> Responds.
                </h1>

                <p className="text-base sm:text-lg text-[#45464D] max-w-xl leading-relaxed">
                  Unifying citizens in critical moments with algorithmic dispatchers, field paramedics, and receiving trauma hospitals into an unbroken continuum of care.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/login"
                    className="bg-[#000A24] hover:bg-[#14213D] text-[#F4EDE0] px-8 py-4 rounded-full font-headline text-base font-bold shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-3 transform hover:-translate-y-0.5"
                  >
                    <span>Open Citizen Portal</span>
                    <span className="material-symbols-outlined text-[#FF6B5B] text-[20px]">arrow_forward</span>
                  </Link>

                  <a
                    href="#vision"
                    className="px-8 py-4 rounded-full font-headline text-base font-bold text-[#000A24] bg-[#E9E2D5] hover:bg-[#E0D9CD] transition-all"
                  >
                    Explore Our Vision
                  </a>
                </div>

                {/* Micro-telemetry Status Bar */}
                <div className="pt-4 grid grid-cols-3 gap-3 max-w-lg">
                  <div className="bg-[#FAF3E6] p-3 rounded-xl border border-[#14213D]/10 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-[#45464D] block">Carrier Latency</span>
                    <p className="font-headline font-bold text-base text-[#000A24] mt-0.5">&lt; 380ms</p>
                  </div>
                  <div className="bg-[#FAF3E6] p-3 rounded-xl border border-[#14213D]/10 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-[#45464D] block">CAD Dispatch Sync</span>
                    <p className="font-headline font-bold text-base text-[#AE3026] mt-0.5">Instantaneous</p>
                  </div>
                  <div className="bg-[#FAF3E6] p-3 rounded-xl border border-[#14213D]/10 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-[#45464D] block">Pre-Arrival Feed</span>
                    <p className="font-headline font-bold text-base text-[#000A24] mt-0.5">Bi-Directional</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Connected Continuum Graphic */}
              <div className="lg:col-span-5 relative">
                <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-[#14213D]/10 overflow-hidden">
                  <div className="flex items-center justify-between pb-4 border-b border-[#14213D]/10">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#AE3026] text-[22px]">emergency</span>
                      <span className="text-[11px] uppercase font-bold text-[#000A24] tracking-wider">
                        Live Continuum Matrix
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFDAD5] text-[#410001] text-[10px] font-bold">
                      SOVEREIGN NETWORK
                    </span>
                  </div>

                  {/* Graphic Pipeline Flow */}
                  <div className="space-y-4 pt-4 relative">
                    <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-[#E9E2D5] z-0"></div>

                    {/* Node 1 */}
                    <div className="relative z-10 flex items-start gap-4 bg-[#FAF3E6] p-3.5 rounded-2xl border border-[#14213D]/5">
                      <div className="w-11 h-11 rounded-full bg-[#AE3026] text-white flex items-center justify-center shrink-0 shadow-md">
                        <span className="material-symbols-outlined text-[22px]">touch_app</span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-headline font-bold text-sm text-[#000A24]">Citizen SOS Beacon</h4>
                          <span className="text-[9px] px-2 py-0.5 bg-[#E9E2D5] rounded-full text-[#45464D] font-bold">
                            1-SEC HOLD
                          </span>
                        </div>
                        <p className="text-xs text-[#45464D] leading-snug">
                          Sub-second GPS vector broadcast. Zero login or credential roadblock.
                        </p>
                      </div>
                    </div>

                    {/* Node 2 */}
                    <div className="relative z-10 flex items-start gap-4 bg-[#FAF3E6] p-3.5 rounded-2xl border border-[#14213D]/5">
                      <div className="w-11 h-11 rounded-full bg-[#000A24] text-white flex items-center justify-center shrink-0 shadow-md">
                        <span className="material-symbols-outlined text-[22px]">hub</span>
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-headline font-bold text-sm text-[#000A24]">Haversine CAD Router</h4>
                        <p className="text-xs text-[#45464D] leading-snug">
                          Real-time corridor optimization and automated nearest ALS fleet match.
                        </p>
                      </div>
                    </div>

                    {/* Node 3 */}
                    <div className="relative z-10 flex items-start gap-4 bg-[#FAF3E6] p-3.5 rounded-2xl border border-[#14213D]/5">
                      <div className="w-11 h-11 rounded-full bg-[#14213D] text-white flex items-center justify-center shrink-0 shadow-md">
                        <span className="material-symbols-outlined text-[22px]">ambulance</span>
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-headline font-bold text-sm text-[#000A24]">En-Route Mobile ICU</h4>
                        <p className="text-xs text-[#45464D] leading-snug">
                          Real-time green-wave coordination &amp; continuous clinical vitals uplink.
                        </p>
                      </div>
                    </div>

                    {/* Node 4 */}
                    <div className="relative z-10 flex items-start gap-4 bg-[#FAF3E6] p-3.5 rounded-2xl border border-[#14213D]/5">
                      <div className="w-11 h-11 rounded-full bg-[#FC6959] text-white flex items-center justify-center shrink-0 shadow-md">
                        <span className="material-symbols-outlined text-[22px]">local_hospital</span>
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-headline font-bold text-sm text-[#000A24]">Trauma ER Readiness</h4>
                        <p className="text-xs text-[#45464D] leading-snug">
                          Pre-arrival 12-lead ECG telemetry pre-activates cath lab &amp; surgical team.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 bg-[#E9E2D5]/50 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#45464D] uppercase text-[10px]">Continuous Telemetry Bridge</span>
                    <span className="font-bold text-[#000A24] font-mono">100% Deterministic Sync</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── OUR VISION SECTION (#vision) ─────────────────────────── */}
        <section className="w-full bg-[#FAF3E6] py-20 border-b border-[#14213D]/10" id="vision">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-0.5 bg-[#AE3026]"></span>
                <span className="text-xs uppercase font-bold text-[#000A24] tracking-widest">
                  Architectural Purpose
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000A24] leading-snug">
                Transforming pre-hospital emergency care across India’s{" "}
                <span className="text-[#AE3026] italic font-normal">Golden Hour</span> through zero-latency synchronization.
              </h2>
              <p className="text-base sm:text-lg text-[#45464D] leading-relaxed">
                Conventional emergency response fails not from lack of medical skill, but from communication gaps between panicked callers, distant dispatchers, and uninformed hospital triage bays. NIVARAN replaces fragmented friction with unified certainty.
              </p>
            </div>

            {/* 3 Solved Frictions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-[#14213D]/5 group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4EDE0] flex items-center justify-center text-[#000A24] group-hover:bg-[#000A24] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[26px]">pin_drop</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#AE3026] font-bold block mb-1">
                      Friction 01 Resolved
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#000A24]">
                      Location Articulation Friction
                    </h3>
                  </div>
                  <p className="text-sm text-[#45464D] leading-relaxed">
                    In severe shock, victims cannot identify landmarks or spell local streets. NIVARAN eliminates landmark descriptions via ambient sub-second carrier and GPS locks that pinpoint coordinates with meter-level accuracy.
                  </p>
                </div>
                <div className="mt-6 pt-3 bg-[#E9E2D5]/30 rounded-xl px-3 py-2 text-[11px] font-bold text-[#000A24]">
                  Eliminated: Landmark Guesswork
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-[#14213D]/5 group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4EDE0] flex items-center justify-center text-[#000A24] group-hover:bg-[#000A24] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[26px]">alt_route</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#AE3026] font-bold block mb-1">
                      Friction 02 Resolved
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#000A24]">
                      Manual Dispatch Bottlenecks
                    </h3>
                  </div>
                  <p className="text-sm text-[#45464D] leading-relaxed">
                    Traditional telephonic handoffs take upwards of five minutes. Algorithmic unit matching utilizes real-time road topology, historical congestion patterns, and live capability matrices to deploy the ideal vehicle in seconds.
                  </p>
                </div>
                <div className="mt-6 pt-3 bg-[#E9E2D5]/30 rounded-xl px-3 py-2 text-[11px] font-bold text-[#000A24]">
                  Eliminated: Manual Operator Calling
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-[#14213D]/5 group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4EDE0] flex items-center justify-center text-[#000A24] group-hover:bg-[#000A24] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[26px]">vital_signs</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#AE3026] font-bold block mb-1">
                      Friction 03 Resolved
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#000A24]">
                      Hospital Information Vacuum
                    </h3>
                  </div>
                  <p className="text-sm text-[#45464D] leading-relaxed">
                    Trauma surgical suites often only learn patient conditions upon ambulance arrival. NIVARAN streams live vitals, incident telemetry, and ETA countdowns directly to the receiving team to prime the cath lab before wheel-in.
                  </p>
                </div>
                <div className="mt-6 pt-3 bg-[#E9E2D5]/30 rounded-xl px-3 py-2 text-[11px] font-bold text-[#000A24]">
                  Eliminated: ER Surprise Arrivals
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW NIVARAN WORKS: 4-STAGE CONTINUUM (#how-it-works) ── */}
        <section className="w-full bg-[#F4EDE0] py-20 border-b border-[#14213D]/10" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="text-xs uppercase font-bold text-[#AE3026] tracking-widest">
                  Deterministic Architecture
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000A24]">
                  The 4-Stage Continuum
                </h2>
              </div>
              <p className="text-sm sm:text-base text-[#45464D] max-w-md">
                A synchronized pathway executed simultaneously across mobile endpoints, cloud dispatch engines, emergency fleets, and hospital trauma boards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stage 01 */}
              <div className="bg-white rounded-3xl p-7 shadow-sm space-y-4 border border-[#14213D]/5">
                <div className="flex justify-between items-start">
                  <span className="font-display text-4xl text-[#E9E2D5] font-bold leading-none select-none">
                    01
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#FFDAD5] text-[#410001] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">touch_app</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-headline font-bold text-base text-[#000A24]">SOS Inception</h4>
                  <span className="text-xs text-[#AE3026] uppercase font-bold block">1-Sec Hold &amp; AI Voice</span>
                </div>
                <p className="text-xs text-[#45464D] leading-relaxed">
                  The citizen initiates an SOS via a 1-second continuous hold (preventing pocket dials) or initiates hands-free Hindi/English speech intake with instant symptom parsing.
                </p>
              </div>

              {/* Stage 02 */}
              <div className="bg-white rounded-3xl p-7 shadow-sm space-y-4 border border-[#14213D]/5">
                <div className="flex justify-between items-start">
                  <span className="font-display text-4xl text-[#E9E2D5] font-bold leading-none select-none">
                    02
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#D9E2FF] text-[#0D1B36] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-headline font-bold text-base text-[#000A24]">CAD Verification</h4>
                  <span className="text-xs text-[#000A24] uppercase font-bold block">Geofence Telemetry</span>
                </div>
                <p className="text-xs text-[#45464D] leading-relaxed">
                  Dispatcher CAD console ingests verified device coordinates, runs haversine distance matching, and isolates the nearest qualified Advanced Life Support vehicle.
                </p>
              </div>

              {/* Stage 03 */}
              <div className="bg-white rounded-3xl p-7 shadow-sm space-y-4 border border-[#14213D]/5">
                <div className="flex justify-between items-start">
                  <span className="font-display text-4xl text-[#E9E2D5] font-bold leading-none select-none">
                    03
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#E9E2D5] text-[#000A24] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">navigation</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-headline font-bold text-base text-[#000A24]">Green-Wave En-Route</h4>
                  <span className="text-xs text-[#000A24] uppercase font-bold block">Live Vitals Streaming</span>
                </div>
                <p className="text-xs text-[#45464D] leading-relaxed">
                  Ambulance rolls with traffic-clearing turn-by-turn navigation. En-route paramedics stream SpO2, blood pressure, and triage tags directly via onboard cellular uplink.
                </p>
              </div>

              {/* Stage 04 */}
              <div className="bg-white rounded-3xl p-7 shadow-sm space-y-4 border border-[#14213D]/5">
                <div className="flex justify-between items-start">
                  <span className="font-display text-4xl text-[#E9E2D5] font-bold leading-none select-none">
                    04
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#AE3026] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">medical_services</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-headline font-bold text-base text-[#000A24]">Trauma Suite Primed</h4>
                  <span className="text-xs text-[#AE3026] uppercase font-bold block">Zero Transfer Delay</span>
                </div>
                <p className="text-xs text-[#45464D] leading-relaxed">
                  Receiving surgical team verifies incoming 12-lead ECG, blood group demand, and burns/trauma classification. Cath lab prepared before patient passes hospital threshold.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── KEY FEATURES GRID (#features) ────────────────────────── */}
        <section className="w-full bg-[#FFF9EE] py-20 border-b border-[#14213D]/10" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs uppercase font-bold text-[#AE3026] tracking-widest">
                Built for Calm Authority
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000A24]">
                Critical Features Engineered for Zero Frustration
              </h2>
              <p className="text-sm sm:text-base text-[#45464D]">
                In high-adrenaline situations, software complexity costs lives. NIVARAN enforces simplicity through rigorous cognitive load optimization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: "timer_10_alt_1",
                  title: "One-Touch Emergency Assistance",
                  desc: "Proprietary 1-second press-and-hold trigger. Provides tactile and haptic reassurance while eradicating false-positive pocket activations entirely.",
                  highlight: true,
                },
                {
                  icon: "my_location",
                  title: "GPS-Based Ambient Sharing",
                  desc: "Zero manual typing required. Cellular trilateration combined with device satellite fix delivers latitude and longitude instantly to the CAD screen.",
                  highlight: false,
                },
                {
                  icon: "radar",
                  title: "Live Ambulance Tracking",
                  desc: "Transparent minute-by-minute countdown with driver name, vehicle registration number, and live map view keeps the caller centered and informed.",
                  highlight: true,
                },
                {
                  icon: "sync_saved_locally",
                  title: "Emergency Status Updates",
                  desc: "Discrete visual phases: Dispatched, En Route, On Scene, Transit to Hospital, keeping family members constantly updated.",
                  highlight: false,
                },
                {
                  icon: "record_voice_over",
                  title: "Voice-Assisted Bilingual Intake",
                  desc: "Ambient clinical entity extraction parses symptoms in Hindi and English simultaneously, generating immediate clinical triage notes for incoming paramedics.",
                  highlight: true,
                },
                {
                  icon: "translate",
                  title: "Multilingual Accessibility",
                  desc: "Engineered to operate reliably across India’s diverse linguistic landscape, ensuring emergency medical support is never gated behind language comprehension.",
                  highlight: false,
                },
              ].map((feat, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF3E6] rounded-3xl p-7 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 border border-[#14213D]/5"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm ${
                      feat.highlight ? "text-[#AE3026]" : "text-[#000A24]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[26px]">{feat.icon}</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-headline font-bold text-lg text-[#000A24]">{feat.title}</h3>
                    <p className="text-xs text-[#45464D] leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONNECTED EMERGENCY ECOSYSTEM (#ecosystem) ──────────── */}
        <section className="w-full bg-[#000A24] py-20 text-[#F4EDE0] overflow-hidden" id="ecosystem">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs uppercase font-bold text-[#FFDAD5] tracking-widest">
                Network Topology
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                The Bidirectional Emergency Ecosystem
              </h2>
              <p className="text-sm sm:text-base text-white/70">
                Click any of the four nodes below to inspect live telemetry specifications, transmission protocols, and latency guarantees.
              </p>
            </div>

            {/* Interactive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: "citizen", name: "Citizen Terminal", icon: "cell_tower", sub: "Direct SOS beacon & speech hotline" },
                { id: "dispatch", name: "CAD Command", icon: "desktop_windows", sub: "Incident triangulation & fleet router" },
                { id: "ambulance", name: "Paramedic Fleet", icon: "directions_car", sub: "Live vitals uplink & transit telemetry" },
                { id: "hospital", name: "Trauma Center", icon: "domain", sub: "Pre-arrival triage & cath lab activation" },
              ].map((node) => {
                const isActive = selectedNode === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    className={`p-6 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
                      isActive
                        ? "bg-white text-[#000A24] border-[#FF6B5B] shadow-2xl scale-[1.02]"
                        : "bg-[#14213D] text-white/90 border-white/10 hover:border-white/30 hover:bg-[#182748]"
                    }`}
                  >
                    <div className="flex items-center justify-between pb-3">
                      <span
                        className={`material-symbols-outlined text-[30px] ${
                          isActive ? "text-[#AE3026]" : "text-white"
                        }`}
                      >
                        {node.icon}
                      </span>
                      <span
                        className={`w-3 h-3 rounded-full ${
                          isActive ? "bg-[#AE3026]" : "bg-white/40"
                        }`}
                      ></span>
                    </div>
                    <h4 className="font-headline font-bold text-base">{node.name}</h4>
                    <p className={`text-xs mt-1 ${isActive ? "text-[#45464D]" : "text-white/60"}`}>
                      {node.sub}
                    </p>
                    <div
                      className={`mt-4 pt-2 text-[11px] font-bold flex items-center gap-1 ${
                        isActive ? "text-[#AE3026]" : "text-[#FF6B5B]"
                      }`}
                    >
                      <span>{isActive ? "Active Inspection" : "Inspect Protocol"}</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Telemetry Panel */}
            <div className="bg-[#14213D] rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold text-[#FFDAD5] tracking-widest font-mono">
                    {currentNode.tag}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white">{currentNode.title}</h3>
                  <p className="text-sm text-white/70 max-w-2xl leading-relaxed">{currentNode.description}</p>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                  <div className="bg-[#000A24] p-3 rounded-xl border border-white/10">
                    <span className="text-[10px] text-white/50 uppercase block font-bold">Standard</span>
                    <span className="font-mono text-xs font-bold text-[#FF6B5B]">{currentNode.protocol}</span>
                  </div>
                  <div className="bg-[#000A24] p-3 rounded-xl border border-white/10">
                    <span className="text-[10px] text-white/50 uppercase block font-bold">Latency</span>
                    <span className="font-mono text-xs font-bold text-white">{currentNode.latency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FREQUENTLY ASKED QUESTIONS (#faq) ───────────────────── */}
        <section className="w-full bg-[#FAF3E6] py-20 border-b border-[#14213D]/10" id="faq">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-bold text-[#AE3026] tracking-widest">
                Public Information
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000A24]">
                Frequently Asked Questions
              </h2>
              <p className="text-sm sm:text-base text-[#45464D]">
                Clear answers regarding citizen privacy, operational mechanisms, and emergency procedures.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl overflow-hidden border border-[#14213D]/10 shadow-sm transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="w-full text-left p-5 sm:p-6 flex justify-between items-center gap-4 focus:outline-none cursor-pointer"
                    >
                      <span className="font-headline font-bold text-base text-[#000A24]">{faq.q}</span>
                      <span
                        className={`material-symbols-outlined text-[#000A24] text-[22px] transition-transform duration-200 shrink-0 ${
                          isOpen ? "rotate-180 text-[#AE3026]" : ""
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 text-sm text-[#45464D] leading-relaxed border-t border-[#14213D]/5 pt-3 animate-fade-in">
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
        <section className="w-full py-20 bg-[#F4EDE0] text-center border-b border-[#14213D]/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs uppercase font-bold text-[#AE3026] tracking-widest">
              Ready When You Need Us Most
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000A24]">
              Experience the Future of Indian Emergency Care
            </h2>
            <p className="text-base text-[#45464D] max-w-xl mx-auto leading-relaxed">
              Open the Citizen Emergency Lifeline or explore the connected ecosystem nodes across the National Trauma Continuum.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/login"
                className="px-8 py-4 rounded-full bg-[#AE3026] hover:bg-[#8C1712] text-white font-headline text-base font-bold shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-3 transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Open Citizen Portal</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>

              <a
                href="https://nivaran-dispatcher.vercel.app/login"
                className="px-6 py-4 rounded-full bg-[#14213D] hover:bg-[#000A24] text-white font-headline text-sm font-bold shadow-md transition-all inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[#C6F432] text-[18px]">terminal</span>
                <span>Enter CAD Command Centre</span>
              </a>

              <a
                href="https://nivaran-hospital.vercel.app/login"
                className="px-6 py-4 rounded-full bg-[#1F3D2B] hover:bg-[#14281C] text-white font-headline text-sm font-bold shadow-md transition-all inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[#8B5CF6] text-[18px]">domain</span>
                <span>Access Hospital Console</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Professional Footer ────────────────────────────────────── */}
      <footer className="w-full bg-[#EEE7DB] text-[#1E1B14] py-12 border-t border-[#14213D]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/nivaran-icon.png"
                  alt="NIVARAN"
                  className="w-8 h-8 object-contain rounded-lg bg-[#14213D] border border-white/20 p-0.5"
                />
                <span className="font-display font-bold text-lg text-[#000A24]">NIVARAN</span>
              </div>
              <p className="text-xs text-[#45464D] max-w-sm leading-relaxed">
                A centralized, dignified digital health initiative engineered to ensure coordinated trauma response, continuum surveillance, and sovereign citizen healthcare readiness nationwide.
              </p>
              <div className="p-3 rounded-xl bg-[#FAF3E6] border border-[#14213D]/10 max-w-sm">
                <p className="text-[10px] uppercase font-bold text-[#000A24]">Statutory Emergency Protocol</p>
                <p className="text-[11px] text-[#45464D] mt-0.5">
                  NIVARAN serves as an emergency care orchestration system. For active life-threatening crises in progress, dial 112 immediately.
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-2">
              <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-[#000A24]">
                Vision Navigation
              </h4>
              <ul className="space-y-1.5 text-xs text-[#45464D]">
                <li><a href="#vision" className="hover:text-[#000A24] transition-colors">National Mandate &amp; Charter</a></li>
                <li><a href="#how-it-works" className="hover:text-[#000A24] transition-colors">Continuum Protocol</a></li>
                <li><a href="#features" className="hover:text-[#000A24] transition-colors">Diagnostic Architecture</a></li>
                <li><a href="#ecosystem" className="hover:text-[#000A24] transition-colors">Clinical Vision Network</a></li>
                <li><a href="#faq" className="hover:text-[#000A24] transition-colors">Citizen Registry FAQ</a></li>
              </ul>
            </div>

            <div className="lg:col-span-4 space-y-2">
              <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-[#000A24]">
                Ecosystem Portals
              </h4>
              <ul className="space-y-1.5 text-xs text-[#45464D]">
                <li><Link href="/login" className="hover:text-[#AE3026] font-semibold transition-colors">Citizen Emergency Portal</Link></li>
                <li><a href="https://nivaran-dispatcher.vercel.app/login" className="hover:text-[#000A24] font-semibold transition-colors">Dispatcher CAD Command Centre ↗</a></li>
                <li><a href="https://nivaran-hospital.vercel.app/login" className="hover:text-[#1F3D2B] font-semibold transition-colors">Hospital Emergency Console ↗</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#14213D]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#45464D]">
            <p>© 2026 NIVARAN Healthcare Initiative. Sovereign Emergency Infrastructure. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-[#000A24] transition-colors cursor-pointer">Privacy Charter</span>
              <span>·</span>
              <span className="hover:text-[#000A24] transition-colors cursor-pointer">Institutional Governance</span>
              <span>·</span>
              <span className="hover:text-[#000A24] transition-colors cursor-pointer">Accessibility Standards</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

