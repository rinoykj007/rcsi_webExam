import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MoreVertical, Activity, AlertCircle, ClipboardList, Stethoscope, Pill, Shield, ListChecks } from "lucide-react";
import { Section } from "@/components/ui/Section";

interface ConditionDetail {
  name: string;
  color: string;
  facts: { label: string; value: string }[];
  sections: { icon: React.ReactNode; title: string; color: string; bullets: string[] }[];
  steps: { title: string; detail: string }[];
}

const DATA: Record<string, ConditionDetail> = {
  dka: {
    name: "Diabetic Ketoacidosis",
    color: "#ef4444",
    facts: [
      { label: "Onset", value: "Hours" }, { label: "Severity", value: "High" },
      { label: "Priority", value: "Immediate" }, { label: "Setting", value: "ED / HDU" },
    ],
    sections: [
      { icon: <ClipboardList size={18} />, title: "Definition", color: "#ef4444",
        bullets: ["Hyperglycaemia (>11 mmol/L)", "Ketonaemia (>3 mmol/L)", "Metabolic acidosis (pH <7.3 or HCO₃ <15)"] },
      { icon: <AlertCircle size={18} />, title: "Signs & Symptoms", color: "#f97316",
        bullets: ["Polyuria, polydipsia", "Kussmaul breathing, ketotic breath", "Nausea, vomiting, abdominal pain", "Drowsiness, dehydration"] },
      { icon: <Stethoscope size={18} />, title: "Assessment (ABCDE)", color: "#3b82f6",
        bullets: ["A — patent airway?", "B — RR, SpO₂, Kussmaul pattern", "C — HR, BP, capillary refill, IV access", "D — GCS, blood glucose, ketones", "E — temperature, fluid balance"] },
      { icon: <Activity size={18} />, title: "Acute Management", color: "#7c3aed",
        bullets: ["0.9% Sodium Chloride 1 L stat", "Fixed-rate IV insulin 0.1 units/kg/hr", "K+ replacement once <5.5 mmol/L", "Switch to dextrose-saline when glucose <14"] },
      { icon: <Pill size={18} />, title: "Treatment", color: "#16a34a",
        bullets: ["Hourly capillary glucose & ketones", "VBG every 2 hours", "Strict fluid balance", "Treat precipitating cause (infection, MI)"] },
      { icon: <Shield size={18} />, title: "Prevention", color: "#0284c7",
        bullets: ["Sick day rules education", "Continue insulin during illness", "Self-monitor ketones", "Early medical advice"] },
      { icon: <ListChecks size={18} />, title: "Nursing Process (ADPIE)", color: "#db2777",
        bullets: ["Assess: ABCDE, glucose, ketones, K+", "Diagnose: fluid volume deficit, risk for hypoK+", "Plan: restore hydration, normalise glucose", "Implement: IV protocol, monitoring", "Evaluate: resolution criteria"] },
    ],
    steps: [
      { title: "Recognise", detail: "Identify hyperglycaemia, ketones >3 and acidosis on bedside tests." },
      { title: "Resuscitate", detail: "Two large-bore cannulae; start 0.9% Sodium Chloride 1 L stat." },
      { title: "Insulin", detail: "Start fixed-rate IV insulin 0.1 units/kg/hr; do NOT bolus." },
      { title: "Potassium", detail: "Add KCl to fluids once serum K+ falls <5.5 mmol/L." },
      { title: "Monitor & escalate", detail: "Hourly observations; involve diabetes team and HDU." },
    ],
  },
  sepsis: {
    name: "Sepsis",
    color: "#e11d48",
    facts: [
      { label: "Onset", value: "Rapid" }, { label: "Severity", value: "Critical" },
      { label: "Priority", value: "Within 1 hour" }, { label: "Setting", value: "Any" },
    ],
    sections: [
      { icon: <ClipboardList size={18} />, title: "Definition", color: "#e11d48",
        bullets: ["Life-threatening organ dysfunction", "Caused by dysregulated host response to infection", "Identified by NEWS2 ≥5 or qSOFA ≥2"] },
      { icon: <AlertCircle size={18} />, title: "Signs & Symptoms", color: "#f97316",
        bullets: ["Fever or hypothermia", "Tachycardia, tachypnoea, hypotension", "Altered mental state", "Mottled skin, oliguria"] },
      { icon: <Activity size={18} />, title: "Sepsis Six (within 1 hour)", color: "#7c3aed",
        bullets: ["GIVE: O₂, IV fluids, IV antibiotics", "TAKE: blood cultures, lactate, urine output"] },
    ],
    steps: [
      { title: "Recognise", detail: "Use NEWS2 / qSOFA; high index of suspicion in vulnerable patients." },
      { title: "Escalate", detail: "Inform senior; prepare for HDU/ICU review if not improving." },
      { title: "Sepsis Six", detail: "Complete all six elements within 60 minutes of recognition." },
      { title: "Source control", detail: "Identify and treat source — drain abscess, remove infected lines." },
      { title: "Reassess", detail: "Lactate clearance, urine output, mentation; modify antibiotics on cultures." },
    ],
  },
};

