import { useState } from "react";
import { ChevronsRight, Image as ImageIcon, Mic, LayoutTemplate } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { FlashcardCard } from "./FlashcardCard";

interface FlashcardCategory {
  id: string;
  name: string;
  count: number;
  waysToLearn: number;
  creator: string;
  color: string;
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FlashcardCatalogProps {
  categories: FlashcardCategory[];
  flashcardsByCategory: Record<string, Flashcard[]>;
}

export const FlashcardCatalog = ({
  categories,
  flashcardsByCategory,
}: FlashcardCatalogProps) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <FadeIn>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        {/* Categories */}
        {categories.map((category, index) => {
          const isExpanded = expandedCategory === category.id;

          // Mocking the active states of the buttons on the right based on index to match the image
          const hasCards = true;
          const hasImage = index === 0 || index === 2;
          const hasMic = index === 1 || index === 2;
          
          const isCardsActive = index === 0;
          const isImageActive = index === 2;
          const isMicActive = index === 1;

          return (
            <div key={category.id} className="flex flex-col">
              <div className="flex gap-4">
                {/* Category Card */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`flex-1 ${category.color} rounded-2xl p-6 text-white shadow-md hover:shadow-lg transition-all relative overflow-hidden group text-left min-h-[160px]`}
                >
                  {/* Decorative wavy background */}
                  <div className="absolute right-0 top-0 bottom-0 left-0 pointer-events-none overflow-hidden">
                    {/* Top Right Wave */}
                    <svg className="absolute -right-4 -top-8 w-64 h-64 text-black/10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <path fill="currentColor" d="M47.7,-68.8C62.4,-61.7,75.3,-49.6,83.9,-34.5C92.5,-19.4,96.8,-1.4,93.4,14.6C90.1,30.5,79.1,44.4,65.3,55.5C51.5,66.6,34.9,74.9,17.5,79.7C0.1,84.4,-18.2,85.6,-34.6,79.9C-51.1,74.1,-65.8,61.4,-75.4,45.4C-85,29.4,-89.6,10.2,-85.9,-7.3C-82.2,-24.8,-70.2,-40.5,-55.8,-48.1C-41.5,-55.6,-24.8,-55.1,-9.1,-52.1C6.6,-49.1,23.1,-43.5,33,-75.9" transform="translate(100 100) scale(1.1)" />
                    </svg>
                    {/* Bottom Wave */}
                    <svg className="absolute -right-16 -bottom-24 w-96 h-96 text-black/10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <path fill="currentColor" d="M39.9,-61.5C51.5,-54.6,60.6,-42.6,68.2,-29.3C75.8,-16.1,81.9,-1.6,80.1,12.3C78.4,26.2,68.9,39.4,56.8,48.5C44.7,57.7,30,62.8,15.2,66.2C0.4,69.5,-14.4,71.2,-28.9,67.6C-43.4,64,-57.6,55,-66.6,42.5C-75.6,30,-79.4,14,-77.8,-1.4C-76.2,-16.8,-69.3,-31.6,-59,-43.3C-48.8,-55.1,-35.1,-63.9,-21.3,-67.7C-7.4,-71.4,6.7,-70.3,20,-68.8" transform="translate(100 100) scale(1.5)" />
                    </svg>
                  </div>

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-display font-semibold text-2xl mb-1">
                          {category.name}
                        </h3>
                        <p className="text-sm opacity-90">
                          {category.count} cards
                        </p>
                      </div>
                      <span className="text-sm font-medium opacity-90 mt-1">
                        {category.waysToLearn} ways to learn
                      </span>
                    </div>

                    <div className="flex justify-between items-end mt-8">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${category.creator}`}
                          alt={category.creator}
                          className="w-8 h-8 rounded-full border-2 border-white/20"
                        />
                        <span className="text-sm font-medium">
                          {category.creator}
                        </span>
                      </div>
                      
                      <ChevronsRight className="w-6 h-6 opacity-80" />
                    </div>
                  </div>
                </button>


              </div>


            </div>
          );
        })}
      </div>
    </FadeIn>
  );
};
