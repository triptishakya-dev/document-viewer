"use client";

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const CreateAnalyzerContent = () => {
  const searchParams = useSearchParams();
  const userName = searchParams.get('username') || 'Valued User';
  const filename = searchParams.get('filename') || 'document.pdf';
  const router = useRouter();

  const handleViewPDF = () => {
    // In a real app, we would fetch the actual PDF from the server.
    // For this demo, we simulate opening it in a new tab.
    window.open(`https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-black flex items-center justify-center p-6 text-white font-sans overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] animate-pulse delay-700"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Main Card */}
        <div className="relative bg-slate-900/40 backdrop-blur-3xl border border-slate-700/50 rounded-[2.5rem] shadow-2xl p-8 md:p-12 overflow-hidden group">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
          
          <div className="space-y-10">
            {/* Header section */}
            <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-8 duration-1000">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">
                Project Initialized
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                {userName}'s Project
              </h1>
              <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                Your document has been securely received and is ready for initialization.
              </p>
            </div>

            {/* File Info Card */}
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Target Document</p>
                  <p className="text-sm font-semibold text-slate-200 truncate max-w-[200px] md:max-w-xs">{filename}</p>
                </div>
              </div>
              <button 
                onClick={handleViewPDF}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors py-2 px-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20 hover:border-indigo-500/40"
              >
                View PDF
              </button>
            </div>

            {/* CTA Section */}
            <div className="pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-600">
              <button 
                onClick={() => router.push('/')}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-5 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <span>Create Project</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-center text-slate-500 text-sm animate-in fade-in duration-1000 delay-1000">
          Need help? <a href="#" className="text-indigo-400 hover:underline">Contact System Administrator</a>
        </p>
      </div>
    </div>
  );
};

export default function AnalyzerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-indigo-400 font-medium animate-pulse">Initializing Portal...</p>
      </div>
    </div>}>
      <CreateAnalyzerContent />
    </Suspense>
  );
}
