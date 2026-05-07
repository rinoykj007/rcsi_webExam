import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import type { ExamResultData, QuestionResult } from "./ExamResults";
import { DEMO } from "./examDemoData";

type Filter = "all" | "incorrect" | "correct" | "skipped";

const STATUS_STYLES: Record<QuestionResult["status"], string> = {
  correct: "bg-green-400 text-white border-green-400",
  incorrect: "bg-red-400 text-white border-red-400",
  skipped: "bg-white text-gray-400 border-gray-300",
};

function QuestionSquare({ q, onClick }: { q: QuestionResult; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`w-9 h-9 rounded-lg border-2 text-xs font-bold flex items-center justify-center transition-colors ${STATUS_STYLES[q.status]}`}
    >
      {q.number}
    </motion.button>
  );
}

export default function ExamAllQuestions() {
  const location = useLocation();
  const nav = useNavigate();
  const data: ExamResultData = (location.state as ExamResultData) ?? DEMO;

  const [filter, setFilter] = useState<Filter>("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered =
    filter === "all"
      ? data.questions
      : data.questions.filter((q) => q.status === filter);

  const filterLabels: Record<Filter, string> = {
    all: "All questions",
    correct: "Correct only",
    incorrect: "Wrong only",
    skipped: "Skipped only",
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
        <button
          onClick={() => nav(-1)}
          className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <X size={16} /> close
        </button>
        <h1 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          {filterLabels[filter]}
        </h1>
        <div className="relative">
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            filter <ChevronDown size={14} />
          </button>
          {filterOpen && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-36 overflow-hidden">
              {(["all", "correct", "incorrect", "skipped"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setFilterOpen(false); }}
                  className={`w-full px-4 py-2.5 text-left text-sm capitalize hover:bg-gray-50 ${
                    filter === f ? "font-bold text-gray-900" : "text-gray-600"
                  }`}
                >
                  {filterLabels[f]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary bar */}
      <div className="px-5 py-4 bg-white border-b border-gray-100 flex items-center justify-between max-w-md mx-auto w-full">
        <div>
          <span className="text-4xl font-black text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
            {data.percentage}%
          </span>
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-green-400 inline-block" />
            <span className="text-gray-600">{data.correct} correct</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-red-400 inline-block" />
            <span className="text-gray-600">{data.incorrect} incorrect</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-white border border-gray-300 inline-block" />
            <span className="text-gray-600">{data.unanswered} skipped</span>
          </span>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${
            data.passed
              ? "border-green-500 bg-green-500 text-white"
              : "border-red-500 bg-red-500 text-white"
          }`}
        >
          {data.passed ? "PASS" : "FAIL"}
        </span>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-md mx-auto w-full">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 mt-10 text-sm">No questions in this category.</p>
        ) : (
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(10, minmax(0, 1fr))" }}>
            {filtered.map((q) => (
              <QuestionSquare
                key={q.number}
                q={q}
                onClick={() => {
                  // Navigate to question review — placeholder
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-8 flex gap-3 max-w-md mx-auto w-full">
        <button
          onClick={() => setFilter("incorrect")}
          className="flex-1 py-4 rounded-2xl border-2 border-gray-300 text-base font-semibold text-gray-700 hover:border-gray-400 transition-colors"
        >
          Wrong only
        </button>
        <button
          onClick={() => {
            // Start review from first incorrect question
            const first = data.questions.find((q) => q.status === "incorrect");
            if (first) {
              // Navigate to review — placeholder
            }
          }}
          className="flex-1 py-4 rounded-2xl bg-gray-900 text-base font-semibold text-white hover:bg-gray-800 transition-colors"
        >
          Review first →
        </button>
      </div>
    </div>
  );
}
