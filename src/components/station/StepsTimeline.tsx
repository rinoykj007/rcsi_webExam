import { StaggerContainer } from "@/components/animations";
import { StepCard } from "./StepCard";

interface StepItem {
  step: number;
  title: string;
  detail: string;
}

interface StepsTimelineProps {
  steps: StepItem[];
}

export const StepsTimeline = ({ steps }: StepsTimelineProps) => (
  <StaggerContainer staggerDelay={0.1} delay={0.2}>
    <div className="space-y-2">
      {steps.map((step, index) => (
        <StepCard
          key={step.step}
          step={step.step}
          title={step.title}
          detail={step.detail}
          isLast={index === steps.length - 1}
        />
      ))}
    </div>
  </StaggerContainer>
);
