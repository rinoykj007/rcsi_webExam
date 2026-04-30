import { useEffect, useState } from "react";
import { BookMarked, ChevronDown } from "lucide-react";
import { fetchGlossary, type GlossaryTerm } from "@/lib/data";

export const GlossarySection = ({ topicId, accent }: { topicId: string; accent: string }) => {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    fetchGlossary(topicId).then(setTerms);
  }, [topicId]);

  if (terms.length === 0) return null;

  return (
    <div className="bg-card rounded-3xl p-5 shadow-card mt-6">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-2 mb-3">
        <BookMarked size={18} style={{ color: accent }} />
        <h3 className="font-display font-bold text-foreground">Quick Reference</h3>
        <span className="text-xs text-muted-foreground">{terms.length} terms</span>
        <ChevronDown
          size={18}
          className={`ml-auto text-muted-foreground transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>
      {open && (
        <div className="space-y-2.5">
          {terms.map((t) => (
            <div key={t.id} className="rounded-xl border border-border p-3">
              <div className="font-semibold text-sm text-foreground mb-0.5" style={{ color: accent }}>
                {t.term}
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed">{t.definition}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
