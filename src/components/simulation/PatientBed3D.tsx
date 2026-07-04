import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Group } from "three";

interface PatientBed3DProps {
  showTarget: boolean;
  siteLabel: string;
  onInject: () => void;
}

export const PatientBed3D = ({ showTarget, siteLabel, onInject }: PatientBed3DProps) => {
  const targetRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (targetRef.current) {
      const s = 1 + Math.sin(t * 4) * 0.15;
      targetRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[-1.35, 0, 0]}>
      {/* bed frame + legs */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2.1, 0.18, 1.0]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      {[-0.95, 0.95].map((x) =>
        [-0.4, 0.4].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.12, z]}>
            <cylinderGeometry args={[0.04, 0.04, 0.24]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        )),
      )}
      {/* headboard */}
      <mesh position={[-1.08, 0.65, 0]}>
        <boxGeometry args={[0.08, 0.9, 1.0]} />
        <meshStandardMaterial color="#7c8aa0" />
      </mesh>
      {/* mattress */}
      <mesh position={[0, 0.47, 0]}>
        <boxGeometry args={[2.05, 0.16, 0.95]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* pillow */}
      <mesh position={[-0.78, 0.6, 0]}>
        <boxGeometry args={[0.42, 0.12, 0.6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* patient head */}
      <mesh position={[-0.62, 0.72, 0]}>
        <sphereGeometry args={[0.17, 24, 24]} />
        <meshStandardMaterial color="#f5c9a4" />
      </mesh>
      {/* hair */}
      <mesh position={[-0.7, 0.78, 0]}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial color="#8d8d94" />
      </mesh>
      {/* torso under blanket */}
      <mesh position={[0.25, 0.62, 0]} rotation={[0, 0, -0.04]}>
        <boxGeometry args={[1.5, 0.22, 0.85]} />
        <meshStandardMaterial color="#a7d3c0" />
      </mesh>
      {/* exposed arm toward the room (deltoid = injection site) */}
      <group position={[-0.25, 0.68, 0.42]} rotation={[0, 0.35, -0.15]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.075, 0.55, 6, 12]} />
          <meshStandardMaterial color="#f5c9a4" />
        </mesh>
      </group>

      {showTarget && (
        <group ref={targetRef} position={[0.25, 0.95, 0.42]}>
          <mesh
            rotation={[-Math.PI / 2.6, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onInject();
            }}
          >
            <torusGeometry args={[0.16, 0.025, 12, 32]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.6} />
          </mesh>
          <Html center position={[0, 0.28, 0]} zIndexRange={[20, 10]}>
            <button
              type="button"
              aria-label={`Inject at ${siteLabel}`}
              onClick={onInject}
              className="whitespace-nowrap rounded-full bg-rcsi-navy text-white text-[10px] font-bold px-2 py-1 shadow"
            >
              Tap to inject
            </button>
          </Html>
        </group>
      )}
    </group>
  );
};
