'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Test, UserAnswer } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import Link from 'next/link';

interface TestPlayerProps {
  testId: string;
}

export function TestPlayer({ testId }: TestPlayerProps) {
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const testData = localStorage.getItem(`test-${testId}`);
    if (testData) {
      const parsedTest = JSON.parse(testData);
      setTest(parsedTest);
    }
  }, [testId]);

  if (!isMounted) {
    return <div className="flex h-screen items-center justify-center">Loading test...</div>;
  }
  
  if (!test) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Alert variant="destructive" className="max-w-md">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Test Not Found</AlertTitle>
                <AlertDescription>
                    The test you are looking for does not exist or has expired.
                    <Button asChild variant="link">
                        <Link href="/test/generate">Generate a new test</Link>
                    </Button>
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...userAnswers];
    const existingAnswerIndex = newAnswers.findIndex(a => a.questionId === currentQuestion.id);
    if (existingAnswerIndex > -1) {
      newAnswers[existingAnswerIndex].answer = value;
    } else {
      newAnswers.push({ questionId: currentQuestion.id, answer: value });
    }
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem(`test-results-${testId}`, JSON.stringify({ test, userAnswers }));
    router.push(`/test/${testId}/results`);
  };

  const selectedAnswer = userAnswers.find(a => a.questionId === currentQuestion.id)?.answer;

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl">
            <div className="mb-4 text-center">
                <h1 className="text-3xl font-bold font-headline">{test.title}</h1>
                <p className="text-muted-foreground">Question {currentQuestionIndex + 1} of {test.questions.length}</p>
            </div>
            <Progress value={progress} className="mb-8" />
            <Card>
                <CardHeader>
                <CardTitle className="text-xl font-medium font-body leading-relaxed">{currentQuestion.questionText}</CardTitle>
                </CardHeader>
                <CardContent>
                <RadioGroup onValueChange={handleAnswerChange} value={selectedAnswer}>
                    {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 rounded-md border p-4 transition-colors hover:bg-accent/50 has-[[data-state=checked]]:bg-accent/80">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                        {option}
                        </Label>
                    </div>
                    ))}
                </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                    Previous
                </Button>
                {currentQuestionIndex === test.questions.length - 1 ? (
                    <Button onClick={handleFinish}>Finish Test</Button>
                ) : (
                    <Button onClick={handleNext}>Next</Button>
                )}
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
