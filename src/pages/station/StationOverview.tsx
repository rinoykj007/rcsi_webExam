import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import TabNavigation from "@/components/TabNavigation";
import { LayoutGrid, Zap, Brain, FileQuestion, GitCompare } from "lucide-react";
import { fetchStationOverview } from "@/lib/data";
import { PageEnter, StaggerContainer, StaggerItem, FadeIn, LoadingSpinner } from "@/components/animations";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

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
      <div className="min-h-screen bg-background">
        <TabNavigation tabs={tabs} />
        <div className="px-5 pt-6 pb-10 flex items-center justify-center h-96">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="min-h-screen bg-background">
        <TabNavigation tabs={tabs} />
        <div className="mx-auto w-full max-w-2xl px-3 sm:px-5 py-6">
          <div className="bg-card rounded-lg sm:rounded-2xl p-4 sm:p-6 text-center shadow-soft">
            <p className="text-muted-foreground text-sm">
              Station content not found
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderSection = (section: any) => {
    const { id, title, badge, content } = section;

    // Methods cards - compact badge layout
    if (id === "methods" && Array.isArray(content) && content[0]?.duration) {
      return (
        <div key={id} className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-display font-bold text-rcsi-navy text-base sm:text-lg">
              {title}
            </h2>
            {badge && (
              <span className="bg-yellow-100 text-yellow-800 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                {badge}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(content as any[]).map((method) => (
              <div
                key={method.id}
                className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-soft border border-border"
              >
                <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <div className="text-2xl sm:text-3xl flex-shrink-0">
                      {method.icon}
                    </div>
                    <h3 className="font-display font-bold text-rcsi-navy text-xs sm:text-sm truncate">
                      {method.title}
                    </h3>
                  </div>
                  <div className="bg-blue-600 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0">
                    {method.duration}
                  </div>
                </div>
                <p className="text-foreground text-xs leading-relaxed line-clamp-2">
                  {method.description}
                </p>
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
        <div key={id} className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-display font-bold text-rcsi-navy text-base sm:text-lg">
              {title}
            </h2>
            {badge && (
              <span className="bg-orange-100 text-orange-800 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                {badge}
              </span>
            )}
          </div>
          <div className="bg-red-50 rounded-lg sm:rounded-2xl p-3 sm:p-4 border border-red-200 shadow-soft">
            <ul className="space-y-1.5 sm:space-y-2">
              {(content as any)?.items?.map((item: string, i: number) => (
                <li
                  key={i}
                  className="flex gap-2 sm:gap-3 text-red-800 text-xs sm:text-sm"
                >
                  <span className="text-lg sm:text-xl flex-shrink-0">
                    {iconMap[i] || "•"}
                  </span>
                  <span className="font-medium leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    // WHO 5 Moments - line items layout
    if (id === "who-moments" && Array.isArray(content) && content[0]?.number) {
      return (
        <div key={id} className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-display font-bold text-rcsi-navy text-base sm:text-lg">
              {title}
            </h2>
            {badge && (
              <span className="bg-yellow-100 text-yellow-800 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                {badge}
              </span>
            )}
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            {(content as any[]).map((moment) => (
              <div
                key={moment.number}
                className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3.5 border border-border shadow-soft flex items-center"
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div
                    className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-lg text-white font-display font-bold text-xs sm:text-sm flex-shrink-0"
                    style={{ backgroundColor: moment.color }}
                  >
                    {moment.number}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-xs sm:text-sm text-rcsi-navy leading-snug">
                      {moment.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-snug line-clamp-2">
                      {moment.description}
                    </p>
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
      <div
        key={id}
        className="bg-card rounded-lg sm:rounded-2xl shadow-soft overflow-hidden px-3 sm:px-5"
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value={`item-${id}`} className="border-none">
            <AccordionTrigger className="py-2 sm:py-3 hover:no-underline">
              <div className="flex items-center gap-2 text-left">
                <h2 className="font-display font-bold text-rcsi-navy text-sm sm:text-base">
                  {title}
                </h2>
                {badge && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                    {badge}
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 pt-1">
              {typeof content === "string" ? (
                <p className="text-foreground text-xs sm:text-sm leading-relaxed">
                  {content}
                </p>
              ) : (
                <ul className="space-y-2">
                  {(content as any)?.items?.map((item: string, i: number) => (
                    <li
                      key={i}
                      className="flex gap-2 text-foreground text-xs sm:text-sm"
                    >
                      <span className="flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TabNavigation tabs={tabs} />
      <PageEnter>
        <div className="mx-auto w-full max-w-2xl px-3 sm:px-5 py-2 sm:py-4 md:py-6">
          {/* Hero Section */}
          <FadeIn direction="down" delay={0.1}>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-2 sm:mb-3 shadow-lg">
              <p className="text-blue-100 text-xs font-semibold tracking-widest mb-1 sm:mb-2 uppercase">
                {overview.title}
              </p>
              <h1 className="font-display font-bold text-2xl sm:text-3xl mb-2 sm:mb-3 leading-tight">
                {overview.description}
              </h1>
              <p className="text-blue-50 text-xs sm:text-sm leading-relaxed">
                {overview.hero_description}
              </p>
            </div>
          </FadeIn>

          {/* Sections */}
          <StaggerContainer staggerDelay={0.1} delay={0.2}>
            <div className="space-y-2 sm:space-y-3">
              {(overview.sections as any[])?.map((section) => (
                <StaggerItem key={section.id}>
                  {renderSection(section)}
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          {/* Important Points */}
          {(overview.important_points as string[])?.length > 0 && (
            <FadeIn direction="up" delay={0.3}>
              <div className="bg-card rounded-lg sm:rounded-2xl shadow-soft overflow-hidden mt-2 sm:mt-3">
                <div className="px-3 sm:px-5 py-2 sm:py-3 border-b border-amber-200 bg-amber-50">
                  <h2 className="font-display font-bold text-amber-900 text-sm sm:text-base">
                    Important Points
                  </h2>
                </div>
                <div className="px-3 sm:px-5 py-2 sm:py-3 bg-amber-50/50">
                  <ul className="space-y-1.5 sm:space-y-2">
                    {(overview.important_points as string[]).map((point, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-amber-800 text-xs sm:text-sm"
                      >
                        <span className="font-bold flex-shrink-0">⚠️</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </PageEnter>
    </div>
  );
};

export default StationOverview;
