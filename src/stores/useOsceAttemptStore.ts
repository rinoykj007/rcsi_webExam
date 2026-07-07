import { create } from "zustand";
import type { OsceAttempt, OsceStation } from "@/engine/types";
import type { StoredAttempt } from "@/lib/osceProgressStats";

/**
 * Attempt history for the OSCE progress tracker.
 *
 * Persists to localStorage per user for now — the Supabase project has no
 * tables yet. Once the `osce_attempts` migration is applied, recordAttempt
 * additionally inserts the same shape into the table (StoredAttempt maps
 * column-for-column) and load() reads from it; the aggregation layer in
 * osceProgressStats is storage-agnostic either way.
 */

const MAX_STORED_ATTEMPTS = 500;

const storageKey = (userId: string | null) => `osce-attempts:${userId ?? "guest"}`;

const readAttempts = (userId: string | null): StoredAttempt[] => {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    const parsed = raw ? (JSON.parse(raw) as StoredAttempt[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeAttempts = (userId: string | null, attempts: StoredAttempt[]) => {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(attempts));
  } catch {
    // Quota exceeded / private mode — keep the in-memory copy only.
  }
};

interface OsceAttemptState {
  attempts: StoredAttempt[];
  loadedFor: string | null;
  load: (userId: string | null) => void;
  recordAttempt: (
    userId: string | null,
    station: OsceStation,
    attempt: OsceAttempt,
  ) => StoredAttempt;
  clear: (userId: string | null) => void;
}

export const useOsceAttemptStore = create<OsceAttemptState>((set, get) => ({
  attempts: [],
  loadedFor: null,
  load: (userId) => {
    set({ attempts: readAttempts(userId), loadedFor: userId ?? "guest" });
  },
  recordAttempt: (userId, station, attempt) => {
    const stored: StoredAttempt = {
      id: crypto.randomUUID(),
      stationId: attempt.stationId,
      stationTitle: station.title,
      category: station.category,
      startedAt: attempt.startedAt,
      finishedAt: attempt.finishedAt,
      score: attempt.score,
      results: attempt.results,
    };
    const key = userId ?? "guest";
    const base = get().loadedFor === key ? get().attempts : readAttempts(userId);
    const attempts = [...base, stored].slice(-MAX_STORED_ATTEMPTS);
    set({ attempts, loadedFor: key });
    writeAttempts(userId, attempts);
    return stored;
  },
  clear: (userId) => {
    set({ attempts: [], loadedFor: userId ?? "guest" });
    try {
      localStorage.removeItem(storageKey(userId));
    } catch {
      // ignore
    }
  },
}));
