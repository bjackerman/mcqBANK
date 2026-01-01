'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { mockQuestions } from '@/lib/data';
import { FlaskConical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  category: z.string().min(1, 'Please select a category.'),
  numQuestions: z.coerce.number().min(1, 'Must have at least 1 question.').max(50, 'Cannot exceed 50 questions.'),
  difficulty: z.string().optional(),
});

const categories = [...new Set(mockQuestions.filter(q => q.status === 'ready').map(q => q.category))];

export function TestGenerator() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: '',
      numQuestions: 10,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, this would create a test record in Firestore and fetch questions
    const availableQuestions = mockQuestions.filter(
      (q) =>
        q.status === 'ready' &&
        q.category === values.category &&
        (values.difficulty ? q.difficulty === values.difficulty : true)
    );

    if (availableQuestions.length < values.numQuestions) {
        toast({
            title: 'Not Enough Questions',
            description: `Only ${availableQuestions.length} questions available for this category. Please select a smaller number.`,
            variant: 'destructive',
        });
        return;
    }

    const selectedQuestions = availableQuestions.sort(() => 0.5 - Math.random()).slice(0, values.numQuestions);
    const testId = Date.now().toString();
    const newTest = {
        id: testId,
        title: values.title,
        questions: selectedQuestions,
        createdAt: new Date(),
    };
    
    // Store test in localStorage for retrieval on the test page
    localStorage.setItem(`test-${testId}`, JSON.stringify(newTest));

    toast({
        title: 'Test Generated!',
        description: 'Your test is ready. Redirecting you now.',
    });

    router.push(`/test/${testId}`);
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="font-headline">Test Details</CardTitle>
        <CardDescription>Fill out the form to create your test.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
             <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Biology Midterm" {...field} />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a question category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Questions</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Any Difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="All">Any Difficulty</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Filter questions by difficulty level.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              <FlaskConical className="mr-2 h-4 w-4" />
              Generate Test
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
