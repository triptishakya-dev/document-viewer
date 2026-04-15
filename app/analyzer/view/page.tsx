"use client";

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import PDFCanvasPage from '@/components/PDFCanvasPage';

const AnalyzerViewContent = () => {
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get('fileUrl');
  const userName = searchParams.get('username') || 'Valued User';
  const filename = searchParams.get('filename') || 'Document';
  const part = searchParams.get('part') || '1'; // '1' | '2' | 'all'

  const partLabel =
    part === '1' ? 'Key Markers : Entry & Exit' :
    part === '2' ? 'Core Content Analysis' :
    'Full Document';

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [allowedPages, setAllowedPages] = useState<number[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const channelRef = useRef<BroadcastChannel | null>(null);
  const allowedLengthRef = useRef(0);

  // Build the page list based on part
  useEffect(() => {
    if (totalPages === 0) return;

    let pages: number[];
    if (part === '1') {
      pages = totalPages === 1 ? [1] : [1, totalPages];
    } else if (part === '2') {
      pages = totalPages <= 2
        ? []
        : Array.from({ length: totalPages - 2 }, (_, i) => i + 2);
    } else {
      // 'all' — every page
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    setAllowedPages(pages);
    allowedLengthRef.current = pages.length;
    setPageIndex(0);
  }, [totalPages, part]);

  // Load PDF
  useEffect(() => {
    if (!fileUrl) return;

    const loadDoc = (lib: any) => {
      lib.getDocument(fileUrl).promise
        .then((pdf: any) => {
          setPdfDoc(pdf);
          setTotalPages(pdf.numPages);
          setIsLoading(false);
        })
        .catch(() => {
          setError('Failed to load PDF.');
          setIsLoading(false);
        });
    };

    if ((window as any).pdfjsLib) {
      loadDoc((window as any).pdfjsLib);
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      script.onload = () => {
        const lib = (window as any).pdfjsLib;
        lib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        loadDoc(lib);
      };
      document.head.appendChild(script);
    }
  }, [fileUrl]);

  // BroadcastChannel — controlled by slides controller
  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel('pdf-slides-control');
      channelRef.current.onmessage = (e) => {
        const len = allowedLengthRef.current;
        if (e.data.type === 'next')
          setPageIndex(i => Math.min(len - 1, i + 1));
        if (e.data.type === 'prev')
          setPageIndex(i => Math.max(0, i - 1));
        if (e.data.type === 'goto' && typeof e.data.index === 'number')
          setPageIndex(Math.max(0, Math.min(len - 1, e.data.index)));
      };
    } catch (_) {}
    return () => { channelRef.current?.close(); };
  }, []);

  const currentPage = allowedPages[pageIndex] ?? 1;
  const isLast = pageIndex === allowedPages.length - 1;

  if (!fileUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p className="text-sm text-slate-400">No document source detected.</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#020205] text-white font-sans overflow-hidden flex flex-col">

      {/* Header */}
      <header className="h-14 shrink-0 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center px-8 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-xs font-bold text-white/90 truncate max-w-64">{filename}</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          {allowedPages.length > 0 && (
            <span className="text-[10px] text-slate-600 font-bold tabular-nums">
              {pageIndex + 1} / {allowedPages.length}
            </span>
          )}
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            {userName}
          </span>
        </div>
      </header>

      {/* Sub-header */}
      <div className="h-9 shrink-0 bg-black/30 border-b border-white/5 flex items-center px-5">
        <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${
          part === '1' ? 'text-indigo-400' :
          part === 'all' ? 'text-indigo-400' :
          'text-slate-400'
        }`}>
          {partLabel}
        </span>
        {/* Progress dots (up to 20 pages) */}
        {allowedPages.length > 0 && allowedPages.length <= 20 && (
          <div className="ml-auto flex items-center gap-1">
            {allowedPages.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === pageIndex
                    ? 'w-4 h-1.5 bg-indigo-500'
                    : 'w-1.5 h-1.5 bg-slate-700'
                }`}
              />
            ))}
          </div>
        )}
        {/* For large docs show a thin progress bar */}
        {allowedPages.length > 20 && (
          <div className="ml-auto w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${((pageIndex + 1) / allowedPages.length) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden relative">

        {/* Loading */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-[#05050a]">
            <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em]">Loading</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#05050a]">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* No pages */}
        {!isLoading && !error && totalPages > 0 && allowedPages.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-[#05050a]">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No pages available</p>
          </div>
        )}

        {/* Single page view — driven by Next/Prev from the controller */}
        {pdfDoc && allowedPages.length > 0 && (
          <div className="h-full overflow-y-auto bg-[#05050a] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="py-8 px-5">
              <p className="text-[8px] font-mono text-slate-700 uppercase tracking-widest mb-3">
                Page {String(currentPage).padStart(2, '0')} of {totalPages}
              </p>
              <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/60">
                <PDFCanvasPage pdfDoc={pdfDoc} pageNumber={currentPage} scale={1.2} />
              </div>
              {isLast && (
                <p className="text-center text-[9px] text-slate-700 uppercase tracking-widest font-bold mt-6">
                  End of Document
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default function AnalyzerViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020205] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    }>
      <AnalyzerViewContent />
    </Suspense>
  );
}
