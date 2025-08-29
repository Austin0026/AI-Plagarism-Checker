"use client";

import { useEffect, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { checkPlagiarism } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  score: undefined,
  reason: undefined,
  error: undefined,
};

const PLAGIARISM_THRESHOLD = 70;
const HIGH_PLAGIARISM_THRESHOLD = 90;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="px-8 text-lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Checking...
        </>
      ) : (
        "Check for Plagiarism"
      )}
    </Button>
  );
}

export function PlagiarismChecker() {
  const [state, formAction] = useActionState(checkPlagiarism, initialState);
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
  }, [state.error, toast]);

  const score = state.score;
  const reason = state.reason;

  const isHighPlagiarism = score !== undefined && score >= HIGH_PLAGIARISM_THRESHOLD;
  const isPlagiarized = score !== undefined && score >= PLAGIARISM_THRESHOLD;

  const progressColor = isHighPlagiarism
    ? "hsl(var(--destructive))"
    : isPlagiarized
    ? "hsl(35, 91%, 55%)"
    : "hsl(var(--primary))";

  const getResultTitle = () => {
    if (score === undefined) return null;
    if (isHighPlagiarism) return "High Plagiarism Detected";
    if (isPlagiarized) return "Potential Plagiarism Detected";
    return "Looking Good!";
  };

  const alertVariant = isHighPlagiarism ? "destructive" : isPlagiarized ? "default" : "default";
  
  const alertClasses = isPlagiarized && !isHighPlagiarism ? "bg-amber-500/10 border-amber-500/50 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-700 dark:[&>svg]:text-amber-400" : "";

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6">
      <form action={formAction} className="grid gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Original Text</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                name="text1"
                placeholder="Paste the first text here..."
                className="min-h-[300px] resize-y text-base"
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                required
              />
              <p className={`mt-2 text-sm ${text1.length < 100 ? 'text-destructive' : 'text-muted-foreground'}`}>{text1.length} / 100 characters minimum</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Comparison Text</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                name="text2"
                placeholder="Paste the second text here..."
                className="min-h-[300px] resize-y text-base"
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                required
              />
              <p className={`mt-2 text-sm ${text2.length < 100 ? 'text-destructive' : 'text-muted-foreground'}`}>{text2.length} / 100 characters minimum</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-center pt-4">
          <SubmitButton />
        </div>
      </form>

      {score !== undefined && reason && (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium text-lg">Plagiarism Score</span>
              <span className="text-3xl font-bold" style={{ color: progressColor }}>
                {score}%
              </span>
            </div>
            <Progress
              value={score}
              className="h-4"
              style={
                {
                  "--primary-foreground": progressColor,
                  "backgroundColor": "hsl(var(--secondary))"
                } as React.CSSProperties
              }
            />
             <Alert variant={alertVariant} className={alertClasses}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{getResultTitle()}</AlertTitle>
              <AlertDescription>
                {reason}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
