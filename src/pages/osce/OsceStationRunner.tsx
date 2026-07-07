import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OsceEngine } from "@/engine/OsceEngine";
import { CATEGORY_TOPIC_MAP } from "@/data/osce/categories";
import { loadStation } from "@/data/osce/loadStations";
import { useAuthStore } from "@/stores/useAuthStore";
import { useOsceAttemptStore } from "@/stores/useOsceAttemptStore";
import { useProgressStore } from "@/stores/useProgressStore";
import type { OsceAttempt, OsceStation } from "@/engine/types";

/**
 * /osce/station/:stationId — loads the station's category chunk, runs the
 * engine, and records the attempt into topic progress (mapped via
 * CATEGORY_TOPIC_MAP) for logged-in users.
 */
const OsceStationRunner = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const user = useAuthStore((s) => s.user);
  const recordResult = useProgressStore((s) => s.recordResult);

  const [station, setStation] = useState<OsceStation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setStation(null);
    if (!stationId) {
      setLoading(false);
      return;
    }
    loadStation(stationId)
      .then((s) => {
        if (cancelled) return;
        setStation(s);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
        toast.error("Could not load this station.");
      });
    return () => {
      cancelled = true;
    };
  }, [stationId]);

  const handleFinish = useCallback(
    async (attempt: OsceAttempt) => {
      if (!station) return;
      useOsceAttemptStore.getState().recordAttempt(user?.id ?? null, station, attempt);
      if (user) {
        const topicId = CATEGORY_TOPIC_MAP[station.category];
        try {
          await recordResult(
            user.id,
            topicId,
            attempt.score.marksAwarded,
            attempt.score.marksAvailable,
          );
          toast.success("Progress saved");
        } catch {
          toast.error("Could not save progress. Please try again.");
        }
      }
    },
    [station, user, recordResult],
  );

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4 pb-24">
      <Button variant="ghost" size="sm" asChild className="self-start">
        <Link to="/osce">
          <ArrowLeft size={16} className="mr-1" /> All stations
        </Link>
      </Button>

      {loading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      )}

      {!loading && !station && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <p className="font-medium">Station not found</p>
            <p className="text-sm text-muted-foreground">
              This station doesn&apos;t exist or hasn&apos;t been published yet.
            </p>
            <Button asChild>
              <Link to="/osce">Browse stations</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {station && <OsceEngine station={station} onFinish={handleFinish} />}
    </div>
  );
};

export default OsceStationRunner;
