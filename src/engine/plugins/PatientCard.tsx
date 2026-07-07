import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PatientCardConfig } from "@/engine/configs";
import type { StepPluginProps } from "@/engine/types";

/**
 * patient.card — shows the patient's details and the station task.
 * Confirming the patient's identity (and, when configured, checking the
 * allergies) are the first checklist marks. With `decoys` configured, the
 * identity check becomes a wristband pick — confirming a decoy is a
 * wrong-patient error and latches a critical fail.
 */
export const PatientCard = ({
  step,
  station,
  onComplete,
}: StepPluginProps<PatientCardConfig>) => {
  const { patient } = station;
  const decoys = step.config.decoys ?? [];
  const needsAllergyCheck = step.config.checkAllergies === true;
  const [identityConfirmed, setIdentityConfirmed] = useState(false);
  const [allergiesChecked, setAllergiesChecked] = useState(false);
  const [wrongIdentity, setWrongIdentity] = useState<string | null>(null);

  // Real patient mixed among the decoys; sorted so position gives nothing away.
  const wristbands = useMemo(
    () =>
      [
        { name: patient.name, age: patient.age, gender: patient.gender },
        ...decoys,
      ].sort((a, b) => a.name.localeCompare(b.name)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [patient.name, patient.age, patient.gender, step.id],
  );

  const finish = () =>
    onComplete({
      marksAwarded: step.marksAvailable,
      marksAvailable: step.marksAvailable,
      critical: false,
      completed: true,
    });

  const handleConfirmIdentity = () => {
    setIdentityConfirmed(true);
    if (!needsAllergyCheck || allergiesChecked) finish();
  };

  const handleCheckAllergies = () => {
    setAllergiesChecked(true);
    if (identityConfirmed) finish();
  };

  const handlePickWristband = (name: string) => {
    if (identityConfirmed || wrongIdentity) return;
    if (name === patient.name) {
      handleConfirmIdentity();
      return;
    }
    setWrongIdentity(name);
    toast.error(`${name} is not your patient — wrong patient identified.`);
    onComplete({
      marksAwarded: 0,
      marksAvailable: step.marksAvailable,
      critical: true,
      completed: true,
      detail: { wrongPatient: name },
    });
  };

  const facts: Array<[string, string]> = [
    ["Name", patient.name],
    ["Age", String(patient.age)],
    ["Gender", patient.gender],
  ];
  if (patient.weightKg) facts.push(["Weight", `${patient.weightKg} kg`]);
  if (patient.diagnosis) facts.push(["Diagnosis", patient.diagnosis]);
  if (patient.allergies) facts.push(["Allergies", patient.allergies]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          Patient details
          <Badge variant="secondary" className="ml-auto">
            {station.difficulty}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          {facts.map(([label, value]) => (
            <div key={label} className="rounded-lg bg-muted p-3">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="font-semibold">{value}</div>
            </div>
          ))}
        </div>
        {patient.prescription && (
          <div className="rounded-lg border p-3 text-sm">
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Prescription
            </div>
            {patient.prescription}
          </div>
        )}
        {patient.history && (
          <div className="rounded-lg border p-3 text-sm">
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              History
            </div>
            {patient.history}
          </div>
        )}
        <div className="rounded-lg border border-dashed p-3 text-sm">
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Your task
          </div>
          {station.task}
        </div>
        {step.config.requireConfirm && decoys.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Check the wristband — which patient is yours?
            </div>
            <div className="flex flex-wrap gap-2">
              {wristbands.map((w) => {
                const isPicked =
                  (identityConfirmed && w.name === patient.name) ||
                  wrongIdentity === w.name;
                const isWrongPick = wrongIdentity === w.name;
                return (
                  <button
                    key={w.name}
                    type="button"
                    onClick={() => handlePickWristband(w.name)}
                    disabled={identityConfirmed || wrongIdentity !== null}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      !isPicked && "hover:bg-muted",
                      isPicked &&
                        (isWrongPick
                          ? "border-destructive/60 bg-destructive/10"
                          : "border-rcsi-green bg-rcsi-mint/30"),
                    )}
                  >
                    <div className="font-semibold">{w.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {w.age} yrs · {w.gender}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {step.config.requireConfirm && (
          <div className="flex flex-wrap gap-2">
            {decoys.length === 0 && (
              <Button
                onClick={handleConfirmIdentity}
                disabled={identityConfirmed}
                variant={identityConfirmed ? "secondary" : "default"}
              >
                <UserCheck size={16} className="mr-2" />
                {identityConfirmed
                  ? "Identity confirmed ✓"
                  : "I have confirmed the patient's identity"}
              </Button>
            )}
            {needsAllergyCheck && (
              <Button
                onClick={handleCheckAllergies}
                disabled={allergiesChecked || wrongIdentity !== null}
                variant={allergiesChecked ? "secondary" : "default"}
              >
                <ShieldCheck size={16} className="mr-2" />
                {allergiesChecked
                  ? "Allergies checked ✓"
                  : "I have checked the allergies"}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
