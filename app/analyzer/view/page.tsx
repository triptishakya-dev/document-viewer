"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PDFCanvasPage from '@/components/PDFCanvasPage';

const AnalyzerViewContent = () => {
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get('fileUrl');
  const userName = searchParams.get('username') || 'Valued User';
  const filename = searchParams.get('filename') || 'Document';
  const part = searchParams.get('part') || '1'; // '1' | '2' | 'all'

  const partLabel =
    part === '1' ? 'First & Last Page' :
    part === '2' ? 'Remaining Pages' :
    'Full Document';

  const partDescription =
    part === '1' ? 'Displaying the opening and closing pages of your document.' :
    part === '2' ? 'Displaying all pages between the first and last.' :
    'Displaying every page in your document.';

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [allowedPages, setAllowedPages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Build the page list based on part
  useEffect(() => {
    if (totalPages === 0) return;

    let pages: number[];
    if (part === '1') {
      // First & Last page only
      pages = totalPages === 1 ? [1] : [1, totalPages];
    } else if (part === '2') {
      // Everything except first & last
      pages = totalPages <= 2
        ? []
        : Array.from({ length: totalPages - 2 }, (_, i) => i + 2);
    } else {
      // 'all' — every page
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    setAllowedPages(pages);
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

  if (!fileUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p className="text-sm text-slate-400">No document source detected.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans flex flex-col">

      {/* Header */}
      <header className="shrink-0 border-b border-white/5 bg-black/40 backdrop-blur-xl z-50 sticky top-0 px-4">
        <div className="max-w-[700px] mx-auto h-14 flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white/90 truncate max-w-64">{filename}</span>
              <span className="text-[10px] text-slate-600 font-medium">{totalPages > 0 ? `${totalPages} total pages` : ''}</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <span className={`text-[10px] uppercase tracking-[0.2em] font-black px-3 py-1 rounded-full border ${
              part === '1'
                ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                : part === '2'
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
            }`}>
              {partLabel}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              {userName}
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em]">Loading Document</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center justify-center py-32">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* No pages */}
        {!isLoading && !error && totalPages > 0 && allowedPages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 space-y-2">
            <svg className="w-12 h-12 text-slate-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No pages available</p>
            <p className="text-slate-600 text-[11px]">This document only has {totalPages} page{totalPages !== 1 ? 's' : ''}.</p>
          </div>
        )}

        {/* All pages rendered together */}
        {pdfDoc && allowedPages.length > 0 && (
          <div className="py-10 px-4">
            {/* Section header */}
            <div className="max-w-[700px] mx-auto mb-8">
              <p className="text-xs text-slate-500 mb-1">{partDescription}</p>
              <p className="text-[10px] text-slate-700 font-mono">
                Showing {allowedPages.length} page{allowedPages.length !== 1 ? 's' : ''} — Pages: {allowedPages.join(', ')}
              </p>
            </div>

            {/* Page cards */}
            <div className="flex flex-col items-center gap-10">
              {allowedPages.map((pageNum, idx) => (
                <div key={pageNum} className="w-full max-w-[700px]">
                  {/* Page label */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                      Page {String(pageNum).padStart(2, '0')} of {totalPages}
                    </p>
                    <span className="text-[9px] font-mono text-slate-700">
                      {idx + 1} / {allowedPages.length}
                    </span>
                  </div>
                  {/* PDF page rendering with proper sizing */}
                  <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/60 border border-white/5 bg-white">
                    <PDFCanvasPage pdfDoc={pdfDoc} pageNumber={pageNum} scale={1.5} />
                  </div>
                </div>
              ))}

              {/* End-of-section marker */}
              <div className="py-6 flex flex-col items-center gap-2">
                <div className="w-12 h-px bg-slate-800" />
                <p className="text-[9px] text-slate-700 uppercase tracking-[0.3em] font-bold">
                  End of {partLabel}
                </p>
              </div>
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
