import { useCallback, useEffect, useRef, useState } from "react";

interface UseSpeech {
  supported: boolean;
  speaking: boolean;
  muted: boolean;
  toggleMute: () => void;
  speak: (text: string, onEnd?: () => void) => void;
  cancel: () => void;
}

/** ~160 wpm reading pace, used when audio is muted or unsupported. */
const estimateMs = (text: string) =>
  Math.max(1500, text.trim().split(/\s+/).length * 375);

export const useSpeech = (): UseSpeech => {
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Guards so onend/onerror fire the callback exactly once, and an
  // intentional cancel() never triggers the pending onEnd.
  const endedRef = useRef(false);
  const cancellingRef = useRef(false);

  useEffect(() => {
    if (!supported) return;
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices() ?? [];
      voiceRef.current =
        voices.find((v) => v.lang === "en-IE") ??
        voices.find((v) => v.lang === "en-GB") ??
        voices.find((v) => v.lang?.startsWith("en")) ??
        null;
    };
    pickVoice();
    window.speechSynthesis.addEventListener("voiceschanged", pickVoice);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", pickVoice);
      cancellingRef.current = true;
      window.speechSynthesis.cancel();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [supported]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (supported) {
      cancellingRef.current = true;
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, [supported]);

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      cancel();
      setSpeaking(true);

      const finish = () => {
        setSpeaking(false);
        onEnd?.();
      };

      if (!supported || mutedRef.current) {
        timerRef.current = setTimeout(finish, estimateMs(text));
        return;
      }

      cancellingRef.current = false;
      endedRef.current = false;
      const utterance = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) utterance.voice = voiceRef.current;
      utterance.rate = 0.95;
      const handleDone = () => {
        if (endedRef.current || cancellingRef.current) return;
        endedRef.current = true;
        finish();
      };
      utterance.onend = handleDone;
      utterance.onerror = handleDone;
      window.speechSynthesis.speak(utterance);
    },
    [supported, cancel],
  );

  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  return { supported, speaking, muted, toggleMute, speak, cancel };
};
