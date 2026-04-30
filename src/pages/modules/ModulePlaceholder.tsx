import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTopicById } from "@/data/topics";

const ModulePlaceholder = () => {
  const { topicId = "" } = useParams();
  const nav = useNavigate();
  const topic = getTopicById(topicId);
  return (
    <div className="min-h-screen bg-background grid place-items-center px-5">
      <div className="max-w-md text-center">
        <button onClick={() => nav(-1)} className="h-10 w-10 rounded-full bg-card shadow-soft grid place-items-center mb-6 mx-auto">
          <ArrowLeft size={18} />
        </button>
        <div className="h-16 w-16 rounded-2xl bg-rcsi-lavender grid place-items-center mx-auto mb-5 text-rcsi-purple">
          <Construction size={28} />
        </div>
        <h1 className="font-display font-bold text-2xl text-rcsi-navy mb-2">
          {topic?.label ?? "Study Module"}
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          The interactive study module for this station is coming next. For now, use the MCQ Quiz from the station page.
        </p>
        <Button onClick={() => nav(`/station/${topicId}`)} className="rounded-full bg-rcsi-navy hover:bg-rcsi-navy/90">
          Back to station
        </Button>
      </div>
    </div>
  );
};

export default ModulePlaceholder;
