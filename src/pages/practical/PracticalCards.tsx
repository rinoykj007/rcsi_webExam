import { useState } from "react";
import { useParams } from "react-router-dom";
import TabNavigation from "@/components/TabNavigation";
import { LayoutGrid, Zap, Brain, FileQuestion, GitCompare, ChevronLeft, ChevronRight } from "lucide-react";
import { PageEnter, FadeIn } from "@/components/animations";
import { FlashcardCard } from "@/components/station";
import { getPracticalContent } from "@/data/practicalContent";

const PracticalCards = () => {
  const { topicId = "" } = useParams();
  const content = getPracticalContent(topicId);
  const cards = content?.checklist ?? [];
  const [index, setIndex] = useState(0);

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutGrid, path: `/screens/practical/${topicId}/overview` },
    { id: "steps", label: "Steps", icon: Zap, path: `/screens/practical/${topicId}/steps` },
    { id: "cards", label: "Cards", icon: Brain, path: `/screens/practical/${topicId}/cards` },
    { id: "quiz", label: "Quiz", icon: FileQuestion, path: `/screens/practical/${topicId}/quiz` },
    { id: "compare", label: "Compare", icon: GitCompare, path: `/screens/practical/${topicId}/compare` },
  ];

  const card = cards[index];

  return (
    <div className="min-h-screen bg-background pb-20">
      <TabNavigation tabs={tabs} />
      <PageEnter>
        <div className="mx-auto w-full max-w-2xl px-3 sm:px-5 py-2 sm:py-4 md:py-6">
          <FadeIn direction="down" delay={0.1}>
            <div className="mb-3 sm:mb-4">
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-rcsi-navy mb-1">
                Practical Checklist
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Tap a card to reveal the answer — the points examiners expect you to know
              </p>
            </div>
          </FadeIn>

          {card ? (
            <>
              {/* Progress */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-muted-foreground tracking-wide">
                  CARD {index + 1} OF {cards.length}
                </span>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ color: card.categoryColor, backgroundColor: card.categoryBg }}
                >
                  {card.category}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-rcsi-navy rounded-full transition-all duration-300"
                  style={{ width: `${((index + 1) / cards.length) * 100}%` }}
                />
              </div>

              <FlashcardCard
                key={card.id}
                question={card.question}
                answer={card.answer}
                category={card.category}
                color={card.categoryColor}
              />

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3 mt-4">
                <button
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                  disabled={index === 0}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-border text-rcsi-navy text-sm font-semibold shadow-soft hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} strokeWidth={2} /> Previous
                </button>
                <button
                  onClick={() => setIndex((i) => Math.min(cards.length - 1, i + 1))}
                  disabled={index === cards.length - 1}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rcsi-navy text-white text-sm font-semibold shadow-soft hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight size={16} strokeWidth={2} />
                </button>
              </div>
            </>
          ) : (
            <div className="bg-card rounded-lg sm:rounded-2xl p-4 sm:p-6 text-center shadow-soft border border-border">
              <p className="text-muted-foreground text-sm">
                Checklist cards for this station are coming soon
              </p>
            </div>
          )}
        </div>
      </PageEnter>
    </div>
  );
};

export default PracticalCards;
