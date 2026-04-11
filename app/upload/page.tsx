"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const UploadPage = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Document submitted successfully!');
      // Reset
      setPdfFile(null);
      setPdfUrl(null);
    }, 1500);
  };

  // Cleanup PDF URL
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black flex items-center justify-center p-6 bg-fixed overflow-hidden text-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-2xl relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 transition-all duration-500">
          
          {!pdfUrl ? (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Insert your PDF</h2>
                <p className="text-slate-400 text-sm mt-1">Please select the document you wish to upload.</p>
              </div>

              <div className="border-2 border-dashed border-slate-700/50 rounded-2xl p-10 text-center hover:border-purple-500/50 transition-colors group/upload">
                <input
                  type="file"
                  id="pdf-upload"
                  className="hidden"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <p className="text-slate-300 font-medium group-hover/upload:text-white transition-colors">
                    Click to browse files
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Only PDF files are supported</p>
                </label>
              </div>
              
              <div className="mt-8 text-center">
                <Link href="/" className="text-sm text-slate-500 hover:text-white transition-colors underline underline-offset-4">
                  Back to Portal
                </Link>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl font-bold">Document Preview</h2>
                  <p className="text-xs text-slate-400 truncate max-w-[200px]">{pdfFile?.name}</p>
                </div>
                <button
                  onClick={() => {
                    setPdfFile(null);
                    setPdfUrl(null);
                  }}
                  className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-all"
                >
                  Change File
                </button>
              </div>

              <div className="relative aspect-[3/4] w-full bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                <iframe
                  src={`${pdfUrl}#toolbar=0`}
                  className="w-full h-full border-none"
                  title="PDF Preview"
                />
              </div>

              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-xl shadow-purple-500/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Completing Submission...
                  </>
                ) : (
                  'Submmit PDF'
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UploadPage;
