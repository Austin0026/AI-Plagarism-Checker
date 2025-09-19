'use client';

import { useState } from 'react';
import type { GenerateQuizOutput } from '@/ai/flows/generate-quiz';
import { TeacherView } from './teacher-view';
import { StudentView } from './student-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function QuizSystem() {
  const [quiz, setQuiz] = useState<GenerateQuizOutput | null>(null);
  const [view, setView] = useState<'teacher' | 'student'>('teacher');
  const [studentAnswers, setStudentAnswers] = useState<string[]>([]);
  const [results, setResults] = useState<{ score: number, reason: string }[] | null>(null);

  const handleQuizGenerated = (generatedQuiz: GenerateQuizOutput) => {
    setQuiz(generatedQuiz);
    setView('student');
    setStudentAnswers(new Array(generatedQuiz.questions.length).fill(''));
    setResults(null);
  };

  const handleStartOver = () => {
    setQuiz(null);
    setView('teacher');
    setStudentAnswers([]);
    setResults(null);
  }

  return (
    <Card className="shadow-lg mt-6">
      <CardHeader>
        <CardTitle>Quiz Generator</CardTitle>
        <CardDescription>
          {view === 'teacher' 
            ? 'Generate a quiz from a topic and content for your students.'
            : 'Answer the questions below.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {view === 'teacher' && <TeacherView onQuizGenerated={handleQuizGenerated} />}
        {view === 'student' && quiz && (
          <StudentView 
            quiz={quiz} 
            onStartOver={handleStartOver}
          />
        )}
      </CardContent>
    </Card>
  );
}
