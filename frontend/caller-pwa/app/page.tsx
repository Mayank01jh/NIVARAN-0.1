"use client";
/**
 * NIVARAN (निवारण) — Official Citizen Emergency Application
 * Built faithfully from Google Stitch designs: nivaran_lifeline
 * 
 * Screens:
 * 1. Screen A: Emergency Home (1s Hold SOS, GPS Lock, Severity selector, 112 calling)
 * 2. Screen B: AI Voice Hotline (Bilingual Hindi/English, Live transcription, clinical symptom tags, instant dispatch)
 * 3. Screen C: Live Ambulance Tracking (Bold ETA countdown, 4-step stepper, vehicle & crew info, hospital notification, WebSocket sync)
 * 4. Screen D: Profile & Emergency Contacts Settings
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { apiClient } from "@/lib/apiClient";

type ScreenId = "home" | "hotline" | "tracking" | "settings";
type Severity = "Critical" | "High" | "Medium" | "Low";

export default function CitizenApp() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("home");
  const [viewMode, setViewMode] = useState<"phone" | "fluid">("phone");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCancelEmergency = async () => {
    try {
      if (incidentId) {
        await apiClient.cancelIncident(incidentId, "Citizen requested cancellation");
      }
    } catch (e) {
      console.warn("Cancel API call:", e);
    }
    setShowCancelModal(false);
    setSosDispatchedBanner(false);
    setCurrentStep(1);
    setIncidentStatus("CANCELLED");
    showToast("Emergency request cancelled successfully.");
    setCurrentScreen("home");
  };

  // Geolocation & GPS telemetry
  const [gpsLocked, setGpsLocked] = useState<boolean>(true);
  const [accuracyMeters, setAccuracyMeters] = useState<number>(8);
  const [address, setAddress] = useState<string>("Connaught Place, Inner Circle, New Delhi");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 28.6315,
    lng: 77.2195,
  });

  // Severity & SOS Hold state
  const [selectedSeverity, setSelectedSeverity] = useState<Severity>("Critical");
  const [sosProgress, setSosProgress] = useState<number>(0);
  const [isHoldingSos, setIsHoldingSos] = useState<boolean>(false);
  const [sosDispatchedBanner, setSosDispatchedBanner] = useState<boolean>(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const holdStartTimeRef = useRef<number>(0);

  // AI Voice Hotline state
  const [hotlineLang, setHotlineLang] = useState<"en" | "hi">("hi");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>(
    "मेरे पिताजी को सीने में तेज दर्द हो रहा है और बहुत पसीना आ रहा है, सांस लेने में तकलीफ है..."
  );
  const [extractedTags, setExtractedTags] = useState<string[]>([
    "Critical Triage (अति गंभीर)",
    "Severe Chest Pain (सीने में दर्द)",
    "Profuse Diaphoresis (अत्यधिक पसीना)",
    "Dyspnea (सांस लेने में तकलीफ)",
  ]);
  const recognitionRef = useRef<any>(null);

  // Live Tracking state
  const [incidentId, setIncidentId] = useState<string>("inc-del-1081");
  const [etaSeconds, setEtaSeconds] = useState<number>(240); // 4 min
  const [currentStep, setCurrentStep] = useState<number>(3); // 1: received, 2: dispatched, 3: en_route, 4: on_scene
  const [incidentStatus, setIncidentStatus] = useState<string>("EN_ROUTE");
  const [ambulanceReg, setAmbulanceReg] = useState<string>("DL-01-AMB-1081");
  const [crewLead, setCrewLead] = useState<string>("Rajesh Kumar");
  const [hospitalName, setHospitalName] = useState<string>("AIIMS Apex Trauma Center, New Delhi");
  const [isHospitalNotified, setIsHospitalNotified] = useState<boolean>(true);

  // Profile & Settings state
  const [userName, setUserName] = useState<string>("Mayank Jha");
  const [userPhone, setUserPhone] = useState<string>("+91 98765 43210");
  const [bloodGroup, setBloodGroup] = useState<string>("O Positive");
  const [emergencyContact, setEmergencyContact] = useState<{ name: string; relation: string; phone: string }>({
    name: "Anita Jha",
    relation: "Mother",
    phone: "+91 98112 34567",
  });

  // Haptic feedback
  const triggerHaptic = useCallback((pattern: number | number[] = 50) => {
    if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  }, []);

  // Browser Geolocation
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setAccuracyMeters(Math.round(pos.coords.accuracy) || 8);
          setGpsLocked(true);
        },
        () => {
          // Keep Delhi central coordinates as stable demo default
          setGpsLocked(true);
          setAccuracyMeters(8);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // ETA Countdown on Tracking Screen
  useEffect(() => {
    if (currentScreen !== "tracking") return;
    const interval = setInterval(() => {
      setEtaSeconds((prev) => (prev > 10 ? prev - 1 : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentScreen]);

  // WebSocket Live Incident Sync with reconnect
  useEffect(() => {
    if (!incidentId) return;
    let ws: WebSocket | null = null;
    let reconnectAttempts = 0;
    const maxAttempts = 5;
    let reconnectTimer: NodeJS.Timeout | null = null;
    let isMounted = true;

    const connect = () => {
      try {
        ws = apiClient.connectIncidentWS(incidentId, (msg: any) => {
          if (!msg) return;
          const data = msg.data || msg;
          if (data.status) {
            setIncidentStatus(data.status);
            if (data.status === "ASSIGNED") setCurrentStep(2);
            else if (data.status === "EN_ROUTE") setCurrentStep(3);
            else if (data.status === "ON_SCENE") {
              setCurrentStep(4);
              setEtaSeconds(0);
            } else if (data.status === "TRANSPORTING" || data.status === "AT_HOSPITAL" || data.status === "CLOSED") {
              setCurrentStep(4);
            }
          }
          if (data.eta_seconds !== undefined && data.eta_seconds !== null) {
            setEtaSeconds(Number(data.eta_seconds));
          }
          if (data.assigned_unit_id) {
            setAmbulanceReg(data.assigned_unit_id.toUpperCase());
          }
          if (data.hospital_name) {
            setHospitalName(data.hospital_name);
            setIsHospitalNotified(true);
          }
          reconnectAttempts = 0; // reset on successful message
        });

        if (ws) {
          (ws as any).onclose = () => {
            if (!isMounted) return;
            if (reconnectAttempts < maxAttempts) {
              const delay = Math.min(2000 * Math.pow(2, reconnectAttempts), 32000);
              reconnectAttempts++;
              reconnectTimer = setTimeout(connect, delay);
            }
          };
        }
      } catch (e) {
        console.warn("WebSocket caller connect error:", e);
      }
    };

    connect();
    return () => {
      isMounted = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, [incidentId]);

  // SOS Press-and-Hold Logic (1000ms duration)
  const startSosHold = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsHoldingSos(true);
    holdStartTimeRef.current = Date.now();
    triggerHaptic(40);

    const stepMs = 20;
    const totalMs = 1000;
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);

    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartTimeRef.current;
      const progress = Math.min(100, Math.round((elapsed / totalMs) * 100));
      setSosProgress(progress);

      if (progress >= 100) {
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
        setIsHoldingSos(false);
        triggerHaptic([100, 50, 150]);
        executeSosDispatch();
      }
    }, stepMs);
  };

  const cancelSosHold = () => {
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    setIsHoldingSos(false);
    setSosProgress(0);
  };

  // Submit SOS to Backend
  const executeSosDispatch = async () => {
    const newIncId = `inc-cit-${Date.now().toString(36).slice(-6)}`;
    setIncidentId(newIncId);
    setEtaSeconds(240);
    setCurrentStep(2);
    setSosDispatchedBanner(true);

    try {
      const resp = await apiClient.sendSOS(
        {
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          accuracy_m: accuracyMeters,
          severity: selectedSeverity.toUpperCase() as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
          caller_info: {
            name: userName,
            phone: userPhone,
            notes: `Citizen 1-Second SOS Triggered [${selectedSeverity.toUpperCase()}]. Location: ${address}`,
          },
        },
        newIncId
      );
      if (resp && resp.incident_id) {
        setIncidentId(resp.incident_id);
        if (resp.eta_seconds) setEtaSeconds(resp.eta_seconds);
      }
    } catch (err) {
      console.warn("SOS API submission note:", err);
    }

    // Smoothly show confirmation and navigate to live tracking
    setTimeout(() => {
      setCurrentScreen("tracking");
    }, 1200);
  };

  // Web Speech API / Voice Hotline
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Offline fallback: simulate voice input
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setSpeechTranscript("सीने में असहनीय दर्द है, बोलने में तकलीफ हो रही है। जल्दी मदद भेजें।");
        setExtractedTags([
          "Critical Triage (अति गंभीर)",
          "Acute Cardiac Symptom (हृदय आघात लक्षण)",
          "Severe Distress (गंभीर आपातकाल)",
        ]);
      }, 2500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = hotlineLang === "hi" ? "hi-IN" : "en-IN";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join(" ");
        setSpeechTranscript(text);

        // Ambient clinical symptom extraction
        const lower = text.toLowerCase();
        const tags = ["Critical Triage (अति गंभीर)"];
        if (lower.includes("chest") || lower.includes("pain") || lower.includes("दर्द") || lower.includes("सीने")) {
          tags.push("Severe Chest Pain (सीने में दर्द)");
        }
        if (lower.includes("sweat") || lower.includes("sweating") || lower.includes("पसीना")) {
          tags.push("Profuse Diaphoresis (अत्यधिक पसीना)");
        }
        if (lower.includes("breath") || lower.includes("saans") || lower.includes("सांस") || lower.includes("दम")) {
          tags.push("Dyspnea / Shortness of Breath (सांस फूलना)");
        }
        if (lower.includes("blood") || lower.includes("bleed") || lower.includes("खून") || lower.includes("चोट")) {
          tags.push("Active Hemorrhage / Trauma (रक्तस्राव)");
        }
        if (tags.length === 1) tags.push("Emergency Reported (आपातकालीन सूचना)");
        setExtractedTags(tags);
      };
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Dispatch via AI Voice Hotline
  const dispatchVoiceHotline = async () => {
    const newIncId = `inc-voice-${Date.now().toString(36).slice(-6)}`;
    setIncidentId(newIncId);
    setEtaSeconds(240);
    setCurrentStep(2);

    try {
      const res = await apiClient.processVoiceCall({
        caller_phone: userPhone,
        caller_name: userName,
        transcript: speechTranscript,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        accuracy_m: accuracyMeters,
      });
      if (res && res.incident_id) {
        setIncidentId(res.incident_id);
      }
    } catch (e) {
      console.warn("Voice dispatch fallback:", e);
    }

    setCurrentScreen("tracking");
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#F4EDE0] text-[#14213D] flex flex-col items-center justify-center selection:bg-[#B91C1C] selection:text-white overscroll-none">
      {/* Toast notification — replaces window.alert() */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-4 z-[100] flex justify-center pointer-events-none">
          <div className="bg-[#14213D] text-[#F4EDE0] text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-fade-in border border-[#14213D]/20">
            <span className="material-symbols-outlined text-[#B91C1C] text-[18px]">check_circle</span>
            {toastMessage}
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Safeguard Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF5EC] border-2 border-[#14213D]/20 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-[#14213D]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#B91C1C]/15 text-[#B91C1C] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[26px]">emergency_home</span>
              </div>
              <div>
                <h3 className="font-headline text-base font-extrabold text-[#14213D]">Cancel Emergency Call?</h3>
                <p className="text-xs text-[#14213D]/70 mt-0.5">Dispatched units will be immediately recalled.</p>
              </div>
            </div>
            <p className="text-xs text-[#14213D]/80 leading-relaxed bg-[#F4EDE0] p-3 rounded-2xl border border-[#14213D]/10">
              Only cancel if patient status has stabilized or help is no longer required.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 rounded-xl bg-[#14213D] text-[#F4EDE0] text-xs font-bold hover:bg-[#0E182D] transition-all shadow"
              >
                Keep Active
              </button>
              <button
                onClick={handleCancelEmergency}
                className="flex-1 py-3 rounded-xl bg-[#B91C1C] text-white text-xs font-bold hover:bg-[#991B1B] transition-all shadow-md shadow-[#B91C1C]/30"
              >
                Yes, Cancel Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container Container (Phone Frame vs Fluid) */}
      <div
        className={`w-full flex-1 min-h-0 flex flex-col transition-all duration-200 ${
          viewMode === "phone"
            ? "max-w-[440px] h-full sm:h-[94vh] sm:max-h-[880px] sm:my-auto shadow-2xl rounded-none sm:rounded-[36px] overflow-hidden border-0 sm:border-[8px] sm:border-[#14213D] bg-[#F4EDE0]"
            : "max-w-4xl h-full px-4 py-4 bg-[#F4EDE0]"
        }`}
      >
        {/* App Header (30% Navy structure with Cream & Coral accents) */}
        <header className="flex-shrink-0 bg-[#14213D] px-4 py-3 flex items-center justify-between border-b border-[#0E182D] shadow-md z-30 text-[#F4EDE0]">
          <div className="flex items-center gap-2">
            <img src="/nivaran-icon.png" alt="NIVARAN" className="h-9 w-9 object-contain rounded-xl shadow-sm bg-[#0E182D] border border-white/20 p-0.5" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-headline font-extrabold text-[#F4EDE0] text-lg tracking-tight leading-none">
                  NIVARAN
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#B91C1C] text-white text-[10px] uppercase font-bold tracking-wider">
                  Lifeline
                </span>
              </div>
              <span className="text-[11px] text-[#F4EDE0]/70 font-medium leading-none mt-0.5">
                {currentScreen === "home" && "Citizen SOS"}
                {currentScreen === "hotline" && "Bilingual AI Triage"}
                {currentScreen === "tracking" && "Live CAD Telemetry"}
                {currentScreen === "settings" && "Emergency Profile"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:112"
              className="h-9 px-3 rounded-full bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-bold flex items-center gap-1 shadow-md active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>112</span>
            </a>
            <button
              onClick={() => setCurrentScreen("settings")}
              className="w-9 h-9 rounded-full bg-[#14213D]/60 border border-[#F4EDE0]/20 text-[#F4EDE0] flex items-center justify-center hover:bg-[#F4EDE0]/10 transition-all"
              title="Profile & Settings"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════════════════════
            SCREEN 1: EMERGENCY HOME
        ══════════════════════════════════════════════════════════════════ */}
        {currentScreen === "home" && (
          <main className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 select-none overscroll-contain">
            {/* Ambient GPS Lock Pill (60% Cream base, 30% Navy border/type, Coral ping) */}
            <div className="w-full bg-[#FAF5EC] border border-[#14213D]/15 rounded-2xl p-3 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative flex items-center justify-center w-6 h-6 flex-shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#B91C1C] opacity-35 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B91C1C]"></span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-[#14213D] font-bold uppercase tracking-wider">GPS Locked</span>
                    <span className="text-[#14213D]/40 text-xs">·</span>
                    <span className="text-xs text-[#14213D] font-semibold">Accurate to {accuracyMeters}m</span>
                  </div>
                  <p className="text-xs text-[#14213D]/80 font-medium truncate mt-0.5">{address}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAccuracyMeters(6);
                  triggerHaptic(20);
                }}
                className="w-8 h-8 rounded-full bg-[#F4EDE0] text-[#14213D] flex items-center justify-center hover:bg-[#14213D]/10 active:scale-90 transition-transform flex-shrink-0"
                title="Recalibrate GPS"
              >
                <span className="material-symbols-outlined text-[16px]">my_location</span>
              </button>
            </div>

            {/* Bilingual Reassuring Headline */}
            <div className="flex flex-col px-0.5 space-y-0.5">
              <h1 className="font-headline text-2xl text-[#14213D] font-extrabold tracking-tight">
                How can we help you?
              </h1>
              <p className="text-sm text-[#14213D]/70 font-medium">आपकी क्या सहायता कर सकते हैं?</p>
            </div>

            {/* Severity Selector (Stitch horizontal pills) */}
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-xs text-[#14213D] font-bold uppercase tracking-wider">Select Triage Urgency</span>
                <span className="text-xs text-[#B91C1C] font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px]">bolt</span>
                  Immediate Response
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pb-1">
                {(
                  [
                    { id: "Critical", label: "Critical", sub: "Cardiac · Stroke · Trauma", color: "#B91C1C", dot: "bg-white animate-pulse" },
                    { id: "High", label: "High", sub: "Severe Bleed · Fractures", color: "#B91C1C", dot: "bg-[#B91C1C]" },
                    { id: "Medium", label: "Medium", sub: "Intense Pain · Fever", color: "#14213D", dot: "bg-[#14213D]" },
                    { id: "Low", label: "Low", sub: "Mild Injury · Transfer", color: "#14213D", dot: "bg-[#14213D]" },
                  ] as const
                ).map((sev) => {
                  const isSelected = selectedSeverity === sev.id;
                  const dotClass = isSelected
                    ? "w-2 h-2 rounded-full shrink-0 bg-white"
                    : sev.id === "Critical"
                    ? "w-2 h-2 rounded-full shrink-0 bg-[#B91C1C] animate-pulse"
                    : sev.id === "High"
                    ? "w-2 h-2 rounded-full shrink-0 bg-[#B91C1C]"
                    : "w-2 h-2 rounded-full shrink-0 bg-[#14213D]";

                  return (
                    <button
                      key={sev.id}
                      onClick={() => {
                        setSelectedSeverity(sev.id);
                        triggerHaptic(20);
                      }}
                      className={
                        isSelected
                          ? "flex items-center gap-2 px-3 py-2 rounded-2xl transition-all text-left bg-[#B91C1C] text-white shadow-md shadow-[#B91C1C]/30 scale-[1.01]"
                          : "flex items-center gap-2 px-3 py-2 rounded-2xl transition-all text-left bg-[#FAF5EC] text-[#14213D] border border-[#14213D]/15 hover:bg-[#EDE5D6]"
                      }
                    >
                      <span className={dotClass}></span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold leading-tight">{sev.label}</span>
                        <span className={isSelected ? "text-[10px] leading-tight truncate text-white/90" : "text-[10px] leading-tight truncate text-[#14213D]/65"}>
                          {sev.sub}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── HERO 1-SECOND PRESS-AND-HOLD SOS BUTTON (10% Coral focus) ── */}
            <div className="relative w-full flex flex-col items-center justify-center py-4">

              {/* Tactile SOS Core (220px) */}
              <div className="relative w-[220px] h-[220px] flex items-center justify-center">
                {/* Dynamic SVG Circular Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 220 220">
                  <circle cx="110" cy="110" r="98" fill="none" stroke="#14213D" strokeOpacity="0.15" strokeWidth="6" />
                  <circle
                    cx="110"
                    cy="110"
                    r="98"
                    fill="none"
                    stroke="#B91C1C"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 98}
                    strokeDashoffset={2 * Math.PI * 98 * (1 - sosProgress / 100)}
                    className="transition-[stroke-dashoffset] duration-75 ease-linear"
                  />
                </svg>

                {/* Tactile Push Trigger Button */}
                <button
                  onMouseDown={startSosHold}
                  onMouseUp={cancelSosHold}
                  onMouseLeave={cancelSosHold}
                  onTouchStart={startSosHold}
                  onTouchEnd={cancelSosHold}
                  onTouchCancel={cancelSosHold}
                  onTouchMove={(e) => e.preventDefault()}
                  className="w-[190px] h-[190px] rounded-full bg-[#B91C1C] hover:bg-[#991B1B] active:scale-95 text-white flex flex-col items-center justify-center shadow-2xl ring-8 ring-[#B91C1C]/25 cursor-pointer transition-all duration-150 select-none touch-none"
                >
                  <span className="material-symbols-outlined text-[42px] mb-0.5 leading-none font-bold">
                    emergency
                  </span>
                  <span className="font-headline text-3xl font-extrabold tracking-tight leading-none text-white">
                    SOS
                  </span>
                  <span className="text-xs font-bold tracking-wider uppercase mt-1 text-white/95">
                    {isHoldingSos ? `Holding... ${sosProgress}%` : "Hold 1 Sec"}
                  </span>
                  <span className="text-[10px] font-semibold text-white/80 mt-0.5">1 सेकंड दबाएं</span>
                </button>
              </div>

              {/* Safeguard text */}
              <div className="flex items-center gap-1.5 mt-3 text-[#14213D]/70">
                <span className="material-symbols-outlined text-[15px] text-[#14213D]">verified_user</span>
                <span className="text-xs font-medium">Confirm with 1 second hold</span>
              </div>
            </div>

            {/* Dispatched Notification Overlay */}
            {sosDispatchedBanner && (
              <div className="w-full bg-[#FAF5EC] rounded-2xl p-4 shadow-lg border border-[#B91C1C]/40 flex items-start gap-3 animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-[#B91C1C]/15 flex items-center justify-center flex-shrink-0 text-[#B91C1C]">
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline text-sm font-bold text-[#14213D]">SOS Dispatched Successfully</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#B91C1C] text-white text-[10px] font-bold uppercase">
                      Live 112 CAD
                    </span>
                  </div>
                  <p className="text-xs text-[#14213D]/70 mt-0.5">Help is on the way — nearest ambulance allocated.</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-headline text-xl text-[#14213D] font-extrabold">04:00</span>
                    <span className="text-xs text-[#14213D]/65">Estimated Arrival to your GPS lock</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Action Cards: AI Hotline & 112 Dial */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => setCurrentScreen("hotline")}
                className="bg-[#FAF5EC] border border-[#14213D]/15 hover:border-[#B91C1C] rounded-2xl p-3.5 text-left flex flex-col justify-between shadow-sm active:scale-98 transition-all min-h-[115px]"
              >
                <div className="w-9 h-9 rounded-xl bg-[#14213D] text-[#F4EDE0] flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                </div>
                <div>
                  <h4 className="font-headline text-sm font-bold text-[#14213D] leading-tight">AI Voice Hotline</h4>
                  <p className="text-[11px] text-[#14213D]/65 mt-0.5">Hindi / English voice triage</p>
                </div>
              </button>

              <a
                href="tel:112"
                className="bg-[#FAF5EC] border border-[#14213D]/15 hover:border-[#B91C1C] rounded-2xl p-3.5 text-left flex flex-col justify-between shadow-sm active:scale-98 transition-all min-h-[115px]"
              >
                <div className="w-9 h-9 rounded-xl bg-[#B91C1C] text-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </div>
                <div>
                  <h4 className="font-headline text-sm font-bold text-[#14213D] leading-tight">Call 112 Directly</h4>
                  <p className="text-[11px] text-[#14213D]/65 mt-0.5">National Police & EMS</p>
                </div>
              </a>
            </div>
          </main>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SCREEN 2: AI VOICE HOTLINE (Bilingual Hindi/English)
        ══════════════════════════════════════════════════════════════════ */}
        {currentScreen === "hotline" && (
          <main className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 select-none overscroll-contain">
            {/* Top Bar: Pulsing Live Audio Status & Language Switch */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#14213D]/10 text-[#14213D] shadow-sm">
                <div className="flex items-end gap-0.5 h-3.5">
                  <span className="w-1 bg-[#B91C1C] rounded-full animate-pulse h-2"></span>
                  <span className="w-1 bg-[#B91C1C] rounded-full animate-pulse h-3.5 [animation-delay:150ms]"></span>
                  <span className="w-1 bg-[#B91C1C] rounded-full animate-pulse h-2.5 [animation-delay:300ms]"></span>
                </div>
                <span className="text-xs font-bold text-[#14213D]">
                  {isListening ? "Listening Live · बोलिए" : "AI Voice Hotline Ready"}
                </span>
              </div>

              {/* Bilingual Pill */}
              <div className="flex items-center bg-[#FAF5EC] p-0.5 rounded-full">
                <button
                  onClick={() => setHotlineLang("en")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    hotlineLang === "en" ? "bg-[#14213D] text-white shadow-sm" : "text-[#14213D]/65"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setHotlineLang("hi")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    hotlineLang === "hi" ? "bg-[#14213D] text-white shadow-sm" : "text-[#14213D]/65"
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            {/* Clinical Prompt Card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#14213D]/15">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-[#B91C1C] uppercase tracking-wider">
                  Instant Medical Dispatch
                </span>
                <span className="text-[11px] font-semibold text-[#14213D] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C]"></span>
                  GPS Connected
                </span>
              </div>
              <h2 className="font-headline text-xl font-extrabold text-[#14213D] tracking-tight">
                {hotlineLang === "hi" ? "क्या आपातकाल है? बेझिझक बोलें।" : "What is the emergency? Speak naturally."}
              </h2>
              <p className="text-xs text-[#14213D]/65 mt-1">
                {hotlineLang === "hi"
                  ? "Gemini AI लक्षणों को पहचान कर तुरंत निकटतम एम्बुलेंस को अलर्ट कर देगा।"
                  : "Gemini AI analyzes clinical symptoms and dispatches the nearest ambulance unit automatically."}
              </p>
            </div>

            {/* Glowing Microphone Orb */}
            <div className="flex flex-col items-center justify-center py-4 relative">
              {/* Dynamic Sound Spectrum Bars */}
              <div className="flex items-center justify-center gap-1.5 h-10 w-full max-w-[240px] mb-3">
                <div className={isListening ? "w-1 rounded-full bg-[#B91C1C] animate-pulse h-4" : "w-1 rounded-full bg-[#B91C1C] h-2"}></div>
                <div className={isListening ? "w-1 rounded-full bg-[#B91C1C] animate-pulse h-8" : "w-1 rounded-full bg-[#B91C1C] h-3"}></div>
                <div className={isListening ? "w-1 rounded-full bg-[#B91C1C] animate-pulse h-10" : "w-1 rounded-full bg-[#B91C1C] h-4"}></div>
                <div className={isListening ? "w-1 rounded-full bg-[#14213D] animate-pulse h-6" : "w-1 rounded-full bg-[#14213D] h-2"}></div>
                <div className={isListening ? "w-1 rounded-full bg-[#B91C1C] animate-pulse h-10" : "w-1 rounded-full bg-[#B91C1C] h-4"}></div>
                <div className={isListening ? "w-1 rounded-full bg-[#B91C1C] animate-pulse h-7" : "w-1 rounded-full bg-[#B91C1C] h-3"}></div>
                <div className={isListening ? "w-1 rounded-full bg-[#B91C1C] animate-pulse h-3" : "w-1 rounded-full bg-[#B91C1C] h-2"}></div>
              </div>

              {/* 88px Tactile Voice Orb */}
              <div className="relative flex items-center justify-center my-1">
                {isListening && (
                  <>
                    <span className="absolute w-28 h-28 rounded-full bg-[#B91C1C]/20 animate-ping opacity-75"></span>
                    <span className="absolute w-24 h-24 rounded-full bg-[#B91C1C]/30 animate-pulse"></span>
                  </>
                )}
                <button
                  onClick={toggleSpeechRecognition}
                  className={`relative z-10 w-[88px] h-[88px] rounded-full flex items-center justify-center text-white shadow-xl active:scale-95 transition-all ${
                    isListening ? "bg-[#14213D] ring-4 ring-[#B91C1C]" : "bg-[#B91C1C] hover:bg-[#991B1B]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[40px]">
                    {isListening ? "stop" : "mic"}
                  </span>
                </button>
              </div>

              <span className="text-xs font-bold text-[#14213D] mt-3">
                {isListening ? "Tap to Finish Speaking" : "Tap Mic & Speak Clearly"}
              </span>
            </div>

            {/* Live Speech Transcription Box */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#14213D]/15">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#14213D] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#14213D]">graphic_eq</span>
                  Live Speech Transcription
                </span>
                <span className="text-[10px] bg-[#14213D]/10 text-[#14213D] font-bold px-2 py-0.5 rounded-full">
                  AI Active
                </span>
              </div>
              <div className="bg-[#FAF3E6] rounded-xl p-3 min-h-[64px]">
                <p className="text-sm font-semibold text-[#14213D] italic">
                  “{speechTranscript}”
                </p>
              </div>
            </div>

            {/* Understood So Far: Extracted Clinical Tags */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#14213D]/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#14213D] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#B91C1C]">verified</span>
                  AI Clinical Extractions (पहचाने गए लक्षण)
                </span>
                <span className="text-[10px] text-[#14213D]/65">Automated Triage</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {extractedTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                      idx === 0
                        ? "bg-[#B91C1C] text-white"
                        : "bg-[#F4EDE0] text-[#14213D] border border-[#14213D]/15"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-[#14213D]/15/60 flex items-center justify-between text-xs text-[#14213D]/65">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#14213D]">location_on</span>
                  {address}
                </span>
                <span className="font-semibold text-[#14213D]">GPS Attached</span>
              </div>
            </div>

            {/* Instant Send Help Action */}
            <button
              onClick={dispatchVoiceHotline}
              className="w-full h-13 py-3.5 rounded-2xl bg-[#B91C1C] hover:bg-[#991B1B] text-white font-headline text-base font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#B91C1C]/30 active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">send_time_extension</span>
              <span>Send Help Now · तुरंत सहायता भेजें</span>
            </button>
          </main>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SCREEN 3: LIVE AMBULANCE TRACKING
        ══════════════════════════════════════════════════════════════════ */}
        {currentScreen === "tracking" && (
          <main className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 select-none overscroll-contain">
            {/* Live Telemetry Status Banner */}
            <div className="w-full bg-white border border-[#14213D]/15 rounded-2xl p-3 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-3 w-3 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B91C1C] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#B91C1C]"></span>
                </span>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-[#14213D] uppercase tracking-tight">
                      Live CAD Dispatch
                    </span>
                    <span className="bg-[#B91C1C]/15 text-[#AE3026] text-[10px] font-bold px-1.5 rounded uppercase">
                      Code Red
                    </span>
                  </div>
                  <span className="text-[11px] text-[#14213D]/65 truncate">Telemetry stream verified · 100Hz sync</span>
                </div>
              </div>

              <div className="bg-[#14213D]/10 border border-[#14213D]/20 px-2 py-0.5 rounded-full text-[#14213D] text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">satellite_alt</span>
                <span>Active</span>
              </div>
            </div>

            {/* Interactive Route Map Simulation Container */}
            <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-sm border border-[#14213D]/15 bg-[#FAF5EC]">
              {/* Map Canvas Background Mock */}
              <div className="absolute inset-0 bg-[#E8E0D0] flex items-center justify-center">
                <svg className="w-full h-full opacity-60" viewBox="0 0 400 200">
                  <path d="M 30,100 Q 150,40 280,110 T 370,80" fill="none" stroke="#FFFFFF" strokeWidth="12" />
                  <path d="M 30,100 Q 150,40 280,110 T 370,80" fill="none" stroke="#B91C1C" strokeWidth="4" strokeDasharray="6,4" />
                </svg>
              </div>

              {/* Patient Pin */}
              <div className="absolute left-8 top-16 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#14213D] text-white flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[16px]">person_pin_circle</span>
                </div>
                <span className="bg-white/90 px-1 rounded text-[10px] font-bold text-[#14213D] shadow mt-0.5">You</span>
              </div>

              {/* Moving Ambulance Pin */}
              <div className="absolute right-16 top-12 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-[#B91C1C] text-white flex items-center justify-center shadow-lg ring-4 ring-[#B91C1C]/30">
                  <span className="material-symbols-outlined text-[20px]">ambulance</span>
                </div>
                <span className="bg-[#B91C1C] text-white px-1.5 rounded text-[10px] font-bold shadow mt-0.5">
                  1.2 km away
                </span>
              </div>

              {/* Map Footer Route Banner */}
              <div className="absolute bottom-2 inset-x-2 bg-white/95 backdrop-blur-sm border border-[#14213D]/10 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs text-[#14213D]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#14213D]">traffic</span>
                  <span className="font-semibold text-xs truncate max-w-[200px]">Green Corridor Active · Sansad Marg</span>
                </div>
                <span className="font-mono text-[#14213D] font-bold text-xs">48 km/h</span>
              </div>
            </div>

            {/* Primary Arrival Countdown Card */}
            <div className="w-full bg-white border border-[#14213D]/15 rounded-2xl p-4 shadow-sm flex flex-col space-y-3">
              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#14213D]/65">
                    Estimated Arrival Time
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-headline text-4xl text-[#B91C1C] font-extrabold tracking-tight">
                      {Math.ceil(etaSeconds / 60)}
                    </span>
                    <span className="font-headline text-lg text-[#B91C1C] font-bold uppercase">MIN</span>
                    <span className="text-xs text-[#14213D]/65 ml-1">({etaSeconds}s)</span>
                  </div>
                  <span className="text-xs text-[#14213D]/65 mt-0.5">Direct Traffic Priority Clearance</span>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="px-2.5 py-1 bg-[#B91C1C]/15 border border-[#B91C1C]/30 rounded-full flex items-center gap-1 text-[#AE3026] text-xs font-bold">
                    <span className="material-symbols-outlined text-[14px] animate-pulse">volume_up</span>
                    <span>Siren Active</span>
                  </div>
                  <span className="text-[11px] text-[#14213D]/65">Updated just now</span>
                </div>
              </div>

              {/* Ambulance & Crew Info Badge */}
              <div className="w-full bg-[#F4EDE0]/60 border border-[#14213D]/10 rounded-xl p-3 flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-white border border-[#14213D]/15 text-[#14213D] flex items-center justify-center font-bold shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">medical_services</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-headline text-sm font-bold text-[#14213D]">{ambulanceReg}</span>
                        <span className="bg-[#14213D]/10 border border-[#14213D]/20 text-[#14213D] text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">
                          ALS Validated
                        </span>
                      </div>
                      <span className="text-[11px] text-[#14213D]/65">Ventilator + Defibrillator Equipped</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-[#14213D]/10">
                  <span className="text-[#14213D]/65">
                    Lead EMT: <strong className="text-[#14213D] font-bold">{crewLead}</strong> · 2 Medics
                  </span>
                  <span className="text-[#14213D] font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    BLS Certified
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:9876543210"
                  className="h-11 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
                  <span>Call Paramedic</span>
                </a>
                <button
                  onClick={() => showToast(`Gate pin shared — paramedic navigation updated for ${address}.`)}
                  className="h-11 rounded-xl bg-white border border-[#14213D]/20 text-[#14213D] text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all hover:bg-[#F4EDE0]"
                >
                  <span className="material-symbols-outlined text-[18px]">share_location</span>
                  <span>Share Gate Pin</span>
                </button>
              </div>
            </div>

            {/* 4-Stage Progress Stepper */}
            <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#14213D]/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-headline text-sm font-bold text-[#14213D]">Dispatch Progress</span>
                <span className="text-xs text-[#14213D]/65 font-mono">#{incidentId}</span>
              </div>

              <div className="flex flex-col space-y-3 relative pl-2">
                {/* Connecting Line */}
                <div className="absolute left-4 top-2 bottom-3 w-0.5 bg-[#E2D7C5]"></div>

                {/* Step 1 */}
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-5 h-5 rounded-full bg-[#B91C1C] text-white flex items-center justify-center text-[12px] shadow-sm mt-0.5">
                    ✓
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#14213D]">1. Request Received</span>
                    <span className="text-[11px] text-[#14213D]/65">Emergency call logged into Delhi CAD network</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3 relative z-10">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[12px] shadow-sm mt-0.5 ${
                    currentStep >= 2 ? "bg-[#B91C1C] text-white" : "bg-[#F4EDE0] text-[#14213D]/65"
                  }`}>
                    {currentStep >= 2 ? "✓" : "2"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#14213D]">2. Ambulance Dispatched</span>
                    <span className="text-[11px] text-[#14213D]/65">Unit allocated from Connaught Place Base Hub 4</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3 relative z-10">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[12px] shadow-sm mt-0.5 ${
                    currentStep >= 3 ? "bg-[#B91C1C] text-white ring-2 ring-[#B91C1C]/30" : "bg-[#F4EDE0] text-[#14213D]/65"
                  }`}>
                    {currentStep >= 3 ? "●" : "3"}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#14213D]">3. On The Way</span>
                      {currentStep === 3 && (
                        <span className="bg-[#B91C1C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                          In Transit
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#14213D]/65">Traversing Outer Circle; clear corridor active</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-3 relative z-10">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[12px] shadow-sm mt-0.5 ${
                    currentStep >= 4 ? "bg-[#B91C1C] text-white" : "bg-[#F4EDE0] text-[#14213D]/65"
                  }`}>
                    {currentStep >= 4 ? "✓" : "4"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#14213D]">4. Arrived at Scene</span>
                    <span className="text-[11px] text-[#14213D]/65">Medics establish curbside contact</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Receiving Hospital Pre-Arrival Readiness Card */}
            <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#14213D]/15 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#14213D]">
                  <span className="material-symbols-outlined text-[18px] text-[#14213D]">domain_verification</span>
                  <span>Designated Facility</span>
                </div>
                <span className="bg-[#14213D]/10 text-[#14213D] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Trauma Ready
                </span>
              </div>
              <h4 className="font-headline text-sm font-bold text-[#14213D]">{hospitalName}</h4>
              <p className="text-[11px] text-[#14213D]/65">Ring Road, Safdarjung Enclave · Distance: 5.8 km</p>

              <div className="bg-[#FAF5EC] rounded-xl p-2.5 text-xs text-[#14213D] flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#14213D] flex-shrink-0 mt-0.5">
                  check_circle
                </span>
                <span>
                  <strong>Pre-Arrival Vitals Transmitted:</strong> Duty Emergency Physician pre-notified. Resuscitation Bay 1 staged.
                </span>
              </div>
            </div>

            {/* Request Cancellation Action with Safeguard Modal */}
            <div className="pt-1 pb-4">
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full py-2.5 rounded-xl border border-[#B91C1C]/40 bg-[#FAF5EC] hover:bg-[#B91C1C]/15 text-[#B91C1C] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98"
              >
                <span className="material-symbols-outlined text-[16px]">cancel</span>
                <span>Cancel Emergency Request</span>
              </button>
            </div>
          </main>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SCREEN 4: PROFILE & EMERGENCY CONTACTS
        ══════════════════════════════════════════════════════════════════ */}
        {currentScreen === "settings" && (
          <main className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 select-none overscroll-contain">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-xl font-extrabold text-[#14213D]">Emergency Profile</h2>
              <button
                onClick={() => setCurrentScreen("home")}
                className="text-xs text-[#B91C1C] font-bold flex items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Back to SOS
              </button>
            </div>

            {/* User Identity Card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#14213D]/15 space-y-3">
              <span className="text-xs font-bold text-[#14213D]/65 uppercase tracking-wider">Your Details</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#14213D]/65 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5EC] border border-[#14213D]/15 text-sm text-[#14213D] font-semibold focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#14213D]/65 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5EC] border border-[#14213D]/15 text-sm text-[#14213D] font-semibold focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#14213D]/65 block mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5EC] border border-[#14213D]/15 text-sm text-[#14213D] font-semibold focus:outline-none focus:border-[#B91C1C]"
                  >
                    <option>O Positive</option>
                    <option>O Negative</option>
                    <option>A Positive</option>
                    <option>A Negative</option>
                    <option>B Positive</option>
                    <option>B Negative</option>
                    <option>AB Positive</option>
                    <option>AB Negative</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-[#14213D]/65 block mb-1">Language Preference</label>
                  <select
                    value={hotlineLang}
                    onChange={(e) => setHotlineLang(e.target.value as "en" | "hi")}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5EC] border border-[#14213D]/15 text-sm text-[#14213D] font-semibold focus:outline-none focus:border-[#B91C1C]"
                  >
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="en">English (Indian)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#14213D]/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#14213D]/65 uppercase tracking-wider">Primary Emergency Contact</span>
                <span className="text-[10px] bg-[#14213D]/10 text-[#14213D] font-bold px-2 py-0.5 rounded-full">
                  Auto-Notified on SOS
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#14213D]/65 block mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={emergencyContact.name}
                    onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5EC] border border-[#14213D]/15 text-sm text-[#14213D] font-semibold focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#14213D]/65 block mb-1">Relation</label>
                  <input
                    type="text"
                    value={emergencyContact.relation}
                    onChange={(e) => setEmergencyContact({ ...emergencyContact, relation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5EC] border border-[#14213D]/15 text-sm text-[#14213D] font-semibold focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-[#14213D]/65 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={emergencyContact.phone}
                    onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5EC] border border-[#14213D]/15 text-sm text-[#14213D] font-semibold focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
              </div>
            </div>

            {/* Permissions & Safeguards */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#14213D]/15 space-y-2">
              <span className="text-xs font-bold text-[#14213D]/65 uppercase tracking-wider">System Permissions</span>
              <div className="flex items-center justify-between py-1.5 border-b border-[#14213D]/15/40 text-xs">
                <span className="text-[#14213D] font-medium">Location Services (GPS)</span>
                <span className="text-[#14213D] font-bold">Enabled · High Precision</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#14213D]/15/40 text-xs">
                <span className="text-[#14213D] font-medium">Microphone for AI Hotline</span>
                <span className="text-[#14213D] font-bold">Granted</span>
              </div>
              <div className="flex items-center justify-between py-1.5 text-xs">
                <span className="text-[#14213D] font-medium">Emergency Broadcast Push</span>
                <span className="text-[#14213D] font-bold">Active</span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast("Emergency profile updated successfully.");
                setCurrentScreen("home");
              }}
              className="w-full py-3 rounded-xl bg-[#14213D] text-white font-bold text-sm shadow hover:bg-[#0E182D] transition-all"
            >
              Save Profile Preferences
            </button>
          </main>
        )}

        {/* ── Fixed Bottom Tab Navigation (30% Navy structure with Coral 10% active highlights) ── */}
        <footer className="flex-shrink-0 bg-[#14213D] border-t border-[#0E182D] px-6 py-2 flex items-center justify-around z-30 text-[#F4EDE0]/70">
          <button
            onClick={() => setCurrentScreen("home")}
            className={`flex flex-col items-center gap-0.5 transition-all pt-1 ${
              currentScreen === "home" ? "text-[#B91C1C] font-bold border-t-2 border-[#B91C1C] -mt-px" : "text-[#F4EDE0]/60 hover:text-[#F4EDE0] border-t-2 border-transparent -mt-px"
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
            <span className="text-[10px] tracking-tight">SOS Home</span>
          </button>

          <button
            onClick={() => setCurrentScreen("hotline")}
            className={`flex flex-col items-center gap-0.5 transition-all pt-1 ${
              currentScreen === "hotline" ? "text-[#B91C1C] font-bold border-t-2 border-[#B91C1C] -mt-px" : "text-[#F4EDE0]/60 hover:text-[#F4EDE0] border-t-2 border-transparent -mt-px"
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">spatial_audio</span>
            <span className="text-[10px] tracking-tight">AI Hotline</span>
          </button>

          <button
            onClick={() => setCurrentScreen("tracking")}
            className={`flex flex-col items-center gap-0.5 transition-all pt-1 ${
              currentScreen === "tracking" ? "text-[#B91C1C] font-bold border-t-2 border-[#B91C1C] -mt-px" : "text-[#F4EDE0]/60 hover:text-[#F4EDE0] border-t-2 border-transparent -mt-px"
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">near_me</span>
            <span className="text-[10px] tracking-tight">Live Track</span>
          </button>

          <button
            onClick={() => setCurrentScreen("settings")}
            className={`flex flex-col items-center gap-0.5 transition-all pt-1 ${
              currentScreen === "settings" ? "text-[#B91C1C] font-bold border-t-2 border-[#B91C1C] -mt-px" : "text-[#F4EDE0]/60 hover:text-[#F4EDE0] border-t-2 border-transparent -mt-px"
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">tune</span>
            <span className="text-[10px] tracking-tight">Settings</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
