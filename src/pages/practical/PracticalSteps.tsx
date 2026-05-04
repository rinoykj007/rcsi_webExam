import { useParams } from "react-router-dom";
import TabNavigation from "@/components/TabNavigation";
import { LayoutGrid, Zap, Brain, FileQuestion, GitCompare } from "lucide-react";

const PracticalSteps = () => {
  const { topicId = "" } = useParams();

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
          Procedure Steps
        </h1>
        <p className="text-gray-500 text-[14px] mt-0.5 mb-6">
          Follow each step carefully to master the procedure
        </p>
        <div className="bg-white rounded-2xl p-6 text-center border border-gray-200">
          <p className="text-gray-500">Steps content coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default PracticalSteps;
