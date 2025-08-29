import { PlagiarismChecker } from '@/components/plagiarism-checker';
import { SimiTextLogo } from '@/components/icons';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <a href="/" className="mr-6 flex items-center space-x-2">
              <SimiTextLogo className="h-6 w-6" />
              <span className="font-bold">SimiText</span>
            </a>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-6xl gap-2 pt-8 text-center">
          <h1 className="text-3xl font-bold tracking-tighter md:text-5xl">
            AI Plagiarism Checker
          </h1>
          <p className="text-lg text-muted-foreground">
            Paste two texts below to check for semantic similarity and potential plagiarism.
          </p>
        </div>
        <PlagiarismChecker />
      </main>
    </div>
  );
}
