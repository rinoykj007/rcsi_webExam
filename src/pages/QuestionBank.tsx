import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  Check,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TOPICS, getTopicById } from "@/data/topics";
import type { Question } from "@/data/questions";
import { fetchAllQuestions } from "@/lib/data";

const ALL_TOPICS = "all";

const QuestionBank = () => {
  const nav = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [topicId, setTopicId] = useState(ALL_TOPICS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [headerSearchOpen, setHeaderSearchOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchAllQuestions(500)
      .then((items) => {
        if (!active) return;
        setQuestions(items);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return questions.filter((q) => {
      const matchesTopic = topicId === ALL_TOPICS || q.topicId === topicId;
      if (!matchesTopic) return false;
      if (!needle) return true;

      const optionText = q.options.map((opt) => opt.text).join(" ");
      return `${q.question} ${q.tag} ${q.explanation} ${optionText}`
        .toLowerCase()
        .includes(needle);
    });
  }, [questions, query, topicId]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [query, topicId]);

  const currentQuestion = filtered[currentIndex];
  const currentTopic = currentQuestion
    ? getTopicById(currentQuestion.topicId)
    : null;
  const selectedTopic = topicId === ALL_TOPICS ? null : getTopicById(topicId);
  const headerSubtitle = selectedTopic
    ? `Station ${selectedTopic.station_id}: ${selectedTopic.label}`
    : "Browse the full question bank by station, answer, and rationale.";
  const selected =
    currentQuestion && selectedAnswers[currentQuestion.id] !== undefined
      ? selectedAnswers[currentQuestion.id]
      : undefined;
  const hasSelected = selected !== undefined;
  const correct =
    currentQuestion && currentQuestion.options[currentQuestion.correct];

  const selectAnswer = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((current) => ({
      ...current,
      [questionId]: optionIndex,
    }));
  };

  const handleTopicChange = (value: string) => {
    setTopicId(value);
    setHeaderSearchOpen(false);
  };

  const goToQuestion = (direction: -1 | 1) => {
    setCurrentIndex((index) => {
      const next = index + direction;
      if (next < 0) return 0;
      if (next >= filtered.length) return index;
      return next;
    });
  };

  const focusSearch = () => {
    setHeaderSearchOpen(true);
    window.setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
          <Loader2 className="animate-spin text-rcsi-purple" size={20} />
          Loading MCQ question bank
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="sticky top-0 z-20 bg-background px-3 pt-3">
        <div className="mx-auto flex h-[76px] w-full max-w-5xl items-center gap-3 rounded-[1.75rem] bg-[#10251b] px-4 text-white shadow-card ring-1 ring-white/10">
          <button
            onClick={() => {
              if (headerSearchOpen) {
                setHeaderSearchOpen(false);
                return;
              }
              nav(-1);
            }}
            className="h-10 w-10 grid place-items-center text-white/90 hover:bg-white/10 rounded-full transition shrink-0"
            aria-label={headerSearchOpen ? "Close search" : "Go back"}
          >
            {headerSearchOpen ? <X size={24} /> : <ArrowLeft size={25} />}
          </button>
          {headerSearchOpen ? (
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
              />
              <Input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search MCQs"
                className="h-11 rounded-full border-white/10 bg-white/10 pl-9 pr-10 text-white placeholder:text-white/55 focus-visible:ring-white/25"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full grid place-items-center text-white/70 hover:bg-white/10"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-white/12 ring-1 ring-white/15 grid place-items-center text-emerald-100 shrink-0">
                <div className="h-9 w-9 rounded-full bg-[#1f8a5b] grid place-items-center shadow-inner">
                  <Brain size={20} />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-[21px] font-bold leading-tight tracking-normal">
                  MCQs
                </h1>
                <p className="truncate text-sm leading-tight text-emerald-50/75">
                  {headerSubtitle}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 rounded-full bg-white/8 p-1 ring-1 ring-white/10">
                <button
                  onClick={focusSearch}
                  className="h-9 w-9 grid place-items-center rounded-full text-white/90 hover:bg-white/12 transition"
                  aria-label="Search questions"
                >
                  <Search size={20} />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="h-9 w-9 grid place-items-center rounded-full text-white/90 hover:bg-white/12 transition"
                      aria-label="Choose station"
                    >
                      <MoreVertical size={20} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 max-h-96 overflow-y-auto"
                  >
                    <DropdownMenuLabel>Choose station</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={topicId}
                      onValueChange={handleTopicChange}
                    >
                      <DropdownMenuRadioItem value={ALL_TOPICS}>
                        All stations
                      </DropdownMenuRadioItem>
                      {TOPICS.map((topic) => (
                        <DropdownMenuRadioItem key={topic.id} value={topic.id}>
                          Station {topic.station_id}: {topic.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-5 py-6">
        {/* <div className="text-sm text-muted-foreground mb-4 px-1">
          Showing <span className="font-bold text-foreground">{filtered.length}</span>{" "}
          of <span className="font-bold text-foreground">{questions.length}</span>{" "}
          questions
        </div> */}

        {!currentQuestion ? (
          <div className="rounded-2xl bg-card border border-border p-8 text-center">
            <p className="font-semibold text-foreground">No questions found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try a different search term or station filter.
            </p>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-border bg-card overflow-hidden shadow-card">
            <div className="flex items-center justify-between gap-3 border-b border-border bg-card/95 px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <div className="text-[11px] font-bold tracking-widest text-muted-foreground">
                  QUESTION {currentIndex + 1} OF {filtered.length}
                </div>
                <div className="font-display font-bold text-foreground truncate">
                  {currentTopic
                    ? `Station ${currentTopic.station_id}: ${currentTopic.label}`
                    : currentQuestion.tag}
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => goToQuestion(-1)}
                  disabled={currentIndex === 0}
                  className="h-9 w-9 rounded-full border border-border grid place-items-center text-foreground hover:bg-muted transition disabled:opacity-40"
                  aria-label="Previous question"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => goToQuestion(1)}
                  disabled={currentIndex + 1 >= filtered.length}
                  className="h-9 w-9 rounded-full border border-border grid place-items-center text-foreground hover:bg-muted transition disabled:opacity-40"
                  aria-label="Next question"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="bg-[#eef5ee] dark:bg-background px-3 py-5 sm:px-6 sm:py-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#2c5f2e] text-white grid place-items-center shrink-0">
                    <Brain size={17} />
                  </div>
                  <div className="max-w-[88%] rounded-[1.7rem] rounded-tl-md bg-white dark:bg-card border border-border p-4 shadow-sm">
                    <div className="text-[11px] font-bold tracking-widest text-muted-foreground mb-1">
                      {currentQuestion.tag.toUpperCase()}
                    </div>
                    <p className="font-display font-bold text-base sm:text-lg text-foreground leading-snug">
                      {currentQuestion.question}
                    </p>
                    {currentQuestion.image_url && (
                      <img
                        src={currentQuestion.image_url}
                        alt="Question reference"
                        loading="lazy"
                        className="w-full max-h-80 object-contain rounded-[1.25rem] bg-muted mt-4"
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="w-full max-w-[88%] space-y-2">
                    {currentQuestion.options.map((opt, optionIndex) => {
                      const isCorrect = optionIndex === currentQuestion.correct;
                      const isSelected = selected === optionIndex;
                      let optionClass =
                        "bg-[#2c5f2e] text-white hover:bg-[#244d26]";

                      if (hasSelected && isCorrect) {
                        optionClass = "bg-rcsi-green text-white";
                      } else if (hasSelected && isSelected) {
                        optionClass =
                          "bg-destructive text-destructive-foreground";
                      } else if (hasSelected) {
                        optionClass =
                          "bg-white/80 dark:bg-card text-muted-foreground";
                      }

                      return (
                        <button
                          key={opt.key}
                          onClick={() =>
                            selectAnswer(currentQuestion.id, optionIndex)
                          }
                          disabled={hasSelected}
                          className={`w-full rounded-[1.45rem] rounded-tr-md px-4 py-3 text-left text-sm font-semibold shadow-sm transition flex items-start gap-3 ${optionClass}`}
                        >
                          <span className="h-7 w-7 rounded-full bg-black/10 grid place-items-center text-xs font-bold shrink-0">
                            {opt.key}
                          </span>
                          <span className="flex-1">{opt.text}</span>
                          {hasSelected && isCorrect && (
                            <Check size={17} className="shrink-0" />
                          )}
                          {hasSelected && isSelected && !isCorrect && (
                            <X size={17} className="shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {hasSelected && (
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-9 w-9 rounded-full text-white grid place-items-center shrink-0 ${
                        selected === currentQuestion.correct
                          ? "bg-rcsi-green"
                          : "bg-destructive"
                      }`}
                    >
                      {selected === currentQuestion.correct ? (
                        <Check size={17} />
                      ) : (
                        <X size={17} />
                      )}
                    </div>
                    <div className="max-w-[88%] rounded-[1.7rem] rounded-tl-md bg-white dark:bg-card border border-border p-4 shadow-sm">
                      <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">
                        {selected === currentQuestion.correct
                          ? "Correct"
                          : "Not quite"}
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {correct
                          ? `Answer: ${correct.key}. ${correct.text}`
                          : "Answer unavailable"}
                      </p>
                      {currentQuestion.explanation && (
                        <p className="text-sm text-foreground/75 mt-2">
                          {currentQuestion.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border bg-card/95 px-4 py-3 sm:px-5">
              <button
                onClick={() => goToQuestion(-1)}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition disabled:opacity-40"
              >
                <ChevronLeft size={15} /> Previous
              </button>
              <button
                onClick={() => goToQuestion(1)}
                disabled={currentIndex + 1 >= filtered.length}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#2c5f2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#244d26] transition disabled:opacity-40"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;
