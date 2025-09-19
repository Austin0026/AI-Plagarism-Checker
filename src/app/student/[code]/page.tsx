import { StudentQuiz } from '@/components/student-quiz';
import { TestForgeLogo } from '@/components/icons';
import Link from 'next/link';
import { getQuiz } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface StudentQuizPageProps {
  params: {
    code: string;
  };
}

export default async function StudentQuizPage({ params }: StudentQuizPageProps) {
  const quizData = await getQuiz(params.code);

  const renderContent = () => {
    if (!quizData) {
      return (
         <Card className="w-full max-w-md">
           <CardHeader>
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Invalid quiz code. Please check the code and try again.
                </AlertDescription>
              </Alert>
           </CardHeader>
          <CardContent>
            <Link href="/student" className="text-center w-full block underline">
                Go back to Student Portal
            </Link>
          </CardContent>
         </Card>
      );
    }
    return <StudentQuiz code={params.code} quizData={quizData} />;
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <header className="p-4 border-b bg-background">
        <div className="container mx-auto flex items-center gap-2">
          <Link href="/quiz" className="flex items-center gap-2">
            <TestForgeLogo className="h-6 w-6" />
            <span className="text-xl font-bold">Quick Test</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
        {renderContent()}
      </main>
    </div>
  );
}
