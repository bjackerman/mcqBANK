'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Test, UserAnswer } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, ChevronsRight, Home, FileDown, Repeat } from 'lucide-react';
import { generatePdf } from '@/lib/pdf-generator';
import Link from 'next/link';

interface TestResultsProps {
  testId: string;
}

interface Results {
  test: Test;
  userAnswers: UserAnswer[];
}

export function TestResults({ testId }: TestResultsProps) {
  const router = useRouter();
  const [results, setResults] = useState<Results | null>(null);
  const [score, setScore] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const resultsData = localStorage.getItem(`test-results-${testId}`);
    if (resultsData) {
      const parsedResults: Results = JSON.parse(resultsData);
      setResults(parsedResults);

      let correctCount = 0;
      parsedResults.test.questions.forEach(q => {
        const userAnswer = parsedResults.userAnswers.find(ua => ua.questionId === q.id);
        if (userAnswer && userAnswer.answer === q.correctAnswer) {
          correctCount++;
        }
      });
      setScore((correctCount / parsedResults.test.questions.length) * 100);
    }
  }, [testId]);

  if (!isMounted) {
    return <div className="flex h-screen items-center justify-center">Calculating results...</div>;
  }
  
  if (!results) {
    return <div className="flex h-screen items-center justify-center">Results not found.</div>;
  }

  const handleExportPdf = () => {
    generatePdf(results.test);
  };

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-headline">Test Complete!</CardTitle>
          <CardDescription>You scored</CardDescription>
          <p className={`text-6xl font-bold ${score >= 70 ? 'text-green-600' : 'text-destructive'}`}>
            {score.toFixed(0)}%
          </p>
        </CardHeader>
        <CardContent>
          <h3 className="mb-4 text-lg font-semibold">Review Your Answers</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-4">
            {results.test.questions.map(q => {
              const userAnswer = results.userAnswers.find(ua => ua.questionId === q.id);
              const isCorrect = userAnswer?.answer === q.correctAnswer;
              return (
                <div key={q.id} className="rounded-md border p-4">
                  <p className="font-medium">{q.questionText}</p>
                  <div className={`mt-2 flex items-center ${isCorrect ? 'text-green-600' : 'text-destructive'}`}>
                    {isCorrect ? <Check className="h-5 w-5 mr-2" /> : <X className="h-5 w-5 mr-2" />}
                    <p className="text-sm">
                      Your answer: <span className="font-semibold">{userAnswer?.answer || 'Not answered'}</span>
                    </p>
                  </div>
                  {!isCorrect && (
                    <div className="mt-1 flex items-center text-green-600">
                        <ChevronsRight className="h-5 w-5 mr-2"/>
                        <p className="text-sm">Correct answer: <span className="font-semibold">{q.correctAnswer}</span></p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2 justify-center pt-6">
            <Button onClick={handleExportPdf}>
                <FileDown className="mr-2 h-4 w-4" />
                Export to PDF
            </Button>
            <Button variant="outline" asChild>
                <Link href="/test/generate">
                    <Repeat className="mr-2 h-4 w-4" />
                    Take Another Test
                </Link>
            </Button>
            <Button variant="secondary" asChild>
                <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
