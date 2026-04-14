"use client";

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PDFCanvasPage from '@/components/PDFCanvasPage';

const PresentContent = () => {
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get('fileUrl') || '';
  const username = searchParams.get('username') || '';
  const filename = searchParams.get('filename') || '';

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const channelRef = useRef<BroadcastChannel | null>(null);
  const numPagesRef = useRef(0);

  const projectName = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

  // Hide scrollbar for this page only
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'present-no-scrollbar';
    style.textContent = 'html,body{scrollbar-width:none;-ms-overflow-style:none;}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none;}';
    document.head.appendChild(style);
    return () => {
      document.getElementById('present-no-scrollbar')?.remove();
    };
  }, []);

  // Load PDF via pdf.js
  useEffect(() => {
    const loadPDF = (lib: any) => {
      if (!fileUrl) return;
      lib.getDocument(fileUrl).promise
        .then((pdf: any) => {
          setPdfDoc(pdf);
          setNumPages(pdf.numPages);
          numPagesRef.current = pdf.numPages;
        })
        .catch((err: any) => {
          console.error('PDF load error:', err);
        });
    };

    if ((window as any).pdfjsLib) {
      loadPDF((window as any).pdfjsLib);
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      script.onload = () => {
        const lib = (window as any).pdfjsLib;
        lib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        loadPDF(lib);
      };
      document.head.appendChild(script);
    }
  }, [fileUrl]);

  // BroadcastChannel listener
  useEffect(() => {
    channelRef.current = new BroadcastChannel('pdf-presenter');

    channelRef.current.onmessage = (event) => {
      const { type } = event.data;
      if (type === 'play') {
        setIsPlaying(true);
        setIsPaused(false);
      } else if (type === 'pause') {
        setIsPlaying(false);
        setIsPaused(true);
      } else if (type === 'prev') {
        setCurrentPage(p => Math.max(1, p - 1));
      } else if (type === 'next') {
        setCurrentPage(p => Math.min(numPagesRef.current || p, p + 1));
      }
    };

    return () => {
      channelRef.current?.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans">

      {/* Sticky header */}
      <header className="sticky top-0 z-50 h-14 border-b border-white/5 bg-black/60 backdrop-blur-xl flex items-center px-8 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-black tracking-tight text-white/90 capitalize leading-none">{projectName}</p>
            {username && (
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">{username}</p>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {numPages > 0 && (
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              {numPages} pages
            </span>
          )}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
            isPlaying
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : isPaused
              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
              : 'bg-slate-800/60 border border-slate-700/50 text-slate-500'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isPlaying ? 'bg-emerald-400 animate-pulse' : isPaused ? 'bg-amber-400' : 'bg-slate-600'
            }`} />
            {isPlaying ? 'Live' : isPaused ? 'Paused' : 'Ready'}
          </div>
        </div>
      </header>

      {/* PDF single page view */}
      <main className="max-w-4xl mx-auto py-12 px-6">
        {pdfDoc ? (
          <div className="space-y-3">
            <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">
              PAGE_{currentPage.toString().padStart(2, '0')} / {numPages.toString().padStart(2, '0')}
            </p>
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
              <PDFCanvasPage pdfDoc={pdfDoc} pageNumber={currentPage} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em]">Loading Document</p>
          </div>
        )}
      </main>

      {/* Pause overlay */}
      {isPaused && (
        <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div className="bg-black/70 backdrop-blur-sm rounded-3xl px-10 py-8 border border-amber-500/20 flex flex-col items-center gap-3 shadow-2xl">
            <svg className="w-10 h-10 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
            <p className="text-xs font-black text-amber-400 uppercase tracking-[0.4em]">Paused</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default function PresentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020205] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    }>
      <PresentContent />
    </Suspense>
  );
}
