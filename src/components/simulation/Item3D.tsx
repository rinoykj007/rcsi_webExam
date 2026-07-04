import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Group } from "three";
import { RoomItem } from "@/data/simulationScenarios";

interface Item3DProps {
  item: RoomItem;
  position: [number, number, number];
  highlighted: boolean;
  /** Changes on every wrong attempt to re-trigger the shake. */
  shakeKey: number | null;
  onPick: (item: RoomItem) => void;
}

const BARREL_LEN: Record<"sm" | "md" | "lg", number> = { sm: 0.22, md: 0.3, lg: 0.38 };

const needleColor = (label: string) =>
  label.toLowerCase().includes("blue")
    ? "#2563eb"
    : label.toLowerCase().includes("orange")
      ? "#f97316"
      : "#64748b";

const ItemMesh = ({ item }: { item: RoomItem }) => {
  switch (item.kind) {
    case "syringe": {
      const len = BARREL_LEN[item.size ?? "sm"];
      return (
        <group rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.045, 0.045, len, 16]} />
            <meshStandardMaterial color="#dbeafe" transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, len / 2 + 0.03, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.08, 12]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[0, -len / 2 - 0.05, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.1, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.6} />
          </mesh>
        </group>
      );
    }
    case "needle":
      return (
        <group rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <capsuleGeometry args={[0.035, 0.14, 6, 12]} />
            <meshStandardMaterial color={needleColor(item.label)} />
          </mesh>
          <mesh position={[0, -0.14, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.08, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.6} />
          </mesh>
        </group>
      );
    case "ampoule":
      return (
        <group>
          <mesh position={[0, -0.02, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.14, 16]} />
            <meshStandardMaterial color="#fecaca" transparent opacity={0.92} />
          </mesh>
          <mesh position={[0, 0.09, 0]}>
            <cylinderGeometry args={[0.012, 0.03, 0.08, 12]} />
            <meshStandardMaterial color="#fda4af" />
          </mesh>
        </group>
      );
    case "vial":
      return (
        <group>
          <mesh position={[0, -0.01, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.16, 16]} />
            <meshStandardMaterial color="#d9f99d" transparent opacity={0.95} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.05, 12]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        </group>
      );
    case "swab":
      return (
        <mesh>
          <boxGeometry args={[0.16, 0.03, 0.14]} />
          <meshStandardMaterial color="#bfdbfe" />
        </mesh>
      );
    case "sharpsBin":
      return (
        <mesh>
          <boxGeometry args={[0.2, 0.24, 0.2]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
      );
  }
};

export const Item3D = ({ item, position, highlighted, shakeKey, onPick }: Item3DProps) => {
  const group = useRef<Group>(null);
  const ringRef = useRef<Group>(null);
  const shakeUntil = useRef(0);
  const lastShakeKey = useRef<number | null>(null);

  if (shakeKey !== null && shakeKey !== lastShakeKey.current) {
    lastShakeKey.current = shakeKey;
    shakeUntil.current = performance.now() + 450;
  }

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      const remaining = shakeUntil.current - performance.now();
      group.current.position.x =
        position[0] + (remaining > 0 ? Math.sin(t * 45) * 0.03 * (remaining / 450) : 0);
      if (highlighted) {
        const s = 1 + Math.sin(t * 5) * 0.08;
        group.current.scale.set(s, s, s);
      } else {
        group.current.scale.set(1, 1, 1);
      }
    }
    if (ringRef.current) {
      const s = 1 + Math.sin(t * 4) * 0.2;
      ringRef.current.scale.set(s, 1, s);
    }
  });

  const pick = (e?: { stopPropagation: () => void }) => {
    e?.stopPropagation();
    onPick(item);
  };

  return (
    <group ref={group} position={position}>
      <group onClick={pick}>
        <ItemMesh item={item} />
      </group>
      {highlighted && (
        <group ref={ringRef} position={[0, -0.05, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.26, 0.03, 10, 32]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.4} />
          </mesh>
        </group>
      )}
      <Html center position={[0, -0.16, 0]} zIndexRange={[10, 0]}>
        <button
          type="button"
          aria-label={item.detail ? `${item.label} — ${item.detail}` : item.label}
          onClick={() => pick()}
          className="whitespace-nowrap rounded-full bg-white/90 dark:bg-slate-800/90 px-1.5 py-0.5 text-[9px] font-semibold text-gray-700 dark:text-gray-200 shadow-sm"
        >
          {item.label}
        </button>
      </Html>
    </group>
  );
};
