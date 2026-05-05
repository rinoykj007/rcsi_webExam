import { FadeIn } from "@/components/animations";

interface StepsTipsProps {
  tips?: string[];
}

export const StepsTips = ({
  tips = [
    "Follow each step in order for best results",
    "Pay special attention to hand hygiene between steps",
    "Always prioritize patient safety and infection control",
  ],
}: StepsTipsProps) => (
  <FadeIn direction="up" delay={0.4}>
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200 mt-2 sm:mt-3">
      <h3 className="font-display font-bold text-rcsi-navy text-base sm:text-lg mb-2">
        Key Tips
      </h3>
      <ul className="space-y-1.5">
        {tips.map((tip, i) => (
          <li key={i} className="flex gap-2 text-xs sm:text-sm text-rcsi-navy">
            <span className="flex-shrink-0 font-bold">✓</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  </FadeIn>
);
