"use client";

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const SlidesContent = () => {
  const searchParams = useSearchParams();
  const filename = searchParams.get('filename') || '';
  const fileUrl = searchParams.get('fileUrl') || '';
  const username = searchParams.get('username') || '';

  const [isPlaying, setIsPlaying] = useState(false);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel('pdf-slides-control');
    } catch (e) {}
    return () => { channelRef.current?.close(); };
  }, []);

  const handlePlay = () => {
    channelRef.current?.postMessage({ type: 'play' });
    setIsPlaying(true);
  };

  const handlePause = () => {
    channelRef.current?.postMessage({ type: 'pause' });
    setIsPlaying(false);
  };

  const handlePrev = () => {
    channelRef.current?.postMessage({ type: 'prev' });
  };

  const handleNext = () => {
    channelRef.current?.postMessage({ type: 'next' });
  };

  const projectName = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-black flex items-center justify-center overflow-hidden relative">

      {/* Background glows */}
      <div className="absolute top-1/3 -left-32 w-125 h-125 bg-indigo-700/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-125 h-125 bg-blue-700/10 rounded-full blur-[120px] animate-pulse delay-700 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,0.06),transparent_60%)] pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 flex flex-col items-center gap-10">

        {/* Label */}
        <div className="flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block" />
            Presentation Controls
          </div>
          {projectName && (
            <p className="text-slate-300 text-sm font-semibold tracking-wide capitalize mt-1">{projectName}</p>
          )}
          <p className="text-slate-500 text-xs tracking-widest uppercase font-medium">
            Use the controls below to navigate
          </p>
        </div>

        {/* Status indicator */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
          isPlaying
            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
            : 'bg-slate-800/60 border border-slate-700/50 text-slate-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          {isPlaying ? 'Presenting' : 'Standby'}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-5">

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="group relative w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-500/80 transition-all duration-200 active:scale-95 shadow-lg shadow-black/30 backdrop-blur-sm"
          >
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-linear-to-br from-slate-700/20 to-transparent" />
            <svg className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Play */}
          <button
            onClick={handlePlay}
            className="group relative w-20 h-20 rounded-3xl flex items-center justify-center bg-linear-to-br from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 border border-indigo-400/30 transition-all duration-200 active:scale-95 shadow-2xl shadow-indigo-600/30"
          >
            <div className="absolute inset-0 rounded-3xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="absolute -inset-1 rounded-[1.75rem] bg-linear-to-br from-indigo-500/20 to-blue-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <svg className="relative w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          {/* Pause */}
          <button
            onClick={handlePause}
            className="group relative w-20 h-20 rounded-3xl flex items-center justify-center bg-linear-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 border border-slate-600/50 hover:border-slate-500/70 transition-all duration-200 active:scale-95 shadow-2xl shadow-black/30"
          >
            <div className="absolute inset-0 rounded-3xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <svg className="relative w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="group relative w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-500/80 transition-all duration-200 active:scale-95 shadow-lg shadow-black/30 backdrop-blur-sm"
          >
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-linear-to-br from-slate-700/20 to-transparent" />
            <svg className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>

        </div>

        {/* Bottom hint */}
        <p className="text-slate-600 text-[10px] tracking-[0.25em] uppercase font-medium">
          ← prev &nbsp;·&nbsp; play / pause &nbsp;·&nbsp; next →
        </p>

      </div>
    </div>
  );
};

export default function SlidesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <SlidesContent />
    </Suspense>
  );
}
