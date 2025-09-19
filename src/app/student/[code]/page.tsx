import { StudentQuiz } from '@/components/student-quiz';
import { TestForgeLogo } from '@/components/icons';
import Link from 'next/link';

// This is mock data. In a real application, you would fetch this from a database
// using the quiz code from the URL.
const MOCK_QUIZ_DATA = {
  topic: 'The American Revolution',
  questions: [
    {
      question: 'What was the primary cause of the Boston Tea Party?',
      answer: 'The primary cause of the Boston Tea Party was the 1773 Tea Act, which allowed the British East India Company to sell tea from China in American colonies without paying taxes apart from the Townshend Acts.',
    },
    {
      question: 'Who was the main author of the Declaration of Independence?',
      answer: 'The main author of the Declaration of Independence was Thomas Jefferson.',
    },
    {
      question: 'What battle is considered the turning point of the American Revolution?',
      answer: 'The Battle of Saratoga, which occurred in 1777, is widely considered the turning point of the American Revolution.',
    },
  ],
};


interface StudentQuizPageProps {
  params: {
    code: string;
  };
}

export default function StudentQuizPage({ params }: StudentQuizPageProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <header className="p-4 border-b bg-background">
        <div className="container mx-auto flex items-center gap-2">
          <Link href="/quiz" className="flex items-center gap-2">
            <TestForgeLogo className="h-6 w-6" />
            <span className="text-xl font-bold">TestForge</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
        <StudentQuiz code={params.code} quizData={MOCK_QUIZ_DATA} />
      </main>
    </div>
  );
}
