'use client';

import { useState, useEffect } from 'react';
import type { Question } from '@/lib/types';
import { mockQuestions } from '@/lib/data';
import { QuestionCard } from '@/components/dashboard/question-card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export function HoldingPen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would be a fetch from Firestore
    const questionsToReview = mockQuestions.filter(q => q.status === 'needs-review' || q.status === 'flagged');
    setQuestions(questionsToReview);
  }, []);

  const handleGraduate = (questionId: string) => {
    setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionId));
    // Here you would update the question's status in Firestore
    toast({
      title: 'Question Graduated!',
      description: 'The question is now ready for use in tests.',
    });
  };

  const handleAnswerUpdate = (questionId: string, newAnswer: string) => {
    setQuestions(prevQuestions => 
      prevQuestions.map(q => 
        q.id === questionId ? { ...q, correctAnswer: newAnswer } : q
      )
    );
  };

  const needsReviewQuestions = questions.filter(q => q.status === 'needs-review');
  const flaggedQuestions = questions.filter(q => q.status === 'flagged');

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center h-[400px]">
        <h3 className="text-xl font-bold tracking-tight">All clear!</h3>
        <p className="text-sm text-muted-foreground">There are no questions that need your attention.</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="needs-review" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="needs-review">Needs Review ({needsReviewQuestions.length})</TabsTrigger>
        <TabsTrigger value="flagged">Flagged ({flaggedQuestions.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="needs-review">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
          {needsReviewQuestions.map(question => (
            <QuestionCard
              key={question.id}
              question={question}
              onGraduate={handleGraduate}
              onAnswerUpdate={handleAnswerUpdate}
            />
          ))}
        </div>
         {needsReviewQuestions.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center h-[400px]">
            <h3 className="text-xl font-bold tracking-tight">No questions need review</h3>
            <p className="text-sm text-muted-foreground">All questions have answers.</p>
          </div>
         )}
      </TabsContent>
      <TabsContent value="flagged">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
          {flaggedQuestions.map(question => (
            <QuestionCard
              key={question.id}
              question={question}
              onGraduate={handleGraduate}
              onAnswerUpdate={handleAnswerUpdate}
            />
          ))}
        </div>
        {flaggedQuestions.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center h-[400px]">
            <h3 className="text-xl font-bold tracking-tight">No questions are flagged</h3>
            <p className="text-sm text-muted-foreground">All reviewed questions seem correct.</p>
          </div>
         )}
      </TabsContent>
    </Tabs>
  );
}
