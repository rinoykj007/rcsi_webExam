import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { DEMO } from "./examDemoData";

export interface DomainResult {
  name: string;
  correct: number;
  total: number;
  passMarkPct: number;
}

export interface QuestionResult {
  number: number;
  status: "correct" | "incorrect" | "skipped";
  topicId?: string;
}

export interface ExamResultData {
  total: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  percentage: number;
  passMarkPct: number;
  passed: boolean;
  duration: string;
  submittedDate: string;
  domains: DomainResult[];
  questions: QuestionResult[];
}


function CircleProgress({ pct, passed, correct, total }: { pct: number; passed: boolean; correct: number; total: number }) {
  const r = 90;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
      <svg width="220" height="220" viewBox="0 0 220 220" className="-rotate-90">
        <circle cx="110" cy="110" r={r} fill="none" stroke="#e5e7eb" strokeWidth="12" />
        <motion.circle
          cx="110"
          cy="110"
          r={r}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-6xl font-black text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          {correct}
        </span>
        <span className="text-lg text-gray-500 font-medium">/ {total}</span>
        <span
          className={`mt-2 px-3 py-1 rounded-full text-sm font-bold ${
            passed ? "bg-green-500 text-white" : "bg-red-400 text-white"
          }`}
        >
          {passed ? "PASS" : "FAIL"} · {pct}%
        </span>
      </div>
    </div>
  );
}

function StatCard({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-2xl px-5 py-4 bg-white">
      <div className="flex items-center gap-3">
        <span className={`w-5 h-5 rounded-md ${color}`} />
        <span className="text-base font-medium text-gray-700">{label}</span>
      </div>
      <span className="text-2xl font-black text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
        {count}
      </span>
    </div>
  );
}

export default function ExamResults() {
  const location = useLocation();
  const nav = useNavigate();
  const data: ExamResultData = (location.state as ExamResultData) ?? DEMO;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
        <button
          onClick={() => nav(-1)}
          className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} /> exit
        </button>
        <h1 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          Results
        </h1>
        <button
          onClick={() => nav("/exam-results/breakdown", { state: data })}
          className="text-gray-500 hover:text-gray-900"
        >
          <ArrowUpRight size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center px-5 pt-10 pb-6 gap-6 max-w-md mx-auto w-full">
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <CircleProgress
            pct={data.percentage}
            passed={data.passed}
            correct={data.correct}
            total={data.total}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-base font-medium text-gray-500">
            Pass mark = {data.passMarkPct}%
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Submitted {data.duration} · {data.submittedDate}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="w-full flex flex-col gap-3"
        >
          <StatCard color="bg-green-500" label="Correct" count={data.correct} />
          <StatCard color="bg-red-400" label="Incorrect" count={data.incorrect} />
          <StatCard color="bg-gray-300" label="Unanswered" count={data.unanswered} />
        </motion.div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-8 flex gap-3 max-w-md mx-auto w-full">
        <button
          onClick={() => nav("/exam-results/questions", { state: data })}
          className="flex-1 py-4 rounded-2xl border-2 border-gray-300 text-base font-semibold text-gray-700 hover:border-gray-400 transition-colors"
        >
          Review answers
        </button>
        <button
          onClick={() => nav("/dashboard")}
          className="flex-1 py-4 rounded-2xl bg-gray-900 text-base font-semibold text-white hover:bg-gray-800 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
