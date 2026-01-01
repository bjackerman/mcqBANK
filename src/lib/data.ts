import type { Question } from './types';

export const mockQuestions: Question[] = [
  {
    id: '1',
    questionText: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Mitochondrion', 'Ribosome', 'Endoplasmic Reticulum'],
    correctAnswer: 'Mitochondrion',
    category: 'Biology',
    difficulty: 'Easy',
    status: 'ready',
    aiVerified: true,
  },
  {
    id: '2',
    questionText: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Madrid', 'Paris'],
    correctAnswer: 'Paris',
    category: 'Geography',
    difficulty: 'Easy',
    status: 'ready',
  },
  {
    id: '3',
    questionText: 'Solve for x: 2x + 3 = 11',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    category: 'Mathematics',
    difficulty: 'Easy',
    status: 'ready',
  },
  {
    id: '4',
    questionText: 'Who wrote "Hamlet"?',
    options: ['Charles Dickens', 'William Shakespeare', 'Leo Tolstoy', 'Mark Twain'],
    category: 'Literature',
    difficulty: 'Medium',
    status: 'needs-review', // Missing answer
  },
  {
    id: '5',
    questionText: 'What is the chemical symbol for Gold?',
    options: ['Ag', 'Go', 'Au', 'Gd'],
    correctAnswer: 'Ag', // Incorrect answer
    category: 'Chemistry',
    difficulty: 'Medium',
    status: 'flagged',
    aiVerified: false,
    aiReasoning: 'The provided answer "Ag" is the symbol for Silver. The correct symbol for Gold is "Au".',
  },
  {
    id: '6',
    questionText: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Mars',
    category: 'Astronomy',
    difficulty: 'Easy',
    status: 'ready',
  },
  {
    id: '7',
    questionText: 'What is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    category: 'Geography',
    difficulty: 'Easy',
    status: 'needs-review', // Missing answer
  },
  {
    id: '8',
    questionText: 'In what year did the Titanic sink?',
    options: ['1905', '1912', '1918', '1923'],
    correctAnswer: '1912',
    category: 'History',
    difficulty: 'Medium',
    status: 'ready',
  },
];
