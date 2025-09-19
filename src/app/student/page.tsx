'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TestForgeLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function StudentPage() {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.trim()) {
      router.push(`/student/${code.trim()}`);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
       <header className="p-4 border-b bg-background">
        <div className="container mx-auto flex items-center gap-2">
          <Link href="/quiz" className="flex items-center gap-2">
            <TestForgeLogo className="h-6 w-6" />
            <span className="text-xl font-bold">Quick Test</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Student Portal</CardTitle>
                <CardDescription>Enter the code from your teacher to begin the test.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="test-code">Test Code</Label>
                        <Input 
                          id="test-code" 
                          placeholder="Enter code here" 
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full" size="lg">Start Test</Button>
                </form>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
