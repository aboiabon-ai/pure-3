/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { CHAPTERS } from '../types';

interface DashboardProps {
  onSelectChapter: (id: number, title: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectChapter }) => {
  return (
    <div className="max-w-6xl mx-auto px-10 py-16">
      <header className="mb-16 flex flex-col items-center text-center">
        <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-6 border border-indigo-100 animate-pulse">
           Cambridge A-Level Prep
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter leading-[1.1]">
          Cambridge <span className="text-indigo-600">Pure Mathematics</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl leading-relaxed font-sans font-medium">
          Master every concept through structured problem sets generated using coursebook standard analytics.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CHAPTERS.map((chapter, index) => (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.01 }}
            onClick={() => onSelectChapter(chapter.id, chapter.title)}
            className="group cursor-pointer bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-500 transition-all flex flex-col justify-between h-80 relative overflow-hidden"
            id={`chapter-card-${chapter.id}`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity translate-x-12 -translate-y-12" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-200 transition-all duration-300">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono text-indigo-400 font-bold tracking-tighter">PHASE {chapter.id.toString().padStart(2, '0')}</span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 group-hover:text-indigo-700 transition-colors tracking-tight">
                {chapter.title}
              </h3>
            </div>
            
            <div className="flex items-center text-indigo-600 font-black text-[10px] tracking-[0.2em] group-hover:text-indigo-800 transition-all relative z-10 uppercase">
              Begin Training
              <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-3 transition-transform duration-300" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
