import { useParams } from "react-router-dom";
import TabNavigation from "@/components/TabNavigation";
import { LayoutGrid, Zap, Brain, FileQuestion, GitCompare } from "lucide-react";

const StationCompare = () => {
  const { topicId = "" } = useParams();

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

  return (
    <div className="min-h-screen bg-[#eef0f7]">
      <TabNavigation tabs={tabs} />
      <div className="px-5 pt-6 pb-10">
        <h1 className="text-[26px] font-extrabold text-gray-900 leading-tight">
          Compare Stations
        </h1>
        <p className="text-gray-500 text-[14px] mt-0.5 mb-6">
          Compare your performance across different stations
        </p>
        <div className="bg-white rounded-2xl p-6 text-center border border-gray-200">
          <p className="text-gray-500">Comparison content coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default StationCompare;
