import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestForgeLogo } from '@/components/icons';
import { BookOpen, User } from 'lucide-react';

export default function QuizHomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="p-4 border-b">
        <div className="container mx-auto flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <TestForgeLogo className="h-6 w-6" />
            <span className="text-xl font-bold">SimiText</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-8 p-4 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center gap-4">
            <TestForgeLogo className="h-16 w-16 text-primary" />
            <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">
              Quick Test
            </h1>
          </div>
          <p className="text-lg text-muted-foreground md:text-xl">
            AI-powered test generation and plagiarism detection. Create engaging
            <br />
            assessments for students, effortlessly.
          </p>
        </div>

        <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="text-left shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                For Teachers
              </CardTitle>
              <CardDescription>
                Upload content, generate tests, and review student results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/teacher">
                <Button size="lg" className="w-full">
                  Teacher Portal
                  <span aria-hidden="true" className="ml-2">→</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="text-left shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                For Students
              </CardTitle>
              <CardDescription>
                Take tests using a unique code provided by your teacher.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <Link href="/student">
                <Button size="lg" className="w-full">
                  Student Portal
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
