"use client";
/**
 * NIVARAN (निवारण) — Citizen Login / Register
 * 60:30:10 Colour System: 60% Cream #F4EDE0 | 30% Navy #14213D | 10% Coral #FF6B5B
 *
 * Demo credentials:
 *  OTP → 123456
 *  3 wrong codes → 15-second lockout + shake animation
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* ─── types ─── */
type Mode = "login" | "register";
type View = "form" | "otp" | "scan" | "done";

const SCAN_STEPS_LOGIN = [
  "Phone verified",
  "Device recognised",
  "GPS permission ready",
  "SOS hold-to-confirm armed",
];
const SCAN_STEPS_REGISTER = [
  "Phone verified",
  "Profile encrypted on this device",
  "GPS permission ready",
  "SOS hold-to-confirm armed",
];

/* ─── helpers ─── */
function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 items-start mt-5 text-xs text-[#14213D]/60">
      <span className="shrink-0">🔒</span>
      <span>{children}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   OTP INPUT (6 boxes, auto-advance, paste, keyboard nav)
══════════════════════════════════════════════════════════════════ */
function OtpInput({
  onComplete,
  locked,
}: {
  onComplete: (code: string) => void;
  locked: boolean;
}) {
  const [vals, setVals] = useState(["", "", "", "", "", ""]);
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);
  const complete = vals.every((v) => v !== "");

  function handleChange(idx: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...vals];
    next[idx] = digit;
    setVals(next);
    if (digit && idx < 5) inputsRef.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !vals[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key === "Enter" && complete && !locked) {
      onComplete(vals.join(""));
    }
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

  return (
    <div className="flex gap-2 justify-between mt-6" onPaste={handlePaste}>
      {vals.map((v, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          aria-label={`OTP digit ${i + 1}`}
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`w-full min-w-0 aspect-[1/1.15] text-center font-headline text-2xl font-extrabold rounded-xl border-2 bg-transparent transition-all focus:outline-none
            ${v ? "border-[#FF6B5B] text-[#14213D]" : "border-[#dcd2c0] text-[#14213D]"}
            focus:border-[#FF6B5B] focus:-translate-y-0.5`}
        />
      ))}
      {complete && !locked && (
        <button
          className="sr-only"
          onClick={() => onComplete(vals.join(""))}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCAN CHECKLIST
══════════════════════════════════════════════════════════════════ */
function ScanChecklist({
  steps,
  onDone,
}: {
  steps: string[];
  onDone: () => void;
}) {
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
    <div className="animate-fade-in">
      <h2 className="font-headline text-2xl font-extrabold text-[#14213D]">
        Securing your account
      </h2>
      <p className="text-sm text-[#14213D]/60 mt-1 mb-4">
        Please keep this screen open.
      </p>
      <ul className="space-y-0 divide-y divide-[#dcd2c0]/60">
        {steps.map((s, i) => {
          const done = i < current;
          const running = i === current && current < steps.length;
          return (
            <li
              key={s}
              className={`flex items-center gap-3 py-3 text-sm transition-colors ${
                done || running ? "text-[#14213D]" : "text-[#14213D]/40"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full border-2 flex-none relative transition-all ${
                  done
                    ? "bg-[#15803d] border-[#15803d]"
                    : running
                    ? "border-[#FF6B5B] border-t-transparent animate-spin"
                    : "border-[#dcd2c0]"
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
                      stroke="white"
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
      <div className="mt-5 h-1.5 bg-[#dcd2c0] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#FF6B5B] rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SUCCESS SCREEN
══════════════════════════════════════════════════════════════════ */
function SuccessScreen({
  heading,
  sub,
  btnLabel,
  onContinue,
}: {
  heading: string;
  sub: string;
  btnLabel: string;
  onContinue: () => void;
}) {
  return (
    <div className="text-center">
      <svg
        className="w-24 h-24 mx-auto mb-4"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          pathLength="1"
          cx="50"
          cy="50"
          r="44"
          stroke="#15803d"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="animate-draw"
        />
        <path
          pathLength="1"
          d="M30 52l14 14 27-30"
          stroke="#15803d"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="animate-draw-delayed"
        />
      </svg>
      <h2 className="font-headline text-2xl font-extrabold text-[#14213D]">
        {heading}
      </h2>
      <p className="text-sm text-[#14213D]/60 mt-1 mb-6">{sub}</p>
      <button
        onClick={onContinue}
        className="w-full py-3.5 rounded-xl bg-[#FF6B5B] hover:bg-[#e85a4a] text-white font-headline font-bold text-base transition-all active:scale-95"
      >
        {btnLabel}
      </button>
      <Note>
        Session expires after 15 minutes of inactivity. This is a front-end
        demo, so no real account is created.
      </Note>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════ */
export default function CitizenLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [view, setView] = useState<View>("form");

  // form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ec, setEc] = useState("");
  const [bg, setBg] = useState("Unknown");
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(false);

  // lockout
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [lockMsg, setLockMsg] = useState("");

  // countdown
  const [resend, setResend] = useState(30);
  useEffect(() => {
    if (view !== "otp") return;
    setResend(30);
    const t = setInterval(() => setResend((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [view]);

  // lock countdown
  // Redirect if already authenticated
  useEffect(() => {
    try {
      const s = localStorage.getItem("nivaran_citizen_session");
      if (s) {
        const parsed = JSON.parse(s);
        if (parsed.authenticated) {
          router.replace("/");
        }
      }
    } catch {}
  }, [router]);

  useEffect(() => {
    if (!lockedUntil) return;
    const t = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockedUntil(0);
        setLockMsg("");
        clearInterval(t);
      } else {
        setLockMsg(`Sign-in locked. Try again in ${remaining}s`);
      }
    }, 500);
    return () => clearInterval(t);
  }, [lockedUntil]);

  function doShake() {
    setShake(false);
    requestAnimationFrame(() => setShake(true));
    setTimeout(() => setShake(false), 400);
  }

  function validateAndSend() {
    setErr("");
    if (mode === "register" && name.trim().length < 2)
      return setErr("Enter your full name."), doShake();
    if (!/^[6-9]\d{9}$/.test(phone))
      return setErr("Enter a valid 10-digit Indian mobile number."), doShake();
    if (mode === "register" && !/^[6-9]\d{9}$/.test(ec))
      return setErr("Add a valid emergency contact number."), doShake();
    if (mode === "register" && !consent)
      return setErr("Please tick the consent box to continue."), doShake();
    setView("otp");
  }

  function verifyOtp(code: string) {
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

  function switchMode(m: Mode) {
    setMode(m);
    setView("form");
    setErr("");
    setName("");
    setPhone("");
    setEc("");
    setConsent(false);
  }

  const locked = Date.now() < lockedUntil;

  return (
    <div className="min-h-[100dvh] bg-[#F4EDE0] font-body">
      {/* ── Header ── */}
      <header className="flex items-center gap-3 px-5 py-4 border-b border-[#dcd2c0]/60">
        <Image
          src="/nivaran-icon.png"
          alt="NIVARAN"
          width={32}
          height={32}
          className="rounded-lg"
        />
        <span className="font-headline font-extrabold text-lg text-[#14213D] tracking-tight uppercase">
          NIVARAN
        </span>
        <span className="ml-auto text-xs text-[#14213D]/50 font-mono">
          Citizen Emergency
        </span>
      </header>

      {/* ── Layout ── */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 p-5 md:py-8">
        {/* Left brand panel */}
        <aside className="bg-[#14213D] rounded-2xl p-8 flex flex-col justify-between min-h-[320px] md:min-h-[540px] overflow-hidden relative">
          <div>
            <h1 className="font-headline text-2xl md:text-[28px] font-extrabold text-white leading-snug max-w-[18ch]">
              Help reaches you faster when we know who you are.
            </h1>
            <p className="text-white/60 text-sm mt-3 max-w-[34ch]">
              Verify your phone once. Your location and medical details stay
              encrypted until you press SOS.
            </p>

            {/* Animated shield */}
            <div className="relative w-36 h-36 mt-6">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-[#FF6B5B] animate-ring"
                  style={{ animationDelay: `${i}s` }}
                />
              ))}
              <svg
                className="absolute inset-6 w-24 h-24 text-[#FF6B5B]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M12 2l8 3v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5z" />
                <path
                  d="M8 12h2l1.5-3 2 6L15 12h1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="flex gap-2 flex-wrap mt-4">
              {["TLS 1.3", "Encrypted session", "Audit logged"].map((b) => (
                <span
                  key={b}
                  className="text-xs border border-white/20 rounded-full px-3 py-1 text-white/70"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* ECG line */}
          <svg
            className="w-full h-14 mt-auto"
            viewBox="0 0 300 60"
            preserveAspectRatio="none"
          >
            <path
              pathLength="1"
              d="M0 30H60L75 30L85 10L100 50L112 30H180L195 30L205 15L218 42L228 30H300"
              fill="none"
              stroke="#FF6B5B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1"
              strokeDashoffset="1"
              className="animate-ecg"
            />
          </svg>
        </aside>

        {/* Right card */}
        <section
          className={`bg-[#FAF5EC] border border-[#dcd2c0] rounded-2xl p-7 flex flex-col justify-center min-h-[320px] transition-transform ${
            shake ? "animate-shake" : ""
          }`}
        >
          {/* ── FORM VIEW ── */}
          {view === "form" && (
            <div className="animate-fade-in">
              {/* Login / Register switch */}
              <div className="flex bg-transparent border border-[#dcd2c0] rounded-xl p-1 mb-5">
                {(["login", "register"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                      mode === m
                        ? "bg-[#14213D] text-[#FAF5EC]"
                        : "text-[#14213D]/60 hover:text-[#14213D]"
                    }`}
                  >
                    {m === "login" ? "Log in" : "Register"}
                  </button>
                ))}
              </div>

              <h2 className="font-headline text-2xl font-extrabold text-[#14213D]">
                {mode === "register" ? "Create your SOS profile" : "Welcome back"}
              </h2>
              <p className="text-sm text-[#14213D]/60 mt-1 mb-5">
                {mode === "register"
                  ? "Takes under a minute. आपकी सुरक्षा हमारी प्राथमिकता है।"
                  : "Log in with your mobile number. We will text you a code."}
              </p>

              {mode === "register" && (
                <div className="mb-1">
                  <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                    Full name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#dcd2c0] bg-transparent text-[#14213D] font-medium focus:border-[#FF6B5B] focus:outline-none transition-colors"
                    placeholder="Rahul Sharma"
                  />
                </div>
              )}

              <div className="mt-3">
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                  Mobile number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-[#14213D]/50 font-semibold text-sm">
                    +91
                  </span>
                  <input
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ""))
                    }
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel-national"
                    placeholder="98765 43210"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#dcd2c0] bg-transparent text-[#14213D] font-medium focus:border-[#FF6B5B] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {mode === "register" && (
                <>
                  <div className="mt-3">
                    <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                      Emergency contact (mobile)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-[#14213D]/50 font-semibold text-sm">
                        +91
                      </span>
                      <input
                        value={ec}
                        onChange={(e) =>
                          setEc(e.target.value.replace(/\D/g, ""))
                        }
                        inputMode="numeric"
                        maxLength={10}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#dcd2c0] bg-transparent text-[#14213D] font-medium focus:border-[#FF6B5B] focus:outline-none transition-colors"
                        placeholder="98765 43211"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                      Blood group
                    </label>
                    <select
                      value={bg}
                      onChange={(e) => setBg(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#dcd2c0] bg-[#FAF5EC] text-[#14213D] font-medium focus:border-[#FF6B5B] focus:outline-none transition-colors"
                    >
                      {["Unknown", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                        (g) => (
                          <option key={g}>{g}</option>
                        )
                      )}
                    </select>
                  </div>

                  <label className="flex gap-3 items-start mt-4 text-xs text-[#14213D]/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 accent-[#FF6B5B]"
                    />
                    <span>
                      I allow NIVARAN to share my live location and medical
                      details with 112 and hospitals only during an SOS.
                    </span>
                  </label>
                </>
              )}

              {err && (
                <p className="text-[#b91c1c] text-xs mt-3 font-medium">{err}</p>
              )}

              <button
                onClick={validateAndSend}
                className="w-full mt-5 py-3.5 rounded-xl bg-[#FF6B5B] hover:bg-[#e85a4a] text-white font-headline font-bold text-base transition-all active:scale-95"
              >
                Send code
              </button>

              <Note>
                Your number is hashed on our servers. We never sell or share it.
              </Note>
            </div>
          )}

          {/* ── OTP VIEW ── */}
          {view === "otp" && (
            <div className="animate-fade-in">
              <h2 className="font-headline text-2xl font-extrabold text-[#14213D]">
                Enter the 6-digit code
              </h2>
              <p className="text-sm text-[#14213D]/60 mt-1">
                Sent to +91 {phone.slice(0, 2)}••••••{phone.slice(-2)}
              </p>

              <OtpInput onComplete={verifyOtp} locked={locked} />

              <div className="flex items-center gap-2 mt-4 text-xs text-[#14213D]/60">
                {resend > 0 ? (
                  <span>Resend code in {resend}s</span>
                ) : (
                  <span>Code expired. Go back to request a new one.</span>
                )}
              </div>

              {lockMsg && (
                <p className="text-[#b91c1c] text-xs mt-2 font-medium">
                  {lockMsg}
                </p>
              )}
              {err && !lockMsg && (
                <p className="text-[#b91c1c] text-xs mt-2 font-medium">{err}</p>
              )}

              <button
                onClick={() => setView("form")}
                className="mt-3 text-[#FF6B5B] text-sm font-semibold"
              >
                ← Go back
              </button>

              <Note>
                Demo build: use code <strong>123456</strong>. Three wrong codes
                lock sign-in for 15 seconds.
              </Note>
            </div>
          )}

          {/* ── SCAN VIEW ── */}
          {view === "scan" && (
            <ScanChecklist
              steps={mode === "register" ? SCAN_STEPS_REGISTER : SCAN_STEPS_LOGIN}
              onDone={() => setView("done")}
            />
          )}

          {/* ── DONE VIEW ── */}
          {view === "done" && (
            <SuccessScreen
              heading={
                mode === "register"
                  ? `Registered. Welcome${name ? ", " + name.split(" ")[0] : ""}.`
                  : "Logged in."
              }
              sub="Your SOS button is ready."
              btnLabel="Open SOS home"
              onContinue={() => {
                const sessionData = {
                  phone: phone || "9810123456",
                  name: name || (mode === "register" ? "Registered Citizen" : "Verified Citizen"),
                  emergencyContact: ec || "",
                  bloodGroup: blood,
                  authenticated: true,
                  loginTime: new Date().toISOString(),
                };
                try {
                  localStorage.setItem("nivaran_citizen_session", JSON.stringify(sessionData));
                  document.cookie = "nivaran_citizen_session=1; path=/; max-age=86400";
                } catch {}
                router.push("/");
              }}
            />
          )}
        </section>
      </div>
    </div>
  );
}

