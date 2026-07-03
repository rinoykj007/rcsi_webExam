import { AnimatePresence, motion } from "framer-motion";
import { RoomItem, SimulationScenario } from "@/data/simulationScenarios";
import { ItemSprite } from "./ItemSprite";

export type ScenePhase =
  | "intro"
  | "speaking"
  | "awaitingPick"
  | "awaitingInject"
  | "injecting"
  | "complete";

export interface FloatingPoints {
  x: number;
  y: number;
  value: number;
  key: number;
}

interface SimulationSceneProps {
  scenario: SimulationScenario;
  phase: ScenePhase;
  /** Item ids that are a correct pick for the current step. */
  correctItemIds: string[];
  hintShown: boolean;
  pickedItemIds: string[];
  /** Re-keyed on every wrong attempt so the shake re-fires. */
  shake: { itemId: string; key: number } | null;
  floatingPoints: FloatingPoints | null;
  onPickItem: (item: RoomItem) => void;
  onInject: () => void;
  onInjectDone: () => void;
}

const itemBoxSize = (item: RoomItem) => {
  if (item.kind === "syringe")
    return item.size === "lg" ? "w-[24%]" : item.size === "md" ? "w-[20%]" : "w-[16%]";
  if (item.kind === "needle") return "w-[16%]";
  return "w-[12%]";
};

const needleTint = (item: RoomItem) =>
  item.label.toLowerCase().includes("blue")
    ? "text-blue-600"
    : item.label.toLowerCase().includes("orange")
      ? "text-orange-500"
      : "text-slate-500";

