import { useParams } from "react-router-dom";
import TabNavigation from "@/components/TabNavigation";
import { LayoutGrid, Zap, Brain, FileQuestion, GitCompare } from "lucide-react";
import { PageEnter, FadeIn } from "@/components/animations";
import { getPracticalContent } from "@/data/practicalContent";

const PracticalCompare = () => {
  const { topicId = "" } = useParams();
  const content = getPracticalContent(topicId);
  const rows = content?.compare ?? [];
  const columns = rows.length > 0 ? Object.keys(rows[0]).filter((k) => k !== "feature") : [];

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
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-rcsi-navy mb-1">
                Compare & Contrast
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Side-by-side distinctions examiners love to ask about
              </p>
            </div>
          </FadeIn>

          {rows.length > 0 ? (
            <FadeIn delay={0.15}>
              <div className="bg-card rounded-2xl shadow-soft border border-border overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-3 sm:px-4 py-3 font-display font-bold text-rcsi-navy whitespace-nowrap">
                        Feature
                      </th>
                      {columns.map((col) => (
                        <th
                          key={col}
                          className="px-3 sm:px-4 py-3 font-display font-bold text-rcsi-navy whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={row.feature}
                        className={i % 2 === 0 ? "bg-background/50" : "bg-card"}
                      >
                        <td className="px-3 sm:px-4 py-3 font-semibold text-rcsi-navy align-top whitespace-nowrap">
                          {row.feature}
                        </td>
                        {columns.map((col) => (
                          <td
                            key={col}
                            className="px-3 sm:px-4 py-3 text-foreground align-top leading-relaxed min-w-[140px]"
                          >
                            {row[col]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeIn>
          ) : (
            <div className="bg-card rounded-lg sm:rounded-2xl p-4 sm:p-6 text-center shadow-soft border border-border">
              <p className="text-muted-foreground text-sm">
                There is no comparison table for this station — focus on the steps, checklist and quiz instead
              </p>
            </div>
          )}
        </div>
      </PageEnter>
    </div>
  );
};

export default PracticalCompare;
