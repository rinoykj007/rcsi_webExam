import { MutableRefObject, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, MathUtils } from "three";

export type NursePose = "idle" | "walking" | "injecting" | "celebrating";

interface NurseCharacter3DProps {
  /** Read every frame so pose can change without re-rendering. */
  poseRef: MutableRefObject<NursePose>;
  /** Read every frame — true once the syringe has been picked. */
  holdingRef: MutableRefObject<boolean>;
}

const SKIN = "#f2c19b";
const SCRUBS = "#1e3a5f"; // rcsi navy family
const TROUSERS = "#2e7d6b";
const HAIR = "#4a3728";

/**
 * Low-poly cartoon nurse built from primitives. Pose micro-animations
 * (bobbing, leg swing, arm raise, blinking) are driven per-frame from
 * poseRef, so the parent can change pose mid-animation without re-rendering.
 */
export const NurseCharacter3D = ({ poseRef, holdingRef }: NurseCharacter3DProps) => {
  const body = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const eyes = useRef<Group>(null);
  const syringe = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pose = poseRef.current;

    if (body.current) {
      body.current.position.y =
        pose === "walking"
          ? Math.abs(Math.sin(t * 9)) * 0.05
          : pose === "celebrating"
            ? Math.abs(Math.sin(t * 5)) * 0.09
            : pose === "idle"
              ? Math.sin(t * 2) * 0.02
              : 0;
    }

    const legSwing = pose === "walking" ? Math.sin(t * 9) * 0.5 : 0;
    if (leftLeg.current) leftLeg.current.rotation.x = MathUtils.lerp(leftLeg.current.rotation.x, legSwing, 0.3);
    if (rightLeg.current) rightLeg.current.rotation.x = MathUtils.lerp(rightLeg.current.rotation.x, -legSwing, 0.3);

    // right arm: relaxed → raised forward when injecting; swings while walking
    const rightArmTarget =
      pose === "injecting" ? -1.5 : pose === "walking" ? Math.sin(t * 9) * 0.4 : 0.1;
    if (rightArm.current)
      rightArm.current.rotation.x = MathUtils.lerp(rightArm.current.rotation.x, rightArmTarget, 0.12);

    // left arm: waves when celebrating
    const leftArmTarget =
      pose === "celebrating" ? Math.PI - 0.4 + Math.sin(t * 8) * 0.25 : pose === "walking" ? -Math.sin(t * 9) * 0.4 : 0.1;
    if (leftArm.current)
      leftArm.current.rotation.x = MathUtils.lerp(leftArm.current.rotation.x, leftArmTarget, 0.12);

    // blink roughly every 3.5s
    if (eyes.current) {
      const cycle = t % 3.5;
      eyes.current.scale.y = cycle > 3.3 ? 0.15 : 1;
    }

    if (syringe.current) syringe.current.visible = holdingRef.current;
  });

  return (
    <group ref={body}>
      {/* legs (pivot at hip) */}
      {[
        [leftLeg, -0.09] as const,
        [rightLeg, 0.09] as const,
      ].map(([ref, x]) => (
        <group key={x} ref={ref} position={[x, 0.62, 0]}>
          <mesh position={[0, -0.24, 0]}>
            <capsuleGeometry args={[0.055, 0.36, 6, 12]} />
            <meshStandardMaterial color={TROUSERS} />
          </mesh>
          <mesh position={[0, -0.48, 0.04]}>
            <boxGeometry args={[0.1, 0.06, 0.18]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </group>
      ))}

      {/* scrubs torso */}
      <mesh position={[0, 0.88, 0]}>
        <capsuleGeometry args={[0.17, 0.34, 8, 16]} />
        <meshStandardMaterial color={SCRUBS} />
      </mesh>
      {/* ID badge */}
      <mesh position={[0.09, 0.95, 0.16]}>
        <boxGeometry args={[0.07, 0.09, 0.015]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* arms (pivot at shoulder) */}
      <group ref={leftArm} position={[-0.22, 1.05, 0]}>
        <mesh position={[0, -0.17, 0]}>
          <capsuleGeometry args={[0.045, 0.26, 6, 12]} />
          <meshStandardMaterial color={SCRUBS} />
        </mesh>
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={SKIN} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.22, 1.05, 0]}>
        <mesh position={[0, -0.17, 0]}>
          <capsuleGeometry args={[0.045, 0.26, 6, 12]} />
          <meshStandardMaterial color={SCRUBS} />
        </mesh>
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={SKIN} />
        </mesh>
        {/* held syringe (visible once picked) */}
        <group ref={syringe} position={[0, -0.4, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.025, 0.025, 0.16, 12]} />
            <meshStandardMaterial color="#dbeafe" />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.08, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.6} />
          </mesh>
        </group>
      </group>

      {/* head */}
      <mesh position={[0, 1.32, 0]}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial color={SKIN} />
      </mesh>
      {/* hair + bun */}
      <mesh position={[0, 1.38, -0.04]}>
        <sphereGeometry args={[0.155, 24, 24]} />
        <meshStandardMaterial color={HAIR} />
      </mesh>
      <mesh position={[0, 1.47, -0.12]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={HAIR} />
      </mesh>
      {/* eyes */}
      <group ref={eyes} position={[0, 1.33, 0.13]}>
        {[-0.055, 0.055].map((x) => (
          <mesh key={x} position={[x, 0, 0]}>
            <sphereGeometry args={[0.02, 10, 10]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        ))}
      </group>
      {/* smile (half-torus flipped so the arc curves upward) */}
      <mesh position={[0, 1.25, 0.145]} rotation={[0.3, 0, Math.PI]}>
        <torusGeometry args={[0.035, 0.008, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>
    </group>
  );
};
