import React, { useCallback, useState } from 'react';

interface FileUploadProps {
  onUpload: (base64: string, mimeType: string, fileName: string) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result !== 'string') {
          alert("Failed to read file. Please try again.");
          return;
        }
        // Extract base64 part safely
        const base64Data = result.split(',')[1];
        if (!base64Data) {
          alert("Invalid file content.");
          return;
        }
        onUpload(base64Data, file.type, file.name);
      };
      reader.onerror = () => {
        alert("Error reading file.");
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a PDF or DOCX file.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className={`relative w-full group transition-all duration-500 ${isLoading ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
      <div
        className={`relative z-10 bg-gray-800/80 backdrop-blur-sm border-2 border-dashed rounded-3xl p-10 md:p-14 text-center transition-all duration-300 ease-out shadow-soft
          ${dragActive
            ? 'border-brand-500 bg-gray-800 scale-[1.01] shadow-glow'
            : 'border-gray-700 hover:border-brand-500/50 hover:shadow-card-hover'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.docx"
          onChange={handleChange}
          disabled={isLoading}
        />

        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${dragActive ? 'bg-brand-900/30 text-brand-400 rotate-6' : 'bg-gray-700/50 text-gray-400 group-hover:bg-brand-900/20 group-hover:text-brand-400 group-hover:-translate-y-2'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">Upload your Resume</h3>
          <p className="text-gray-400 text-base mb-8 max-w-sm mx-auto leading-relaxed">
            Drag & drop your file here, or click to browse. <br />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 mt-2 block">Supports PDF & DOCX</span>
          </p>

          <span className={`inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-white transition-all shadow-md
            ${isLoading ? 'bg-gray-600 cursor-wait' : 'bg-brand-600 hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/20 hover:-translate-y-0.5'}
          `}>
            {isLoading ? 'Analyzing...' : 'Select File'}
          </span>

          <div className="mt-8 flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Your data is processed securely and never stored.
          </div>
        </label>
      </div>

      {/* Decorative background elements behind card */}
      <div className={`absolute -inset-1 bg-gradient-to-r from-brand-600 to-purple-600 rounded-3xl blur opacity-20 transition-opacity duration-500 ${dragActive ? 'opacity-40' : 'opacity-0 group-hover:opacity-30'}`}></div>
    </div>
  );
};

export default FileUpload;