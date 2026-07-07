import { ArrowRight, Lightbulb, Play, FileText, LayoutGrid, Zap, Brain, FileQuestion, GitCompare } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import TabNavigation from "@/components/TabNavigation";
import { FadeIn } from "@/components/animations";
import { getPracticalContent } from "@/data/practicalContent";

const PracticalOverview = () => {
  const { topicId = "" } = useParams();
  const nav = useNavigate();
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
      <div className="mx-auto w-full max-w-2xl px-3 sm:px-5 py-2 sm:py-4 md:py-6">
        <FadeIn direction="down" delay={0.1}>
          <div className="mb-6 sm:mb-8">
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-rcsi-navy">
              {content?.title ?? "Practical Preparation"}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-1">
              {content?.intro ?? "Master clinical procedures and real-world techniques"}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
            <h2 className="font-display font-bold text-rcsi-navy text-lg sm:text-xl">
              Learning Path
            </h2>

            {/* Procedure Walkthrough */}
            <button
              onClick={() => nav(`/screens/practical/${topicId}/steps`)}
              className="w-full text-left bg-card rounded-lg sm:rounded-xl p-4 sm:p-5 border-b-2 border-amber-500 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-rcsi-navy text-sm sm:text-base">
                    Procedure Walkthrough
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                    Follow step-by-step instructions for executing this station's procedure safely and effectively.
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-600 text-xs font-bold tracking-wide">
                  {content ? `${content.steps.length} STEPS` : "STEP-BY-STEP"}
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" strokeWidth={2} />
              </div>
            </button>

            {/* Practical Checklist */}
            <button
              onClick={() => nav(`/screens/practical/${topicId}/cards`)}
              className="w-full text-left bg-card rounded-lg sm:rounded-xl p-4 sm:p-5 border-b-2 border-emerald-500 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-rcsi-navy text-sm sm:text-base">
                    Practical Checklist
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                    Flip through revision cards covering the critical points examiners look for.
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 text-xs font-bold tracking-wide">
                  {content ? `${content.checklist.length} CARDS` : "INTERACTIVE"}
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" strokeWidth={2} />
              </div>
            </button>

            {/* Station Quiz */}
            <button
              onClick={() => nav(`/screens/practical/${topicId}/quiz`)}
              className="w-full text-left bg-card rounded-lg sm:rounded-xl p-4 sm:p-5 border-b-2 border-sky-500 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-3">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                  <FileQuestion className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-rcsi-navy text-sm sm:text-base">
                    Station Quiz
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                    Test yourself with scenario-based questions about this station.
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sky-600 text-xs font-bold tracking-wide">
                  {content ? `${content.quiz.length} QUESTIONS` : "MCQ PRACTICE"}
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" strokeWidth={2} />
              </div>
            </button>
          </div>
        </FadeIn>

        {content && content.examTips.length > 0 && (
          <FadeIn delay={0.2}>
            <div className="space-y-2 sm:space-y-3">
              <h2 className="font-display font-bold text-rcsi-navy text-lg sm:text-xl">
                Exam Tips
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-blue-200">
                <ul className="space-y-2.5">
                  {content.examTips.map((tip, i) => (
                    <li key={i} className="flex gap-2.5 text-xs sm:text-sm text-rcsi-navy">
                      <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
};

export default PracticalOverview;
