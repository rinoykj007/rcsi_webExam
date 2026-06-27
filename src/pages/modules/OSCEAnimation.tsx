import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ── Scene config ──────────────────────────────────────────────────────────────

const SCENES = [
  { id: "intro",    label: "Welcome",         duration: 5000 },
  { id: "needle",   label: "The Scenario",    duration: 7000 },
  { id: "osce",     label: "OSCE Overview",   duration: 6500 },
  { id: "room",     label: "In the Room",     duration: 6500 },
  { id: "stations", label: "Stations",        duration: 7000 },
  { id: "scenario", label: "Example",         duration: 7000 },
  { id: "scoring",  label: "Scoring",         duration: 7000 },
];

// ── SVG Character helpers ─────────────────────────────────────────────────────

function TutorFigure({ x, y, pointing = false }: { x: number; y: number; pointing?: boolean }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* head */}
      <circle cx="0" cy="-52" r="16" fill="#FBBF24" />
      {/* hair */}
      <ellipse cx="0" cy="-65" rx="16" ry="9" fill="#374151" />
      {/* white coat */}
      <rect x="-18" y="-36" width="36" height="52" rx="4" fill="white" />
      {/* scrubs underneath */}
      <rect x="-13" y="-30" width="26" height="42" rx="2" fill="#3B82F6" />
      {/* lapels */}
      <path d="M-18,-36 L-7,-10 L0,-22 L7,-10 L18,-36" fill="white" />
      {/* stethoscope */}
      <path d="M-5,-15 Q-10,0 -8,8" stroke="#374151" strokeWidth="2" fill="none" />
      <circle cx="-8" cy="8" r="3" fill="#374151" />
      {/* legs */}
      <rect x="-12" y="16" width="10" height="30" rx="3" fill="#374151" />
      <rect x="2"   y="16" width="10" height="30" rx="3" fill="#374151" />
      {/* shoes */}
      <ellipse cx="-7" cy="47" rx="10" ry="4" fill="#111827" />
      <ellipse cx="7"  cy="47" rx="10" ry="4" fill="#111827" />
      {/* arms */}
      {pointing ? (
        <>
          <line x1="-18" y1="-18" x2="-32" y2="6"  stroke="#FBBF24" strokeWidth="9" strokeLinecap="round" />
          <line x1="18"  y1="-18" x2="62"  y2="8"  stroke="#FBBF24" strokeWidth="9" strokeLinecap="round" />
          <circle cx="62" cy="8" r="6" fill="#FBBF24" />
        </>
      ) : (
        <>
          <line x1="-18" y1="-18" x2="-32" y2="6" stroke="#FBBF24" strokeWidth="9" strokeLinecap="round" />
          <line x1="18"  y1="-18" x2="32"  y2="6" stroke="#FBBF24" strokeWidth="9" strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

function StudentFigure({ x, y, reachingForward = false }: { x: number; y: number; reachingForward?: boolean }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx="0" cy="-52" r="16" fill="#F87171" />
      <ellipse cx="0" cy="-63" rx="14" ry="7" fill="#7C3AED" />
      {/* scrubs */}
      <rect x="-16" y="-36" width="32" height="52" rx="4" fill="#0EA5E9" />
      <rect x="-11" y="-20" width="12" height="12" rx="2" fill="#0284C7" />
      {/* legs */}
      <rect x="-11" y="16" width="9" height="30" rx="3" fill="#0EA5E9" />
      <rect x="2"   y="16" width="9" height="30" rx="3" fill="#0EA5E9" />
      <ellipse cx="-6" cy="47" rx="9" ry="4" fill="#111827" />
      <ellipse cx="6"  cy="47" rx="9" ry="4" fill="#111827" />
      {/* arms */}
      {reachingForward ? (
        <>
          <line x1="-16" y1="-18" x2="-32" y2="6"   stroke="#F87171" strokeWidth="9" strokeLinecap="round" />
          <line x1="16"  y1="-18" x2="-10" y2="-2"  stroke="#F87171" strokeWidth="9" strokeLinecap="round" />
          <circle cx="-10" cy="-2" r="5" fill="#F87171" />
        </>
      ) : (
        <>
          <line x1="-16" y1="-18" x2="-30" y2="6" stroke="#F87171" strokeWidth="9" strokeLinecap="round" />
          <line x1="16"  y1="-18" x2="30"  y2="6" stroke="#F87171" strokeWidth="9" strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

function ClinicalTable({ x, y, hasSharpsBox = true, hasNeedle = true, needleGone = false }:
  { x: number; y: number; hasSharpsBox?: boolean; hasNeedle?: boolean; needleGone?: boolean }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* table top */}
      <rect x="-72" y="0"  width="144" height="10" rx="3" fill="#CBD5E1" />
      {/* legs */}
      <rect x="-62" y="10" width="8"   height="42" fill="#94A3B8" />
      <rect x="54"  y="10" width="8"   height="42" fill="#94A3B8" />
      {/* tray on top */}
      <rect x="-52" y="-22" width="104" height="22" rx="3" fill="#E2E8F0" />
      {/* sharps bin */}
      {hasSharpsBox && (
        <g>
          <rect x="28" y="-42" width="22" height="28" rx="3" fill="#FCD34D" />
          <rect x="25" y="-48" width="28" height="9"  rx="2" fill="#F59E0B" />
          <text x="39" y="-30" textAnchor="middle" fontSize="8" fill="#78350F" fontWeight="bold">⚠</text>
          <text x="39" y="-22" textAnchor="middle" fontSize="5" fill="#78350F">SHARPS</text>
        </g>
      )}
      {/* needle */}
      {hasNeedle && !needleGone && (
        <g>
          <rect x="-30" y="-16" width="36" height="5" rx="2" fill="#9CA3AF" />
          <polygon points="6,-18 18,-14 6,-10" fill="#EF4444" />
          <circle cx="-30" cy="-14" r="5" fill="#D1FAE5" stroke="#10B981" strokeWidth="1.5" />
        </g>
      )}
    </g>
  );
}

function SpeechBubble({ x, y, lines, tailLeft = true }:
  { x: number; y: number; lines: string[]; tailLeft?: boolean }) {
  const w = Math.max(...lines.map((l) => l.length)) * 7.5 + 24;
  const h = lines.length * 22 + 18;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="0" width={w} height={h} rx="10" fill="white" filter="url(#shadow)" />
      <rect x="0" y="0" width={w} height={h} rx="10" fill="none" stroke="#E2E8F0" strokeWidth="1.5" />
      {tailLeft
        ? <polygon points="-10,18 0,13 0,23" fill="white" />
        : <polygon points={`${w+10},18 ${w},13 ${w},23`} fill="white" />}
      {lines.map((line, i) => (
        <text key={i} x="12" y={22 + i * 22} fontSize="12" fill="#1E293B" fontFamily="Inter, sans-serif">{line}</text>
      ))}
    </g>
  );
}

// ── Scene 1 — Intro ───────────────────────────────────────────────────────────

function IntroScene() {
  const badges = [
    { emoji: "🏥", label: "14 Stations" },
    { emoji: "⏱", label: "10 Min Each" },
    { emoji: "✅", label: "Scored Live" },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 gap-0">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/30"
      >
        <span className="text-4xl">🏥</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.55 }}
        className="text-5xl font-bold text-white font-display leading-tight mb-3"
      >
        OSCE Practical Exam
      </motion.h1>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.75, duration: 0.5 }}
        className="h-1 w-48 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mb-5 origin-left"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="text-xl text-slate-300 mb-2"
      >
        Ireland Nursing Clinical Assessment
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.15, duration: 0.5 }}
        className="text-slate-400 max-w-md text-sm leading-relaxed mb-8"
      >
        Designed to simulate real nursing situations — assessed on real skills, not on actual patients.
      </motion.p>

      <div className="flex gap-3">
        {badges.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 + i * 0.15, type: "spring" }}
            className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-full px-4 py-2 text-sm text-slate-200"
          >
            <span>{b.emoji}</span>
            <span>{b.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Scene 2 — Needle pickup ───────────────────────────────────────────────────

function NeedleScene({ progress }: { progress: number }) {
  const phase = progress < 0.35 ? "observe" : progress < 0.7 ? "approach" : "pickup";

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-5 pb-1"
      >
        <h2 className="text-3xl font-bold text-white font-display">The Station Begins</h2>
        <p className="text-slate-400 text-sm mt-1">Your tutor sets the clinical scene</p>
      </motion.div>

      <div className="flex-1 flex items-center justify-center">
        <svg viewBox="0 0 640 300" className="w-full max-w-2xl">
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000040" />
            </filter>
          </defs>

          {/* floor */}
          <rect x="0" y="248" width="640" height="52" fill="#0F172A" />
          <line x1="0" y1="248" x2="640" y2="248" stroke="#1E293B" strokeWidth="2" />
          {/* wall */}
          <rect x="0" y="0" width="640" height="248" fill="#050D1A" />
          {/* skirting */}
          <rect x="0" y="238" width="640" height="10" fill="#172033" />

          {/* window */}
          <rect x="480" y="30" width="120" height="80" rx="4" fill="#1E3A5F" stroke="#334155" strokeWidth="2" />
          <line x1="540" y1="30" x2="540" y2="110" stroke="#334155" strokeWidth="1" />
          <line x1="480" y1="70" x2="600" y2="70" stroke="#334155" strokeWidth="1" />

          {/* tutor */}
          <motion.g initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
            <TutorFigure x={145} y={200} pointing />
          </motion.g>

          {/* speech bubble */}
          <motion.g initial={{ opacity: 0, scale: 0, originX: 185, originY: 100 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, type: "spring" }}>
            <SpeechBubble x={200} y={104} lines={["Please pick up", "the needle safely."]} tailLeft />
          </motion.g>

          {/* table */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <ClinicalTable x={360} y={218} hasSharpsBox needleGone={phase === "pickup"} />
          </motion.g>

          {/* student — walks closer in "approach" phase */}
          <motion.g
            animate={{ x: phase !== "observe" ? -35 : 0, opacity: 1 }}
            initial={{ x: 40, opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <StudentFigure x={498} y={200} reachingForward={phase === "pickup"} />
          </motion.g>

          {/* needle lifted when picked up */}
          {phase === "pickup" && (
            <motion.g initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -35 }} transition={{ duration: 0.6 }}>
              <rect x="423" y="196" width="30" height="5" rx="2" fill="#9CA3AF" />
              <polygon points="453,193 464,197 453,201" fill="#EF4444" />
            </motion.g>
          )}

          {/* examiner silhouette */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            <g transform="translate(590,200)">
              <circle cx="0" cy="-50" r="13" fill="#A78BFA" />
              <rect x="-12" y="-37" width="24" height="46" rx="3" fill="#4C1D95" />
              <rect x="-7" y="-10" width="14" height="20" rx="1" fill="white" />
              <text x="0" y="5" textAnchor="middle" fontSize="8" fill="#4C1D95">✓ ✓</text>
              <rect x="-11" y="9" width="9" height="22" rx="3" fill="#4C1D95" />
              <rect x="2"   y="9" width="9" height="22" rx="3" fill="#4C1D95" />
              <text x="0" y="43" textAnchor="middle" fontSize="8" fill="#A78BFA">Examiner</text>
            </g>
          </motion.g>
        </svg>
      </div>

      {/* safety tips */}
      <div className="flex gap-3 justify-center pb-5 px-6">
        {[
          { icon: "🧤", text: "Wear gloves first" },
          { icon: "⚠️", text: "Never recap needles" },
          { icon: "🗑️", text: "Dispose in sharps bin" },
        ].map((tip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 + i * 0.15 }}
            className="flex items-center gap-2 bg-amber-900/30 border border-amber-500/30 rounded-xl px-3 py-2 text-sm text-amber-200"
          >
            <span>{tip.icon}</span>
            <span>{tip.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Scene 3 — OSCE Overview ───────────────────────────────────────────────────

function OSCEScene() {
  const stats = [
    { n: "14", label: "Stations",         icon: "🏥", grad: "from-blue-500 to-cyan-500" },
    { n: "10", label: "Minutes Each",     icon: "⏱️", grad: "from-emerald-500 to-teal-500" },
    { n: "1–2", label: "Examiners",       icon: "👥", grad: "from-purple-500 to-violet-500" },
  ];
  const cards = [
    { icon: "📋", title: "Written Scenario", desc: "Posted outside AND inside each room" },
    { icon: "🎯", title: "Simulated Setting", desc: "Real skills — not on actual patients" },
    { icon: "🚶", title: "Station Rotation", desc: "Move through each in sequence" },
    { icon: "📊", title: "Live Scoring",     desc: "Examiners mark you as you work" },
  ];
  return (
    <div className="flex flex-col h-full px-8 py-5">
      <motion.h2 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-white text-center font-display mb-1">
        What is the OSCE?
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        className="text-slate-400 text-center text-sm mb-6">
        Objective Structured Clinical Examination
      </motion.p>

      <div className="grid grid-cols-3 gap-4 mb-5">
        {stats.map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.12, type: "spring", stiffness: 220 }}
            className="bg-slate-800/80 rounded-2xl p-4 text-center border border-slate-700"
          >
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className={`text-4xl font-black bg-gradient-to-r ${s.grad} bg-clip-text text-transparent`}>{s.n}</div>
            <div className="text-slate-400 text-xs mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {cards.map((c, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75 + i * 0.1 }}
            className="flex gap-3 items-start bg-slate-800/50 border border-slate-700/50 rounded-xl p-3"
          >
            <span className="text-2xl">{c.icon}</span>
            <div>
              <p className="text-white font-semibold text-sm">{c.title}</p>
              <p className="text-slate-400 text-xs mt-0.5">{c.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Scene 4 — In the Room ─────────────────────────────────────────────────────

function RoomScene() {
  const items = [
    { icon: "🛏️", text: "Mannequin or simulated patient",     delay: 0.4 },
    { icon: "👨‍⚕️", text: "1–2 examiners observing you",       delay: 0.6 },
    { icon: "💉", text: "IV stand with infusion bag",          delay: 0.8 },
    { icon: "🩺", text: "BP monitor & vitals equipment",       delay: 1.0 },
    { icon: "🩹", text: "Dressing tray & wound supplies",      delay: 1.2 },
    { icon: "📝", text: "Documentation & nursing record forms",delay: 1.4 },
  ];
  return (
    <div className="flex flex-col h-full px-6 py-5">
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="text-3xl font-bold text-white text-center font-display mb-1">
        Inside the Station Room
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-slate-400 text-center text-sm mb-5">
        Everything you need is already set up — just walk in and begin
      </motion.p>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* room illustration */}
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
          className="flex-shrink-0 flex items-center">
          <svg viewBox="0 0 230 250" className="w-52 h-auto">
            <rect x="8"  y="8"   width="214" height="222" rx="6" fill="#1E293B" stroke="#334155" strokeWidth="2" />
            <text x="115" y="28" textAnchor="middle" fontSize="10" fill="#64748B" fontFamily="Inter,sans-serif">STATION ROOM</text>

            {/* bed */}
            <rect x="20" y="50" width="90" height="130" rx="8" fill="#0F766E" />
            <rect x="20" y="50" width="90" height="35"  rx="8" fill="#134E4A" />
            <ellipse cx="65" cy="67" rx="20" ry="20" fill="#FCD34D" />
            <rect x="45" y="85" width="40" height="95" rx="5" fill="#F1F5F9" />

            {/* IV stand */}
            <line x1="152" y1="68" x2="152" y2="192" stroke="#94A3B8" strokeWidth="3" />
            <line x1="138" y1="68" x2="166" y2="68"  stroke="#94A3B8" strokeWidth="3" />
            <rect x="138" y="71" width="28" height="44" rx="4" fill="#BAE6FD" stroke="#7DD3FC" strokeWidth="1.5" />
            <text x="152" y="97" textAnchor="middle" fontSize="9" fill="#0C4A6E" fontFamily="Inter,sans-serif">IV</text>
            <line x1="152" y1="115" x2="152" y2="192" stroke="#7DD3FC" strokeWidth="1" strokeDasharray="4 3" />

            {/* vitals monitor */}
            <rect x="152" y="130" width="54" height="44" rx="5" fill="#1E3A5F" stroke="#3B82F6" strokeWidth="1.5" />
            <rect x="156" y="134" width="46" height="32" rx="3" fill="#050D1A" />
            <path d="M158,150 L164,150 L167,143 L170,157 L173,150 L200,150" stroke="#22C55E" strokeWidth="1.5" fill="none" />
            <text x="179" y="161" textAnchor="middle" fontSize="7" fill="#60A5FA" fontFamily="monospace">BP 120/80</text>

            {/* dressing tray */}
            <rect x="20"  y="192" width="70" height="8"  rx="2" fill="#E2E8F0" />
            <rect x="24"  y="184" width="62" height="9"  rx="2" fill="#E5E7EB" />
            <rect x="26"  y="174" width="14" height="11" rx="2" fill="#A7F3D0" />
            <rect x="44"  y="176" width="18" height="9"  rx="2" fill="#FCA5A5" />
            <rect x="65"  y="175" width="16" height="10" rx="2" fill="#FEF9C3" />

            {/* examiner */}
            <g transform="translate(192,158)">
              <circle cx="0" cy="-28" r="12" fill="#A78BFA" />
              <rect x="-12" y="-16" width="24" height="38" rx="4" fill="#4C1D95" />
              <rect x="-7"  y="0"   width="14" height="20" rx="2" fill="white" />
              <text x="0"   y="17" textAnchor="middle" fontSize="7" fill="#4C1D95" fontFamily="Inter,sans-serif">✓ ✓</text>
              <rect x="-10" y="22" width="8"  height="14" rx="3" fill="#4C1D95" />
              <rect x="2"   y="22" width="8"  height="14" rx="3" fill="#4C1D95" />
            </g>

            {/* door */}
            <rect x="178" y="8"  width="34" height="56" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
            <circle cx="182" cy="37" r="3" fill="#FCD34D" />
          </svg>
        </motion.div>

        {/* checklist */}
        <div className="flex-1 flex flex-col gap-2 justify-center">
          {items.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.delay }}
              className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/40 rounded-xl px-3 py-2.5"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-slate-200 text-sm flex-1">{item.text}</span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: item.delay + 0.3, type: "spring" }}
                className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0"
              >
                <span className="text-emerald-400 text-xs">✓</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Scene 5 — Typical Stations ────────────────────────────────────────────────

function StationsScene() {
  const stations = [
    { icon: "🩺", name: "Vital Signs",       desc: "Take & record accurately" },
    { icon: "💊", name: "Medication",         desc: "Safe administration" },
    { icon: "🩹", name: "Wound Dressing",     desc: "Sterile technique" },
    { icon: "🧼", name: "Hand Hygiene",       desc: "WHO 5 moments" },
    { icon: "📋", name: "Patient Assessment", desc: "Systematic head-to-toe" },
    { icon: "💬", name: "Communication",      desc: "Patient or family" },
    { icon: "📝", name: "Documentation",      desc: "Accurate nursing records" },
    { icon: "🚨", name: "Emergency Response", desc: "Deteriorating patient" },
  ];
  return (
    <div className="flex flex-col h-full px-8 py-5">
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="text-3xl font-bold text-white text-center font-display mb-1">
        Typical Stations
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-slate-400 text-center text-sm mb-5">
        Common clinical scenarios — prepare all 14 thoroughly
      </motion.p>

      <div className="grid grid-cols-4 gap-3 flex-1">
        {stations.map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 24, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.07, type: "spring", stiffness: 220 }}
            className="bg-slate-800/70 border border-slate-700/50 rounded-xl p-3 flex flex-col items-center text-center"
          >
            <motion.span
              className="text-3xl mb-2"
              animate={{ rotate: [0, -6, 6, 0] }}
              transition={{ delay: 0.55 + i * 0.07, duration: 0.45 }}
            >
              {s.icon}
            </motion.span>
            <p className="text-white text-xs font-semibold leading-tight">{s.name}</p>
            <p className="text-slate-500 text-xs mt-0.5">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
        className="mt-4 bg-blue-900/25 border border-blue-500/30 rounded-xl p-3 text-center">
        <p className="text-blue-300 text-sm">💡 You won't know which stations you'll face — practise every one</p>
      </motion.div>
    </div>
  );
}

// ── Scene 6 — Example Scenario ────────────────────────────────────────────────

function ScenarioScene() {
  const steps = [
    "Wash hands and don PPE",
    "Introduce yourself — confirm patient identity",
    "Explain the wound dressing procedure clearly",
    "Maintain strict sterile field throughout",
    "Clean and dress the wound safely",
    "Document findings accurately",
  ];
  return (
    <div className="flex flex-col h-full px-8 py-5">
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="text-3xl font-bold text-white text-center font-display mb-5">
        Example Station Scenario
      </motion.h2>

      <div className="flex gap-5 flex-1 min-h-0">
        {/* station card */}
        <motion.div
          initial={{ opacity: 0, rotateY: -70 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
          style={{ perspective: 800 }}
          className="flex-1 bg-amber-950/40 border-2 border-amber-600/50 rounded-2xl p-5 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📋</span>
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">Station Card</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 flex-1">
            <p className="text-slate-200 text-sm leading-relaxed italic">
              "Mr. John, age 65, has a leg wound requiring attention. Clean and dress the wound, explain the
              procedure to the patient, maintain sterile technique, and document your findings."
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-amber-900/50 text-amber-300 text-xs px-2 py-1 rounded-full">Wound Care</span>
            <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">10 minutes</span>
            <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">Station 6</span>
          </div>
        </motion.div>

        {/* numbered steps */}
        <div className="flex-1 flex flex-col gap-2">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            What you need to do
          </motion.p>
          {steps.map((step, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 + i * 0.13 }}
              className="flex items-start gap-3 bg-slate-800/60 rounded-xl px-3 py-2.5"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.75 + i * 0.13, type: "spring", stiffness: 300 }}
                className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0 mt-0.5"
              >
                <span className="text-emerald-400 text-xs font-bold">{i + 1}</span>
              </motion.div>
              <span className="text-slate-300 text-sm leading-snug">{step}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Scene 7 — Scoring ─────────────────────────────────────────────────────────

function ScoringScene() {
  const criteria = [
    { icon: "🧼", label: "Hand Hygiene",      desc: "WHO 5 moments — assessed from the moment you enter", color: "emerald" },
    { icon: "👋", label: "Introduction",       desc: "State your name & role, confirm patient identity",    color: "blue" },
    { icon: "💬", label: "Communication",      desc: "Clear, empathetic, patient-centred dialogue",         color: "purple" },
    { icon: "⚕️", label: "Safe Procedure",     desc: "Correct technique, safe sequencing, no shortcuts",    color: "amber" },
    { icon: "📝", label: "Documentation",      desc: "Accurate, legible, complete nursing record",          color: "rose" },
  ];
  const ring: Record<string, string> = {
    emerald: "border-emerald-500/50 bg-emerald-500/10",
    blue:    "border-blue-500/50 bg-blue-500/10",
    purple:  "border-purple-500/50 bg-purple-500/10",
    amber:   "border-amber-500/50 bg-amber-500/10",
    rose:    "border-rose-500/50 bg-rose-500/10",
  };
  const txt: Record<string, string> = {
    emerald: "text-emerald-300",
    blue:    "text-blue-300",
    purple:  "text-purple-300",
    amber:   "text-amber-300",
    rose:    "text-rose-300",
  };
  return (
    <div className="flex flex-col h-full px-8 py-5">
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="text-3xl font-bold text-white text-center font-display mb-1">
        How Examiners Score You
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-slate-400 text-center text-sm mb-5">
        Five core competency areas assessed at every station
      </motion.p>

      <div className="flex flex-col gap-2.5 flex-1 justify-center">
        {criteria.map((c, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.14 }}
            className={`flex items-center gap-4 rounded-xl p-3.5 border ${ring[c.color]}`}
          >
            <motion.span
              className="text-3xl w-9 text-center"
              initial={{ rotate: -120, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.14, type: "spring", stiffness: 250 }}
            >
              {c.icon}
            </motion.span>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${txt[c.color]}`}>{c.label}</p>
              <p className="text-slate-400 text-xs mt-0.5">{c.desc}</p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.65 + i * 0.14, type: "spring", stiffness: 320 }}
              className="w-8 h-8 rounded-full border-2 border-emerald-500 bg-emerald-500/15 flex items-center justify-center flex-shrink-0"
            >
              <span className="text-emerald-400 font-bold text-sm">✓</span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
        className="mt-4 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 rounded-xl p-3 text-center">
        <p className="text-emerald-300 font-semibold text-sm">
          🎯 Every criterion carries marks — don't skip steps even under pressure
        </p>
      </motion.div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function OSCEAnimation() {
  const navigate = useNavigate();
  const [current, setCurrent]       = useState(0);
  const [playing, setPlaying]       = useState(true);
  const [progress, setProgress]     = useState(0);   // 0–1 within current scene
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };

  const goTo = useCallback((index: number) => {
    clearTimer();
    const clamped = Math.max(0, Math.min(SCENES.length - 1, index));
    setCurrent(clamped);
    setProgress(0);
  }, []);

  // Tick the progress bar and auto-advance
  useEffect(() => {
    if (!playing) return;
    clearTimer();
    const duration = SCENES[current].duration;
    const tick = 40;
    let elapsed = 0;

    timerRef.current = setInterval(() => {
      elapsed += tick;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct);
      if (pct >= 1) {
        clearInterval(timerRef.current!);
        if (current < SCENES.length - 1) {
          setCurrent((c) => c + 1);
          setProgress(0);
          elapsed = 0;
        } else {
          setPlaying(false);
        }
      }
    }, tick);

    return clearTimer;
  }, [current, playing]);

  const togglePlay = () => setPlaying((p) => !p);
  const restart = () => { goTo(0); setPlaying(true); };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden select-none">
      {/* Close */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-3 right-3 z-50 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-lg leading-none"
        aria-label="Close"
      >
        ✕
      </button>

      {/* Scene progress strips */}
      <div className="flex gap-1 px-3 pt-3 pr-12">
        {SCENES.map((s, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); setPlaying(true); }}
            className="flex-1 h-1 rounded-full bg-slate-700 overflow-hidden cursor-pointer"
            aria-label={s.label}
          >
            <motion.div
              className="h-full bg-emerald-400 rounded-full"
              animate={{ width: i < current ? "100%" : i === current ? `${progress * 100}%` : "0%" }}
              transition={{ duration: 0 }}
            />
          </button>
        ))}
      </div>

      {/* Scene label */}
      <div className="flex items-center gap-2 px-4 pt-2 pb-1">
        <span className="text-xs text-slate-500">{current + 1} / {SCENES.length}</span>
        <span className="text-xs text-emerald-400 font-semibold">{SCENES[current].label}</span>
      </div>

      {/* Scene content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="h-full"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.38, ease: "easeInOut" }}
          >
            {current === 0 && <IntroScene />}
            {current === 1 && <NeedleScene progress={progress} />}
            {current === 2 && <OSCEScene />}
            {current === 3 && <RoomScene />}
            {current === 4 && <StationsScene />}
            {current === 5 && <ScenarioScene />}
            {current === 6 && <ScoringScene />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Playback controls */}
      <div className="flex items-center justify-center gap-3 py-3 border-t border-slate-800/80">
        <button
          onClick={() => { goTo(current - 1); setPlaying(true); }}
          disabled={current === 0}
          className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 flex items-center justify-center text-white text-xl transition-colors"
          aria-label="Previous"
        >
          ‹
        </button>

        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-white text-xl transition-colors shadow-lg shadow-emerald-500/25"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "⏸" : "▶"}
        </button>

        <button
          onClick={() => { goTo(current + 1); setPlaying(true); }}
          disabled={current === SCENES.length - 1}
          className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 flex items-center justify-center text-white text-xl transition-colors"
          aria-label="Next"
        >
          ›
        </button>

        <button
          onClick={restart}
          className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-base"
          aria-label="Restart"
        >
          ↺
        </button>
      </div>
    </div>
  );
}
