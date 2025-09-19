import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestForgeLogo } from '@/components/icons';
import { BookOpen, Scale } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="p-4 border-b">
        <div className="container mx-auto flex items-center gap-2">
          
          <span className="text-xl font-bold"></span>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-8 p-4 text-center">
        <div className="space-y-4">
          <p className="text-lg text-muted-foreground md:text-xl">
            Powerful AI tools for plagiarism detection and quiz generation.
          </p>
        </div>

        <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="text-left shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-6 w-6 text-primary" />
                Plagiarism Checker
              </CardTitle>
              <CardDescription>
                Analyze two texts for semantic similarity and detect potential plagiarism.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/plagiarism-checker">
                <Button size="lg" className="w-full">
                  Open Plagiarism Checker
                  <span aria-hidden="true" className="ml-2">→</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="text-left shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Quick Test
              </CardTitle>
              <CardDescription>
                Generate quizzes for students and analyze the plagiarism score.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <Link href="/quiz">
                <Button size="lg" className="w-full">
                  Open Quiz System
                  <span aria-hidden="true" className="ml-2">→</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
