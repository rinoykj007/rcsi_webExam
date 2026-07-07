import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { McqQuestionConfig } from "@/engine/configs";
import type { StepPluginProps } from "@/engine/types";

/**
 * mcq.question — single-submit multiple choice. A correct first answer earns
 * the marks; after submitting, the correct option and explanation are shown
 * before continuing.
 */
export const McqQuestion = ({
  step,
  onComplete,
}: StepPluginProps<McqQuestionConfig>) => {
  const { question, options, correctIndex, explanation, criticalOnWrong } =
    step.config;
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedIndex = selected === null ? -1 : Number(selected);
  const correct = selectedIndex === correctIndex;

  const finish = () =>
    onComplete({
      marksAwarded: correct ? step.marksAvailable : 0,
      marksAvailable: step.marksAvailable,
      critical: !correct && criticalOnWrong === true,
      completed: true,
      detail: { selectedIndex },
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <RadioGroup
          value={selected ?? ""}
          onValueChange={setSelected}
          disabled={submitted}
        >
          {options.map((option, i) => (
            <Label
              key={i}
              htmlFor={`${step.id}-opt-${i}`}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm font-normal transition-colors",
                !submitted && "hover:bg-muted",
                submitted && i === correctIndex && "border-rcsi-green bg-rcsi-mint/30",
                submitted &&
                  i === selectedIndex &&
                  i !== correctIndex &&
                  "border-destructive/60 bg-destructive/10",
              )}
            >
              <RadioGroupItem value={String(i)} id={`${step.id}-opt-${i}`} />
              <span className="flex-1">{option}</span>
              {submitted && i === correctIndex && (
                <CheckCircle2 size={16} className="text-rcsi-green" />
              )}
              {submitted && i === selectedIndex && i !== correctIndex && (
                <XCircle size={16} className="text-destructive" />
              )}
            </Label>
          ))}
        </RadioGroup>
        {submitted && explanation && (
          <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            {explanation}
          </p>
        )}
        {!submitted ? (
          <Button
            className="self-end"
            disabled={selected === null}
            onClick={() => setSubmitted(true)}
          >
            Submit answer
          </Button>
        ) : (
          <Button className="self-end" onClick={finish}>
            Continue
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
