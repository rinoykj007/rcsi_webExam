import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Check, RotateCcw, TimerOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { computeScore } from "@/engine/scoring";
import type { ScoreSummaryConfig } from "@/engine/configs";
import type { PluginKey, StepPluginProps } from "@/engine/types";

const STEP_LABELS: Partial<Record<PluginKey, string>> = {
  "patient.card": "Patient identification",
  "equipment.select": "Equipment selection",
  "mcq.question": "Knowledge check",
  "injection.perform": "Injection technique",
  "documentation.form": "Documentation",
};

/**
 * score.summary — final checklist + pass/fail banner. Marks the engine run
 * complete on mount (the runner records progress when the engine finishes).
 */
export const ScoreSummary = ({
  step,
  results,
  engineStatus,
  onComplete,
  onRestart,
}: StepPluginProps<ScoreSummaryConfig>) => {
  const navigate = useNavigate();
  const completedRef = useRef(false);

  useEffect(() => {
    if (completedRef.current || engineStatus !== "running") return;
    completedRef.current = true;
    onComplete({
      marksAwarded: 0,
      marksAvailable: 0,
      critical: false,
      completed: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const score = computeScore(results, {
    timedOut: engineStatus === "timedOut",
    passMarkPct: step.config.passMarkPct,
  });
  const checklist = results.filter((r) => r.marksAvailable > 0 || r.critical);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Station result</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-xl p-4 text-center font-semibold",
            score.passed
              ? "bg-rcsi-mint/40 text-rcsi-navy dark:text-rcsi-mint"
              : "bg-destructive/10 text-destructive",
          )}
        >
          {score.criticalFail ? (
            <span className="flex items-center justify-center gap-2">
              <AlertTriangle size={18} /> Critical error — automatic fail
            </span>
          ) : score.timedOut ? (
            <span className="flex items-center justify-center gap-2">
              <TimerOff size={18} /> Time expired — station not passed
            </span>
          ) : score.passed ? (
            "Station passed — well done!"
          ) : (
            "Station not passed — review and try again"
          )}
          <div className="mt-1 text-2xl">
            {score.marksAwarded}/{score.marksAvailable} ({score.pct}%)
          </div>
        </motion.div>

        <ul className="flex flex-col gap-2">
          {checklist.map((r) => {
            const good = r.marksAwarded === r.marksAvailable && !r.critical;
            return (
              <li
                key={r.stepId}
                className="flex items-center gap-3 rounded-lg border p-3 text-sm"
              >
                {r.critical ? (
                  <AlertTriangle size={16} className="shrink-0 text-destructive" />
                ) : good ? (
                  <Check size={16} className="shrink-0 text-rcsi-green" />
                ) : (
                  <X size={16} className="shrink-0 text-destructive" />
                )}
                <span className="flex-1">
                  {STEP_LABELS[r.pluginKey] ?? r.pluginKey}
                  {r.critical && (
                    <span className="ml-2 text-xs font-medium text-destructive">
                      critical error
                    </span>
                  )}
                </span>
                <span className="text-muted-foreground">
                  {r.marksAwarded}/{r.marksAvailable}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onRestart}>
            <RotateCcw size={14} className="mr-1" /> Try again
          </Button>
          <Button onClick={() => navigate("/osce")}>Back to catalog</Button>
        </div>
      </CardContent>
    </Card>
  );
};
