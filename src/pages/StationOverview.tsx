import {
  ArrowRight,
  Download,
  Eye,
  Play,
  Briefcase,
  FileQuestion,
  FileText,
  LayoutGrid,
  PlayCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const StationOverview = () => {
  const { topicId = "" } = useParams();
  const nav = useNavigate();
  return (
    <div className="px-5 pt-6 pb-10 bg-[#eef0f7] min-h-screen">
      {/* Learning Modules */}
      <h1 className="text-[26px] font-extrabold text-gray-900 leading-tight">
        Learning Modules
      </h1>
      <p className="text-gray-500 text-[14px] mt-0.5 mb-5">
        Three pillars of clinical excellence
      </p>

      {/* Practical Prep Card */}
      <button
        onClick={() => nav(`/screens/practical/${topicId}`)}
        className="w-full text-left bg-white rounded-[18px] p-5 mb-4 border-b-[3px] border-[#4a47a3] hover:shadow-md transition cursor-pointer"
      >
        <div className="w-[52px] h-[52px] bg-[#e8e7f5] rounded-[14px] flex items-center justify-center mb-3">
          <Briefcase
            className="w-[26px] h-[26px] text-[#4a47a3]"
            strokeWidth={1.8}
          />
        </div>
        <h2 className="text-[17px] font-bold text-gray-900">Practical Prep</h2>
        <p className="text-gray-500 text-[13px] mt-1.5 leading-snug">
          Master clinical protocols and step-by-step techniques in real-world
          settings.
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-[#4a47a3] text-[11px] font-bold tracking-widest">
            8 LESSONS
          </span>
          <ArrowRight className="w-5 h-5 text-[#4a47a3]" strokeWidth={2} />
        </div>
      </button>

      {/* MCQ Challenge Card */}
      <button
        onClick={() => nav(`/quiz/${topicId}`)}
        className="w-full text-left bg-white rounded-[18px] p-5 mb-8 border-b-[3px] border-[#2c4a72] hover:shadow-md transition cursor-pointer"
      >
        <div className="w-[52px] h-[52px] bg-[#d8e8f5] rounded-[14px] flex items-center justify-center mb-3">
          <FileQuestion
            className="w-[26px] h-[26px] text-[#2c4a72]"
            strokeWidth={1.8}
          />
        </div>
        <h2 className="text-[17px] font-bold text-gray-900">MCQ Challenge</h2>
        <p className="text-gray-500 text-[13px] mt-1.5 leading-snug">
          Test your knowledge on protocols and criteria under active exam
          conditions.
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-[#2c4a72] text-[11px] font-bold tracking-widest">
            27 QUESTIONS
          </span>
          <ArrowRight className="w-5 h-5 text-[#2c4a72]" strokeWidth={2} />
        </div>
      </button>

      {/* Quick Resources */}
      <h2 className="text-[22px] font-extrabold text-gray-900 mb-4">
        Quick Resources
      </h2>

      {/* Tool PDF */}
      <div className="bg-white rounded-2xl px-4 py-[14px] flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <div className="w-[46px] h-[46px] rounded-full bg-[#fce8e8] flex items-center justify-center flex-shrink-0">
            <FileText
              className="w-[22px] h-[22px] text-[#c0392b]"
              strokeWidth={1.8}
            />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-[15px]">Tool PDF</p>
            <p className="text-gray-400 text-[11px] font-medium tracking-wider mt-0.5">
              REFERENCE GUIDE • 1.2 MB
            </p>
          </div>
        </div>
        <Download className="w-5 h-5 text-gray-500" strokeWidth={1.8} />
      </div>

      {/* Clinical Chart Guide */}
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
              Clinical Chart Guide
            </p>
            <p className="text-gray-400 text-[11px] font-medium tracking-wider mt-0.5">
              INTERACTIVE SHEET • 0.8 MB
            </p>
          </div>
        </div>
        <Eye className="w-5 h-5 text-gray-500" strokeWidth={1.8} />
      </div>

      {/* Risk Assessment Video */}
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
              Risk Assessment Video
            </p>
            <p className="text-gray-400 text-[11px] font-medium tracking-wider mt-0.5">
              CLINICAL DEMONSTRATION • 15:20 MIN
            </p>
          </div>
        </div>
        <Play className="w-4 h-4 text-gray-500 fill-gray-500" strokeWidth={0} />
      </div>

      {/* CTA Banner */}
      <div className="rounded-[22px] p-6 overflow-hidden relative bg-[#3a3590]">
        <div className="absolute w-[100px] h-[100px] rounded-full bg-white/[.07] -top-5 right-5" />
        <div className="absolute w-[60px] h-[60px] rounded-full bg-white/[.07] bottom-2.5 right-[60px]" />
        <div className="absolute w-[80px] h-[80px] rounded-full bg-white/[.05] -bottom-2.5 right-2.5" />
        <h2 className="text-[21px] font-extrabold text-white relative z-10">
          Ready to start?
        </h2>
        <p className="mt-2 text-[13px] text-white/75 leading-snug relative z-10">
          Begin your journey into clinical precision with the Practical Prep
          module.
        </p>
      </div>
    </div>
  );
};

export default StationOverview;
