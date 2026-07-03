import { ItemKind } from "@/data/simulationScenarios";

interface ItemSpriteProps {
  kind: ItemKind;
  size?: "sm" | "md" | "lg";
}

const SYRINGE_BARREL: Record<"sm" | "md" | "lg", number> = {
  sm: 22,
  md: 30,
  lg: 38,
};

const Syringe = ({ size = "sm" }: { size?: "sm" | "md" | "lg" }) => {
  const barrel = SYRINGE_BARREL[size];
  return (
    <svg viewBox="0 0 64 24" className="w-full h-full" aria-hidden>
      {/* plunger */}
      <rect x={2} y={9} width={8} height={6} rx={1} fill="#94a3b8" />
      <rect x={8} y={11} width={6} height={2} fill="#cbd5e1" />
      {/* barrel */}
      <rect x={14} y={6} width={barrel} height={12} rx={2} fill="#e0f2fe" stroke="#64748b" strokeWidth={1} />
      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={14 + barrel * t}
          y1={7}
          x2={14 + barrel * t}
          y2={12}
          stroke="#64748b"
          strokeWidth={0.8}
        />
      ))}
      {/* hub + needle */}
      <rect x={14 + barrel} y={9} width={4} height={6} fill="#94a3b8" />
      <line x1={18 + barrel} y1={12} x2={30 + barrel} y2={12} stroke="#475569" strokeWidth={1.4} />
    </svg>
  );
};

const Needle = () => (
  <svg viewBox="0 0 64 24" className="w-full h-full" aria-hidden>
    {/* protective cap */}
    <rect x={8} y={8} width={26} height={8} rx={3} fill="currentColor" opacity={0.85} />
    {/* hub */}
    <rect x={34} y={7} width={8} height={10} rx={2} fill="currentColor" />
    <line x1={42} y1={12} x2={54} y2={12} stroke="#475569" strokeWidth={1.4} />
  </svg>
);

const Ampoule = () => (
  <svg viewBox="0 0 24 40" className="w-full h-full" aria-hidden>
    <path
      d="M10 4 L14 4 L13 12 L16 16 L16 34 A4 4 0 0 1 12 38 A4 4 0 0 1 8 34 L8 16 L11 12 Z"
      fill="#fee2e2"
      stroke="#b91c1c"
      strokeWidth={1}
    />
    <line x1={9} y1={11} x2={15} y2={11} stroke="#b91c1c" strokeWidth={1} />
    <rect x={9} y={22} width={6} height={9} rx={1} fill="#fff" stroke="#b91c1c" strokeWidth={0.6} />
  </svg>
);

const Vial = () => (
  <svg viewBox="0 0 24 40" className="w-full h-full" aria-hidden>
    <rect x={8} y={2} width={8} height={5} rx={1} fill="#94a3b8" />
    <rect x={6} y={7} width={12} height={30} rx={3} fill="#ecfccb" stroke="#4d7c0f" strokeWidth={1} />
    <rect x={8} y={16} width={8} height={13} rx={1} fill="#fff" stroke="#4d7c0f" strokeWidth={0.6} />
  </svg>
);

const Swab = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full" aria-hidden>
    <rect x={4} y={6} width={24} height={20} rx={2} fill="#dbeafe" stroke="#1d4ed8" strokeWidth={1} />
    <line x1={4} y1={16} x2={28} y2={16} stroke="#1d4ed8" strokeWidth={0.8} strokeDasharray="2 2" />
    <circle cx={16} cy={16} r={5} fill="#fff" stroke="#1d4ed8" strokeWidth={0.8} />
  </svg>
);

const SharpsBin = () => (
  <svg viewBox="0 0 32 36" className="w-full h-full" aria-hidden>
    <rect x={4} y={8} width={24} height={26} rx={2} fill="#fde047" stroke="#a16207" strokeWidth={1} />
    <rect x={2} y={4} width={28} height={6} rx={2} fill="#facc15" stroke="#a16207" strokeWidth={1} />
    <path d="M13 18 L19 18 L16 26 Z" fill="#a16207" />
  </svg>
);

export const ItemSprite = ({ kind, size = "sm" }: ItemSpriteProps) => {
  switch (kind) {
    case "syringe":
      return <Syringe size={size} />;
    case "needle":
      return <Needle />;
    case "ampoule":
      return <Ampoule />;
    case "vial":
      return <Vial />;
    case "swab":
      return <Swab />;
    case "sharpsBin":
      return <SharpsBin />;
  }
};
