import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TimerIcon } from "lucide-react";
import type { TimerCountdownConfig } from "@/engine/configs";
import type { StepPluginProps } from "@/engine/types";

/**
 * timer.countdown — arms the station timer and auto-advances after a brief
 * "station started" flash. Kept as a real data step (rather than engine-only
 * config) to preserve the 1:1 station_steps row mapping from the blueprint.
 */
export const TimerCountdown = ({
  step,
  onArmTimer,
  onComplete,
}: StepPluginProps<TimerCountdownConfig>) => {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    onArmTimer(step.config.seconds);
    const t = setTimeout(
      () =>
        onComplete({
          marksAwarded: 0,
          marksAvailable: 0,
          critical: false,
          completed: true,
        }),
      1400,
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-3 rounded-xl border bg-card p-10 text-center"
    >
      <TimerIcon size={32} className="text-rcsi-navy dark:text-rcsi-mint" />
      <div className="text-xl font-semibold">Station started</div>
      <div className="text-sm text-muted-foreground">
        You have {Math.round(step.config.seconds / 60)} minutes
      </div>
    </motion.div>
  );
};
