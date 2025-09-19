'use client';

import { useState } from 'react';
import type { GenerateQuizOutput } from '@/ai/flows/generate-quiz';
import { TeacherView } from './teacher-view';
import { StudentView } from './student-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function QuizSystem() {
  const [quiz, setQuiz] = useState<GenerateQuizOutput | null>(null);
  const [view, setView] = useState<'teacher' | 'student'>('teacher');
  
  const handleQuizGenerated = (generatedQuiz: GenerateQuizOutput) => {
    setQuiz(generatedQuiz);
    setView('student');
  };

  const handleStartOver = () => {
    setQuiz(null);
    setView('teacher');
  }

  return (
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
            <h2 className="text-2xl font-bold mb-4">Generated Quiz</h2>
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
              <Button size="lg">Share with Students</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Dummy components to avoid breaking the code, will be filled out later.
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from './ui/button';
