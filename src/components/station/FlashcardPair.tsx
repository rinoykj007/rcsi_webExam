import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { FlashcardCard } from "./FlashcardCard";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface FlashcardDeckProps {
  flashcards: Flashcard[];
  onBack: () => void;
}

export const FlashcardPair = ({ flashcards, onBack }: FlashcardDeckProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (flashcards.length === 0) {
    return (
      <div className="bg-card rounded-lg sm:rounded-2xl p-6 text-center shadow-soft border border-border">
        <p className="text-muted-foreground">No flashcards available</p>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const hasNext = currentIndex < flashcards.length - 1;
  const hasPrev = currentIndex > 0;

  const handlePrev = () => {
    if (hasPrev) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (hasNext) setCurrentIndex(currentIndex + 1);
  };

  const handleFeedback = (feedback: "learning" | "know") => {
    console.log(`Card ${currentIndex + 1}: ${feedback}`);
  };

  return (
    <div className="space-y-6">
      {/* Card */}
      <FlashcardCard
        question={currentCard.question}
        answer={currentCard.answer}
        category={currentCard.category || "HAND HYGIENE"}
        onFeedback={handleFeedback}
      />

      {/* Navigation and Progress */}
      <div className="space-y-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </button>

        {/* Prev/Next and Progress */}
        <div className="flex items-center justify-between gap-4">
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            disabled={!hasPrev}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm sm:text-base disabled:opacity-40 disabled:cursor-not-allowed text-muted-foreground bg-card border border-border hover:border-blue-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {flashcards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-blue-600 w-8"
                    : "bg-gray-300 w-2 hover:bg-gray-400"
                }`}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm sm:text-base disabled:opacity-40 disabled:cursor-not-allowed text-muted-foreground bg-card border border-border hover:border-blue-300 transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};