import { PlagiarismChecker } from '@/components/plagiarism-checker';
import { QuizSystem } from '@/components/quiz-system';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-6xl gap-2 pt-8 text-center">
          <h1 className="text-3xl font-bold tracking-tighter md:text-5xl">
            AI Plagiarism & Quiz Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Check for semantic similarity or generate a quiz from your content.
          </p>
        </div>

        <div className="mx-auto w-full max-w-6xl">
          <Tabs defaultValue="plagiarism-checker">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="plagiarism-checker">Plagiarism Checker</TabsTrigger>
              <TabsTrigger value="quiz-generator">Quiz Generator</TabsTrigger>
            </TabsList>
            <TabsContent value="plagiarism-checker">
              <PlagiarismChecker />
            </TabsContent>
            <TabsContent value="quiz-generator">
              <QuizSystem />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
