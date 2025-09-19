import { QuizSystem } from '@/components/quiz-system';
import { TestForgeLogo } from '@/components/icons';
import Link from 'next/link';

export default function TeacherPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <header className="p-4 border-b bg-background">
        <div className="container mx-auto flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <TestForgeLogo className="h-6 w-6" />
            <span className="text-xl font-bold">TestForge</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-4xl gap-2">
          <h1 className="text-3xl font-bold tracking-tighter">
            Teacher Portal
          </h1>
          <p className="text-lg text-muted-foreground">
            Create and manage quizzes for your students.
          </p>
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <QuizSystem />
        </div>
      </main>
    </div>
  );
}
