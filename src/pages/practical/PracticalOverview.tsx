import { ArrowRight, Download, Play, PlayCircle, FileText, LayoutGrid, Zap, Brain, FileQuestion, GitCompare } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import TabNavigation from "@/components/TabNavigation";
import { FadeIn } from "@/components/animations";

const PracticalOverview = () => {
  const { topicId = "" } = useParams();
  const nav = useNavigate();

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
              Practical Preparation
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-1">
              Master clinical procedures and real-world techniques
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
                    Follow step-by-step instructions for executing clinical procedures safely and effectively.
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-600 text-xs font-bold tracking-wide">
                  12 STEPS
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
                    Interactive checklist to ensure you don't miss critical steps during assessment.
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 text-xs font-bold tracking-wide">
                  INTERACTIVE
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" strokeWidth={2} />
              </div>
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="space-y-2 sm:space-y-3">
            <h2 className="font-display font-bold text-rcsi-navy text-lg sm:text-xl">
              Quick Resources
            </h2>

            {/* Resource Items */}
            {[
              { icon: FileText, label: "Procedure Guide", meta: "PDF REFERENCE • 2.4 MB", color: "bg-red-100 text-red-600" },
              { icon: LayoutGrid, label: "Equipment Diagram", meta: "INTERACTIVE • 1.1 MB", color: "bg-blue-100 text-blue-600" },
              { icon: PlayCircle, label: "Technique Demonstration", meta: "VIDEO TUTORIAL • 8:45 MIN", color: "bg-cyan-100 text-cyan-600" },
            ].map((item, i) => (
              <div key={i} className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center justify-between border border-border hover:shadow-sm transition">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-rcsi-navy text-xs sm:text-sm">
                      {item.label}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {item.meta}
                    </p>
                  </div>
                </div>
                <Download className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" strokeWidth={2} />
              </div>
            ))}
          </div>
        </FadeIn>

        {/* CTA Banner */}
        <FadeIn delay={0.25}>
          <div className="mt-6 sm:mt-8 rounded-xl sm:rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute w-32 h-32 rounded-full bg-white -top-8 right-0" />
              <div className="absolute w-20 h-20 rounded-full bg-white bottom-0 -right-10" />
            </div>
            <div className="relative z-10">
              <h2 className="font-display font-bold text-lg sm:text-xl mb-2">
                Practice Makes Perfect
              </h2>
              <p className="text-emerald-50 text-xs sm:text-sm leading-relaxed">
                Review the steps and complete the practical checklist before attempting the assessment.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default PracticalOverview;
