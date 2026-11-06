"use client";
/**
 * NIVARAN (निवारण) — Hospital Staff Secure Sign-in
 * 60:30:10 Colour System: 60% Sand Beige #E8DCC4 | 30% Forest Green #1F3D2B | 10% Electric Purple #8B5CF6
 *
 * Demo credentials:
 *  Password: any 8+ characters
 *  TOTP code: 123456  (30-second animated countdown ring)
 *  Security checklist: TLS → Licence → Role → Certificate → Audit
 */

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* ─── types ─── */
type View = "form" | "totp" | "scan" | "done";

/* ─── Password strength ─── */
function strengthLevel(pw: string): number {
  return (
    (pw.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(pw) ? 1 : 0) +
    (/\d/.test(pw) ? 1 : 0) +
    (/[^\w]/.test(pw) ? 1 : 0)
  );
}
const STRENGTH_COLOURS = ["#ef4444", "#f59e0b", "#84cc16", "#16a34a"];

/* ─── Helpers ─── */
function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 items-start mt-5 text-xs text-[#1F3D2B]/60">
      <span className="shrink-0">🔒</span>
      <span>{children}</span>
    </div>
  );
}

/* ─── TOTP ring countdown ─── */
const CIRCUMFERENCE = 2 * Math.PI * 15; // r=15

function TotpCountdown() {
  const [seconds, setSeconds] = useState(30);
  useEffect(() => {
    const t = setInterval(
      () => setSeconds((s) => (s <= 1 ? 30 : s - 1)),
      1000
    );
    return () => clearInterval(t);
  }, []);
  const offset = CIRCUMFERENCE * (1 - seconds / 30);
  return (
    <div className="flex items-center gap-2 mt-4 text-xs text-[#1F3D2B]/60">
      <svg width="30" height="30" viewBox="0 0 36 36" className="-rotate-90">
        <circle cx="18" cy="18" r="15" fill="none" stroke="#d6cfba" strokeWidth="4" />
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="4"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <span>Code refreshes in {seconds}s</span>
    </div>
  );
}