export const SimulationScene = ({
  scenario,
  phase,
  correctItemIds,
  hintShown,
  pickedItemIds,
  shake,
  floatingPoints,
  onPickItem,
  onInject,
  onInjectDone,
}: SimulationSceneProps) => {
  const visibleItems = scenario.items.filter((i) => !pickedItemIds.includes(i.id));
  const pickedItems = scenario.items.filter((i) => pickedItemIds.includes(i.id));
  const site = scenario.injectionSite;

  return (
    <div>
      <div className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm select-none">
        {/* Room */}
        <div className="absolute inset-x-0 top-0 h-[55%] bg-rcsi-mint/30 dark:bg-slate-800" />
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-[#e7e2d9] dark:bg-slate-900" />
        {/* Window */}
        <div className="absolute left-[8%] top-[6%] w-[22%] h-[18%] rounded-lg bg-sky-100 dark:bg-slate-700 border-4 border-white dark:border-slate-600">
          <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-white dark:bg-slate-600" />
        </div>
        {/* Wall clock */}
        <div className="absolute right-[10%] top-[7%] w-[9%] aspect-square rounded-full bg-white dark:bg-slate-700 border-2 border-gray-300 dark:border-slate-500">
          <div className="absolute left-1/2 top-1/2 w-[2px] h-[30%] -translate-x-1/2 -translate-y-full bg-gray-500 origin-bottom" />
          <div className="absolute left-1/2 top-1/2 h-[2px] w-[26%] -translate-y-1/2 bg-gray-400" />
        </div>

        {/* Patient on bed (left) */}
        <svg viewBox="0 0 100 100" className="absolute left-[2%] top-[30%] w-[52%]" aria-label={`Patient ${scenario.patient.name} on a bed`}>
          {/* bed frame */}
          <rect x={4} y={52} width={92} height={16} rx={4} fill="#cbd5e1" />
          <rect x={4} y={66} width={5} height={22} fill="#94a3b8" />
          <rect x={91} y={66} width={5} height={22} fill="#94a3b8" />
          <rect x={2} y={28} width={8} height={28} rx={3} fill="#94a3b8" />
          {/* mattress + pillow */}
          <rect x={8} y={44} width={88} height={12} rx={5} fill="#f8fafc" />
          <rect x={10} y={40} width={20} height={10} rx={4} fill="#fff" stroke="#e2e8f0" />
          {/* patient head */}
          <circle cx={22} cy={38} r={7} fill="#f5c9a4" />
          <path d="M15 35 a7 7 0 0 1 14 0 l-2 -1 -3 1 -4 -2 -3 2 Z" fill="#8d8d94" />
          {/* torso under blanket */}
          <path d="M30 44 Q52 34 92 44 L92 54 L30 54 Z" fill="#a7d3c0" />
          {/* exposed arm toward the room */}
          <path d="M30 42 Q42 36 54 40 L53 46 Q42 42 32 47 Z" fill="#f5c9a4" />
        </svg>

        {/* Treatment trolley (right): one shelf under each item row */}
        <div className="absolute right-[2%] top-[30%] w-[52%] h-[58%]">
          {[0, 24, 48, 72].map((top) => (
            <div
              key={top}
              className="absolute inset-x-0 h-[4%] rounded bg-slate-300 dark:bg-slate-600"
              style={{ top: `${top}%` }}
            />
          ))}
          <div className="absolute left-[5%] bottom-0 top-[2%] w-[3%] bg-slate-400 dark:bg-slate-500" />
          <div className="absolute right-[5%] bottom-0 top-[2%] w-[3%] bg-slate-400 dark:bg-slate-500" />
        </div>

        {/* Clickable items */}
        {visibleItems.map((item) => {
          const isCorrect = correctItemIds.includes(item.id);
          const highlighted = hintShown && isCorrect && phase === "awaitingPick";
          const shaking = shake?.itemId === item.id;
          return (
            <motion.button
              key={shaking ? `${item.id}-${shake?.key}` : item.id}
              type="button"
              aria-label={item.detail ? `${item.label} — ${item.detail}` : item.label}
              onClick={() => onPickItem(item)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 ${itemBoxSize(item)} ${item.kind === "needle" ? needleTint(item) : ""}`}
              style={{ left: `${item.position.x}%`, top: `${item.position.y}%` }}
              whileTap={{ scale: 0.9 }}
              animate={shaking ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
              transition={shaking ? { duration: 0.45 } : undefined}
            >
              {highlighted && (
                <motion.span
                  className="absolute -inset-2 rounded-full border-2 border-rcsi-green bg-rcsi-green/15"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0.2, 0.7] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                />
              )}
              <div className="relative aspect-[2/1]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ItemSprite kind={item.kind} size={item.size} />
                </div>
              </div>
              <span className="block mx-auto mt-0.5 w-fit whitespace-nowrap rounded-full bg-white/85 dark:bg-slate-800/85 px-1.5 text-[9px] font-semibold text-gray-700 dark:text-gray-200">
                {item.label}
              </span>
            </motion.button>
          );
        })}

        {/* Injection site target */}
        <AnimatePresence>
          {phase === "awaitingInject" && (
            <motion.button
              type="button"
              aria-label={`Inject at ${site.label}`}
              onClick={onInject}
              className="absolute w-[13%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-rcsi-navy dark:border-rcsi-green"
              style={{ left: `${site.x}%`, top: `${site.y}%` }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1, scale: [1, 1.15, 1] }}
              transition={{ scale: { repeat: Infinity, duration: 1.2 } }}
            >
              <span className="absolute inset-[28%] rounded-full bg-rcsi-green/40" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Flying syringe while injecting */}
        {phase === "injecting" && (
          <motion.div
            className="absolute w-[16%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ left: "72%", top: "70%", rotate: 0 }}
            animate={{ left: `${site.x + 4}%`, top: `${site.y - 2}%`, rotate: -35 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            onAnimationComplete={onInjectDone}
          >
            <ItemSprite kind="syringe" size="sm" />
          </motion.div>
        )}

        {/* Floating points */}
        <AnimatePresence>
          {floatingPoints && (
            <motion.div
              key={floatingPoints.key}
              className="absolute -translate-x-1/2 pointer-events-none font-display font-extrabold text-rcsi-green text-xl drop-shadow"
              style={{ left: `${floatingPoints.x}%`, top: `${floatingPoints.y}%` }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              +{floatingPoints.value}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* In-hand tray */}
      <div className="max-w-md mx-auto mt-3 flex items-center gap-2 min-h-12 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-3 py-2">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide shrink-0">
          In hand
        </span>
        {pickedItems.length === 0 ? (
          <span className="text-xs text-gray-400">Nothing picked yet</span>
        ) : (
          pickedItems.map((item) => (
            <motion.span
              key={item.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`inline-flex items-center gap-1 rounded-full bg-rcsi-mint/40 dark:bg-slate-700 px-2 py-1 ${item.kind === "needle" ? needleTint(item) : ""}`}
            >
              <span className="w-8 h-4 inline-block">
                <ItemSprite kind={item.kind} size="sm" />
              </span>
              <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-200">
                {item.label}
              </span>
            </motion.span>
          ))
        )}
      </div>
    </div>
  );
};
