import { useState } from "react";

export const FlipCard = ({ front, back, onFlip }: {
  front: React.ReactNode; back: React.ReactNode; onFlip?: (flipped: boolean) => void;
}) => {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => { setFlipped((f) => { onFlip?.(!f); return !f; }); };
  return (
    <div className="perspective w-full" onClick={toggle}>
      <div className="relative preserve-3d transition-transform duration-500 cursor-pointer min-h-[280px]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0)" }}>
        <div className="absolute inset-0 backface-hidden bg-card rounded-3xl shadow-card p-6 flex flex-col">
          {front}
        </div>
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-rcsi-navy text-primary-foreground rounded-3xl shadow-elevated p-6 flex flex-col">
          {back}
        </div>
      </div>
    </div>
  );
};
