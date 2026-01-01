'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2, Wand2, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { verifyNewAnswer } from '@/ai/flows/verify-new-answer';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const formSchema = z.object({
  questionText: z.string().min(10, 'Question must be at least 10 characters.'),
  options: z.array(z.object({ value: z.string().min(1, 'Option cannot be empty.') })).min(2, 'Must have at least 2 options.'),
  correctAnswer: z.string().min(1, 'Please select a correct answer.'),
  category: z.string().min(1, 'Category is required.'),
});

type AIResponse = {
  isCorrect: boolean;
  reasoning: string;
  flagForReview: boolean;
} | null;

export function NewQuestionForm() {
  const [open, setOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionText: '',
      options: [{ value: '' }, { value: '' }],
      correctAnswer: '',
      category: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options',
  });

  const watchOptions = form.watch('options');
  const watchCorrectAnswer = form.watch('correctAnswer');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsVerifying(true);
    setAiResponse(null);
    try {
      const result = await verifyNewAnswer({
        question: values.questionText,
        answer: values.correctAnswer,
      });
      setAiResponse(result);
      
      if (result && !result.flagForReview) {
        // In a real app, save to Firestore here
        toast({
          title: 'Question Verified and Added!',
          description: 'The new question is ready for use.',
        });
        setTimeout(() => {
          setOpen(false);
          form.reset();
          setAiResponse(null);
        }, 2000);
      } else {
         toast({
          title: 'Verification Complete',
          description: 'Review the AI feedback before proceeding.',
          variant: 'default',
        });
      }

    } catch (error) {
      console.error('Failed to verify answer:', error);
      toast({
        title: 'Verification Failed',
        description: 'Could not get a response from the AI. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAddNewQuestion = () => {
     // In a real app, save to Firestore here, with status = 'flagged' or 'needs-review'
    toast({
      title: 'Question Added for Review',
      description: 'The new question has been sent to the Holding Pen.',
    });
    setOpen(false);
    form.reset();
    setAiResponse(null);
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        form.reset();
        setAiResponse(null);
      }
    }}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle />
          New Question
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline">Add New Question</DialogTitle>
          <DialogDescription>
            Enter the details for the new question. The answer will be verified by AI.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="questionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., What is the capital of Japan?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Options</FormLabel>
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`options.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 mt-2">
                      <FormControl>
                        <Input {...field} placeholder={`Option ${index + 1}`} />
                      </FormControl>
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 2}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ value: '' })}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="correctAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correct Answer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={watchOptions.some(o => !o.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the answer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {watchOptions.map((option, index) => (
                          option.value && <SelectItem key={index} value={option.value}>{option.value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Geography" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {aiResponse && (
              <Alert variant={aiResponse.isCorrect ? 'default' : 'destructive'}>
                {aiResponse.isCorrect ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                <AlertTitle>AI Verification Result</AlertTitle>
                <AlertDescription>{aiResponse.reasoning}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              {aiResponse?.flagForReview ? (
                <Button type="button" onClick={handleAddNewQuestion}>
                  Add to Holding Pen Anyway
                </Button>
              ) : (
                <Button type="submit" disabled={isVerifying || !watchCorrectAnswer}>
                  {isVerifying ? <Loader className="animate-spin" /> : <Wand2 />}
                  Verify & Add Question
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
