"use client";

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PDFCanvasPage from '@/components/PDFCanvasPage';

const PresentContent = () => {
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get('fileUrl') || '';

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const channelRef = useRef<BroadcastChannel | null>(null);

  // Part 1: first + last
  const firstPage = numPages >= 1 ? 1 : null;
  const lastPage = numPages >= 2 ? numPages : null;

  // Part 2: middle pages 2…numPages-1
  const middlePages = numPages >= 3
    ? Array.from({ length: numPages - 2 }, (_, i) => i + 2)
    : [];

  // Load PDF
  useEffect(() => {
    if (!fileUrl) return;

    const loadPDF = (lib: any) => {
      lib.getDocument(fileUrl).promise
        .then((pdf: any) => {
          setPdfDoc(pdf);
          setNumPages(pdf.numPages);
          setIsLoading(false);
        })
        .catch(() => {
          setError('Failed to load PDF.');
          setIsLoading(false);
        });
    };

    if ((window as any).pdfjsLib) {
      loadPDF((window as any).pdfjsLib);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.setAttribute('data-pdfjs', '1');
    script.onload = () => {
      const lib = (window as any).pdfjsLib;
      lib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      loadPDF(lib);
    };
    document.head.appendChild(script);
  }, [fileUrl]);

  // BroadcastChannel
  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel('pdf-presenter');
    } catch (e) {}
    return () => { channelRef.current?.close(); };
  }, []);

  // Spinner shown while loading
  const Spinner = () => (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex h-screen bg-[#020205] text-white font-sans overflow-hidden">

      {/* ══════════════════════════════════════
          LEFT HALF — Part 01: First + Last page
         ══════════════════════════════════════ */}
      <div className="w-1/2 flex flex-col border-r border-white/5 overflow-hidden">

        {/* header */}
        <div className="shrink-0 h-12 flex items-center px-5 gap-3 border-b border-white/5 bg-black/50 backdrop-blur-xl">
          <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-[9px] font-black text-white">01</div>
          <div>
            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">Access Part 01</p>
            <p className="text-[8px] text-slate-600 uppercase tracking-widest">Key Markers · First &amp; Last Page</p>
          </div>
          {numPages > 0 && (
            <span className="ml-auto text-[9px] text-slate-700 font-bold">2 pages</span>
          )}
        </div>

        {/* content */}
        <div className="flex-1 overflow-y-auto bg-[#05050a] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="p-5 flex flex-col gap-6">

            {isLoading && <Spinner />}
            {error && (
              <div className="flex items-center justify-center py-20">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {pdfDoc && (
              <>
                {/* First page */}
                {firstPage !== null && (
                  <div className="space-y-2">
                    <p className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">
                      Page 01 — First
                    </p>
                    <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/60">
                      <PDFCanvasPage pdfDoc={pdfDoc} pageNumber={firstPage} scale={1.5} />
                    </div>
                  </div>
                )}

                {/* Last page */}
                {lastPage !== null && lastPage !== firstPage && (
                  <div className="space-y-2">
                    <p className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">
                      Page {String(lastPage).padStart(2, '0')} — Last
                    </p>
                    <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/60">
                      <PDFCanvasPage pdfDoc={pdfDoc} pageNumber={lastPage} scale={1.5} />
                    </div>
                  </div>
                )}

                {/* Single-page document */}
                {numPages === 1 && (
                  <p className="text-[10px] text-slate-600 text-center py-4">Single page document.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT HALF — Part 02: Remaining pages (page by page)
         ══════════════════════════════════════ */}
      <div className="w-1/2 flex flex-col overflow-hidden">

        {/* header */}
        <div className="shrink-0 h-12 flex items-center px-5 gap-3 border-b border-white/5 bg-black/50 backdrop-blur-xl">
          <div className="w-6 h-6 bg-slate-700 rounded-lg flex items-center justify-center text-[9px] font-black text-white">02</div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Access Part 02</p>
            <p className="text-[8px] text-slate-600 uppercase tracking-widest">Core Content · Remaining Pages</p>
          </div>
          {middlePages.length > 0 && (
            <span className="ml-auto text-[9px] text-slate-700 font-bold">{middlePages.length} pages</span>
          )}
        </div>

        {/* content */}
        <div className="flex-1 overflow-y-auto bg-[#040409] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="p-5 flex flex-col gap-5">

            {isLoading && <Spinner />}

            {!isLoading && !error && middlePages.length === 0 && numPages > 0 && (
              <div className="flex items-center justify-center py-20">
                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">No middle pages in this document</p>
              </div>
            )}

            {pdfDoc && middlePages.length > 0 && (
              <div className="flex flex-col gap-6">
                {middlePages.map((pageNum) => (
                  <div key={pageNum} className="space-y-2">
                    <p className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">
                      Page {String(pageNum).padStart(2, '0')}
                    </p>
                    <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/60">
                      <PDFCanvasPage pdfDoc={pdfDoc} pageNumber={pageNum} scale={1.5} />
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

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
