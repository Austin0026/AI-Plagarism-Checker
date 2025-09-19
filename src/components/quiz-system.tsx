'use client';

import { useState } from 'react';
import type { GenerateQuizOutput } from '@/ai/flows/generate-quiz';
import { TeacherView } from './teacher-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Copy, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveQuiz } from '@/app/actions';

export function QuizSystem() {
  const [quiz, setQuiz] = useState<GenerateQuizOutput | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [view, setView] = useState<'teacher' | 'student'>('teacher');
  const [quizCode, setQuizCode] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleQuizGenerated = (generatedQuiz: GenerateQuizOutput, quizTopic: string) => {
    setQuiz(generatedQuiz);
    setTopic(quizTopic);
    setView('student');
  };

  const handleStartOver = () => {
    setQuiz(null);
    setTopic(null);
    setQuizCode(null);
    setView('teacher');
  }

  const handleShare = async () => {
    if (!quiz || !topic) return;

    setIsSaving(true);
    const result = await saveQuiz({ ...quiz, topic });
    setIsSaving(false);

    if (result.code) {
      setQuizCode(result.code);
      setIsShareModalOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to save the quiz.",
      });
    }
  };
  
  const copyToClipboard = () => {
    if (quizCode) {
      navigator.clipboard.writeText(quizCode);
      toast({
        title: "Copied to clipboard!",
        description: `Quiz code ${quizCode} is ready to be shared.`,
      });
    }
  }


  return (
    <>
      <Card className="shadow-lg mt-6 w-full">
        <CardHeader>
          <CardTitle>Create a New Quiz</CardTitle>
          <CardDescription>
            {view === 'teacher' 
              ? 'Generate a quiz from a topic and content for your students.'
              : 'Review the generated quiz below. Students will only see the questions.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {view === 'teacher' && <TeacherView onQuizGenerated={handleQuizGenerated} />}
          {view === 'student' && quiz && (
            <div>
              <h2 className="text-2xl font-bold mb-4">{topic}</h2>
              <Accordion type="single" collapsible className="w-full">
                {quiz.questions.map((q, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>
                      <span className="font-semibold">Q{index + 1}: {q.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="bg-muted/50 p-4 rounded-md">
                        <p className="font-semibold">Answer:</p>
                        <p className="text-muted-foreground">{q.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="mt-6 flex gap-4">
                <Button onClick={handleStartOver} variant="outline" size="lg">Create New Quiz</Button>
                <Button onClick={handleShare} size="lg" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Share with Students
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share this quiz!</AlertDialogTitle>
            <AlertDialogDescription>
              Give the following code to your students. They can use it in the Student Portal to take the quiz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 p-4 bg-muted rounded-lg flex items-center justify-between">
            <span className="text-2xl font-bold tracking-widest">{quizCode}</span>
            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
              <Copy className="h-5 w-5" />
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction>Done</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
