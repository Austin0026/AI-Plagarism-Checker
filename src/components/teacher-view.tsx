'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createQuiz } from '@/app/actions';
import type { GenerateQuizOutput } from '@/ai/flows/generate-quiz';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Slider } from './ui/slider';

const initialState = {
  quiz: undefined,
  error: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full text-lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating Quiz...
        </>
      ) : (
        'Generate Quiz'
      )}
    </Button>
  );
}

interface TeacherViewProps {
  onQuizGenerated: (quiz: GenerateQuizOutput) => void;
}

export function TeacherView({ onQuizGenerated }: TeacherViewProps) {
  const [state, formAction] = useActionState(createQuiz, initialState);
  const { toast } = useToast();
  
  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
    if (state.quiz) {
      onQuizGenerated(state.quiz);
    }
  }, [state, onQuizGenerated, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="topic">Topic</Label>
        <Input
          id="topic"
          name="topic"
          placeholder="e.g., Photosynthesis, The American Revolution"
          required
          className="text-base"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Paste the content/article for the quiz here. (Min 200 characters)"
          className="min-h-[250px] resize-y text-base"
          required
        />
      </div>
       <div className="space-y-2">
        <Label htmlFor="questionCount">Number of Questions (1-10)</Label>
        <Slider
          id="questionCount"
          name="questionCount"
          min={1}
          max={10}
          defaultValue={[3]}
          step={1}
        />
      </div>
      <div className="flex justify-center pt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
