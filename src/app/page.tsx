import { PlagiarismChecker } from '@/components/plagiarism-checker';
import { SimiTextLogo } from '@/components/icons';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
          <SimiTextLogo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">SimiText</h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">AI Plagiarism Checker</h1>
          <p className="text-muted-foreground">
            Paste two texts below to check for semantic similarity and potential plagiarism.
          </p>
        </div>
        <PlagiarismChecker />
      </main>
    </div>
  );
}