/* ─── OTP / TOTP boxes ─── */
function OtpInput({
  onComplete,
  locked,
  accentColor,
}: {
  onComplete: (code: string) => void;
  locked: boolean;
  accentColor: string;
}) {
  const [vals, setVals] = useState(["", "", "", "", "", ""]);
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(idx: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...vals];
    next[idx] = digit;
    setVals(next);
    if (digit && idx < 5) inputsRef.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !vals[idx] && idx > 0)
      inputsRef.current[idx - 1]?.focus();
    if (e.key === "Enter" && vals.every((v) => v) && !locked)
      onComplete(vals.join(""));
  }

  function handlePaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = ["", "", "", "", "", ""];
    text.split("").forEach((c, i) => (next[i] = c));
    setVals(next);
    inputsRef.current[Math.min(text.length - 1, 5)]?.focus();
  }

  const complete = vals.every((v) => v !== "");

  return (
    <>
      <div className="flex gap-2 justify-between mt-5" onPaste={handlePaste}>
        {vals.map((val, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Code digit ${i + 1}`}
            className="w-full min-w-0 aspect-[1/1.15] text-center font-headline text-2xl font-extrabold rounded-xl border-2 bg-transparent text-[#1F3D2B] transition-all focus:outline-none focus:-translate-y-0.5"
            style={{
              borderColor: val ? accentColor : "#d6cfba",
            }}
          />
        ))}
      </div>
      {complete && !locked && (
        <button
          className="w-full mt-4 py-3.5 rounded-xl font-headline font-bold text-base text-white transition-all active:scale-95"
          style={{ background: accentColor }}
          onClick={() => onComplete(vals.join(""))}
        >
          Verify
        </button>
      )}
    </>
  );
}

/* ─── Scan checklist ─── */
function ScanChecklist({ steps, onDone }: { steps: string[]; onDone: () => void }) {
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
      <h2 className="font-headline text-2xl font-extrabold text-[#1F3D2B]">
        Opening secure workspace
      </h2>
      <p className="text-sm text-[#1F3D2B]/60 mt-1 mb-3">
        Please keep this screen open.
      </p>
      <ul className="divide-y divide-[#d6cfba]/60">
        {steps.map((s, i) => {
          const done = i < current;
          const running = i === current && current < steps.length;
          return (
            <li
              key={s}
              className={`flex items-center gap-3 py-3 text-sm transition-colors ${
                done || running ? "text-[#1F3D2B]" : "text-[#1F3D2B]/40"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full border-2 flex-none relative transition-all ${
                  done
                    ? "bg-[#16a34a] border-[#16a34a]"
                    : running
                    ? "border-[#8B5CF6] border-t-transparent animate-spin"
                    : "border-[#d6cfba]"
                }`}
              >
                {done && (
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="font-medium">{s}</span>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 h-1.5 bg-[#d6cfba] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, background: "#8B5CF6" }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════ */
export default function HospitalLoginPage() {
  const router = useRouter();
  const [view, setView] = useState<View>("form");

  // form
  const [facilityId, setFacilityId] = useState("AIIMS-ED-01");
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(false);

  // lockout
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [lockMsg, setLockMsg] = useState("");

  useEffect(() => {
    if (!lockedUntil) return;
    const t = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) { setLockedUntil(0); setLockMsg(""); }
      else setLockMsg(`Sign-in locked. Try again in ${remaining}s`);
    }, 500);
    return () => clearInterval(t);
  }, [lockedUntil]);

  function doShake() {
    setShake(false);
    requestAnimationFrame(() => setShake(true));
    setTimeout(() => setShake(false), 400);
  }

  const strength = strengthLevel(password);

  function validateAndContinue() {
    setErr("");
    if (!facilityId.trim() || !staffId.trim())
      return setErr("Enter your facility ID and staff ID."), doShake();
    if (password.length < 8)
      return setErr("Password must be at least 8 characters."), doShake();
    setView("totp");
  }

  function verifyTotp(code: string) {
    if (Date.now() < lockedUntil) return;
    if (code === "123456") {
      setView("scan");
    } else {
      const next = attempts + 1;
      setAttempts(next);
      doShake();
      if (next >= 3) {
        setLockedUntil(Date.now() + 15000);
        setAttempts(0);
        setErr("Too many wrong codes. Sign-in locked for 15 seconds.");
      } else {
        setErr(`Wrong code. ${3 - next} attempt${3 - next > 1 ? "s" : ""} left.`);
      }
    }
  }

  const locked = Date.now() < lockedUntil;

  const SCAN_STEPS = [
    "TLS 1.3 handshake complete",
    "Facility licence verified",
    "Role confirmed: Triage lead",
    "Device certificate bound",
    "Audit session started",
  ];

  return (
    <div className="min-h-[100dvh] bg-[#E8DCC4] font-body">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-4 border-b border-[#d6cfba]/60">
        <Image src="/nivaran-icon.png" alt="NIVARAN" width={32} height={32} className="rounded-lg" />
        <span className="font-headline font-extrabold text-lg text-[#1F3D2B] tracking-tight uppercase">
          NIVARAN Clinical
        </span>
        <span className="ml-auto text-xs text-[#1F3D2B]/50 font-mono">
          ED Pre-Arrival Network
        </span>
      </header>

      {/* Layout */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 p-5 md:py-8">
        {/* Brand panel */}
        <aside className="bg-[#1F3D2B] rounded-2xl p-8 flex flex-col justify-between min-h-[320px] md:min-h-[540px] overflow-hidden relative">
          <div>
            <h1 className="font-headline text-2xl md:text-[28px] font-extrabold text-white leading-snug max-w-[18ch]">
              Only verified clinical staff can see incoming patients.
            </h1>
            <p className="text-white/60 text-sm mt-3 max-w-[34ch]">
              Facility ID, staff password and a one-time code are all required
              before the pre-alert queue opens.
            </p>

            {/* Shield rings */}
            <div className="relative w-36 h-36 mt-6">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-[#8B5CF6] animate-ring"
                  style={{ animationDelay: `${i}s` }}
                />
              ))}
              <svg
                className="absolute inset-6 w-24 h-24 text-[#8B5CF6]"
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
              {["TLS 1.3", "DPDP compliant", "Audit logged", "Role-gated"].map((b) => (
                <span key={b} className="text-xs border border-white/20 rounded-full px-3 py-1 text-white/70">
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
              stroke="#8B5CF6"
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
          className={`bg-[#F4EFE2] border border-[#d6cfba] rounded-2xl p-7 flex flex-col justify-center min-h-[320px] transition-transform ${
            shake ? "animate-shake" : ""
          }`}
        >
          {/* ── FORM ── */}
          {view === "form" && (
            <div className="animate-fade-in">
              <h2 className="font-headline text-2xl font-extrabold text-[#1F3D2B]">
                Clinical staff sign in
              </h2>
              <p className="text-sm text-[#1F3D2B]/60 mt-1 mb-5">
                Emergency department pre-arrival network
              </p>

              <label className="block text-xs font-bold text-[#1F3D2B] mb-1.5">
                Facility ID
              </label>
              <input
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
                autoComplete="organization"
                className="w-full px-4 py-3 rounded-xl border-2 border-[#d6cfba] bg-transparent text-[#1F3D2B] font-medium focus:border-[#8B5CF6] focus:outline-none transition-colors mb-3"
              />

              <label className="block text-xs font-bold text-[#1F3D2B] mb-1.5">
                Staff ID
              </label>
              <input
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                autoComplete="username"
                placeholder="e.g. SN-2041"
                className="w-full px-4 py-3 rounded-xl border-2 border-[#d6cfba] bg-transparent text-[#1F3D2B] font-medium focus:border-[#8B5CF6] focus:outline-none transition-colors mb-3"
              />

              <label className="block text-xs font-bold text-[#1F3D2B] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full px-4 pr-16 py-3 rounded-xl border-2 border-[#d6cfba] bg-transparent text-[#1F3D2B] font-medium focus:border-[#8B5CF6] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1F3D2B]/50 text-xs font-semibold px-2 py-1 rounded hover:text-[#1F3D2B]"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>

              {/* Strength meter */}
              {password && (
                <div className="flex gap-1 mt-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{
                        background: i < strength ? STRENGTH_COLOURS[strength - 1] : "#d6cfba",
                      }}
                    />
                  ))}
                </div>
              )}

              {err && <p className="text-[#b91c1c] text-xs mt-3 font-medium">{err}</p>}

              <button
                onClick={validateAndContinue}
                className="w-full mt-5 py-3.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-headline font-bold text-base transition-all active:scale-95"
              >
                Continue to verification
              </button>

              <Note>
                Patient data is protected under the DPDP Act. Every view is
                written to an audit log.
              </Note>
            </div>
          )}

          {/* ── TOTP ── */}
          {view === "totp" && (
            <div className="animate-fade-in">
              <h2 className="font-headline text-2xl font-extrabold text-[#1F3D2B]">
                Two-step verification
              </h2>
              <p className="text-sm text-[#1F3D2B]/60 mt-1">
                Enter the code from your authenticator app
              </p>

              <OtpInput onComplete={verifyTotp} locked={locked} accentColor="#8B5CF6" />

              <TotpCountdown />

              {lockMsg && <p className="text-[#b91c1c] text-xs mt-2 font-medium">{lockMsg}</p>}
              {err && !lockMsg && <p className="text-[#b91c1c] text-xs mt-2 font-medium">{err}</p>}

              <button
                onClick={() => { setView("form"); setErr(""); }}
                className="mt-3 text-[#8B5CF6] text-sm font-semibold"
              >
                ← Go back
              </button>

              <Note>
                Demo build: use code <strong>123456</strong>. Three wrong codes
                lock sign-in for 15 seconds.
              </Note>
            </div>
          )}

          {/* ── SCAN ── */}
          {view === "scan" && (
            <ScanChecklist steps={SCAN_STEPS} onDone={() => setView("done")} />
          )}

          {/* ── DONE ── */}
          {view === "done" && (
            <div className="text-center">
              <svg className="w-24 h-24 mx-auto mb-4" viewBox="0 0 100 100" fill="none">
                <circle pathLength="1" cx="50" cy="50" r="44" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" strokeDasharray="1" strokeDashoffset="1" className="animate-draw" />
                <path pathLength="1" d="M30 52l14 14 27-30" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset="1" className="animate-draw-delayed" />
              </svg>
              <h2 className="font-headline text-2xl font-extrabold text-[#1F3D2B]">Access granted</h2>
              <p className="text-sm text-[#1F3D2B]/60 mt-1 mb-6">
                Casualty radar is live for {facilityId}.
              </p>
              <button
                onClick={() => router.push("/")}
                className="w-full py-3.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-headline font-bold text-base transition-all active:scale-95"
              >
                Open ED command
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

