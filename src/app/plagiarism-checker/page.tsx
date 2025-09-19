import { PlagiarismChecker } from '@/components/plagiarism-checker';
import { TestForgeLogo } from '@/components/icons';
import Link from 'next/link';
import { Scale } from 'lucide-react';

export default function PlagiarismCheckerPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <header className="p-4 border-b bg-background">
        <div className="container mx-auto flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <TestForgeLogo className="h-6 w-6" />
            <span className="text-xl font-bold">SimiText</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <div className="flex items-center gap-3">
             <Scale className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tighter">
              AI Plagiarism Checker
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Compare two texts to check for plagiarism and semantic similarity.
          </p>
        </div>

        <div className="mx-auto w-full max-w-6xl">
          <PlagiarismChecker />
        </div>
      </main>
    </div>
  );
}
