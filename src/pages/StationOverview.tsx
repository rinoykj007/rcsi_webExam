import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Brain, Stethoscope, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTopicById, studyModuleRoute } from "@/data/topics";
import { GlossarySection } from "@/components/GlossarySection";

const StationOverview = () => {
  const { topicId = "" } = useParams();
  const nav = useNavigate();
  const topic = getTopicById(topicId);

  if (!topic) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Station not found</p>
          <Button onClick={() => nav("/")}>Go home</Button>
        </div>
      </div>
    );
  }

  const accent = topic.dotColor;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto w-full max-w-2xl px-5 py-6 lg:py-10">
        <button
          onClick={() => nav(-1)}
          className="h-10 w-10 rounded-full bg-card shadow-soft grid place-items-center hover:scale-105 transition mb-6"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="h-3 w-3 rounded-full" style={{ background: accent }} />
          <div className="text-xs font-bold tracking-widest text-muted-foreground">
            STATION {topic.station_id}
          </div>
        </div>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-rcsi-navy mb-3">
          {topic.label}
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          {topic.description}
        </p>

        {/* Two main sections */}
        <div className="grid grid-cols-1 gap-4">

          {/* ── MCQ Section ── */}
          <div
            className="rounded-3xl overflow-hidden shadow-card border-2"
            style={{ borderColor: accent + "40" }}
          >
            <div
              className="px-6 py-4 flex items-center gap-3"
              style={{ background: accent + "18" }}
            >
              <div
                className="h-10 w-10 rounded-2xl grid place-items-center"
                style={{ background: accent }}
              >
                <Brain size={20} className="text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-rcsi-navy text-lg">
                  MCQ
                </div>
                <div className="text-xs text-muted-foreground">
                  Multiple-choice questions
                </div>
              </div>
            </div>

            <div className="px-6 pb-5 pt-4 bg-card space-y-3">
              {/* Exam mode */}
              <Button
                asChild
                className="w-full h-13 rounded-2xl justify-between px-5"
                style={{ background: accent }}
              >
                <Link to={`/quiz/${topic.id}?mode=exam`}>
                  <span className="flex items-center gap-2 font-semibold">
                    <Zap size={17} /> Exam Mode
                  </span>
                  <span className="flex items-center gap-1 text-xs opacity-80">
                    <Clock size={13} /> 10 min
                  </span>
                </Link>
              </Button>

              {/* Practice mode */}
              <Button
                asChild
                variant="outline"
                className="w-full h-12 rounded-2xl justify-between px-5"
                style={{ borderColor: accent + "60", color: accent }}
              >
                <Link to={`/quiz/${topic.id}`}>
                  <span className="flex items-center gap-2 font-semibold">
                    <Brain size={17} /> Practice Mode
                  </span>
                  <span className="text-xs opacity-70">Untimed</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* ── Practical Section ── */}
          <div className="rounded-3xl overflow-hidden shadow-card border-2 border-rcsi-navy/20">
            <div className="px-6 py-4 flex items-center gap-3 bg-rcsi-navy/10">
              <div className="h-10 w-10 rounded-2xl grid place-items-center bg-rcsi-navy">
                <Stethoscope size={20} className="text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-rcsi-navy text-lg">
                  Practical
                </div>
                <div className="text-xs text-muted-foreground">
                  OSCE skills, flashcards & study
                </div>
              </div>
            </div>

            <div className="px-6 pb-5 pt-4 bg-card">
              <Button
                asChild
                className="w-full h-13 rounded-2xl justify-between px-5 bg-rcsi-navy hover:bg-rcsi-navy/90"
              >
                <Link to={studyModuleRoute(topic.id)}>
                  <span className="flex items-center gap-2 font-semibold">
                    <Stethoscope size={17} /> Open Practical Module
                  </span>
                  <span className="text-xs opacity-70">Read & practise</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <GlossarySection topicId={topic.id} accent={accent} />
      </div>
    </div>
  );
};

export default StationOverview;
