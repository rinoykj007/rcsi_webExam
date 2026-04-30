import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Section = ({ icon, title, color, children, defaultOpen = false }: {
  icon: React.ReactNode; title: string; color: string; children: React.ReactNode; defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-3 p-4 hover:bg-muted/40 transition">
        <div className="h-10 w-10 rounded-xl grid place-items-center text-white shrink-0" style={{ background: color }}>
          {icon}
        </div>
        <div className="flex-1 text-left font-display font-semibold text-rcsi-navy">{title}</div>
        <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-4 pb-5 pt-1 text-sm text-rcsi-navy/80 leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
