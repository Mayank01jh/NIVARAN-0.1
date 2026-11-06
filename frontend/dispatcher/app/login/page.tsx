"use client";
/**
 * NIVARAN (निवारण) — Ambulance Crew & Dispatcher Secure Sign-in
 * 60:30:10: 60% Midnight Black #0B0B0C | 30% Pure White #FFFFFF | 10% Lime Green #C6F432
 *
 * Demo credentials:
 *  Crew PIN: 1234
 *  3 wrong PINs → 15-second lockout
 *
 * Security simulation:
 *  Vehicle binding → GPS lock → Shift roster → Encrypted WebSocket
 */

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* ─── types ─── */
type View = "form" | "scan" | "done";

const UNITS = [
  "DL-01-AMB-1081",
  "DL-02-AMB-1082",
  "DL-03-AMB-1083",
  "DL-04-AMB-1084",
  "CAD desk, Central sector",
];

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 items-start mt-5 text-xs text-white/40">
      <span className="shrink-0">🔒</span>
      <span>{children}</span>
    </div>
  );
}

/* ─── 4-dot PIN indicator ─── */
function PinDots({ filled }: { filled: number }) {
  return (
    <div className="flex gap-3 justify-center my-4">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`w-4 h-4 rounded-full border-2 transition-all ${
            i < filled
              ? "bg-[#C6F432] border-[#C6F432] scale-110"
              : "border-[#C6F432]/50"
          }`}
        />
      ))}
    </div>
  );
}

/* ─── Numeric keypad ─── */
function Keypad({ onPress }: { onPress: (key: string) => void }) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"];
  return (
    <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
      {keys.map((k) => (
        <button
          key={k}
          onClick={() => onPress(k)}
          className={`py-3.5 rounded-xl border text-xl font-headline font-bold transition-all active:scale-95 ${
            k === "C"
              ? "border-white/10 bg-[#1a1c22] text-white/50 text-sm"
              : k === "⌫"
              ? "border-white/10 bg-[#1a1c22] text-white/70"
              : "border-white/10 bg-[#181A1F] text-white hover:bg-[#C6F432] hover:text-[#0B0B0C] hover:border-[#C6F432]"
          }`}
        >
          {k}
        </button>
      ))}
    </div>
  );
}

