import { useParams } from "react-router-dom";
import TabNavigation from "@/components/TabNavigation";
import { LayoutGrid, Zap, Brain, FileQuestion, GitCompare } from "lucide-react";
import { PageEnter, FadeIn } from "@/components/animations";
import { StepsTimeline, StepsTips } from "@/components/station";
import { getPracticalContent } from "@/data/practicalContent";

const PracticalSteps = () => {
  const { topicId = "" } = useParams();
  const content = getPracticalContent(topicId);

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutGrid, path: `/screens/practical/${topicId}/overview` },
    { id: "steps", label: "Steps", icon: Zap, path: `/screens/practical/${topicId}/steps` },
    { id: "cards", label: "Cards", icon: Brain, path: `/screens/practical/${topicId}/cards` },
    { id: "quiz", label: "Quiz", icon: FileQuestion, path: `/screens/practical/${topicId}/quiz` },
    { id: "compare", label: "Compare", icon: GitCompare, path: `/screens/practical/${topicId}/compare` },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <TabNavigation tabs={tabs} />
      <PageEnter>
        <div className="mx-auto w-full max-w-2xl px-3 sm:px-5 py-2 sm:py-4 md:py-6">
          <FadeIn direction="down" delay={0.1}>
            <div className="mb-3 sm:mb-4">
              <h1 className="font-display font-bold text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                {content?.title ?? "Procedure Steps"}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Follow each step in order and practise verbalising your actions as you would in the OSCE
              </p>
            </div>
          </FadeIn>

          {content && content.steps.length > 0 ? (
            <>
              <StepsTimeline steps={content.steps} />
              <StepsTips tips={content.examTips} />
            </>
          ) : (
            <div className="bg-card rounded-lg sm:rounded-2xl p-4 sm:p-6 text-center shadow-soft border border-border">
              <p className="text-muted-foreground text-sm">
                Steps content for this station is coming soon
              </p>
            </div>
          )}
        </div>
      </PageEnter>
    </div>
  );
};

export default PracticalSteps;
