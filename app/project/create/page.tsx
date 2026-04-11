"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const CreateProjectContent = () => {
  const searchParams = useSearchParams();
  const filename = searchParams.get('filename') || 'Document';

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900/20 to-black flex flex-col items-center justify-center p-6 text-white font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10 text-center space-y-12">
        {/* Document Header */}
        <div className="animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="inline-flex items-center space-x-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-6 hover:bg-white/10 transition-colors cursor-default">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-6-6H7zm7 1.5L17.5 8H14V3.5z" />
            </svg>
            <span className="text-sm font-medium text-slate-300 truncate max-w-[200px] sm:max-w-md">
              {filename}
            </span>
          </div>

        </div>

        {/* Action Card */}
        <div className="relative group animate-in fade-in zoom-in-95 delay-300 duration-1000 fill-mode-both">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
          
          <div className="relative bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 sm:p-12 shadow-2xl overflow-hidden text-center">
            {/* Decorative background circle */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500 rotate-3 group-hover:rotate-6">
                <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">Ready to initialize?</h2>
              <p className="text-slate-400 mb-10 max-w-sm mx-auto leading-relaxed">
                We've processed <span className="text-white font-medium">{filename}</span>. Click below to start your new project workspace and begin the analysis.
              </p>
              
              <button 
                onClick={() => alert('Initializing project environment...')}
                className="group/btn relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-xl shadow-indigo-600/20"
              >
                Create Project
                <svg className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <p className="text-slate-500 text-sm animate-in fade-in duration-1000 delay-700 fill-mode-both">
          Analysis will begin automatically after project creation.
        </p>
      </div>
    </div>
  );
};

export default function CreateProjectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>}>
      <CreateProjectContent />
    </Suspense>
  );
}
