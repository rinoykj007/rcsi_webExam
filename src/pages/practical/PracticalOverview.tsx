import {
  ArrowRight,
  Download,
  Eye,
  Play,
  PlayCircle,
  FileText,
  LayoutGrid,
  Zap,
  Brain,
  FileQuestion,
  GitCompare,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import TabNavigation from "@/components/TabNavigation";
import { getTopicById } from "@/data/topics";

const PracticalOverview = () => {
  const { topicId = "" } = useParams();
  const nav = useNavigate();
  const topic = getTopicById(topicId);

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutGrid,
      path: `/screens/practical/${topicId}/overview`,
    },
    {
      id: "steps",
      label: "Steps",
      icon: Zap,
      path: `/screens/practical/${topicId}/steps`,
    },
    {
      id: "cards",
      label: "Cards",
      icon: Brain,
      path: `/screens/practical/${topicId}/cards`,
    },
    {
      id: "quiz",
      label: "Quiz",
      icon: FileQuestion,
      path: `/screens/practical/${topicId}/quiz`,
    },
    {
      id: "compare",
      label: "Compare",
      icon: GitCompare,
      path: `/screens/practical/${topicId}/compare`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#eef0f7]">
      <TabNavigation tabs={tabs} />
      <div className="px-5 pt-6 pb-10">
        <h1 className="text-[26px] font-extrabold text-gray-900 leading-tight">
          Practical Preparation
        </h1>
        <p className="text-gray-500 text-[14px] mt-0.5 mb-6">
          Master clinical procedures and real-world techniques
        </p>

        {/* Learning Path */}
        <h2 className="text-[22px] font-extrabold text-gray-900 mb-4">
          Learning Path
        </h2>

        {/* Procedure Walkthrough Card */}
        <button
          onClick={() => nav(`/screens/practical/${topicId}/steps`)}
          className="w-full text-left bg-white rounded-[18px] p-5 mb-4 border-b-[3px] border-[#f59e0b] hover:shadow-md transition cursor-pointer"
        >
          <div className="w-[52px] h-[52px] bg-[#fef3c7] rounded-[14px] flex items-center justify-center mb-3">
            <Play
              className="w-[26px] h-[26px] text-[#f59e0b]"
              strokeWidth={1.8}
            />
          </div>
          <h2 className="text-[17px] font-bold text-gray-900">
            Procedure Walkthrough
          </h2>
          <p className="text-gray-500 text-[13px] mt-1.5 leading-snug">
            Follow step-by-step instructions for executing clinical procedures safely and effectively.
          </p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-[#f59e0b] text-[11px] font-bold tracking-widest">
              12 STEPS
            </span>
            <ArrowRight className="w-5 h-5 text-[#f59e0b]" strokeWidth={2} />
          </div>
        </button>

        {/* Practical Checklist Card */}
        <button
          onClick={() => nav(`/screens/practical/${topicId}/cards`)}
          className="w-full text-left bg-white rounded-[18px] p-5 mb-8 border-b-[3px] border-[#10b981] hover:shadow-md transition cursor-pointer"
        >
          <div className="w-[52px] h-[52px] bg-[#d1fae5] rounded-[14px] flex items-center justify-center mb-3">
            <FileText
              className="w-[26px] h-[26px] text-[#10b981]"
              strokeWidth={1.8}
            />
          </div>
          <h2 className="text-[17px] font-bold text-gray-900">
            Practical Checklist
          </h2>
          <p className="text-gray-500 text-[13px] mt-1.5 leading-snug">
            Interactive checklist to ensure you don't miss critical steps during assessment.
          </p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-[#10b981] text-[11px] font-bold tracking-widest">
              INTERACTIVE
            </span>
            <ArrowRight className="w-5 h-5 text-[#10b981]" strokeWidth={2} />
          </div>
        </button>

        {/* Quick Resources */}
        <h2 className="text-[22px] font-extrabold text-gray-900 mb-4">
          Quick Resources
        </h2>

        {/* Procedure Guide */}
        <div className="bg-white rounded-2xl px-4 py-[14px] flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="w-[46px] h-[46px] rounded-full bg-[#fce8e8] flex items-center justify-center flex-shrink-0">
              <FileText
                className="w-[22px] h-[22px] text-[#c0392b]"
                strokeWidth={1.8}
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-[15px]">
                Procedure Guide
              </p>
              <p className="text-gray-400 text-[11px] font-medium tracking-wider mt-0.5">
                PDF REFERENCE • 2.4 MB
              </p>
            </div>
          </div>
          <Download className="w-5 h-5 text-gray-500" strokeWidth={1.8} />
        </div>

        {/* Equipment Diagram */}
        <div className="bg-white rounded-2xl px-4 py-[14px] flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="w-[46px] h-[46px] rounded-full bg-[#e5eaf4] flex items-center justify-center flex-shrink-0">
              <LayoutGrid
                className="w-[22px] h-[22px] text-[#3d5a99]"
                strokeWidth={1.8}
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-[15px]">
                Equipment Diagram
              </p>
              <p className="text-gray-400 text-[11px] font-medium tracking-wider mt-0.5">
                INTERACTIVE • 1.1 MB
              </p>
            </div>
          </div>
          <Eye className="w-5 h-5 text-gray-500" strokeWidth={1.8} />
        </div>

        {/* Technique Demonstration */}
        <div className="bg-white rounded-2xl px-4 py-[14px] flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-[46px] h-[46px] rounded-full bg-[#dcedf5] flex items-center justify-center flex-shrink-0">
              <PlayCircle
                className="w-[22px] h-[22px] text-[#2e7fa3]"
                strokeWidth={1.8}
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-[15px]">
                Technique Demonstration
              </p>
              <p className="text-gray-400 text-[11px] font-medium tracking-wider mt-0.5">
                VIDEO TUTORIAL • 8:45 MIN
              </p>
            </div>
          </div>
          <Play className="w-4 h-4 text-gray-500 fill-gray-500" strokeWidth={0} />
        </div>

        {/* CTA Banner */}
        <div className="rounded-[22px] p-6 overflow-hidden relative bg-[#059669]">
          <div className="absolute w-[100px] h-[100px] rounded-full bg-white/[.07] -top-5 right-5" />
          <div className="absolute w-[60px] h-[60px] rounded-full bg-white/[.07] bottom-2.5 right-[60px]" />
          <div className="absolute w-[80px] h-[80px] rounded-full bg-white/[.05] -bottom-2.5 right-2.5" />
          <h2 className="text-[21px] font-extrabold text-white relative z-10">
            Practice Makes Perfect
          </h2>
          <p className="mt-2 text-[13px] text-white/75 leading-snug relative z-10">
            Review the steps and complete the practical checklist before attempting the assessment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PracticalOverview;
