"use client";

import React, { useState, useRef } from 'react';

interface DocumentSubmissionPortalProps {
  id: string;
  userName?: string;
}

const DocumentSubmissionPortal = ({ id, userName }: DocumentSubmissionPortalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else if (selectedFile) {
      alert('Please select a valid PDF document.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      const url = URL.createObjectURL(droppedFile);
      setPreviewUrl(url);
    } else if (droppedFile) {
      alert('Please drop a valid PDF document.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    // Open the project creation page in a new tab
    const url = `/analyzer/create?filename=${encodeURIComponent(file.name)}&username=${encodeURIComponent(userName || '')}`;
    window.open(url, '_blank');

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const removeFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
          <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-white">Document Submitted!</h2>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
          Your document has been securely uploaded and is now being processed. We will notify you once the analysis is complete.
        </p>
        <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-2xl inline-block max-w-xs w-full">
          <p className="text-xs text-slate-500 mb-1 uppercase tracking-widest font-bold">Reference ID</p>
          <p className="text-sm font-mono text-emerald-400 break-all">{id}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center">
        {userName && (
          <h2 className="text-2xl font-bold text-white mb-2">Welcome, {userName}</h2>
        )}
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Please upload your PDF document for secure processing. Access key: <span className="text-emerald-400 font-mono text-xs">{id.substring(0, 8)}...</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="relative group cursor-pointer"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative border-2 border-dashed border-slate-700/50 rounded-2xl p-12 text-center transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-800/20">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700/50 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-slate-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Click or drag PDF here</h3>
              <p className="text-slate-400 text-sm mb-6">Maximum file size: 10MB</p>
              
              <button
                type="button"
                className="bg-slate-700/50 hover:bg-slate-600/50 text-white text-sm font-medium py-2 px-6 rounded-lg border border-slate-600 transition-all active:scale-95"
              >
                Choose PDF File
              </button>

             
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* File Info Bar */}
            <div className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="shrink-0 w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20">
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-6-6H7zm7 1.5L17.5 8H14V3.5zM8 12h8v2H8v-2zm0 4h8v2H8v-2z" />
                  </svg>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document</p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="Remove file"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Preview Section */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl blur opacity-25"></div>
              <div className="relative bg-black/40 border border-slate-700/50 rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[4/3] w-full shadow-2xl">
                {previewUrl && (
                  <iframe
                    src={`${previewUrl}#toolbar=0&navpanes=0`}
                    className="w-full h-full border-none"
                    title="PDF Preview"
                  />
                )}
                {/* Overlay for aesthetic */}
                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-2xl"></div>
              </div>
              <div className="mt-2 text-center text-xs text-slate-500 italic">
                PDF Preview Mode
              </div>
            </div>

          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !file}
          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-xl shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing Securely...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.355c-1.92-1.206-3.84-2.412-5.76-3.618a11.955 11.955 0 01-1.858-13.722M12 21.355a11.955 11.955 0 007.618-17.34" />
              </svg>
              <span>Submit Document</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default DocumentSubmissionPortal;
