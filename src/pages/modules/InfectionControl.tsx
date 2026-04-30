import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Droplets, HardHat, SprayCan, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlipCard } from "@/components/ui/FlipCard";
import { Section } from "@/components/ui/Section";
import { fetchFlashcards, markFlashcardKnown, type DbFlashcard } from "@/lib/data";
import { useAuthStore } from "@/stores/useAuthStore";

const CATEGORY_COLORS = ["#db2777", "#7c3aed", "#0284c7", "#16a34a", "#ea580c", "#ca8a04"];

const InfectionControl = () => {
  const nav = useNavigate();
  const { user } = useAuthStore();
  const [tab, setTab] = useState<"overview" | "cards">("overview");
  const [reviewIdx, setReviewIdx] = useState<number | null>(null);
  const [cards, setCards] = useState<DbFlashcard[]>([]);

  useEffect(() => {
    fetchFlashcards("infection_control").then(setCards);
  }, []);

  const FLASHCARDS = cards.map((c, i) => ({
    id: c.id,
    q: c.front,
    a: c.back,
    cat: "Infection Control",
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto w-full max-w-2xl px-5 py-6">
        <button onClick={() => nav(-1)} className="h-10 w-10 rounded-full bg-card shadow-soft grid place-items-center mb-5">
          <ArrowLeft size={18} />
        </button>

        {/* tab bar */}
        <div className="flex bg-card rounded-full p-1 shadow-soft mb-6 w-full max-w-xs">
          {(["overview", "cards"] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setReviewIdx(null); }}
              className={`flex-1 py-2 text-sm font-semibold capitalize rounded-full transition ${
                tab === t ? "bg-rcsi-navy text-primary-foreground" : "text-muted-foreground"
              }`}>{t}</button>
          ))}
        </div>

        {tab === "overview" && (
          <>
            <div className="bg-rcsi-navy text-primary-foreground rounded-3xl p-6 mb-5 shadow-elevated">
              <h1 className="font-display font-extrabold text-2xl mb-1">Infection Control</h1>
              <p className="text-sm text-primary-foreground/70 mb-3">Standard precautions, hand hygiene, PPE & isolation</p>
              <div className="inline-block bg-white/10 rounded-full px-3 py-1 text-xs font-semibold">{FLASHCARDS.length} flashcards</div>
            </div>

            <div className="space-y-3">
              <Section icon={<ShieldCheck size={18} />} title="Standard Precautions" color="#0284c7" defaultOpen>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Apply to all patients regardless of diagnosis</li>
                  <li>Hand hygiene before and after patient contact</li>
                  <li>PPE based on anticipated exposure</li>
                  <li>Safe injection practices, sharps disposal</li>
                </ul>
              </Section>
              <Section icon={<Droplets size={18} />} title="Hand Hygiene — 5 moments" color="#db2777">
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>Before patient contact</li>
                  <li>Before aseptic task</li>
                  <li>After body fluid exposure risk</li>
                  <li>After patient contact</li>
                  <li>After contact with patient surroundings</li>
                </ol>
              </Section>
              <Section icon={<HardHat size={18} />} title="PPE Usage" color="#7c3aed">
                <p className="mb-2"><b>Don:</b> gown → mask → eye protection → gloves</p>
                <p><b>Doff:</b> gloves → eye protection → gown → mask, with hand hygiene between</p>
              </Section>
              <Section icon={<SprayCan size={18} />} title="Environmental Cleaning" color="#16a34a">
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>High-touch surfaces cleaned at least daily</li>
                  <li>Sporicidal agents (chlorine 1000 ppm) for C. difficile</li>
                  <li>Terminal cleaning between patients in isolation</li>
                </ul>
              </Section>
            </div>
          </>
        )}

        {tab === "cards" && reviewIdx === null && (
          <>
            <div className="bg-rcsi-navy text-primary-foreground rounded-3xl p-6 mb-5 shadow-elevated text-center">
              <div className="text-5xl font-display font-extrabold">{FLASHCARDS.length}</div>
              <div className="text-sm text-primary-foreground/70 mt-1">Flashcards available</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {FLASHCARDS.map((c, i) => (
                <button key={c.id} onClick={() => setReviewIdx(i)}
                  className="bg-card rounded-2xl p-5 shadow-soft hover:shadow-card transition text-left border-l-4"
                  style={{ borderLeftColor: c.color }}>
                  <div className="text-[10px] tracking-widest font-bold text-muted-foreground mb-1.5">{c.cat.toUpperCase()}</div>
                  <div className="text-sm font-medium text-rcsi-navy line-clamp-3">{c.q}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {tab === "cards" && reviewIdx !== null && (
          <div>
            <div className="flex justify-between items-center mb-4 text-sm font-medium text-muted-foreground">
              <button onClick={() => setReviewIdx(null)} className="text-rcsi-navy">← Back to list</button>
              <span>{reviewIdx + 1} / {FLASHCARDS.length}</span>
            </div>
            <FlipCard
              front={
                <>
                  <span className="inline-block text-[10px] tracking-widest font-bold text-white px-2 py-1 rounded-full self-start mb-4"
                    style={{ background: FLASHCARDS[reviewIdx].color }}>
                    {FLASHCARDS[reviewIdx].cat.toUpperCase()}
                  </span>
                  <div className="flex-1 grid place-items-center text-center">
                    <div className="font-display font-bold text-xl text-rcsi-navy">{FLASHCARDS[reviewIdx].q}</div>
                  </div>
                  <div className="text-xs text-muted-foreground text-center">Tap to reveal answer</div>
                </>
              }
              back={
                <>
                  <span className="inline-block text-[10px] tracking-widest font-bold text-rcsi-navy bg-white px-2 py-1 rounded-full self-start mb-4">
                    ANSWER
                  </span>
                  <div className="flex-1 grid place-items-center text-center">
                    <div className="text-base leading-relaxed">{FLASHCARDS[reviewIdx].a}</div>
                  </div>
                  <div className="text-xs text-primary-foreground/60 text-center">Tap to flip back</div>
                </>
              }
            />
            <div className="grid grid-cols-2 gap-3 mt-5">
              <Button variant="outline" className="rounded-full h-11"
                onClick={() => {
                  if (user?.id && reviewIdx !== null) markFlashcardKnown(user.id, FLASHCARDS[reviewIdx].id, false);
                  setReviewIdx((i) => Math.max(0, (i ?? 0) - 1));
                }} disabled={reviewIdx === 0}>
                <ChevronLeft size={16} /> Still learning
              </Button>
              <Button className="rounded-full h-11 bg-rcsi-green hover:bg-rcsi-green/90"
                onClick={() => {
                  if (user?.id && reviewIdx !== null) markFlashcardKnown(user.id, FLASHCARDS[reviewIdx].id, true);
                  setReviewIdx((i) => (i ?? 0) + 1 >= FLASHCARDS.length ? null : (i ?? 0) + 1);
                }}>
                Know it ✓ <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfectionControl;
