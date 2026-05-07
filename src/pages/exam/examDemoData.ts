import type { ExamResultData } from "./ExamResults";

const INCORRECT_SET = new Set([
  3, 13, 16, 17, 22, 26, 27, 39, 42, 52, 53, 55, 59, 68, 71,
  81, 84, 85, 88, 94, 95, 97, 101, 111, 113, 114, 117, 127, 132, 139, 142, 143,
]);
const SKIPPED_SET = new Set([4, 46, 75, 104, 146]);

export const DEMO: ExamResultData = {
  total: 150,
  correct: 117,
  incorrect: 28,
  unanswered: 5,
  percentage: 78,
  passMarkPct: 65,
  passed: true,
  duration: "2h 47m",
  submittedDate: "26 Apr 2026",
  domains: [
    { name: "Adult General", correct: 32, total: 40, passMarkPct: 65 },
    { name: "Mental Health", correct: 18, total: 22, passMarkPct: 65 },
    { name: "Children's", correct: 14, total: 20, passMarkPct: 65 },
    { name: "Intellectual Disability", correct: 11, total: 14, passMarkPct: 65 },
    { name: "Medications", correct: 25, total: 30, passMarkPct: 65 },
    { name: "Ethics & Law", correct: 17, total: 24, passMarkPct: 65 },
  ],
  questions: Array.from({ length: 150 }, (_, i) => ({
    number: i + 1,
    status: INCORRECT_SET.has(i + 1)
      ? "incorrect"
      : SKIPPED_SET.has(i + 1)
      ? "skipped"
      : "correct",
  })),
};