/* ─── Scan checklist ─── */
function ScanChecklist({ unit, onDone }: { unit: string; onDone: () => void }) {
  const steps = [
    "PIN accepted",
    `Vehicle ${unit.split(",")[0]} bound to device`,
    "GPS lock acquired",
    "Shift roster confirmed",
    "Encrypted WebSocket open",
  ];
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (current >= steps.length) {
      setProgress(100);
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
    setProgress(((current + 0.5) / steps.length) * 100);
    const t = setTimeout(() => setCurrent((c) => c + 1), 650);
    return () => clearTimeout(t);
  }, [current]);

  return (
    <div>
      <h2 className="font-headline text-2xl font-extrabold text-white">
        Binding vehicle and crew
      </h2>
      <p className="text-sm text-white/50 mt-1 mb-3">
        Please keep this screen open.
      </p>
      <ul className="divide-y divide-white/10">
        {steps.map((s, i) => {
          const done = i < current;
          const running = i === current && current < steps.length;
          return (
            <li
              key={s}
              className={`flex items-center gap-3 py-3 text-sm transition-colors ${
                done || running ? "text-white" : "text-white/35"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full border-2 flex-none relative transition-all ${
                  done
                    ? "bg-[#C6F432] border-[#C6F432]"
                    : running
                    ? "border-[#C6F432] border-t-transparent animate-spin"
                    : "border-white/20"
                }`}
              >
                {done && (
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="#0B0B0C"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="font-medium">{s}</span>
            </li>
          );
        })}
      </ul>
      <div className="mt-5 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#C6F432] rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════ */
export default function DispatcherLoginPage() {
  const router = useRouter();
  const [view, setView] = useState<View>("form");
  const [unit, setUnit] = useState(UNITS[0]);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [lockMsg, setLockMsg] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    try {
      const s = localStorage.getItem("nivaran_dispatcher_session");
      if (s) {
        const parsed = JSON.parse(s);
        if (parsed.authenticated) {
          if (parsed.role === "CREW") {
            router.replace("/crew");
          } else {
            router.replace("/");
          }
        }
      }
    } catch {}
  }, [router]);

  useEffect(() => {
    if (!lockedUntil) return;
    const t = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) { setLockedUntil(0); setLockMsg(""); }
      else setLockMsg(`Unit locked. Wait ${remaining}s.`);
    }, 500);
    return () => clearInterval(t);
  }, [lockedUntil]);

  function doShake() {
    setShake(false);
    requestAnimationFrame(() => setShake(true));
    setTimeout(() => { setShake(false); setPin(""); }, 400);
  }

  function handleKey(k: string) {
    if (Date.now() < lockedUntil) return;
    setErr("");
    if (k === "C") return setPin("");
    if (k === "⌫") return setPin((p) => p.slice(0, -1));
    if (pin.length >= 4) return;
    const next = pin + k;
    setPin(next);

    if (next.length === 4) {
      if (next === "1234") {
        setView("scan");
      } else {
        const nextAtt = attempts + 1;
        setAttempts(nextAtt);
        doShake();
        if (nextAtt >= 3) {
          setLockedUntil(Date.now() + 15000);
          setAttempts(0);
          setErr("Three wrong PINs. Unit locked for 15 seconds.");
        } else {
          setErr(`Wrong PIN. ${3 - nextAtt} attempt${3 - nextAtt > 1 ? "s" : ""} left.`);
        }
      }
    }
  }

  const locked = Date.now() < lockedUntil;

  return (
    <div className="min-h-[100dvh] bg-[#0B0B0C] font-body">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <Image src="/nivaran-icon.png" alt="NIVARAN" width={32} height={32} className="rounded-lg bg-[#121316] p-0.5 border border-white/10" />
        <span className="font-headline font-extrabold text-lg text-white tracking-tight uppercase">
          NIVARAN CAD
        </span>
        <span className="ml-auto text-xs text-white/40 font-mono">
          Dispatch Command Centre
        </span>
      </header>

      {/* Layout */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 p-5 md:py-8">
        {/* Brand panel */}
        <aside className="bg-[#121316] border border-white/10 rounded-2xl p-8 flex flex-col justify-between min-h-[320px] md:min-h-[540px] overflow-hidden relative">
          <div>
            <h1 className="font-headline text-2xl md:text-[28px] font-extrabold text-white leading-snug max-w-[18ch]">
              Every ambulance and dispatcher is bound to a verified unit.
            </h1>
            <p className="text-white/50 text-sm mt-3 max-w-[34ch]">
              Crew PIN, vehicle binding and a live GPS check run before dispatch
              orders appear.
            </p>

            {/* Shield */}
            <div className="relative w-36 h-36 mt-6">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-[#C6F432] animate-ring"
                  style={{ animationDelay: `${i}s` }}
                />
              ))}
              <svg
                className="absolute inset-6 w-24 h-24 text-[#C6F432]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M12 2l8 3v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5z" />
                <path d="M8 12h2l1.5-3 2 6L15 12h1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="flex gap-2 flex-wrap mt-4">
              {["GPS verified", "Vehicle-bound", "Encrypted WS", "Shift-locked"].map((b) => (
                <span key={b} className="text-xs border border-white/15 rounded-full px-3 py-1 text-white/60">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* ECG */}
          <svg className="w-full h-14 mt-auto" viewBox="0 0 300 60" preserveAspectRatio="none">
            <path
              pathLength="1"
              d="M0 30H60L75 30L85 10L100 50L112 30H180L195 30L205 15L218 42L228 30H300"
              fill="none"
              stroke="#C6F432"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1"
              strokeDashoffset="1"
              className="animate-ecg"
            />
          </svg>
        </aside>

        {/* Card */}
        <section
          className={`bg-[#121316] border border-white/10 rounded-2xl p-7 flex flex-col justify-center min-h-[320px] transition-transform ${
            shake ? "animate-shake" : ""
          }`}
        >
          {/* ── FORM ── */}
          {view === "form" && (
            <div className="animate-fade-in">
              <h2 className="font-headline text-2xl font-extrabold text-white">
                Crew and dispatcher sign in
              </h2>
              <p className="text-sm text-white/50 mt-1 mb-5">
                Choose your unit, then enter your PIN
              </p>

              <label className="block text-xs font-bold text-white/70 mb-1.5">
                Unit or desk
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-white/10 bg-[#181A1F] text-white font-medium focus:border-[#C6F432] focus:outline-none transition-colors mb-5"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u} className="bg-[#181A1F]">
                    {u}
                  </option>
                ))}
              </select>

              <label className="block text-xs font-bold text-white/70 mb-0.5 text-center">
                Crew PIN
              </label>
              <PinDots filled={pin.length} />

              {(err || lockMsg) && (
                <p className="text-[#f87171] text-xs text-center mb-3 font-medium">
                  {lockMsg || err}
                </p>
              )}

              <Keypad onPress={locked ? () => {} : handleKey} />

              <Note>
                Demo build: PIN is <strong>1234</strong>. Three wrong PINs lock
                the unit for 15 seconds.
              </Note>
            </div>
          )}

          {/* ── SCAN ── */}
          {view === "scan" && (
            <div className="animate-fade-in">
              <ScanChecklist unit={unit} onDone={() => setView("done")} />
            </div>
          )}

          {/* ── DONE ── */}
          {view === "done" && (
            <div className="text-center animate-fade-in">
              <svg className="w-24 h-24 mx-auto mb-4" viewBox="0 0 100 100" fill="none">
                <circle
                  pathLength="1"
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="#C6F432"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  className="animate-draw"
                />
                <path
                  pathLength="1"
                  d="M30 52l14 14 27-30"
                  stroke="#C6F432"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  className="animate-draw-delayed"
                />
              </svg>
              <h2 className="font-headline text-2xl font-extrabold text-white">
                Unit on duty
              </h2>
              <p className="text-sm text-white/60 mt-1 mb-6">
                {unit} is online and receiving dispatch.
              </p>
              <button
                onClick={() => {
                  const isCrew = unit.startsWith("DL-");
                  const sessionData = {
                    unitId: unit,
                    role: isCrew ? "CREW" : "DISPATCHER",
                    authenticated: true,
                    loginTime: new Date().toISOString(),
                  };
                  try {
                    localStorage.setItem("nivaran_dispatcher_session", JSON.stringify(sessionData));
                    document.cookie = "nivaran_dispatcher_session=1; path=/; max-age=86400";
                  } catch {}
                  if (isCrew) {
                    router.push("/crew");
                  } else {
                    router.push("/");
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-[#C6F432] hover:bg-[#AEE01E] text-[#0B0B0C] font-headline font-extrabold text-base transition-all active:scale-95"
              >
                {unit.startsWith("DL-") ? "Open In-Cab Crew Terminal" : "Open CAD Command Console"}
              </button>
              <Note>
                Session expires after 15 minutes of inactivity. This is a
                front-end demo.
              </Note>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

