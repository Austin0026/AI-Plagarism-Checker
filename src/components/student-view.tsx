'use client';

import { useState, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import type { GenerateQuizOutput } from '@/ai/flows/generate-quiz';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { checkPlagiarism } from '@/app/actions';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const PLAGIARISM_THRESHOLD = 70;
const HIGH_PLAGIARISM_THRESHOLD = 90;

const initialState = { score: undefined, reason: undefined, error: undefined };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
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

interface StudentViewProps {
  quiz: GenerateQuizOutput;
  onStartOver: () => void;
}

export function StudentView({ quiz, onStartOver }: StudentViewProps) {
  const [studentAnswers, setStudentAnswers] = useState<string[]>(new Array(quiz.questions.length).fill(''));
  const [results, setResults] = useState<{ score: number; reason: string }[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...studentAnswers];
    newAnswers[index] = value;
    setStudentAnswers(newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const plagiarismResults = [];
    for (let i = 0; i < quiz.questions.length; i++) {
      const studentAnswer = studentAnswers[i];
      const correctAnswer = quiz.questions[i].answer;

      if (studentAnswer.length < 10 || correctAnswer.length < 10) {
        // Handle short texts, maybe assign a score of 0 or skip
         plagiarismResults.push({ score: 0, reason: 'Answer is too short to be evaluated.' });
         continue;
      }
      
      const formData = new FormData();
      // Pad with dummy text if needed to meet min length requirement
      formData.append('text1', studentAnswer.length < 100 ? studentAnswer.padEnd(100, ' ') : studentAnswer);
      formData.append('text2', correctAnswer.length < 100 ? correctAnswer.padEnd(100, ' ') : correctAnswer);
      
      const result = await checkPlagiarism(initialState, formData);
      plagiarismResults.push({ score: result.score ?? 0, reason: result.reason ?? 'No analysis available.' });
    }
    setResults(plagiarismResults);
    setIsSubmitting(false);
  };
  
  const totalScore = results ? results.reduce((acc, result) => acc + (100 - result.score), 0) : 0;
  const maxScore = quiz.questions.length * 100;
  const finalMark = results ? (totalScore / maxScore * 100).toFixed(0) : 0;

  return (
    <div className="space-y-6">
      {results ? (
         <Card>
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
                <p className="text-lg text-muted-foreground">Final Mark</p>
                <p className="text-6xl font-bold tracking-tighter">{finalMark}%</p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {quiz.questions.map((q, index) => {
                const result = results[index];
                const isHighPlagiarism = result.score >= HIGH_PLAGIARISM_THRESHOLD;
                const isPlagiarized = result.score >= PLAGIARISM_THRESHOLD;
                const progressColor = isHighPlagiarism ? "hsl(var(--destructive))" : isPlagiarized ? "hsl(35, 91%, 55%)" : "hsl(var(--primary))";
                const alertVariant = isHighPlagiarism ? "destructive" : isPlagiarized ? "default" : "default";
                const alertClasses = isPlagiarized && !isHighPlagiarism ? "bg-amber-500/10 border-amber-500/50 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-700 dark:[&>svg]:text-amber-400" : "";
                return (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>
                      <span className="truncate">Q{index + 1}: {q.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p><strong>Your Answer:</strong> {studentAnswers[index]}</p>
                      <p><strong>Correct Answer:</strong> {q.answer}</p>
                       <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between gap-4">
                            <span className="font-medium">Plagiarism Score</span>
                            <span className="text-2xl font-bold" style={{ color: progressColor }}>
                                {result.score}%
                            </span>
                        </div>
                        <Progress value={result.score} className="h-3" style={{ "--primary-foreground": progressColor } as React.CSSProperties} />
                         <Alert variant={alertVariant} className={alertClasses}>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Plagiarism Analysis</AlertTitle>
                            <AlertDescription>{result.reason}</AlertDescription>
                        </Alert>
                       </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
          <CardFooter>
            <Button onClick={onStartOver} variant="outline" size="lg">Start New Quiz</Button>
          </CardFooter>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {quiz.questions.map((q, index) => (
            <div key={index} className="space-y-2">
              <label htmlFor={`question-${index}`} className="font-medium">
                {index + 1}. {q.question}
              </label>
              <Textarea
                id={`question-${index}`}
                value={studentAnswers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="Your answer here..."
                className="min-h-[100px] text-base"
                required
              />
            </div>
          ))}
          <div className="flex justify-between items-center pt-4">
            <Button onClick={onStartOver} variant="outline" type="button">Back</Button>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Answers'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
