'use client';

import { useState } from 'react';
import type { Question } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { predictMissingAnswers } from '@/ai/flows/predict-missing-answers';
import { Wand2, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


interface QuestionCardProps {
  question: Question;
  onGraduate: (questionId: string) => void;
  onAnswerUpdate: (questionId: string, newAnswer: string) => void;
}

export function QuestionCard({ question, onGraduate, onAnswerUpdate }: QuestionCardProps) {
  const [predictedAnswer, setPredictedAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(question.correctAnswer);

  const handlePredictAnswer = async () => {
    setIsLoading(true);
    try {
      const result = await predictMissingAnswers({
        questionText: question.questionText,
        options: question.options,
      });
      setPredictedAnswer(result.predictedAnswer);
    } catch (error) {
      console.error('Failed to predict answer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
    onAnswerUpdate(question.id, value);
  };
  
  const canGraduate = !!selectedAnswer;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-base font-medium font-body leading-relaxed">{question.questionText}</CardTitle>
        <CardDescription>
          <Badge variant="secondary">{question.category}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {question.status === 'flagged' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Flagged for Review</AlertTitle>
            <AlertDescription>
              {question.aiReasoning || "AI analysis suggests the original answer may be incorrect."}
            </AlertDescription>
          </Alert>
        )}

        {question.status === 'needs-review' && !predictedAnswer && (
          <Button onClick={handlePredictAnswer} disabled={isLoading} className="w-full">
            {isLoading ? <Loader className="animate-spin" /> : <Wand2 />}
            Predict Answer with AI
          </Button>
        )}

        {predictedAnswer && (
          <Alert>
             <Wand2 className="h-4 w-4" />
            <AlertTitle>AI Prediction</AlertTitle>
            <AlertDescription>
              The AI suggests the answer is: <strong className="font-semibold">{predictedAnswer}</strong>
            </AlertDescription>
          </Alert>
        )}

        <Select onValueChange={handleAnswerChange} value={selectedAnswer}>
          <SelectTrigger>
            <SelectValue placeholder="Select the correct answer" />
          </SelectTrigger>
          <SelectContent>
            {question.options.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onGraduate(question.id)} disabled={!canGraduate} className="w-full bg-green-600 hover:bg-green-700">
          <CheckCircle />
          Graduate Question
        </Button>
      </CardFooter>
    </Card>
  );
}
