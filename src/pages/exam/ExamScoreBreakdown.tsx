import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { ExamResultData } from "./ExamResults";
import { DEMO } from "./examDemoData";

function DomainRow({
  name,
  correct,
  total,
  passMarkPct,
  delay,
}: {
  name: string;
  correct: number;
  total: number;
  passMarkPct: number;
  delay: number;
}) {
  const pct = Math.round((correct / total) * 100);
  const passed = pct >= passMarkPct;
  const passPos = passMarkPct; // percentage position of the threshold marker

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="flex flex-col gap-1"
    >
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-semibold text-gray-800">{name}</span>
        <span className="text-sm font-bold text-gray-900">
          {correct}/{total}{" "}
          <span className={passed ? "text-green-600" : "text-red-500"}>{pct}%</span>
        </span>
      </div>
      <div className="relative h-3 bg-gray-100 rounded-full overflow-visible">
        {/* Fill bar */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-green-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.1, duration: 0.7, ease: "easeOut" }}
        />
        {/* Pass mark notch */}
        <div
          className="absolute top-[-3px] bottom-[-3px] w-0.5 bg-gray-500"
          style={{ left: `${passPos}%` }}
        />
      </div>
    </motion.div>
  );
}

export default function ExamScoreBreakdown() {
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
          <ArrowLeft size={16} /> back
        </button>
        <h1 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
          Score breakdown
        </h1>
        <button
          onClick={() => nav("/exam-results/questions", { state: data })}
          className="text-gray-500 hover:text-gray-900"
        >
          <ArrowUpRight size={20} />
        </button>
      </div>

      {/* Score banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-0 bg-yellow-400 px-6 py-5"
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
                {data.percentage}%
              </span>
              <span className="text-xl font-semibold text-gray-800">
                {data.correct} / {data.total}
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-1">
              Pass mark {data.passMarkPct}% · all {data.domains.length} domains required
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${
              data.passed
                ? "border-gray-900 bg-white text-gray-900"
                : "border-red-600 bg-white text-red-600"
            }`}
          >
            {data.passed ? "PASS" : "FAIL"}
          </span>
        </div>
      </motion.div>

      {/* Domain list */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4 max-w-md mx-auto w-full">
        <p className="text-xs font-semibold tracking-widest text-gray-400 mb-5 uppercase">
          By Domain
        </p>
        <div className="flex flex-col gap-6">
          {data.domains.map((d, i) => (
            <DomainRow
              key={d.name}
              name={d.name}
              correct={d.correct}
              total={d.total}
              passMarkPct={d.passMarkPct}
              delay={i * 0.07}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-8 flex gap-3 max-w-md mx-auto w-full">
        <button
          onClick={() => {
            // PDF save placeholder
            alert("PDF saving not yet implemented.");
          }}
          className="flex-1 py-4 rounded-2xl border-2 border-gray-300 text-base font-semibold text-gray-700 hover:border-gray-400 transition-colors"
        >
          Save PDF
        </button>
        <button
          onClick={() => nav("/exam-results/questions", { state: data })}
          className="flex-1 py-4 rounded-2xl bg-gray-900 text-base font-semibold text-white hover:bg-gray-800 transition-colors"
        >
          Review →
        </button>
      </div>
    </div>
  );
}
