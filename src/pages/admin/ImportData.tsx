import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Database,
  Loader2,
  Check,
  AlertTriangle,
  Flame,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAuthStore } from "@/stores/useAuthStore";
import { QUESTIONS } from "@/data/questions";
import { toast } from "@/hooks/use-toast";
import { firebaseDb } from "@/lib/firebase";

const FLASHCARD_SEED: Record<string, { front: string; back: string }[]> = {
  infection_control: [
    {
      front: "What are the 5 moments of hand hygiene?",
      back: "1. Before patient contact  2. Before aseptic task  3. After body fluid exposure  4. After patient contact  5. After touching patient surroundings",
    },
    {
      front: "When should N95 respirators be used?",
      back: "Airborne precautions — TB, measles, varicella, COVID-19 aerosol-generating procedures.",
    },
    {
      front: "Standard precautions apply to whom?",
      back: "ALL patients, regardless of diagnosis or infection status.",
    },
    {
      front: "How long is the contact precaution period for C. difficile?",
      back: "Until 48 hours after diarrhoea has resolved. Use soap & water (alcohol gel ineffective).",
    },
    {
      front: "Correct order to DOFF PPE:",
      back: "Gloves → eye protection → gown → mask. Hand hygiene between each step.",
    },
    {
      front: "What disinfectant kills C. difficile spores?",
      back: "Sporicidal agents — chlorine (1000 ppm) or hydrogen peroxide-based cleaners.",
    },
  ],
};

// Friendly tag label per topic
const TAG_MAP: Record<string, string> = {
  infection_control: "Infection Control",
  fundamentals: "Fundamentals of Nursing",
  isbar: "ISBAR",
  sepsis: "Sepsis",
  older_person: "Older Person",
  wound_dressing: "Wound Dressing",
  iv_infusion: "IV Infusion",
  chest_infection: "Chest Infection",
  oral_drug: "Oral Drug",
  nok_discussion: "NOK Discussion",
  death_dying: "Death & Dying",
  chronic_disease: "Chronic Disease",
  teaching: "Teaching",
  acute_management: "Acute Management",
};

// All topic IDs stored in Firestore
const FIREBASE_TOPICS = Object.keys(TAG_MAP);

