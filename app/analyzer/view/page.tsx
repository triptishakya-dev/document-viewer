"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import PDFCanvasPage from '@/components/PDFCanvasPage';

const AnalyzerViewContent = () => {
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get('fileUrl');
  const userName = searchParams.get('username') || 'Valued User';
  const filename = searchParams.get('filename') || 'Document';

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const numPagesRef = useRef<number | null>(null);

  useEffect(() => { numPagesRef.current = numPages; }, [numPages]);

  // Listen to slides controller — open once, use ref for numPages
  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel('pdf-slides-control');
      channelRef.current.onmessage = (event) => {
        const { type } = event.data;
        if (type === 'next') setCurrentPage(p => (numPagesRef.current ? Math.min(numPagesRef.current, p + 1) : p));
        if (type === 'prev') setCurrentPage(p => Math.max(1, p - 1));
      };
    } catch (e) {}
    return () => { channelRef.current?.close(); };
  }, []);

  useEffect(() => {
    const loadDocument = (lib: any) => {
      if (fileUrl) {
        lib.getDocument(fileUrl).promise.then((pdf: any) => {
          setPdfDoc(pdf);
          setNumPages(pdf.numPages);
          setIsLoading(false);
        }).catch((err: any) => {
          console.error("PDF.js loading error:", err);
          setError("Failed to load PDF.");
          setIsLoading(false);
        });
      }
    };

    if (!(window as any).pdfjsLib) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      script.onload = () => {
        const lib = (window as any).pdfjsLib;
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        loadDocument(lib);
      };
      document.head.appendChild(script);
    } else {
      loadDocument((window as any).pdfjsLib);
    }
  }, [fileUrl]);

  const goToPrev = useCallback(() => {
    setCurrentPage(p => Math.max(1, p - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentPage(p => Math.min(numPages ?? p, p + 1));
  }, [numPages]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToNext();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goToNext, goToPrev]);

  if (!fileUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>No document source detected.</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#020205] text-white font-sans overflow-hidden flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center px-8 shrink-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-xs font-bold tracking-tight text-white/90">{filename}</span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Analysis Portal : {userName}</span>
        </div>
      </header>

      {/* Page Viewer */}
      <main className="flex-1 overflow-y-auto bg-[#05050a] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="max-w-3xl mx-auto py-10 px-6">

          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em]">Loading Document</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex items-center justify-center py-32">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Page display */}
          {pdfDoc && numPages && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Page counter */}
              <div className="flex items-center justify-center space-x-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                  Page {currentPage} of {numPages}
                </span>
              </div>

              {/* PDF Page */}
              <div className="shadow-2xl shadow-indigo-500/5 rounded-2xl overflow-hidden">
                <PDFCanvasPage pdfDoc={pdfDoc} pageNumber={currentPage} scale={1.8} />
              </div>

              {/* Page pills */}
              <div className="flex items-center justify-center space-x-1 pt-4 pb-2">
                {Array.from({ length: Math.min(numPages, 7) }, (_, i) => {
                  let page: number;
                  if (numPages <= 7) {
                    page = i + 1;
                  } else if (currentPage <= 4) {
                    page = i < 6 ? i + 1 : numPages;
                  } else if (currentPage >= numPages - 3) {
                    page = i === 0 ? 1 : numPages - 5 + i;
                  } else {
                    const map = [1, currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, numPages];
                    page = map[i];
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${
                        page === currentPage
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-500 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default function AnalyzerViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020205] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-12 h-12 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.5em]">Establishing Protocol</p>
        </div>
      </div>
    }>
      <AnalyzerViewContent />
    </Suspense>
  );
}
