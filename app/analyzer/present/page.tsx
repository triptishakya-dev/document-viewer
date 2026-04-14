"use client";

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PDFCanvasPage from '@/components/PDFCanvasPage';

interface ProjectNameCardProps {
  projectName: string;
  username: string;
  label: string;
  onClick: () => void;
}

const ProjectNameCard = ({ projectName, username, label, onClick }: ProjectNameCardProps) => (
  <button
    onClick={onClick}
    className="group w-full flex-1 flex flex-col items-center justify-center gap-6 hover:bg-white/2 transition-all duration-300 active:scale-[0.99]"
  >
    <div className="w-20 h-20 bg-indigo-600/20 border border-indigo-500/20 rounded-3xl flex items-center justify-center group-hover:bg-indigo-600/30 group-hover:border-indigo-500/40 transition-all duration-300">
      <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-3xl font-black text-white capitalize tracking-tight text-center px-8">
        {projectName || 'Document'}
      </h2>
      {username && (
        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{username}</p>
      )}
      <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em] font-bold mt-2 group-hover:text-indigo-400/60 transition-colors duration-300">
        {label}
      </p>
    </div>
  </button>
);

const PresentContent = () => {
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get('fileUrl') || '';
  const username = searchParams.get('username') || '';
  const filename = searchParams.get('filename') || '';

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const channelRef = useRef<BroadcastChannel | null>(null);

  const projectName = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

  // Load PDF via pdf.js — guard against duplicate script injection
  useEffect(() => {
    if (!fileUrl) return;

    const loadPDF = (lib: any) => {
      lib.getDocument(fileUrl).promise
        .then((pdf: any) => {
          setPdfDoc(pdf);
          setNumPages(pdf.numPages);
        })
        .catch((err: any) => console.error('PDF load error:', err));
    };

    const lib = (window as any).pdfjsLib;
    if (lib) {
      loadPDF(lib);
      return;
    }

    // Avoid injecting the script more than once
    const existing = document.querySelector('script[data-pdfjs]');
    if (existing) {
      existing.addEventListener('load', () => {
        const l = (window as any).pdfjsLib;
        if (l) loadPDF(l);
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.setAttribute('data-pdfjs', '1');
    script.onload = () => {
      const l = (window as any).pdfjsLib;
      l.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      loadPDF(l);
    };
    document.head.appendChild(script);
  }, [fileUrl]);

  // BroadcastChannel
  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel('pdf-presenter');
      channelRef.current.onmessage = (event) => {
        const { type } = event.data;
        if (type === 'play') setIsPaused(false);
        else if (type === 'pause') setIsPaused(true);
      };
    } catch (e) {
      console.warn('BroadcastChannel not available', e);
    }
    return () => { channelRef.current?.close(); };
  }, []);

  const firstPage = numPages >= 1 ? 1 : null;
  const lastPage = numPages >= 2 ? numPages : null;
  const middlePages = numPages >= 3
    ? Array.from({ length: numPages - 2 }, (_, i) => i + 2)
    : [];

  return (
    <div className="flex h-screen bg-[#020205] text-white font-sans overflow-hidden">

      {/* LEFT SCREEN */}
      <div className="w-1/2 flex flex-col border-r border-white/6 overflow-y-auto">
        {!leftOpen ? (
          <div className="flex-1 flex">
            <ProjectNameCard
              projectName={projectName}
              username={username}
              label="Click to view first & last page"
              onClick={() => setLeftOpen(true)}
            />
          </div>
        ) : (
          <>
            <div className="shrink-0 h-12 flex items-center px-5 gap-3 border-b border-white/5 bg-black/40 backdrop-blur-xl">
              <button onClick={() => setLeftOpen(false)} className="text-slate-600 hover:text-slate-300 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">First &amp; Last Page</p>
            </div>
            <div className="flex flex-col gap-6 p-5">
              {pdfDoc ? (
                <>
                  {firstPage !== null && (
                    <div className="space-y-2">
                      <p className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">
                        Page {String(firstPage).padStart(2, '0')} — First
                      </p>
                      <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/60">
                        <PDFCanvasPage pdfDoc={pdfDoc} pageNumber={firstPage} scale={1.5} />
                      </div>
                    </div>
                  )}
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
                </>
              ) : (
                <div className="flex items-center justify-center py-32">
                  <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* RIGHT SCREEN */}
      <div className="w-1/2 flex flex-col overflow-y-auto">
        {!rightOpen ? (
          <div className="flex-1 flex">
            <ProjectNameCard
              projectName={projectName}
              username={username}
              label="Click to view remaining pages"
              onClick={() => setRightOpen(true)}
            />
          </div>
        ) : (
          <>
            <div className="shrink-0 h-12 flex items-center px-5 gap-3 border-b border-white/5 bg-black/40 backdrop-blur-xl">
              <button onClick={() => setRightOpen(false)} className="text-slate-600 hover:text-slate-300 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                Remaining Pages{middlePages.length > 0 ? ` (${middlePages.length})` : ''}
              </p>
            </div>
            <div className="p-5">
              {pdfDoc ? (
                middlePages.length > 0 ? (
                  <div className="flex flex-col gap-8">
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
                ) : (
                  <div className="flex items-center justify-center py-32">
                    <p className="text-[10px] text-slate-700 uppercase tracking-widest font-bold">No middle pages</p>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center py-32">
                  <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                </div>
              )}
            </div>
          </>
        )}
      </div>

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
