"use client";

import React, { useEffect, useRef, useState } from 'react';

interface PDFCanvasPageProps {
  pdfDoc: any;
  pageNumber: number;
  scale?: number;
}

const PDFCanvasPage: React.FC<PDFCanvasPageProps> = ({ pdfDoc, pageNumber, scale = 1.5 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let renderTask: any = null;
    let isMounted = true;

    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        setIsLoading(true);
        const page = await pdfDoc.getPage(pageNumber);
        
        if (!isMounted || !canvasRef.current) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        // Set dimensions
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        // If there was a previous task, it would have been cancelled by the cleanup
        renderTask = page.render(renderContext);
        
        try {
          await renderTask.promise;
          if (isMounted) {
            setIsLoading(false);
          }
        } catch (err: any) {
          if (err.name !== 'RenderingCancelledException') {
            throw err;
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Error rendering PDF page:', err);
          setError('Failed to render page');
          setIsLoading(false);
        }
      }
    };

    renderPage();

    return () => {
      isMounted = false;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, pageNumber, scale]);

  return (
    <div className="relative group w-full">
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <canvas 
          ref={canvasRef} 
          className="w-full h-auto rounded-lg shadow-xl bg-white"
        />
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-800">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 backdrop-blur-sm rounded-lg border border-red-500/30">
          <p className="text-red-400 text-[10px] font-bold uppercase">{error}</p>
        </div>
      )}
      
      {/* Aesthetic Overlay */}
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-lg"></div>
    </div>
  );
};

export default PDFCanvasPage;

