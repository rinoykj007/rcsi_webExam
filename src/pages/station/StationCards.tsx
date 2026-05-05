import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TabNavigation from "@/components/TabNavigation";
import { LayoutGrid, Zap, Brain, FileQuestion, GitCompare, ChevronLeft } from "lucide-react";
import { PageEnter, FadeIn } from "@/components/animations";
import { FlashcardCard } from "@/components/station";

export interface FlashCard {
  id: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  question: string;
  answer: string;
}

export const FLASHCARDS: FlashCard[] = [
  // ── Hand Hygiene Basics ──────────────────────────────────────────────────
  {
    id: "f01",
    category: "Hand Hygiene",
    categoryColor: "#0284c7",
    categoryBg: "#EFF6FF",
    question: "What is the recommended duration for soap and water handwashing?",
    answer: "40–60 seconds.",
  },
  {
    id: "f02",
    category: "Hand Hygiene",
    categoryColor: "#0284c7",
    categoryBg: "#EFF6FF",
    question: "What is the recommended duration for alcohol-based hand rub?",
    answer: "20–30 seconds.",
  },
  {
    id: "f03",
    category: "Hand Hygiene",
    categoryColor: "#0284c7",
    categoryBg: "#EFF6FF",
    question: "When must you use soap and water instead of alcohol hand rub?",
    answer: "When hands are visibly soiled, after handling C. difficile (Clostridioides difficile), and after removing gloves if hands are soiled.",
  },
  {
    id: "f04",
    category: "Hand Hygiene",
    categoryColor: "#0284c7",
    categoryBg: "#EFF6FF",
    question: "What jewellery/accessories must be removed before clinical hand hygiene?",
    answer: "All wrist and hand jewellery including watches, rings (plain wedding band exception may apply), and bracelets. Nails must be short and nail varnish/false nails are not permitted.",
  },
  {
    id: "f05",
    category: "Hand Hygiene",
    categoryColor: "#0284c7",
    categoryBg: "#EFF6FF",
    question: "What is the 'bare below the elbows' policy?",
    answer: "Healthcare workers must have bare forearms in clinical areas — no long sleeves, watches, or wrist jewellery. This allows effective hand and wrist decontamination.",
  },

  // ── WHO 5 Moments ────────────────────────────────────────────────────────
  {
    id: "f06",
    category: "WHO 5 Moments",
    categoryColor: "#7c3aed",
    categoryBg: "#F5F3FF",
    question: "What are the WHO 5 Moments of Hand Hygiene?",
    answer: "1. Before patient contact\n2. Before aseptic procedure\n3. After body fluid exposure\n4. After patient contact\n5. After patient surroundings contact",
  },

  // ── Soap & Water Steps ───────────────────────────────────────────────────
  {
    id: "f11",
    category: "Soap & Water Steps",
    categoryColor: "#0369a1",
    categoryBg: "#E0F2FE",
    question: "What is the very first step in the soap and water handwashing procedure?",
    answer: "Open the tap and wet the hands.",
  },
  {
    id: "f12",
    category: "Soap & Water Steps",
    categoryColor: "#0369a1",
    categoryBg: "#E0F2FE",
    question: "What should be done immediately after taking soap solution into cupped hands?",
    answer: "Rub palm to palm.",
  },
  {
    id: "f13",
    category: "Soap & Water Steps",
    categoryColor: "#0369a1",
    categoryBg: "#E0F2FE",
    question: "Describe the technique for cleaning the back of the hands during washing.",
    answer: "Rub the right palm over the left dorsum with interlaced fingers, and vice versa.",
  },
  {
    id: "f14",
    category: "Soap & Water Steps",
    categoryColor: "#0369a1",
    categoryBg: "#E0F2FE",
    question: "How should the palms be rubbed to ensure the spaces between fingers are cleaned?",
    answer: "Palm to palm with fingers interlaced.",
  },
  {
    id: "f15",
    category: "Soap & Water Steps",
    categoryColor: "#0369a1",
    categoryBg: "#E0F2FE",
    question: "What is the specific step for cleaning the back of the fingers?",
    answer: "Rub the back of the fingers to the opposite palm with fingers interlocked.",
  },
  {
    id: "f16",
    category: "Soap & Water Steps",
    categoryColor: "#0369a1",
    categoryBg: "#E0F2FE",
    question: "Describe the step specifically targeting the thumbs during handwashing.",
    answer: "Rotational rubbing of the left thumb clasped in the right palm and vice versa.",
  },
  {
    id: "f17",
    category: "Soap & Water Steps",
    categoryColor: "#0369a1",
    categoryBg: "#E0F2FE",
    question: "Describe the step used to clean the fingertips and nails.",
    answer: "Rub the tips of the fingers in the opposite palm using a circular motion and vice versa.",
  },
  {
    id: "f18",
    category: "Soap & Water Steps",
    categoryColor: "#0369a1",
    categoryBg: "#E0F2FE",
    question: "How should hands be dried at the end of the handwashing procedure?",
    answer: "Using separate tissues to clean and dry hands.",
  },
  {
    id: "f19",
    category: "Soap & Water Steps",
    categoryColor: "#0369a1",
    categoryBg: "#E0F2FE",
    question: "In which waste container should tissues used for hand drying be discarded?",
    answer: "Clear bag.",
  },
  {
    id: "f20",
    category: "Soap & Water Steps",
    categoryColor: "#0369a1",
    categoryBg: "#E0F2FE",
    question: "How should the tap be turned off to avoid recontaminating hands?",
    answer: "Use a separate tissue to turn off the tap.",
  },

  // ── Superbugs & Resistance ───────────────────────────────────────────────
  {
    id: "f21",
    category: "Superbugs",
    categoryColor: "#DC2626",
    categoryBg: "#FEF2F2",
    question: 'Define the term "Superbug".',
    answer: "Organisms that are resistant to antibiotics, making infections very difficult to treat.",
  },
  {
    id: "f22",
    category: "Superbugs",
    categoryColor: "#DC2626",
    categoryBg: "#FEF2F2",
    question: "What does MRSA stand for?",
    answer: "Methicillin-resistant Staphylococcus aureus.",
  },
  {
    id: "f23",
    category: "Superbugs",
    categoryColor: "#DC2626",
    categoryBg: "#FEF2F2",
    question: "What does VRE stand for?",
    answer: "Vancomycin-resistant Enterococci.",
  },
  {
    id: "f24",
    category: "Superbugs",
    categoryColor: "#DC2626",
    categoryBg: "#FEF2F2",
    question: "What does CRE stand for?",
    answer: "Carbapenem-resistant Enterobacteriaceae.",
  },
  {
    id: "f25",
    category: "Superbugs",
    categoryColor: "#DC2626",
    categoryBg: "#FEF2F2",
    question: "What does MDRO stand for?",
    answer: "Multi-drug resistant organism.",
  },
  {
    id: "f26",
    category: "Superbugs",
    categoryColor: "#DC2626",
    categoryBg: "#FEF2F2",
    question: "List three examples of MDROs.",
    answer: "MRSA, VRE, and CRE.",
  },
  {
    id: "f27",
    category: "Superbugs",
    categoryColor: "#DC2626",
    categoryBg: "#FEF2F2",
    question: "How does failing to complete a course of antibiotics contribute to resistance?",
    answer: "It is a primary cause of antibiotic resistance — surviving bacteria develop and pass on resistance.",
  },
  {
    id: "f28",
    category: "Superbugs",
    categoryColor: "#DC2626",
    categoryBg: "#FEF2F2",
    question: "What is a genetic reason for the development of superbugs?",
    answer: "Genetic mutation in bacteria that confers resistance to antibiotics.",
  },
  {
    id: "f29",
    category: "Superbugs",
    categoryColor: "#DC2626",
    categoryBg: "#FEF2F2",
    question: "Besides human medicine, where else does antibiotic use contribute to superbugs?",
    answer: "In animals and agriculture — widespread use contributes to resistance.",
  },
  {
    id: "f30",
    category: "Superbugs",
    categoryColor: "#DC2626",
    categoryBg: "#FEF2F2",
    question: "How does the wrong selection of antibiotics impact bacteria?",
    answer: "It contributes to the development of antibiotic resistance by selecting for resistant strains.",
  },

  // ── PPE & Masks ──────────────────────────────────────────────────────────
  {
    id: "f31",
    category: "PPE & Masks",
    categoryColor: "#16a34a",
    categoryBg: "#F0FDF4",
    question: "Which type of mask is appropriate for protection against droplet infections?",
    answer: "Medical or surgical mask.",
  },
  {
    id: "f32",
    category: "PPE & Masks",
    categoryColor: "#16a34a",
    categoryBg: "#F0FDF4",
    question: "Which type of mask is required when performing aerosol-generating procedures?",
    answer: "FFP2 or FFP3 (e.g., N95 equivalent).",
  },
  {
    id: "f33",
    category: "PPE & Masks",
    categoryColor: "#16a34a",
    categoryBg: "#F0FDF4",
    question: "In the general PPE doffing sequence, which item is removed first?",
    answer: "Gloves.",
  },
  {
    id: "f34",
    category: "PPE & Masks",
    categoryColor: "#16a34a",
    categoryBg: "#F0FDF4",
    question: "In the general PPE doffing sequence, which item is removed second?",
    answer: "Goggles.",
  },
  {
    id: "f35",
    category: "PPE & Masks",
    categoryColor: "#16a34a",
    categoryBg: "#F0FDF4",
    question: "In the general PPE doffing sequence, which item is removed third?",
    answer: "Gown.",
  },
  {
    id: "f36",
    category: "PPE & Masks",
    categoryColor: "#16a34a",
    categoryBg: "#F0FDF4",
    question: "Where should the mask be removed if the patient has an infectious condition?",
    answer: "Outside of the patient's room.",
  },
  {
    id: "f37",
    category: "PPE & Masks",
    categoryColor: "#16a34a",
    categoryBg: "#F0FDF4",
    question: "What action must be performed after removing gloves in the doffing sequence for an infected patient?",
    answer: "Use hand rub.",
  },
  {
    id: "f38",
    category: "PPE & Masks",
    categoryColor: "#16a34a",
    categoryBg: "#F0FDF4",
    question: "What action must be performed after removing goggles in the doffing sequence?",
    answer: "Use hand rub.",
  },
  {
    id: "f39",
    category: "PPE & Masks",
    categoryColor: "#16a34a",
    categoryBg: "#F0FDF4",
    question: "How is a gown typically released during doffing?",
    answer: "By releasing the velcro or tie at the back.",
  },
  {
    id: "f40",
    category: "PPE & Masks",
    categoryColor: "#16a34a",
    categoryBg: "#F0FDF4",
    question: "What action follows the removal of the gown in the doffing sequence?",
    answer: "Hand rub.",
  },
  {
    id: "f41",
    category: "PPE & Masks",
    categoryColor: "#16a34a",
    categoryBg: "#F0FDF4",
    question: "After removing a mask outside the room, what is the final step in the doffing procedure?",
    answer: "Hand rub.",
  },

  // ── Waste Disposal ───────────────────────────────────────────────────────
  {
    id: "f42",
    category: "Waste Disposal",
    categoryColor: "#d97706",
    categoryBg: "#FFFBEB",
    question: "Where should an IV set be discarded as a whole?",
    answer: "Yellow bin (clinical/medical waste).",
  },
  {
    id: "f43",
    category: "Waste Disposal",
    categoryColor: "#d97706",
    categoryBg: "#FFFBEB",
    question: "Which waste container is used for items that cannot be recycled?",
    answer: "Clear bag.",
  },
  {
    id: "f44",
    category: "Waste Disposal",
    categoryColor: "#d97706",
    categoryBg: "#FFFBEB",
    question: "Which type of waste bag is typically used for items that can be recycled?",
    answer: "Green bag.",
  },

  // ── Transmission Precautions ─────────────────────────────────────────────
  {
    id: "f45",
    category: "Precautions",
    categoryColor: "#475569",
    categoryBg: "#F1F5F9",
    question: "Name the three categories of transmission-based precautions.",
    answer: "Contact precautions, Droplet precautions, and Airborne precautions.",
  },
  {
    id: "f46",
    category: "Precautions",
    categoryColor: "#475569",
    categoryBg: "#F1F5F9",
    question: "What does PCRA stand for?",
    answer: "Point of Care Risk Assessment — performed before any patient interaction.",
  },
];

