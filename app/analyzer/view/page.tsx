"use client";

import React, { Suspense, useEffect, useState } from 'react';
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

  useEffect(() => {
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

    const loadDocument = (lib: any) => {
      if (fileUrl) {
        lib.getDocument(fileUrl).promise.then((pdf: any) => {
          setPdfDoc(pdf);
          setNumPages(pdf.numPages);
          setIsLoading(false);
        }).catch((err: any) => {
          console.error("PDF.js loading error:", err);
          setError("Failed to load PDF metadata.");
          setIsLoading(false);
        });
      }
    };
  }, [fileUrl]);

  if (!fileUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>No document source detected.</p>
      </div>
    );
  }

  const middlePages = [];
  if (numPages && numPages > 2) {
    for (let i = 2; i < numPages; i++) {
      middlePages.push(i);
    }
  }

  const part = searchParams.get('part');

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans overflow-hidden flex flex-col">
      {/* Dynamic Header */}
      <header className="h-14 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center px-8 shrink-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-xs font-bold tracking-tight text-white/90">
            {filename} {part === '1' ? '— Part 01' : part === '2' ? '— Part 02' : ''}
          </span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Analysis Portal : {userName}</span>
        </div>
      </header>

      {/* Main Container - Focused View */}
      <main className="flex-1 overflow-y-auto bg-[#05050a] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div className="max-w-4xl mx-auto py-12 px-6">
          
          {/* PART 1: BEGINNING & END */}
          {(!part || part === '1') && (
            <section id="part-1" className="space-y-12 animate-in fade-in duration-700">
              <div className="space-y-2 mb-8 text-center">
                <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Section 01</h2>
                <p className="text-xl font-bold text-slate-300">Key Markers: Entry & Exit</p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Page 1 */}
                <div className="space-y-4">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">01 / Entry Point</p>
                  <div className="shadow-2xl shadow-indigo-500/5 rounded-2xl overflow-hidden hover:ring-1 ring-indigo-500/30 transition-all">
                    <PDFCanvasPage pdfDoc={pdfDoc} pageNumber={1} />
                  </div>
                </div>

                {/* Final Page */}
                {numPages && numPages > 1 && (
                  <div className="space-y-4">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{numPages.toString().padStart(2, '0')} / Conclusion</p>
                    <div className="shadow-2xl shadow-slate-500/5 rounded-2xl overflow-hidden hover:ring-1 ring-slate-500/30 transition-all">
                      <PDFCanvasPage pdfDoc={pdfDoc} pageNumber={numPages} />
                    </div>
                  </div>
                )}
              </div>

              {!pdfDoc && !error && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
              )}
            </section>
          )}

          {/* PART 2: THE CORE CONTENT */}
          {(!part || part === '2') && (
            <section id="part-2" className="space-y-12 animate-in fade-in duration-700">
              <div className="space-y-2 mb-12 text-center">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Section 02</h2>
                <p className="text-xl font-bold text-slate-400">Rest of the Document</p>
              </div>

              <div className="space-y-16">
                {middlePages.length > 0 ? (
                  middlePages.map(pageNum => (
                    <div key={pageNum} className="space-y-6 max-w-2xl mx-auto">
                      <div className="flex items-center space-x-4 opacity-30">
                        <span className="text-[9px] font-mono text-slate-400">BLOCK_{pageNum.toString().padStart(2, '0')}</span>
                        <div className="h-[1px] flex-1 bg-slate-800"></div>
                      </div>
                      <div className="shadow-2xl shadow-black/50 rounded-2xl overflow-hidden">
                        <PDFCanvasPage pdfDoc={pdfDoc} pageNumber={pageNum} />
                      </div>
                    </div>
                  ))
                ) : numPages !== null ? (
                  <div className="h-[40vh] flex items-center justify-center border border-white/5 bg-white/[0.01] rounded-[2rem] p-12">
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] max-w-xs mx-auto">
                        This document does not contain any middle pages.
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
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
