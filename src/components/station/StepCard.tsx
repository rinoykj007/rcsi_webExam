import { StaggerItem } from "@/components/animations";

interface StepCardProps {
  step: number;
  title: string;
  detail: string;
  isLast: boolean;
}

export const StepCard = ({ step, title, detail, isLast }: StepCardProps) => (
  <StaggerItem>
    <div className="flex gap-2 sm:gap-3">
      {/* Step Number */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-display font-bold text-sm sm:text-base shadow-md">
          {step}
        </div>
        {!isLast && (
          <div className="h-4 sm:h-5 w-0.5 bg-gradient-to-b from-blue-200 to-transparent mx-auto mt-1"></div>
        )}
      </div>

      {/* Step Content */}
      <div className="flex-1">
        <div className="bg-card rounded-lg sm:rounded-xl p-2 sm:p-2.5 shadow-soft border border-border">
          <h3 className="font-display font-bold text-rcsi-navy text-sm sm:text-base leading-snug mb-1">
            {title}
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm leading-snug line-clamp-2">
            {detail}
          </p>
        </div>
      </div>
    </div>
  </StaggerItem>
);
