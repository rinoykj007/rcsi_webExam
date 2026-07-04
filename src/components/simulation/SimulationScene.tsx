import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Group, MathUtils, Vector3 } from "three";
import { RoomItem, SimulationScenario } from "@/data/simulationScenarios";
import { ItemSprite } from "./ItemSprite";
import { Item3D } from "./Item3D";
import { PatientBed3D } from "./PatientBed3D";
import { NurseCharacter3D, NursePose } from "./NurseCharacter3D";

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

// Map the scenario's 2D percentage positions onto trolley shelves.
const SHELF_Y = [1.32, 0.99, 0.66, 0.33];
const shelfRow = (y: number) => (y < 33 ? 0 : y < 47 ? 1 : y < 60 ? 2 : 3);
const itemWorldPos = (p: { x: number; y: number }): [number, number, number] => [
  0.35 + ((p.x - 50) / 40) * 1.35,
  SHELF_Y[shelfRow(p.y)] + 0.12,
  0.05,
];

const NURSE_STAND = new Vector3(-0.3, 0, 1.15);
const NURSE_BEDSIDE = new Vector3(-0.75, 0, 0.85);

const needleTint = (item: RoomItem) =>
  item.label.toLowerCase().includes("blue")
    ? "text-blue-600"
    : item.label.toLowerCase().includes("orange")
      ? "text-orange-500"
      : "text-slate-500";

/** Owns the nurse's walk → inject → celebrate sequence, frame-driven. */
const NurseRig = ({
  phase,
  holding,
  onInjectDone,
}: {
  phase: ScenePhase;
  holding: boolean;
  onInjectDone: () => void;
}) => {
  const group = useRef<Group>(null);
  const walk = useRef(0);
  const armTime = useRef(0);
  const fired = useRef(false);
  const poseRef = useRef<NursePose>("idle");
  const holdingRef = useRef(holding);
  holdingRef.current = holding;

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;

    if (phase === "injecting") {
      if (walk.current < 1) {
        walk.current = Math.min(1, walk.current + delta / 1.1);
        const e = MathUtils.smoothstep(walk.current, 0, 1);
        g.position.lerpVectors(NURSE_STAND, NURSE_BEDSIDE, e);
        g.rotation.y = MathUtils.lerp(0.15, 0.9, e);
        poseRef.current = "walking";
      } else if (armTime.current < 0.9) {
        armTime.current += delta;
        poseRef.current = "injecting";
      } else if (!fired.current) {
        fired.current = true;
        onInjectDone();
      } else {
        poseRef.current = "celebrating";
      }
    } else {
      walk.current = 0;
      armTime.current = 0;
      fired.current = false;
      g.position.copy(NURSE_STAND);
      g.rotation.y = 0.15;
      poseRef.current = phase === "complete" ? "celebrating" : "idle";
    }
  });

  return (
    <group ref={group} position={NURSE_STAND.toArray()} rotation={[0, 0.15, 0]}>
      <NurseCharacter3D poseRef={poseRef} holdingRef={holdingRef} />
    </group>
  );
};

const Room = () => (
  <group>
    {/* floor */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.5]}>
      <planeGeometry args={[9, 6]} />
      <meshStandardMaterial color="#e7e2d9" />
    </mesh>
    {/* back wall */}
    <mesh position={[0, 1.6, -1.3]}>
      <planeGeometry args={[9, 3.6]} />
      <meshStandardMaterial color="#d8ebe2" />
    </mesh>
    {/* window */}
    <mesh position={[-1.6, 1.9, -1.28]}>
      <planeGeometry args={[1.1, 0.85]} />
      <meshStandardMaterial color="#bfe0f5" />
    </mesh>
    <mesh position={[-1.6, 1.9, -1.27]}>
      <boxGeometry args={[1.2, 0.06, 0.02]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  </group>
);

const Trolley = () => (
  <group>
    {SHELF_Y.map((y) => (
      <mesh key={y} position={[1.05, y, 0]}>
        <boxGeometry args={[1.75, 0.05, 0.6]} />
        <meshStandardMaterial color="#b9c2cf" />
      </mesh>
    ))}
    {[0.25, 1.85].map((x) =>
      [-0.26, 0.26].map((z) => (
        <mesh key={`${x}${z}`} position={[x, 0.7, z]}>
          <cylinderGeometry args={[0.025, 0.025, 1.35, 10]} />
          <meshStandardMaterial color="#8494a8" />
        </mesh>
      )),
    )}
  </group>
);

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
  const holdingSyringe = pickedItems.some((i) => i.kind === "syringe");

  return (
    <div>
      <div className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm select-none bg-[#d8ebe2]">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 2.3, 5.3], fov: 44 }}
          onCreated={({ camera }) => camera.lookAt(-0.25, 0.7, 0)}
        >
          <ambientLight intensity={0.85} />
          <directionalLight position={[3, 5, 4]} intensity={1.1} />
          <directionalLight position={[-3, 3, 2]} intensity={0.35} />
          <Room />
          <Trolley />
          <PatientBed3D
            showTarget={phase === "awaitingInject"}
            siteLabel={scenario.injectionSite.label}
            onInject={onInject}
          />
          {visibleItems.map((item) => (
            <Item3D
              key={item.id}
              item={item}
              position={itemWorldPos(item.position)}
              highlighted={hintShown && phase === "awaitingPick" && correctItemIds.includes(item.id)}
              shakeKey={shake?.itemId === item.id ? shake.key : null}
              onPick={onPickItem}
            />
          ))}
          <NurseRig phase={phase} holding={holdingSyringe} onInjectDone={onInjectDone} />
        </Canvas>

        {/* Floating points overlay */}
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
