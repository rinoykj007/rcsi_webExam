import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { AlertTriangle, Check, Hand } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { EquipmentOption, EquipmentSelectConfig } from "@/engine/configs";
import type { StepPluginProps } from "@/engine/types";

/** Deterministic shuffle so a station always shows the same option order. */
const shuffle = <T,>(items: T[], seed: string): T[] => {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = (h * 33) ^ seed.charCodeAt(i);
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    h = (h * 33) ^ i;
    const j = (h >>> 0) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * equipment.select — drag the correct item(s) onto the preparation tray
 * (framer-motion drag with drop-zone hit-testing); tapping an item is the
 * keyboard/assistive fallback. With `allowMultiple`, every correct item must
 * be placed. Full marks require zero wrong picks; picking a critical
 * distractor (wrong medication/set class error) latches a critical fail but
 * the learner must still complete the tray to move on.
 */
export const EquipmentSelect = ({
  step,
  onComplete,
}: StepPluginProps<EquipmentSelectConfig>) => {
  const options = useMemo(
    () => shuffle(step.config.options, step.id),
    [step.config.options, step.id],
  );
  const correctIds = useMemo(
    () => new Set(step.config.options.filter((o) => o.correct).map((o) => o.id)),
    [step.config.options],
  );

  const trayRef = useRef<HTMLDivElement>(null);
  const wrongPicksRef = useRef(0);
  const criticalRef = useRef(false);
  // Suppresses the synthetic click browsers fire right after a drag ends.
  const draggingRef = useRef(false);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const done = placedIds.length === correctIds.size;

  const handlePick = (option: EquipmentOption) => {
    if (done || placedIds.includes(option.id)) return;
    if (option.correct) {
      const placed = [...placedIds, option.id];
      setPlacedIds(placed);
      if (placed.length === correctIds.size) {
        onComplete({
          marksAwarded: wrongPicksRef.current === 0 ? step.marksAvailable : 0,
          marksAvailable: step.marksAvailable,
          critical: criticalRef.current,
          completed: true,
          detail: { wrongPicks: wrongPicksRef.current, placed },
        });
      }
      return;
    }
    wrongPicksRef.current += 1;
    if (option.critical) {
      criticalRef.current = true;
      toast.error(option.feedback ?? "Critical error: this item endangers the patient.", {
        duration: 6000,
      });
    } else {
      toast.warning(
        option.feedback ?? `${option.label} is not the right equipment for this task.`,
      );
    }
    setWrongIds((ids) => (ids.includes(option.id) ? ids : [...ids, option.id]));
  };

  const handleDragEnd = (option: EquipmentOption, point: { x: number; y: number }) => {
    const rect = trayRef.current?.getBoundingClientRect();
    if (!rect) return;
    const inTray =
      point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
    if (inTray) handlePick(option);
  };

  const placedLabels = placedIds
    .map((id) => options.find((o) => o.id === id)?.label)
    .filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{step.config.prompt}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {step.config.allowMultiple
            ? `Drag every item you need onto the preparation tray — or tap them. (${placedIds.length}/${correctIds.size} placed)`
            : "Drag the correct item onto the preparation tray — or tap it."}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {options.map((option) => {
            const isWrong = wrongIds.includes(option.id);
            const isPlaced = placedIds.includes(option.id);
            return (
              <motion.button
                key={option.id}
                type="button"
                drag={!done && !isPlaced}
                dragSnapToOrigin
                whileDrag={{ scale: 1.08, zIndex: 30 }}
                whileHover={{ scale: done || isPlaced ? 1 : 1.03 }}
                onDragStart={() => {
                  draggingRef.current = true;
                }}
                onDragEnd={(_e, info) => {
                  handleDragEnd(option, info.point);
                  setTimeout(() => {
                    draggingRef.current = false;
                  }, 0);
                }}
                onClick={() => {
                  if (!draggingRef.current) handlePick(option);
                }}
                aria-label={`Select ${option.label}`}
                className={cn(
                  "relative flex min-h-20 cursor-grab touch-none select-none flex-col items-center justify-center gap-1 rounded-xl border-2 bg-card p-3 text-sm font-medium shadow-sm transition-colors",
                  isPlaced && "border-rcsi-green bg-rcsi-mint/30",
                  isWrong && "border-destructive/60 opacity-60",
                  !isPlaced && !isWrong && "border-border hover:border-rcsi-navy/40",
                )}
              >
                <Hand size={18} className="text-muted-foreground" />
                {option.label}
                {isPlaced && (
                  <Check size={16} className="absolute right-2 top-2 text-rcsi-green" />
                )}
                {isWrong && option.critical && (
                  <AlertTriangle
                    size={16}
                    className="absolute right-2 top-2 text-destructive"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
        <div
          ref={trayRef}
          className={cn(
            "flex min-h-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed p-3 text-center text-sm text-muted-foreground transition-colors",
            done
              ? "border-rcsi-green bg-rcsi-mint/20 text-rcsi-navy dark:text-rcsi-mint"
              : placedIds.length > 0
                ? "border-rcsi-green/50"
                : "border-muted-foreground/30",
          )}
        >
          {placedLabels.length > 0 ? (
            <>
              <span className="font-medium">
                {placedLabels.join(", ")} {done && "✓"}
              </span>
              {!done && <span className="text-xs">Keep going — the tray is not complete.</span>}
            </>
          ) : (
            "Preparation tray — drop items here"
          )}
        </div>
      </CardContent>
    </Card>
  );
};
