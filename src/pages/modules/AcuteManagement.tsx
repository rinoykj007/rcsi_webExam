import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Droplet, Brain, Activity, Stethoscope, Heart } from "lucide-react";
import { motion } from "framer-motion";

const CONDITIONS = [
  { id: "dka", name: "DKA", full: "Diabetic Ketoacidosis", desc: "Hyperglycaemia + ketosis + acidosis. Fluids, insulin, K+ replacement.", color: "#ef4444", tag: "Emergency", icon: Droplet },
  { id: "uti", name: "UTI", full: "Urinary Tract Infection", desc: "Common in older adults; can present atypically as confusion or falls.", color: "#3b82f6", tag: "Stable", icon: Activity },
  { id: "delirium", name: "Delirium", full: "Acute Confusional State", desc: "Acute fluctuating cognitive change — screen with 4AT.", color: "#8b5cf6", tag: "Urgent", icon: Brain },
  { id: "stoma", name: "Stoma Care", full: "Stoma Management", desc: "Skin care, output monitoring, leakage prevention and patient education.", color: "#16a34a", tag: "Stable", icon: Stethoscope },
  { id: "compartment", name: "Compartment Syndrome", full: "Acute Compartment Syndrome", desc: "Limb-threatening — pain out of proportion is the earliest sign.", color: "#f97316", tag: "Emergency", icon: AlertTriangle },
  { id: "sepsis", name: "Sepsis", full: "Sepsis Six Bundle", desc: "Life-threatening organ dysfunction — Sepsis Six within 1 hour.", color: "#e11d48", tag: "Emergency", icon: Heart },
];

const TAG_BG: Record<string, string> = {
  Emergency: "bg-destructive/10 text-destructive",
  Urgent: "bg-rcsi-yellow text-amber-700",
  Stable: "bg-rcsi-mint text-emerald-700",
};

const AcuteManagement = () => {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto w-full max-w-2xl px-5 py-6">
        <button onClick={() => nav(-1)} className="h-10 w-10 rounded-full bg-card shadow-soft grid place-items-center mb-5"
          style={{ color: "#4f46e5" }}>
          <ArrowLeft size={18} />
        </button>

        <div className="rounded-3xl p-6 mb-6 text-primary-foreground shadow-elevated"
          style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
          <h1 className="font-display font-extrabold text-2xl mb-1">Acute Management</h1>
          <p className="text-sm text-primary-foreground/80 mb-3">Nursing process in acute situations</p>
          <div className="inline-block bg-white/15 rounded-full px-3 py-1 text-xs font-semibold">{CONDITIONS.length} Conditions</div>
        </div>

        <div className="space-y-3">
          {CONDITIONS.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div key={c.id}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}>
                <Link to={`/screens/acuteManagement/${c.id}`}
                  className="block bg-card rounded-2xl shadow-soft hover:shadow-card transition overflow-hidden">
                  <div className="flex">
                    <div className="w-1.5 shrink-0" style={{ background: c.color }} />
                    <div className="flex-1 p-4 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl grid place-items-center shrink-0"
                        style={{ background: `${c.color}1a`, color: c.color }}>
                        <Icon size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full ${TAG_BG[c.tag]}`}>
                            {c.tag.toUpperCase()}
                          </span>
                        </div>
                        <div className="font-display font-bold text-rcsi-navy">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.full}</div>
                        <div className="text-xs text-rcsi-navy/70 mt-1.5 line-clamp-2">{c.desc}</div>
                      </div>
                      <div className="text-sm font-semibold shrink-0" style={{ color: c.color }}>Explore →</div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AcuteManagement;
