'use client';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { checkPlagiarism } from '@/app/actions';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type QuizQuestion = {
  question: string;
  answer: string;
};

type QuizData = {
  topic: string;
  questions: QuizQuestion[];
};

interface StudentQuizProps {
  code: string;
  quizData: QuizData;
}

type AnswerAnalysis = {
  score: number;
  reason: string;
  studentAnswer: string;
};

type ResultsState = {
  finalMark: number;
  analysis: AnswerAnalysis[];
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        'Submit Answers'
      )}
    </Button>
  );
}

export function StudentQuiz({ code, quizData }: StudentQuizProps) {
  const [studentAnswers, setStudentAnswers] = useState<string[]>(Array(quizData.questions.length).fill(''));
  const [results, setResults] = useState<ResultsState | null>(null);
  const [isSubmitting, startTransition] = useTransition();

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...studentAnswers];
    newAnswers[index] = value;
    setStudentAnswers(newAnswers);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const analysisResults = await Promise.all(
        quizData.questions.map(async (q, index) => {
          const studentAnswer = studentAnswers[index] || ""
           
          const formData = new FormData();
          formData.append('text1', studentAnswer);
          formData.append('text2', q.answer);

          const singleResult = await checkPlagiarism({ score: 0, reason: ''}, formData);

          return { 
              score: singleResult.score ?? 0, 
              reason: singleResult.reason ?? 'No analysis available.', 
              studentAnswer 
          };
        })
      );

      const totalScore = analysisResults.reduce((acc, curr) => acc + curr.score, 0);
      const finalMark = Math.round(totalScore / analysisResults.length);

      setResults({ finalMark, analysis: analysisResults });
    });
  };
  
  const getResultTitle = (score: number) => {
    if (score >= 90) return "Excellent Work!";
    if (score >= 70) return "Good Job!";
    if (score >= 50) return "Room for Improvement";
    return "Needs Review";
  };


  if (results) {
    return (
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Quiz Results</CardTitle>
          <CardDescription>Topic: {quizData.topic}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="text-center p-6 bg-muted rounded-lg">
                <p className="text-lg text-muted-foreground">Your Final Mark</p>
                <p className="text-6xl font-bold text-primary">{results.finalMark}%</p>
            </div>
          {quizData.questions.map((q, index) => (
            <div key={index} className="border-t pt-4">
              <h3 className="font-semibold text-lg">{index + 1}. {q.question}</h3>
              <div className="mt-2 p-4 bg-background rounded-md space-y-4">
                <div>
                    <p className="text-sm font-medium">Your Answer:</p>
                    <p className="text-sm text-muted-foreground p-2 border rounded-md bg-muted/50">{results.analysis[index].studentAnswer || "No answer provided."}</p>
                </div>
                 <div>
                    <p className="text-sm font-medium">Correct Answer:</p>
                    <p className="text-sm text-muted-foreground p-2 border rounded-md bg-green-500/10">{q.answer}</p>
                </div>
                 <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{getResultTitle(results.analysis[index].score)} (Similarity: {results.analysis[index].score}%)</AlertTitle>
                    <AlertDescription>
                        {results.analysis[index].reason}
                    </AlertDescription>
                </Alert>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
            <Button onClick={() => setResults(null)} className="w-full" variant="outline">Back to Quiz</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{quizData.topic}</CardTitle>
        <CardDescription>
          Test Code: <span className="font-mono font-bold">{code}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {quizData.questions.map((q, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`question-${index}`} className="font-semibold text-base">
                {index + 1}. {q.question}
              </Label>
              <Textarea
                id={`question-${index}`}
                name={`question-${index}`}
                placeholder="Type your answer here..."
                className="min-h-[120px] resize-y"
                value={studentAnswers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                required
              />
            </div>
          ))}
          <div className="pt-4">
             <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
