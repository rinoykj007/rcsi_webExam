import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  CalendarCheck,
  Check,
  Clock,
  Flame,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getCategoryBySlug } from "@/data/osce/categories";
import { useAuthStore } from "@/stores/useAuthStore";
import { useOsceAttemptStore } from "@/stores/useOsceAttemptStore";
import {
  categoryLabel,
  computeBadges,
  computeCategoryStats,
  computeMistakes,
  computeOverall,
  computeRecommendation,
  computeSkillStats,
  computeTrend,
} from "@/lib/osceProgressStats";
import type { OsceCategorySlug } from "@/engine/types";

const label = (slug: OsceCategorySlug) =>
  getCategoryBySlug(slug)?.label ?? categoryLabel(slug);

const formatMinutes = (min: number) =>
  min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min}m`;

const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });

const StatTile = ({
  icon,
  value,
  caption,
}: {
  icon: React.ReactNode;
  value: string;
  caption: string;
}) => (
  <Card>
    <CardContent className="flex items-center gap-3 p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rcsi-mint/40 text-rcsi-navy dark:text-rcsi-mint">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xl font-semibold leading-tight">{value}</div>
        <div className="truncate text-xs text-muted-foreground">{caption}</div>
      </div>
    </CardContent>
  </Card>
);

/**
 * /osce/progress — attempt-history dashboard for the OSCE engine.
 * Everything is derived on the fly from the stored attempts, so the page
 * has no state of its own to keep in sync.
 */
const OsceProgress = () => {
  const user = useAuthStore((s) => s.user);
  const attempts = useOsceAttemptStore((s) => s.attempts);
  const load = useOsceAttemptStore((s) => s.load);

  useEffect(() => {
    load(user?.id ?? null);
  }, [load, user?.id]);

  const overall = useMemo(() => computeOverall(attempts), [attempts]);
  const categories = useMemo(() => computeCategoryStats(attempts), [attempts]);
  const skills = useMemo(() => computeSkillStats(attempts), [attempts]);
  const mistakes = useMemo(() => computeMistakes(attempts), [attempts]);
  const trend = useMemo(() => computeTrend(attempts), [attempts]);
  const badges = useMemo(() => computeBadges(attempts), [attempts]);
  const plan = useMemo(() => computeRecommendation(attempts), [attempts]);
  const recent = useMemo(() => [...attempts].reverse().slice(0, 10), [attempts]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4 pb-24">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/osce" aria-label="Back to OSCE catalog">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <h1 className="text-xl font-bold">OSCE Progress</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        <StatTile
          icon={<Target size={18} />}
          value={`${overall.averagePct}%`}
          caption="Average score"
        />
        <StatTile
          icon={<CalendarCheck size={18} />}
          value={`${overall.passed} / ${overall.attempts}`}
          caption="Stations passed"
        />
        <StatTile
          icon={<Flame size={18} />}
          value={`${overall.streakDays} ${overall.streakDays === 1 ? "day" : "days"}`}
          caption="Study streak"
        />
        <StatTile
          icon={<Clock size={18} />}
          value={formatMinutes(overall.practiceMinutes)}
          caption="Time practised"
        />
        <StatTile
          icon={<TrendingUp size={18} />}
          value={String(overall.stationsTried)}
          caption="Unique stations tried"
        />
        <StatTile
          icon={<X size={18} />}
          value={String(overall.failed)}
          caption="Not passed"
        />
      </motion.div>

      <Card className="border-rcsi-green/40 bg-rcsi-mint/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Today&apos;s recommendation</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <ul className="list-disc pl-5 text-sm">
            {plan.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Estimated study time: {plan.estimatedMinutes} minutes
            </span>
            <Button size="sm" asChild>
              <Link to="/osce">Start practising</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="categories">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Category progress</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No attempts yet — your weakest categories will show up here first.
                </p>
              )}
              {categories.map((c) => (
                <div key={c.category} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{label(c.category)}</span>
                    <span className="text-muted-foreground">
                      {c.averagePct}% · {c.passed}/{c.attempts} passed
                    </span>
                  </div>
                  <Progress value={c.averagePct} />
                </div>
              ))}
            </CardContent>
          </Card>

          {trend.length > 1 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Weekly trend</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {trend.map((t) => (
                  <div key={t.weekStart} className="flex items-center gap-3 text-sm">
                    <span className="w-24 shrink-0 text-muted-foreground">
                      {formatDay(t.weekStart)}
                    </span>
                    <Progress value={t.averagePct} className="flex-1" />
                    <span className="w-10 text-right">{t.averagePct}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="skills" className="flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Skill progress</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {skills.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Complete a station to see per-skill scores.
                </p>
              )}
              {skills.map((s) => (
                <div key={s.skill} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{s.skill}</span>
                    <span className="text-muted-foreground">{s.averagePct}%</span>
                  </div>
                  <Progress value={s.averagePct} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Most common mistakes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {mistakes.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No mistakes recorded — keep it up!
                </p>
              )}
              {mistakes.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center gap-3 rounded-lg border p-3 text-sm"
                >
                  {m.critical ? (
                    <AlertTriangle size={16} className="shrink-0 text-destructive" />
                  ) : (
                    <X size={16} className="shrink-0 text-muted-foreground" />
                  )}
                  <span className="flex-1">{m.label}</span>
                  <Badge variant={m.critical ? "destructive" : "secondary"}>
                    {m.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent attempts</CardTitle>
            </CardHeader>
            <CardContent>
              {recent.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Your last 10 attempts will appear here.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Station</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-right">Result</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recent.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="max-w-40 truncate">
                          <Link
                            to={`/osce/station/${a.stationId}`}
                            className="hover:underline"
                          >
                            {a.stationTitle}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">{a.score.pct}%</TableCell>
                        <TableCell className="text-right">
                          {a.score.passed ? (
                            <Check size={16} className="ml-auto text-rcsi-green" />
                          ) : (
                            <X size={16} className="ml-auto text-destructive" />
                          )}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatDay(a.finishedAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-3 text-sm",
                    b.earned
                      ? "border-rcsi-green/50 bg-rcsi-mint/30"
                      : "opacity-50",
                  )}
                >
                  <Award
                    size={18}
                    className={cn("shrink-0", b.earned && "text-rcsi-green")}
                  />
                  <span>{b.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OsceProgress;