const StationCards = () => {
  const { topicId = "" } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState(FLASHCARDS);

  const handleCardClick = (clickedCardId: string) => {
    setCards(prevCards => {
      const cardIndex = prevCards.findIndex(c => c.id === clickedCardId);
      if (cardIndex === -1) return prevCards;
      
      const newCards = [...prevCards];
      const [clickedCard] = newCards.splice(cardIndex, 1);
      newCards.push(clickedCard);
      return newCards;
    });
  };

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

  // An elegant gradient palette that matches the app's clean UI design
  const ELEGANT_GRADIENTS = [
    "bg-gradient-to-br from-blue-600 to-indigo-700",
    "bg-gradient-to-br from-indigo-500 to-purple-600",
    "bg-gradient-to-br from-violet-500 to-fuchsia-600",
    "bg-gradient-to-br from-blue-500 to-cyan-600",
    "bg-gradient-to-br from-slate-700 to-slate-900",
    "bg-gradient-to-br from-teal-500 to-emerald-600"
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-4">
      <TabNavigation tabs={tabs} />
      <PageEnter>
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 py-2 sm:py-4 md:py-6">
          <FadeIn direction="down" delay={0.1}>
            <div className="mb-8 flex items-center relative px-2">
              <button 
                onClick={() => navigate(-1)}
                className="w-12 h-12 shrink-0 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow transition-all active:scale-95 z-10"
              >
                <ChevronLeft className="w-6 h-6 text-slate-700" strokeWidth={2.5} />
              </button>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <h1 className="font-display font-semibold text-lg sm:text-xl text-slate-900">
                  Study Deck
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Tap to reveal answers
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {cards.map((card, index) => {
              const dynamicColor = ELEGANT_GRADIENTS[index % ELEGANT_GRADIENTS.length];
              return (
                <div 
                  className="w-full max-w-sm mx-auto transition-all duration-500 animate-in fade-in slide-in-from-bottom-4" 
                  key={card.id}
                >
                  <FlashcardCard 
                    category={card.category}
                    question={card.question}
                    answer={card.answer}
                    color={dynamicColor}
                    onFeedback={() => handleCardClick(card.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </PageEnter>
    </div>
  );
};

export default StationCards;
