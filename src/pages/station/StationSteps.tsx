import { useState } from "react";
import { useParams } from "react-router-dom";
import { LayoutGrid, Zap, Brain, FileQuestion, GitCompare } from "lucide-react";
import TabNavigation from "@/components/TabNavigation";
import { PageEnter, FadeIn } from "@/components/animations";
import { StepsTimeline, StepsTips } from "@/components/station";
import {
  HAND_HYGIENE_SOAP_STEPS,
  HAND_HYGIENE_ALCOHOL_STEPS
} from "@/data/infectionControlContent";

const StationSteps = () => {
  const { topicId = "" } = useParams();
  const [hygieneMethod, setHygieneMethod] = useState<'soap' | 'alcohol'>('soap');

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutGrid,
      path: `/station/${topicId}/overview`,
    },
    {
      id: "steps",
      label: "Steps",
      icon: Zap,
      path: `/station/${topicId}/steps`,
    },
    {
      id: "cards",
      label: "Cards",
      icon: Brain,
      path: `/station/${topicId}/cards`,
    },
    {
      id: "quiz",
      label: "Quiz",
      icon: FileQuestion,
      path: `/station/${topicId}/quiz`,
    },
    {
      id: "compare",
      label: "Compare",
      icon: GitCompare,
      path: `/station/${topicId}/compare`,
    },
  ];

  const getStepsForTopic = () => {
    if (topicId === "infection_control") {
      return hygieneMethod === 'soap' ? HAND_HYGIENE_SOAP_STEPS : HAND_HYGIENE_ALCOHOL_STEPS;
    }
    return [];
  };

  const steps = getStepsForTopic();
  const isHygiene = topicId === "infection_control";

  return (
    <div className="min-h-screen bg-background pb-20">
      <TabNavigation tabs={tabs} />
      <PageEnter>
        <div className="mx-auto w-full max-w-2xl px-3 sm:px-5 py-2 sm:py-4 md:py-6">
          {/* Header Section */}
          <FadeIn direction="down" delay={0.1}>
            <div className="mb-3 sm:mb-4">
              <h1 className="font-display font-bold text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                {isHygiene ? "Hand Hygiene" : "Step-by-Step Guide"}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {isHygiene
                  ? "Master the clinical hand hygiene process with these detailed steps"
                  : "Master the clinical assessment process with these detailed steps"}
              </p>
            </div>
          </FadeIn>

          {/* Hygiene Method Selector */}
          {isHygiene && (
            <FadeIn delay={0.2}>
              <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
                <button
                  onClick={() => setHygieneMethod('soap')}
                  className={`flex-1 py-2.5 px-4 rounded-full font-semibold text-sm sm:text-base transition-all ${
                    hygieneMethod === 'soap'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'bg-card border border-border text-muted-foreground hover:border-cyan-300'
                  }`}
                >
                  🧼 Soap & Water
                </button>
                <button
                  onClick={() => setHygieneMethod('alcohol')}
                  className={`flex-1 py-3 px-4 rounded-full font-semibold text-sm sm:text-base transition-all ${
                    hygieneMethod === 'alcohol'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'bg-card border border-border text-muted-foreground hover:border-cyan-300'
                  }`}
                >
                  🧴 Alcohol Rub
                </button>
              </div>
            </FadeIn>
          )}

          {/* Time Info */}
          {isHygiene && (
            <FadeIn delay={0.3}>
              <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                <p className="text-rcsi-navy font-semibold text-sm sm:text-base">
                  ⏱️ Total time: {hygieneMethod === 'soap' ? '40-60' : '20-30'} seconds
                </p>
              </div>
            </FadeIn>
          )}

          {/* Steps Timeline */}
          {steps.length > 0 ? (
            <>
              <StepsTimeline steps={steps} />
              <StepsTips
                tips={
                  isHygiene
                    ? hygieneMethod === 'soap'
                      ? [
                          'Follow each step in order for best results',
                          'Pay special attention to all hand surfaces and between fingers',
                          'Always prioritize thorough rinsing and drying',
                        ]
                      : [
                          'Apply enough product to cover all hand surfaces',
                          'Ensure hands are completely dry before continuing',
                          'Effective for quick hand sanitization when soap unavailable',
                        ]
                    : [
                        'Follow each step in order for best results',
                        'Pay special attention to hand hygiene between steps',
                        'Always prioritize patient safety and infection control',
                      ]
                }
              />
            </>
          ) : (
            <FadeIn>
              <div className="bg-card rounded-lg sm:rounded-2xl p-6 text-center shadow-soft border border-border">
                <p className="text-muted-foreground">Steps content not available</p>
              </div>
            </FadeIn>
          )}
        </div>
      </PageEnter>
    </div>
  );
};

export default StationSteps;
