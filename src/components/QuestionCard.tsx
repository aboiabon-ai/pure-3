/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Award, Info } from 'lucide-react';
import { Question } from '../types';
import { MathRenderer } from './MathRenderer';

interface QuestionCardProps {
  question: Question;
  isHardest?: boolean;
  tip?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, isHardest, tip }) => {
  const [showSolution, setShowSolution] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);

  const difficultyColors = {
    easy: 'text-green-700 bg-green-50 border-green-100',
    medium: 'text-amber-700 bg-amber-50 border-amber-100',
    hard: 'text-rose-700 bg-rose-50 border-rose-100',
  };

  const toggleSolution = () => {
    if (!showSolution) {
      setShowSolution(true);
      setVisibleSteps(1);
    } else {
      setShowSolution(false);
      setVisibleSteps(0);
    }
  };

  const nextStep = () => {
    if (visibleSteps < question.solutionSteps.length) {
      setVisibleSteps(v => v + 1);
    }
  };

  const revealAll = () => {
    setVisibleSteps(question.solutionSteps.length);
  };

  return (
    <motion.div
      layout
      className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full border ${difficultyColors[question.difficulty]}`}>
              {question.difficulty}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5 tracking-wider">
              <Award className="w-3 h-3" />
              {question.marks} MARKS
            </span>
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-widest leading-none">
              {question.type}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-300 tracking-tighter uppercase font-mono">Question {question.id}</span>
        </div>

        <div className="mb-8">
          <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4">Problem Statement</div>
          <MathRenderer content={question.text} className="text-xl font-medium leading-relaxed text-slate-800 font-sans" />
          
          <div className="mt-8 py-10 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100/50 relative overflow-hidden">
             <div className="absolute inset-0 opacity-5 select-none pointer-events-none flex items-center justify-center">
                <div className="text-9xl font-serif italic text-indigo-900">Σ</div>
             </div>
             <MathRenderer content={`$$${question.text.includes('\\int') ? '\\int f(x)dx' : 'ax^2 + bx + c = 0'}$$`} className="text-slate-200 text-6xl opacity-20 pointer-events-none select-none italic font-serif" />
          </div>
        </div>

        {isHardest && tip && (
          <div className="mb-8 p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex gap-4 text-indigo-700 text-sm leading-relaxed">
            <Info className="w-5 h-5 flex-shrink-0 text-indigo-400 mt-0.5" />
            <p><strong className="font-bold">Tutor Tip:</strong> <span className="italic">{tip}</span></p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!showSolution ? (
             <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-100 rounded-3xl border border-dashed border-slate-300 p-10 text-center flex flex-col items-center justify-center"
             >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-slate-400">
                   <ChevronDown className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 font-sans tracking-tight">Solution Hidden</h3>
                <p className="text-sm text-slate-500 mb-8 max-w-[240px] leading-snug">Solve the problem on paper before verifying your steps.</p>
                <button
                  onClick={toggleSolution}
                  className="px-10 py-3.5 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                  id={`btn-reveal-${question.id}`}
                >
                  Reveal Model Solution
                </button>
             </motion.div>
          ) : (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="overflow-hidden"
            >
              <div className="pt-8 border-t border-slate-100 mt-4 px-2">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Explanatory Solution</h4>
                  <div className="flex gap-3">
                    <button 
                      onClick={revealAll}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase"
                    >
                      Show All
                    </button>
                    <button 
                      onClick={toggleSolution}
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase"
                    >
                      Hide
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {question.solutionSteps.slice(0, visibleSteps).map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-6 items-start group"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                        {step.stepNumber}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-slate-600 font-medium mb-3 leading-relaxed">
                          {step.explanation}
                        </p>
                        {step.mathContent && (
                          <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 inline-block min-w-[200px]">
                            <MathRenderer content={step.mathContent} className="text-indigo-900" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {visibleSteps < question.solutionSteps.length ? (
                    <button
                      onClick={nextStep}
                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm hover:border-indigo-300 hover:text-indigo-500 transition-all flex items-center justify-center gap-2"
                    >
                      Next Logical Step <ChevronDown className="w-4 h-4" />
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-10 p-6 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Award className="w-20 h-20" />
                      </div>
                      <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Final Verification</h5>
                      <div className="text-2xl font-black tracking-tight flex items-baseline gap-2">
                        <span className="text-slate-400 text-sm font-medium italic">Ans:</span>
                        <MathRenderer content={question.finalAnswer} />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

