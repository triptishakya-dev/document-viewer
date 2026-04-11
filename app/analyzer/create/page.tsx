"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const CreateAnalyzerContent = () => {
  const searchParams = useSearchParams();
  const analyzerName = searchParams.get('username') || searchParams.get('analyzer') || 'PDF Analyzer';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans selection:bg-indigo-500/30">
      <div className="w-full max-w-sm text-center space-y-12">
        {/* Name Greeting */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 uppercase tracking-widest">
            {analyzerName}
          </h1>
          <div className="h-px w-12 bg-indigo-500 mx-auto mt-4 opacity-50"></div>
        </div>

        {/* Primary Action */}
        <div className="animate-in fade-in zoom-in-95 delay-200 duration-700 fill-mode-both">
          <button 
            onClick={() => alert('Initializing analyzer environment...')}
            className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-300 bg-indigo-600 rounded-2xl hover:bg-indigo-500 active:scale-95 shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:shadow-[0_0_60px_rgba(79,70,229,0.5)]"
          >
            PDF Analyzer
            <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AnalyzerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>}>
      <CreateAnalyzerContent />
    </Suspense>
  );
}
