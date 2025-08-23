"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
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
  error: undefined,
};

const PLAGIARISM_THRESHOLD = 50; // 50%

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
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
  const [state, formAction] = useFormState(checkPlagiarism, initialState);
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
  const isPlagiarized = score !== undefined && score > PLAGIARISM_THRESHOLD;

  const progressColor = isPlagiarized ? "hsl(var(--accent))" : "hsl(var(--primary))";

  const getResultMessage = () => {
    if (score === undefined) return null;
    if (score > 75) return "High similarity detected. Strong indication of plagiarism.";
    if (score > PLAGIARISM_THRESHOLD) return "Moderate similarity detected. Potential plagiarism found.";
    return "Low similarity detected. Unlikely to be plagiarized.";
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6">
      <form action={formAction} className="grid gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Original Text</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                name="text1"
                placeholder="Paste the first text here..."
                className="min-h-[300px] resize-y"
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                required
              />
              <p className={`mt-2 text-sm ${text1.length < 100 ? 'text-destructive' : 'text-muted-foreground'}`}>{text1.length} / 100 characters minimum</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Comparison Text</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                name="text2"
                placeholder="Paste the second text here..."
                className="min-h-[300px] resize-y"
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                required
              />
              <p className={`mt-2 text-sm ${text2.length < 100 ? 'text-destructive' : 'text-muted-foreground'}`}>{text2.length} / 100 characters minimum</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-center">
          <SubmitButton />
        </div>
      </form>

      {score !== undefined && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium">Plagiarism Score</span>
              <span className="text-2xl font-bold" style={{ color: progressColor }}>
                {score}%
              </span>
            </div>
            <Progress
              value={score}
              className="h-4"
              style={
                {
                  "--primary": progressColor,
                } as React.CSSProperties
              }
            />
            <Alert variant={isPlagiarized ? "destructive" : "default"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{isPlagiarized ? "Plagiarism Alert" : "Looking Good!"}</AlertTitle>
              <AlertDescription>
                {getResultMessage()}
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <h3 className="font-semibold mb-2">Original Text</h3>
                <div className={`p-4 rounded-md border ${isPlagiarized ? 'border-destructive/50' : ''} bg-muted/50 max-h-60 overflow-y-auto`}>
                  <p className="text-sm whitespace-pre-wrap">{text1}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Comparison Text</h3>
                <div className={`p-4 rounded-md border ${isPlagiarized ? 'border-destructive/50' : ''} bg-muted/50 max-h-60 overflow-y-auto`}>
                  <p className="text-sm whitespace-pre-wrap">{text2}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
