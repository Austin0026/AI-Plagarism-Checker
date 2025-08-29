import { PlagiarismChecker } from '@/components/plagiarism-checker';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-6xl gap-2 pt-8">
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