const fallback: ConditionDetail = {
  name: "Condition", color: "#4f46e5",
  facts: [{ label: "Onset", value: "—" }, { label: "Severity", value: "—" }, { label: "Priority", value: "—" }, { label: "Setting", value: "—" }],
  sections: [], steps: [],
};

const TABS = ["Overview", "Steps", "Cards", "Quiz", "Compare"] as const;
type Tab = typeof TABS[number];

const AcuteCondition = () => {
  const { conditionId = "" } = useParams();
  const nav = useNavigate();
  const c = DATA[conditionId] ?? { ...fallback, name: conditionId };
  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto w-full max-w-2xl px-5 py-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => nav(-1)} className="h-10 w-10 rounded-full bg-card shadow-soft grid place-items-center"
            style={{ color: c.color }}>
            <ArrowLeft size={18} />
          </button>
          <div className="font-display font-bold text-rcsi-navy">{c.name}</div>
          <button className="h-10 w-10 rounded-full bg-card shadow-soft grid place-items-center text-muted-foreground">
            <MoreVertical size={18} />
          </button>
        </div>

        {/* tabs */}
        <div className="relative border-b border-border mb-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap relative transition ${
                  tab === t ? "text-rcsi-navy" : "text-muted-foreground"
                }`}>
                {t}
                {tab === t && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full" style={{ background: c.color }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {tab === "Overview" && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {c.facts.map((f) => (
                <div key={f.label} className="bg-card rounded-2xl p-4 shadow-soft">
                  <div className="text-xs text-muted-foreground">{f.label}</div>
                  <div className="font-display font-bold text-rcsi-navy mt-0.5">{f.value}</div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {c.sections.length === 0 && (
                <div className="bg-card rounded-2xl p-6 text-sm text-muted-foreground text-center">
                  Detailed content coming soon for this condition.
                </div>
              )}
              {c.sections.map((s, i) => (
                <Section key={s.title} icon={s.icon} title={s.title} color={s.color} defaultOpen={i === 0}>
                  <ul className="list-disc pl-5 space-y-1.5">
                    {s.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </Section>
              ))}
            </div>
          </>
        )}

        {tab === "Steps" && (
          <div className="space-y-3">
            {c.steps.length === 0 ? (
              <div className="bg-card rounded-2xl p-6 text-sm text-muted-foreground text-center">Steps coming soon.</div>
            ) : c.steps.map((s, i) => (
              <div key={i} className="bg-card rounded-2xl p-4 shadow-soft flex gap-4">
                <div className="h-10 w-10 rounded-full grid place-items-center font-bold text-primary-foreground shrink-0"
                  style={{ background: c.color }}>{i + 1}</div>
                <div className="flex-1">
                  <div className="font-display font-semibold text-rcsi-navy">{s.title}</div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {(tab === "Cards" || tab === "Quiz" || tab === "Compare") && (
          <div className="bg-card rounded-2xl p-8 text-center">
            <div className="text-sm text-muted-foreground">
              {tab} content for this condition is coming soon. Try the global Quiz from the Station overview.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcuteCondition;
