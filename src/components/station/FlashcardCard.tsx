import { useState } from "react";
import { FadeIn } from "@/components/animations";
import { ChevronsRight, RotateCw } from "lucide-react";

interface FlashcardCardProps {
  question: string;
  answer: string;
  category: string;
  color: string;
  creator?: string;
  onFeedback?: (feedback: "learning" | "know") => void;
  onFlip?: (isRevealed: boolean) => void;
}

export const FlashcardCard = ({ 
  question, 
  answer, 
  category, 
  color,
  creator = "RCSI Student", 
  onFeedback,
  onFlip
}: FlashcardCardProps) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <FadeIn>
      <div 
        className="relative w-full h-52 sm:h-56 cursor-pointer group" 
        style={{ perspective: '1000px' }}
        onClick={() => {
          const nextState = !revealed;
          setRevealed(nextState);
          if (onFlip) onFlip(nextState);
        }}
      >
        {/* Flip Inner Container */}
        <div 
          className="w-full h-full relative transition-all duration-500"
          style={{ transformStyle: 'preserve-3d', transform: revealed ? 'rotateY(180deg)' : 'rotateY(0)' }}
        >
          
          {/* Front Face */}
          <div 
            className={`absolute w-full h-full rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-shadow overflow-hidden text-white ${color || 'bg-gradient-to-br from-blue-600 to-indigo-700'}`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Wavy Background (Front) */}
            <div className="absolute right-0 top-0 bottom-0 left-0 pointer-events-none overflow-hidden">
              <svg className="absolute -right-4 -top-8 w-64 h-64 text-black/10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M47.7,-68.8C62.4,-61.7,75.3,-49.6,83.9,-34.5C92.5,-19.4,96.8,-1.4,93.4,14.6C90.1,30.5,79.1,44.4,65.3,55.5C51.5,66.6,34.9,74.9,17.5,79.7C0.1,84.4,-18.2,85.6,-34.6,79.9C-51.1,74.1,-65.8,61.4,-75.4,45.4C-85,29.4,-89.6,10.2,-85.9,-7.3C-82.2,-24.8,-70.2,-40.5,-55.8,-48.1C-41.5,-55.6,-24.8,-55.1,-9.1,-52.1C6.6,-49.1,23.1,-43.5,33,-75.9" transform="translate(100 100) scale(1.1)" />
              </svg>
              <svg className="absolute -right-16 -bottom-24 w-96 h-96 text-black/10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M39.9,-61.5C51.5,-54.6,60.6,-42.6,68.2,-29.3C75.8,-16.1,81.9,-1.6,80.1,12.3C78.4,26.2,68.9,39.4,56.8,48.5C44.7,57.7,30,62.8,15.2,66.2C0.4,69.5,-14.4,71.2,-28.9,67.6C-43.4,64,-57.6,55,-66.6,42.5C-75.6,30,-79.4,14,-77.8,-1.4C-76.2,-16.8,-69.3,-31.6,-59,-43.3C-48.8,-55.1,-35.1,-63.9,-21.3,-67.7C-7.4,-71.4,6.7,-70.3,20,-68.8" transform="translate(100 100) scale(1.5)" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col h-full w-full">
               <div className="flex justify-between items-center shrink-0">
                  <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-90">
                    {category}
                  </div>
                  <RotateCw className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />
               </div>

               <h3 className="font-display font-semibold text-base sm:text-lg md:text-xl text-center flex-1 flex items-center justify-center min-h-0 overflow-y-auto px-1 py-1">
                  {question}
               </h3>

               <div className="flex justify-between items-center mt-auto pt-2 shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator}`}
                      alt={creator}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white/20"
                    />
                    <span className="text-xs sm:text-sm font-medium">
                      {creator}
                    </span>
                  </div>
                  <ChevronsRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />
               </div>
            </div>
          </div>

          {/* Back Face */}
          <div 
            className="absolute w-full h-full rounded-2xl p-4 sm:p-5 shadow-md border border-border bg-white overflow-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
             <div className="relative z-10 flex flex-col h-full w-full">
               <div className="flex justify-between items-start mb-2 shrink-0 text-rcsi-navy">
                  <div className="text-xs font-bold uppercase tracking-wider opacity-60">
                    Answer
                  </div>
                  <RotateCw className="w-5 h-5 opacity-40" />
               </div>
               
               <div className="flex-1 overflow-y-auto px-1 py-2 min-h-0">
                 <div className="min-h-full flex flex-col justify-center">
                   <p className="text-rcsi-navy text-xs sm:text-sm md:text-base leading-snug sm:leading-relaxed text-center">
                     {answer}
                   </p>
                 </div>
               </div>
               
               {onFeedback && (
                 <div className="grid grid-cols-2 gap-2 mt-auto pt-2 border-t border-border shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setRevealed(false);
                        onFeedback("learning");
                      }}
                      className="py-1.5 px-2 rounded-full font-medium text-[11px] sm:text-xs bg-yellow-50 border border-yellow-400 text-yellow-600 hover:bg-yellow-100 transition-colors"
                    >
                      ⟳ Still Learning
                    </button>
                    <button
                      onClick={() => {
                        setRevealed(false);
                        onFeedback("know");
                      }}
                      className="py-1.5 px-2 rounded-full font-medium text-[11px] sm:text-xs bg-green-500 text-white hover:bg-green-600 transition-colors"
                    >
                      ✓ Know it
                    </button>
                 </div>
               )}
             </div>
          </div>

        </div>
      </div>
    </FadeIn>
  );
};