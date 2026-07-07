import { useCallback, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { SkipForward, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { VoicePlayConfig } from "@/engine/configs";
import type { StepPluginProps } from "@/engine/types";

/**
 * voice.play — speaks the examiner transcript via browser TTS, one sentence
 * at a time (long single utterances can stall Chrome's speechSynthesis).
 * The transcript stays visible as text so muted/unsupported users lose
 * nothing. Advances automatically when speech ends.
 */
export const VoicePlay = ({
  step,
  speech,
  onComplete,
}: StepPluginProps<VoicePlayConfig>) => {
  const sentences = useMemo(
    () =>
      step.config.transcript
        .split(/(?<=[.?!])\s+/)
        .map((s) => s.trim())
        .filter(Boolean),
    [step.config.transcript],
  );

  const doneRef = useRef(false);
  const indexRef = useRef(0);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    speech.cancel();
    onComplete({
      marksAwarded: 0,
      marksAvailable: 0,
      critical: false,
      completed: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const speakNext = () => {
      if (doneRef.current) return;
      const i = indexRef.current;
      if (i >= sentences.length) {
        finish();
        return;
      }
      indexRef.current = i + 1;
      speech.speak(sentences[i], speakNext);
    };
    speakNext();
    return () => speech.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <motion.span
            animate={speech.speaking ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="text-rcsi-navy dark:text-rcsi-mint"
          >
            <Volume2 size={18} />
          </motion.span>
          Examiner
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8"
            aria-label={speech.muted ? "Unmute voice" : "Mute voice"}
            onClick={speech.toggleMute}
          >
            {speech.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </Button>
        </div>
        <p className="text-base leading-relaxed">{step.config.transcript}</p>
        <Button variant="outline" size="sm" className="self-end" onClick={finish}>
          <SkipForward size={14} className="mr-1" /> Skip
        </Button>
      </CardContent>
    </Card>
  );
};
