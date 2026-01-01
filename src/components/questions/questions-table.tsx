'use client';

import { useState, useEffect } from 'react';
import type { Question } from '@/lib/types';
import { mockQuestions } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '../ui/input';

export function QuestionsTable() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // In a real app, this would be a fetch from Firestore with a where('status', '==', 'ready') clause
    const readyQuestions = mockQuestions.filter(q => q.status === 'ready');
    setQuestions(readyQuestions);
  }, []);

  const filteredQuestions = questions.filter(
    (q) =>
      q.questionText.toLowerCase().includes(filter.toLowerCase()) ||
      q.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <Input
                placeholder="Filter questions..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="max-w-sm"
            />
        </div>
        <div className="rounded-md border">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>
                <span className="sr-only">Actions</span>
                </TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {filteredQuestions.length > 0 ? (
                filteredQuestions.map(question => (
                <TableRow key={question.id}>
                    <TableCell className="font-medium max-w-lg truncate">{question.questionText}</TableCell>
                    <TableCell>
                    <Badge variant="outline">{question.category}</Badge>
                    </TableCell>
                    <TableCell>
                    <Badge variant={
                        question.difficulty === 'Easy' ? 'default' :
                        question.difficulty === 'Medium' ? 'secondary' :
                        'destructive'
                    } className={
                      question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                        {question.difficulty}
                    </Badge>
                    </TableCell>
                    <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                    No results.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
    </div>
  );
}