interface FirebaseQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const ImportData = () => {
  const nav = useNavigate();
  const isAdmin = useIsAdmin();
  const { user } = useAuthStore();
  const [busy, setBusy] = useState(false);
  const [fbBusy, setFbBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [wipe, setWipe] = useState(false);

  const append = (line: string) => setLog((l) => [...l, line]);

  const grantSelfAdmin = async () => {
    if (!user?.id) return;
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: user.id, role: "admin" });
    if (error) {
      toast({
        title: "Could not grant admin",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Admin granted",
        description: "Reload the page to use the importer.",
      });
    }
  };

  const runImport = async () => {
    setBusy(true);
    setLog([]);
    try {
      if (wipe) {
        append("Clearing existing questions and flashcards…");
        const { error: dq } = await supabase
          .from("questions")
          .delete()
          .neq("id", "00000000-0000-0000-0000-000000000000");
        const { error: df } = await supabase
          .from("flashcards")
          .delete()
          .neq("id", "00000000-0000-0000-0000-000000000000");
        if (dq) throw dq;
        if (df) throw df;
        append("Cleared.");
      }

      let qCount = 0;
      for (const [topicId, qs] of Object.entries(QUESTIONS)) {
        if (qs.length === 0) continue;
        const rows = qs.map((q) => ({
          topic_id: topicId,
          tag: q.tag,
          question: q.question,
          options: q.options,
          correct: q.correct,
          explanation: q.explanation,
        }));
        const { error } = await supabase.from("questions").insert(rows);
        if (error) throw error;
        qCount += rows.length;
        append(`✓ ${topicId}: ${rows.length} questions`);
      }
      append(`Imported ${qCount} questions total.`);

      let fCount = 0;
      for (const [topicId, cards] of Object.entries(FLASHCARD_SEED)) {
        const rows = cards.map((c) => ({
          topic_id: topicId,
          front: c.front,
          back: c.back,
        }));
        const { error } = await supabase.from("flashcards").insert(rows);
        if (error) throw error;
        fCount += rows.length;
        append(`✓ ${topicId}: ${rows.length} flashcards`);
      }
      append(`Imported ${fCount} flashcards total.`);

      toast({
        title: "Import complete",
        description: `${qCount} questions, ${fCount} flashcards.`,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      append(`✗ Failed: ${msg}`);
      toast({
        title: "Import failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const runFirebaseImport = async () => {
    setFbBusy(true);
    setLog([]);
    try {
      if (wipe) {
        append("Clearing existing questions…");
        const { error: dq } = await supabase
          .from("questions")
          .delete()
          .neq("id", "00000000-0000-0000-0000-000000000000");
        if (dq) throw dq;
        append("Cleared.");
      }

      let total = 0;
      for (const topicId of FIREBASE_TOPICS) {
        append(`Fetching ${topicId} from Firebase…`);
        const snap = await getDocs(
          collection(firebaseDb, "questions", topicId, "items")
        );
        if (snap.empty) {
          append(`  — no questions found, skipping`);
          continue;
        }

        const rows = snap.docs.map((doc) => {
          const d = doc.data() as Omit<FirebaseQuestion, "id">;
          const tag = TAG_MAP[topicId] ?? topicId;
          return {
            topic_id: topicId,
            tag,
            question: d.question,
            options: (d.options ?? []).map((text: string, i: number) => ({
              key: ["A", "B", "C", "D"][i] as "A" | "B" | "C" | "D",
              text,
            })),
            correct: d.correct,
            explanation: d.explanation ?? "",
          };
        });

        const { error } = await supabase.from("questions").insert(rows);
        if (error) throw error;
        total += rows.length;
        append(`✓ ${topicId}: ${rows.length} questions`);
      }

      append(`Done — imported ${total} questions from Firebase.`);
      toast({
        title: "Firebase import complete",
        description: `${total} questions loaded into Supabase.`,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      append(`✗ Failed: ${msg}`);
      toast({
        title: "Import failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setFbBusy(false);
    }
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="animate-spin text-rcsi-purple" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-5">
        <div className="max-w-md w-full bg-card rounded-3xl p-8 shadow-card text-center space-y-4">
          <AlertTriangle className="mx-auto text-amber-500" size={32} />
          <h1 className="font-display font-bold text-2xl text-rcsi-navy">
            Admin only
          </h1>
          <p className="text-sm text-muted-foreground">
            This page imports questions and flashcards into the database. You
            need the <b>admin</b> role.
          </p>
          <p className="text-xs text-muted-foreground">
            If you're the project owner and this is the first install, click
            below to grant yourself admin (only works once, until another admin
            exists).
          </p>
          <Button
            onClick={grantSelfAdmin}
            className="bg-rcsi-navy hover:bg-rcsi-navy/90"
          >
            Grant me admin
          </Button>
          <div>
            <Button asChild variant="ghost">
              <Link to="/">Back home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto w-full max-w-2xl px-5 py-6">
        <button
          onClick={() => nav(-1)}
          className="h-10 w-10 rounded-full bg-card shadow-soft grid place-items-center mb-5"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="bg-rcsi-navy text-primary-foreground rounded-3xl p-6 mb-6 shadow-elevated">
          <Database className="mb-3" size={28} />
          <h1 className="font-display font-extrabold text-2xl mb-1">
            Import questions & flashcards
          </h1>
          <p className="text-sm text-primary-foreground/70">
            Load questions from Firebase or seed from the local static bank.
          </p>
        </div>

        {/* Firebase import card */}
        <div className="bg-card rounded-3xl p-6 shadow-card space-y-4 mb-4 border-2 border-orange-200">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="text-orange-500" size={20} />
            <h2 className="font-display font-bold text-rcsi-navy">
              Import from Firebase
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Pulls all 200+ questions directly from the <b>rcsiexam</b> Firestore
            project and inserts them into Supabase. Covers all 14 stations.
          </p>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={wipe}
              onChange={(e) => setWipe(e.target.checked)}
              className="mt-1"
            />
            <div>
              <div className="font-semibold text-rcsi-navy text-sm">
                Wipe existing questions first
              </div>
              <div className="text-xs text-muted-foreground">
                Deletes all questions before inserting. User progress is
                preserved.
              </div>
            </div>
          </label>

          <Button
            onClick={runFirebaseImport}
            disabled={fbBusy || busy}
            className="w-full h-12 rounded-full bg-orange-500 hover:bg-orange-600 gap-2"
          >
            {fbBusy ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Importing from
                Firebase…
              </>
            ) : (
              <>
                <Flame size={16} /> Import from Firebase
              </>
            )}
          </Button>
        </div>

        {/* Static seed card */}
        <div className="bg-card rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Database className="text-rcsi-navy" size={20} />
            <h2 className="font-display font-bold text-rcsi-navy">
              Seed from local bank
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Inserts questions from{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded">
              src/data/questions.ts
            </code>{" "}
            (currently a small placeholder set).
          </p>

          <Button
            onClick={runImport}
            disabled={busy || fbBusy}
            variant="outline"
            className="w-full h-12 rounded-full border-rcsi-navy text-rcsi-navy gap-2"
          >
            {busy ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Importing…
              </>
            ) : (
              <>
                <Check size={16} /> Run local import
              </>
            )}
          </Button>
        </div>

        {log.length > 0 && (
          <div className="mt-4 bg-muted rounded-xl p-4 text-xs font-mono space-y-1 max-h-80 overflow-auto">
            {log.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportData;
