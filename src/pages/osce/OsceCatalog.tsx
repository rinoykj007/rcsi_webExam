import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { OSCE_CATEGORIES, getCategoryBySlug } from "@/data/osce/categories";
import { OSCE_CATALOG } from "@/data/osce/loadStations";
import type { OsceDifficulty } from "@/engine/types";

const DIFFICULTY_BADGE: Record<OsceDifficulty, string> = {
  Easy: "bg-rcsi-mint/50 text-rcsi-navy dark:text-rcsi-mint",
  Medium: "bg-rcsi-lavender/60 text-rcsi-navy dark:text-rcsi-lavender",
  Hard: "bg-rcsi-peach/60 text-rcsi-navy dark:text-rcsi-peach",
};

const PAGE_SIZE = 60;

/** /osce — browse and filter the 500-station practice catalog. */
const OsceCatalog = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return OSCE_CATALOG.filter(
      (e) =>
        (category === "all" || e.category === category) &&
        (difficulty === "all" || e.difficulty === difficulty) &&
        (q === "" || e.title.toLowerCase().includes(q) || e.id.includes(q)),
    );
  }, [category, difficulty, search]);

  const shown = filtered.slice(0, visible);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4 pb-24">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild aria-label="Back to home">
          <Link to="/">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">OSCE Practice Stations</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {OSCE_CATALOG.length} stations
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setCategory("all");
            setVisible(PAGE_SIZE);
          }}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            category === "all"
              ? "border-rcsi-navy bg-rcsi-navy text-white"
              : "hover:bg-muted",
          )}
        >
          All
        </button>
        {OSCE_CATEGORIES.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => {
              setCategory(c.slug);
              setVisible(PAGE_SIZE);
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              category === c.slug
                ? "border-rcsi-navy bg-rcsi-navy text-white"
                : "hover:bg-muted",
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", c.dotColor)} />
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search stations…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={difficulty}
          onValueChange={(v) => {
            setDifficulty(v);
            setVisible(PAGE_SIZE);
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        {shown.map((entry, i) => {
          const meta = getCategoryBySlug(entry.category);
          return (
            <motion.button
              key={entry.id}
              type="button"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 20) * 0.015 }}
              onClick={() => navigate(`/osce/station/${entry.id}`)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition-colors hover:border-rcsi-navy/40 hover:bg-muted/50",
                meta?.tint,
              )}
            >
              <span
                className={cn("h-2.5 w-2.5 shrink-0 rounded-full", meta?.dotColor)}
              />
              <span className="flex-1 font-medium">{entry.title}</span>
              <Badge
                variant="secondary"
                className={DIFFICULTY_BADGE[entry.difficulty]}
              >
                {entry.difficulty}
              </Badge>
            </motion.button>
          );
        })}
      </div>

      {shown.length < filtered.length && (
        <Button
          variant="outline"
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
          className="self-center"
        >
          Load more ({filtered.length - shown.length} remaining)
        </Button>
      )}
      {filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No stations match your filters.
        </p>
      )}
    </div>
  );
};

export default OsceCatalog;
