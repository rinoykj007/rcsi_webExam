import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Syringe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { InjectionPerformConfig, InjectionSite } from "@/engine/configs";
import type { StepPluginProps } from "@/engine/types";

/**
 * injection.perform — drag the syringe token onto the correct site on a 2D
 * body figure (framer-motion drag, hit-tested against the site hotspots);
 * tapping a site is the keyboard/assistive fallback. Wrong sites give
 * feedback and 0 marks; with `criticalOnWrong` they also latch a wrong-route
 * critical fail per the blueprint scoring rules.
 */
export const InjectionPerform = ({
  step,
  station,
  onComplete,
}: StepPluginProps<InjectionPerformConfig>) => {
  const { correctSite, sites, criticalOnWrong } = step.config;
  const siteRefs = useRef(new Map<string, HTMLButtonElement>());
  const attemptsRef = useRef(0);
  const criticalRef = useRef(false);
  const [wrongSites, setWrongSites] = useState<string[]>([]);
  const [doneSite, setDoneSite] = useState<string | null>(null);

  const handleSite = (site: InjectionSite) => {
    if (doneSite) return;
    attemptsRef.current += 1;
    if (site.site === correctSite) {
      setDoneSite(site.site);
      const firstTry = attemptsRef.current === 1;
      toast.success(`Injection administered at the ${site.label}.`);
      onComplete({
        marksAwarded: firstTry ? step.marksAvailable : 0,
        marksAvailable: step.marksAvailable,
        critical: criticalRef.current,
        completed: true,
        detail: { attempts: attemptsRef.current, site: site.site },
      });
      return;
    }
    if (criticalOnWrong) criticalRef.current = true;
    toast.warning(
      `The ${site.label} is not the correct site for this medication.`,
    );
    setWrongSites((s) => (s.includes(site.site) ? s : [...s, site.site]));
  };

  const handleDragEnd = (point: { x: number; y: number }) => {
    for (const site of sites) {
      const el = siteRefs.current.get(site.site);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      // Generous hit area around the hotspot for touch use.
      const pad = 10;
      if (
        point.x >= rect.left - pad &&
        point.x <= rect.right + pad &&
        point.y >= rect.top - pad &&
        point.y <= rect.bottom + pad
      ) {
        handleSite(site);
        return;
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Administer the injection — {station.patient.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Drag the syringe onto the correct site, or tap the site.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div className="relative w-full max-w-64 shrink-0" style={{ aspectRatio: "10 / 14" }}>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-full w-full"
            aria-hidden="true"
          >
            {/* stylized front-facing patient figure */}
            <g className="fill-muted stroke-muted-foreground/40" strokeWidth="0.8">
              <ellipse cx="50" cy="8" rx="7" ry="6" />
              <rect x="47" y="13" width="6" height="4" />
              <path d="M38 17 h24 q3 0 3 3 v28 q0 3 -3 3 h-24 q-3 0 -3 -3 v-28 q0 -3 3 -3 z" />
              {/* arms */}
              <path d="M35 18 q-6 2 -8 12 l-4 14 q-1 4 3 5 q3 1 4 -3 l5 -14 z" />
              <path d="M65 18 q6 2 8 12 l4 14 q1 4 -3 5 q-3 1 -4 -3 l-5 -14 z" />
              {/* legs */}
              <path d="M39 51 h9 l-1 40 q0 3 -3 3 h-3 q-3 0 -3 -3 z" />
              <path d="M52 51 h9 l1 40 q0 3 -3 3 h-3 q-3 0 -3 -3 z" />
            </g>
          </svg>
          {sites.map((site) => {
            const isWrong = wrongSites.includes(site.site);
            const isDone = doneSite === site.site;
            return (
              <button
                key={site.site}
                ref={(el) => {
                  if (el) siteRefs.current.set(site.site, el);
                  else siteRefs.current.delete(site.site);
                }}
                type="button"
                aria-label={`Inject at ${site.label}`}
                onClick={() => handleSite(site)}
                className={cn(
                  "absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors",
                  isDone
                    ? "border-rcsi-green bg-rcsi-mint/70"
                    : isWrong
                      ? "border-destructive/70 bg-destructive/20"
                      : "animate-pulse border-rcsi-navy/50 bg-rcsi-lavender/50 hover:bg-rcsi-lavender",
                )}
                style={{ left: `${site.x}%`, top: `${site.y}%` }}
              />
            );
          })}
        </div>
        <div className="flex flex-col items-center gap-3">
          <motion.div
            drag={!doneSite}
            dragSnapToOrigin
            whileDrag={{ scale: 1.15, zIndex: 30 }}
            onDragEnd={(_e, info) => handleDragEnd(info.point)}
            className={cn(
              "flex cursor-grab touch-none select-none items-center gap-2 rounded-xl border-2 bg-card px-5 py-4 font-medium shadow-md",
              doneSite ? "border-rcsi-green opacity-60" : "border-rcsi-navy/40",
            )}
          >
            <Syringe size={20} className="text-rcsi-navy dark:text-rcsi-mint" />
            Syringe
          </motion.div>
          <ul className="text-xs text-muted-foreground">
            {sites.map((site) => (
              <li key={site.site}>• {site.label}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
