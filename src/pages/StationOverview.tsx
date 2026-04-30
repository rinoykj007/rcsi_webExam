import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Brain, GraduationCap } from "lucide-react";
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
        <button onClick={() => nav(-1)} className="h-10 w-10 rounded-full bg-card shadow-soft grid place-items-center hover:scale-105 transition mb-6">
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-3 w-3 rounded-full" style={{ background: accent }} />
          <div className="text-xs font-bold tracking-widest text-muted-foreground">STATION {topic.station_id}</div>
        </div>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-rcsi-navy mb-4">{topic.label}</h1>
        <p className="text-muted-foreground leading-relaxed mb-10">{topic.description}</p>

        <div className="space-y-3">
          <Button asChild className="w-full h-14 rounded-2xl bg-rcsi-navy hover:bg-rcsi-navy/90 justify-between px-5 text-base">
            <Link to={`/quiz/${topic.id}?mode=exam`}>
              <span className="flex items-center gap-3"><Brain size={20} /> Start MCQ Quiz</span>
              <span className="text-xs opacity-70">Exam · 10 min</span>
            </Link>
          </Button>
          <Button asChild variant="secondary" className="w-full h-14 rounded-2xl justify-between px-5 text-base">
            <Link to={`/quiz/${topic.id}`}>
              <span className="flex items-center gap-3"><GraduationCap size={20} /> Practice Mode</span>
              <span className="text-xs opacity-70">Untimed</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-14 rounded-2xl justify-between px-5 text-base"
            style={{ borderColor: accent, color: accent }}>
            <Link to={studyModuleRoute(topic.id)}>
              <span className="flex items-center gap-3"><BookOpen size={20} /> Study Module</span>
              <span className="text-xs opacity-70">Read & flashcards</span>
            </Link>
          </Button>
        </div>

        <GlossarySection topicId={topic.id} accent={accent} />
      </div>
    </div>
  );
};

export default StationOverview;
