/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SolutionStep {
  stepNumber: number;
  explanation: string;
  mathContent?: string;
}

export interface Question {
  id: number;
  text: string;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'Foundational' | 'Standard' | 'Challenge' | 'Proof' | 'Modelling';
  solutionSteps: SolutionStep[];
  finalAnswer: string;
  hint?: string;
  sourceChapter: number;
}

export interface ExerciseSet {
  chapter: number;
  chapterTitle: string;
  questions: Question[];
  tip?: string; // Global tip for the set (most difficult question)
}

export const CHAPTERS = [
  { id: 1, title: 'Algebra' },
  { id: 2, title: 'Logarithmic and Exponential Functions' },
  { id: 3, title: 'Trigonometry' },
  { id: 4, title: 'Differentiation' },
  { id: 5, title: 'Integration' },
  { id: 6, title: 'Numerical Solutions of Equations' },
  { id: 7, title: 'Further Algebra' },
  { id: 8, title: 'Further Calculus' },
  { id: 9, title: 'Vectors' },
  { id: 10, title: 'Differential Equations' },
  { id: 11, title: 'Complex Numbers' },
];
