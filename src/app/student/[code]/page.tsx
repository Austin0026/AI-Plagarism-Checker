import { TestForgeLogo } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface StudentQuizPageProps {
  params: {
    code: string;
  };
}

export default function StudentQuizPage({ params }: StudentQuizPageProps) {
  // In a real application, you would fetch the quiz data using the code.
  // For this prototype, we'll just display a placeholder.

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
        <Card className="w-full max-w-2xl shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Quiz Time!</CardTitle>
                <CardDescription>Test Code: <span className="font-mono font-bold">{params.code}</span></CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center p-8">
                  <p className="text-muted-foreground">The quiz taking interface will be built here.</p>
                  <p className="text-muted-foreground mt-2">For now, this page confirms that you've entered a code.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
