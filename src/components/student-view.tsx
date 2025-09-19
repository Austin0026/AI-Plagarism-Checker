// This is a placeholder file. The student quiz-taking functionality will be built out here.
'use client';

import type { GenerateQuizOutput } from '@/ai/flows/generate-quiz';

interface StudentViewProps {
  quiz: GenerateQuizOutput;
  onStartOver: () => void;
}

export function StudentView({ quiz, onStartOver }: StudentViewProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Student View</h2>
      <p>This is where students will take the quiz.</p>
    </div>
  );
}
