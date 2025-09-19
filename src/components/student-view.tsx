'use client';

import { useState } from 'react';
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

const CORRECTNESS_THRESHOLD = 70;
const HIGH_CORRECTNESS_THRESHOLD = 90;

const initialState = { score: undefined, reason: undefined, error: undefined };

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

      if (studentAnswer.trim().length < 10) {
         plagiarismResults.push({ score: 0, reason: 'Answer is too short to be evaluated for correctness.' });
         continue;
      }
      
      const formData = new FormData();
      formData.append('text1', studentAnswer.length < 100 ? studentAnswer.padEnd(100, ' ') : studentAnswer);
      formData.append('text2', correctAnswer.length < 100 ? correctAnswer.padEnd(100, ' ') : correctAnswer);
      
      const result = await checkPlagiarism(initialState, formData);
      plagiarismResults.push({ score: result.score ?? 0, reason: result.reason ?? 'No analysis available.' });
    }
    setResults(plagiarismResults);
    setIsSubmitting(false);
  };
  
  const totalScore = results ? results.reduce((acc, result) => acc + result.score, 0) : 0;
  const maxScore = quiz.questions.length * 100;
  const finalMark = results ? (totalScore / maxScore * 100).toFixed(0) : 0;

  return (
    <div className="space-y-6">
      {results ? (
         <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-secondary rounded-lg">
                <p className="text-lg font-medium text-muted-foreground">Final Mark</p>
                <p className="text-6xl font-bold tracking-tighter text-primary">{finalMark}%</p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {quiz.questions.map((q, index) => {
                const result = results[index];
                const isHighCorrectness = result.score >= HIGH_CORRECTNESS_THRESHOLD;
                const isCorrect = result.score >= CORRECTNESS_THRESHOLD;
                const progressColor = isHighCorrectness ? "hsl(var(--primary))" : isCorrect ? "hsl(35, 91%, 55%)" : "hsl(var(--destructive))";
                
                const getResultTitle = () => {
                  if (isHighCorrectness) return "Excellent";
                  if (isCorrect) return "Good";
                  return "Needs Improvement";
                };

                return (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full pr-2">
                        <span className="truncate flex-1 text-left">Q{index + 1}: {q.question}</span>
                        <span className="font-bold text-lg" style={{ color: progressColor }}>{result.score}%</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 p-4 bg-muted/50 rounded-md">
                      <div>
                        <p className="font-semibold">Your Answer:</p>
                        <p className="text-muted-foreground">{studentAnswers[index]}</p>
                      </div>
                       <div>
                        <p className="font-semibold">Suggested Answer:</p>
                        <p className="text-muted-foreground">{q.answer}</p>
                      </div>
                       <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between gap-4">
                            <span className="font-medium text-lg">Correctness Score</span>
                        </div>
                        <Progress value={result.score} className="h-3" style={{ "--primary-foreground": progressColor } as React.CSSProperties} />
                         <Alert className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>{getResultTitle()}</AlertTitle>
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
            <Button onClick={onStartOver} variant="outline" size="lg" className="w-full">Start New Quiz</Button>
          </CardFooter>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {quiz.questions.map((q, index) => (
            <div key={index} className="space-y-2">
              <label htmlFor={`question-${index}`} className="font-medium text-lg">
                {index + 1}. {q.question}
              </label>
              <Textarea
                id={`question-${index}`}
                value={studentAnswers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="Your answer here..."
                className="min-h-[120px] text-base"
                required
              />
            </div>
          ))}
          <div className="flex justify-between items-center pt-4">
            <Button onClick={onStartOver} variant="outline" type="button" size="lg">Back</Button>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Answers'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
