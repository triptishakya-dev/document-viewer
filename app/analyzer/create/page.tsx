"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const CreateAnalyzerContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userName = searchParams.get('username') || 'Valued User';
  const filename = searchParams.get('filename') || 'document.pdf';
  const fileUrl = searchParams.get('fileUrl');
  const correctPassword = searchParams.get('password');
  
  const [isVerified, setIsVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleOpenPDF = (inputPassword?: string) => {
    const passwordToVerify = inputPassword !== undefined ? inputPassword : password;
    
    // If password param is in URL (even if empty), use it. Otherwise fallback to admin123.
    const actualCorrectPassword = (correctPassword !== null) ? correctPassword : 'admin123';

    if (passwordToVerify !== actualCorrectPassword) {
      if (inputPassword === undefined) { 
        setError('enter your valid password');
      }
      return;
    }

    if (fileUrl) {
      // Set error to empty and close modal first to improve UX
      setError('');
      setIsVerified(true);
      setShowModal(false);
    } else {
      alert('The document could not be found on the server. Please try re-uploading.');
    }
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

            {/* File Info Card - Now Clickable */}
            <div 
              onClick={() => setShowModal(true)}
              className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-6 flex items-center space-x-4 cursor-pointer hover:bg-slate-900/50 hover:border-indigo-500/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200"
            >
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Target Document</p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-semibold text-slate-200 truncate">{filename}</p>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20">Click to View</span>
                </div>
              </div>
            </div>

            {/* CTA Section / Links */}
            <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-600">
              {!isVerified ? (
                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-5 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center space-x-2"
                >
                  <span>Verification Required</span>
                  <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 px-2 pb-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Access Links Generated</span>
                  </div>
                  
                  {/* Link 1: Part 01 */}
                  <a 
                    href={`/analyzer/view?fileUrl=${encodeURIComponent(fileUrl || '')}&username=${encodeURIComponent(userName)}&filename=${encodeURIComponent(filename)}&part=1`}
                    target="_blank"
                    className="flex items-center justify-between p-5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-xs">01</div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-white tracking-tight">Access Part 01</p>
                        <p className="text-[10px] text-indigo-400/70 font-bold uppercase tracking-widest mt-0.5">Key Markers : Entry & Exit</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-indigo-400 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>

                  {/* Link 2: Part 02 */}
                  <a 
                    href={`/analyzer/view?fileUrl=${encodeURIComponent(fileUrl || '')}&username=${encodeURIComponent(userName)}&filename=${encodeURIComponent(filename)}&part=2`}
                    target="_blank"
                    className="flex items-center justify-between p-5 bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 hover:border-slate-600/80 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-white font-black text-xs">02</div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-white tracking-tight">Access Part 02</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Core Content Analysis</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-slate-500 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-center text-slate-500 text-sm animate-in fade-in duration-1000 delay-1000">
          Need help? <a href="#" className="text-indigo-400 hover:underline">Contact System Administrator</a>
        </p>
      </div>

      {/* Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-1">{userName}'s Project</h2>
              <p className="text-sm text-slate-400">Please enter your project password to continue.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleOpenPDF(); }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Security Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPassword(val);
                    const actualCorrectPassword = (correctPassword !== null) ? correctPassword : 'admin123';
                    if (val === actualCorrectPassword) {
                      handleOpenPDF(val);
                    }
                  }}
                  placeholder="••••••••"
                  autoFocus
                  className={`w-full bg-slate-800/50 border ${error ? 'border-red-500/50' : 'border-slate-700/50'} rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500/50' : 'focus:ring-indigo-500/50'} focus:border-indigo-500/50 transition-all duration-200`}
                />
                {error && (
                  <p className="text-red-400 text-xs font-medium mt-2 animate-in fade-in slide-in-from-top-1">
                    {error}
                  </p>
                )}
              </div>
              
              {/* Hidden submit button to allow "Enter" key to work */}
              <button type="submit" className="hidden" aria-hidden="true" />
            </form>
          </div>
        </div>
      )}
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
