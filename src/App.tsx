/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Loader2, 
  RefreshCcw, 
  Sparkles,
  Trophy,
  History
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { QuestionCard } from './components/QuestionCard';
import { ExerciseSet, CHAPTERS } from './types';
import { generateExercise } from './services/geminiService';

 export default function App() {
  const [view, setView] = useState<'dashboard' | 'exercise'>('dashboard');
  const [exercise, setExercise] = useState<ExerciseSet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartExercise = async (id: number, title: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateExercise(id, title);
      setExercise(data);
      setView('exercise');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError("Failed to generate exercise. Please check your API key or try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setView('dashboard');
    setExercise(null);
  };

  const handleRetry = () => {
    if (exercise) {
      handleStartExercise(exercise.chapter, exercise.chapterTitle);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 border border-slate-200">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-40 relative">
        <div className="p-7 border-b border-slate-100">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleBack}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3 group-hover:rotate-0 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-slate-800 uppercase italic">
              Math<span className="text-indigo-600">Flow</span>
            </h1>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-1 overflow-y-auto overflow-x-hidden">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-3 mb-4">Exam Sections</div>
          {CHAPTERS.map(c => (
            <button
              key={c.id}
              onClick={() => handleStartExercise(c.id, c.title)}
              className={`w-full flex items-center text-left px-4 py-3 text-[13px] rounded-2xl transition-all duration-200 ${
                exercise?.chapter === c.id 
                ? 'bg-indigo-600 text-white font-black shadow-lg shadow-indigo-100 translate-x-1' 
                : 'text-slate-600 font-bold hover:bg-slate-100 hover:translate-x-1'
              }`}
            >
              <span className="opacity-40 mr-3 text-[10px] font-mono whitespace-nowrap">CH {c.id.toString().padStart(2, '0')}</span>
              <span className="truncate">{c.title}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-slate-100">
          <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Rank</div>
               <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-black mb-4 tracking-tight tabular-nums">78% Mastery</div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '78%' }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="bg-indigo-500 h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-slate-50/50 overflow-hidden relative">
        {/* Progress Background Accent */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10" />

        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between z-30 sticky top-0">
          <div className="flex items-center gap-5 text-[11px] font-black uppercase tracking-[0.2em]">
            <span className="text-slate-400">CURRICULUM</span>
            <span className="text-slate-200">/</span>
            <span className="text-slate-900 font-black">
              {view === 'dashboard' ? 'Overview' : `Exercise ${exercise?.chapter.toString().padStart(2, '0')}`}
            </span>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[11px] font-black text-slate-600 tracking-widest">LIVE SESSION</span>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 font-black text-sm shadow-inner italic">
              AB
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-20">
          <AnimatePresence mode="wait">
            {view === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Dashboard onSelectChapter={handleStartExercise} />
              </motion.div>
            ) : (
              <motion.div
                key="exercise"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-4xl mx-auto px-10 py-16"
              >
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 mb-16">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <button
                        onClick={handleBack}
                        className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all"
                       >
                          <ChevronLeft className="w-5 h-5" />
                       </button>
                       <span className="px-5 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-[11px] font-black text-indigo-700 tracking-widest uppercase">
                        Practice Mode Active
                       </span>
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                        Chapter {exercise?.chapter}: {exercise?.chapterTitle}
                      </h2>
                      <p className="text-slate-500 font-medium mt-1 text-lg">Detailed analytical problem set generated using coursedata patterns.</p>
                    </div>
                  </div>

                  <button
                    onClick={handleRetry}
                    disabled={isLoading}
                    className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white hover:bg-slate-900 disabled:opacity-50 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-indigo-100 border-b-4 border-indigo-800 active:translate-y-1 active:border-b-0"
                    id="btn-regenerate"
                  >
                    <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh Set
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-10 lg:pr-10">
                  {exercise?.questions.map((q, idx) => (
                    <QuestionCard 
                      key={idx} 
                      question={q} 
                      isHardest={q.difficulty === 'hard'} 
                      tip={exercise.tip}
                    />
                  ))}
                </div>

                <div className="mt-24 text-center">
                  <div className="inline-flex flex-col items-center p-12 bg-slate-900 rounded-[3rem] text-white shadow-2xl border border-slate-800 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-indigo-600 scale-0 group-hover:scale-110 transition-transform duration-700 rounded-full -z-10 origin-center opacity-10" />
                     <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-8 border border-slate-700 group-hover:rotate-12 transition-transform">
                        <Trophy className="w-10 h-10 text-amber-500" />
                     </div>
                     <h3 className="text-3xl font-black mb-4 tracking-tighter leading-tight">Ready for a new chapter?</h3>
                     <p className="text-slate-400 font-bold mb-10 max-w-sm mx-auto text-lg leading-relaxed">
                       Consistent structured practice is the single most effective way to A-Level success.
                     </p>
                     <button 
                      onClick={handleBack}
                      className="px-12 py-5 bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl transition-all shadow-[0_15px_30px_-10px_rgba(99,102,241,0.4)] hover:shadow-none"
                      id="btn-complete"
                     >
                       Return to Index
                     </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Improved Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center"
            >
              <div className="relative mb-12">
                <div className="w-28 h-28 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-black text-indigo-600 tracking-tighter text-3xl italic">
                  Σ
                </div>
                <div className="absolute -inset-4 bg-indigo-50 rounded-full -z-10 animate-ping opacity-20" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">Crunching Numbers...</h2>
              <p className="mt-4 text-slate-500 max-w-xs leading-relaxed font-bold uppercase tracking-[0.2em] text-[10px]">
                Selecting optimal problem sets from Chapter {CHAPTERS.find(c => c.id === exercise?.chapter)?.id || ''}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Improved Error Toast */}
        {error && (
          <div className="fixed bottom-10 right-10 z-[100] w-full max-w-md">
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-slate-900 text-white p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between border border-slate-700"
            >
              <div className="flex gap-4 items-center">
                 <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
                    <Info className="w-5 h-5 text-white" />
                 </div>
                 <p className="font-bold text-sm leading-snug tracking-tight text-slate-100">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="ml-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-[10px] font-black uppercase tracking-widest text-slate-400">
                Dismiss
              </button>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

