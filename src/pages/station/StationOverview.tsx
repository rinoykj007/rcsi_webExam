import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import TabNavigation from "@/components/TabNavigation";
import { LayoutGrid, Zap, Brain, FileQuestion, GitCompare } from "lucide-react";
import { fetchStationOverview } from "@/lib/data";

const StationOverview = () => {
  const { topicId = "" } = useParams();

  const { data: overview, isLoading } = useQuery({
    queryKey: ["station", topicId, "overview"],
    queryFn: () => fetchStationOverview(topicId),
    enabled: !!topicId,
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#eef0f7]">
        <TabNavigation tabs={tabs} />
        <div className="px-5 pt-6 pb-10 flex items-center justify-center h-96">
          <div className="h-10 w-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="min-h-screen bg-[#eef0f7]">
        <TabNavigation tabs={tabs} />
        <div className="px-5 pt-6 pb-10">
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-200">
            <p className="text-gray-500">Station content not found</p>
          </div>
        </div>
      </div>
    );
  }

  const renderSection = (section: any) => {
    const { id, title, badge, content } = section;

    // Methods cards - two columns side by side
    if (id === "methods" && Array.isArray(content) && content[0]?.duration) {
      return (
        <div key={id} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {badge && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                {badge}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(content as any[]).map((method) => (
              <div
                key={method.id}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft"
              >
                <div className="text-4xl mb-3">{method.icon}</div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">{method.title}</h3>
                <div className="bg-blue-600 text-white px-4 py-2 rounded-full inline-block mb-3 font-bold">
                  {method.duration}
                </div>
                <p className="text-gray-700">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // When Alcohol Is Ineffective - list with icons
    if (id === "when-ineffective") {
      const iconMap: Record<number, string> = {
        0: "🖐️",
        1: "⚠️",
        2: "ℹ️",
      };
      return (
        <div key={id} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {badge && (
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                {badge}
              </span>
            )}
          </div>
          <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
            <ul className="space-y-3">
              {(content as any)?.items?.map((item: string, i: number) => (
                <li key={i} className="flex gap-3 text-red-800">
                  <span className="text-2xl flex-shrink-0">{iconMap[i] || "•"}</span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    // WHO 5 Moments - numbered cards with colors
    if (id === "who-moments" && Array.isArray(content) && content[0]?.number) {
      return (
        <div key={id} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {badge && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                {badge}
              </span>
            )}
          </div>
          <div className="space-y-3">
            {(content as any[]).map((moment) => (
              <div
                key={moment.number}
                className="rounded-2xl p-6 border-l-4"
                style={{
                  backgroundColor: moment.bgColor,
                  borderColor: moment.color,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-lg text-white font-bold flex-shrink-0"
                    style={{ backgroundColor: moment.color }}
                  >
                    {moment.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: moment.color }}>
                      {moment.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{moment.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default section rendering
    return (
      <div key={id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft mb-4">
        <div className="flex gap-3 items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          {badge && (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
              {badge}
            </span>
          )}
        </div>
        {typeof content === "string" ? (
          <p className="text-gray-700">{content}</p>
        ) : (
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {(content as any)?.items?.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#eef0f7]">
      <TabNavigation tabs={tabs} />
      <div className="px-5 pt-6 pb-10 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-8 mb-8 shadow-lg">
          <p className="text-blue-100 text-sm font-semibold tracking-wide mb-2">
            {overview.title}
          </p>
          <h1 className="text-4xl font-extrabold mb-4">{overview.description}</h1>
          <p className="text-blue-50 leading-relaxed">{overview.hero_description}</p>
        </div>

        {/* Sections */}
        {(overview.sections as any[])?.map((section) => renderSection(section))}

        {/* Important Points */}
        {(overview.important_points as string[])?.length > 0 && (
          <div className="bg-amber-50 rounded-2xl p-6 border-l-4 border-amber-400 mb-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Important Points</h2>
            <ul className="space-y-2">
              {(overview.important_points as string[]).map((point, i) => (
                <li key={i} className="flex gap-2 text-amber-800">
                  <span className="font-bold">⚠️</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationOverview;
