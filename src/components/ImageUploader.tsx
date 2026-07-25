import React, { useRef, useState } from 'react';
import { Upload, RefreshCw, Trash2, CheckCircle2, FileImage } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  className?: string;
  previewHeightClass?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  helperText = 'Upload an image directly from your computer, phone gallery, or device file manager.',
  className = '',
  previewHeightClass = 'h-48',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP, GIF, etc.)');
      return;
    }
    // Limit to 15MB
    if (file.size > 15 * 1024 * 1024) {
      setError('Image file size is too large (max 15MB). Please choose a smaller image.');
      return;
    }

    setError(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setError('Failed to read image file. Please try selecting another file.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs font-bold text-stone-800">{label}</label>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
        className="hidden"
      />

      {/* Upload Zone / Preview Container */}
      {value ? (
        <div className="relative group rounded-2xl border-2 border-stone-200 bg-stone-50 overflow-hidden transition-all shadow-xs hover:border-amber-700">
          <div className={`w-full ${previewHeightClass} bg-stone-900/5 relative flex items-center justify-center p-2`}>
            <img
              src={value}
              alt="Uploaded Preview"
              className="max-h-full max-w-full object-contain rounded-xl shadow-md"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-amber-300" />
                <span>Processing Image...</span>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-3 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-stone-800 truncate">Image Uploaded Successfully</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-amber-900 text-amber-100 hover:bg-amber-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace Image</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-rose-200 transition-all"
                title="Remove image"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-amber-700 bg-amber-50/80 scale-[0.99]'
              : 'border-stone-300 bg-stone-50/60 hover:bg-amber-50/30 hover:border-amber-600'
          }`}
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mb-3 shadow-xs">
            <Upload className="w-6 h-6" />
          </div>

          <h4 className="text-xs font-bold text-stone-900 mb-1">
            Upload from device gallery or drag & drop image here
          </h4>
          <p className="text-[11px] text-stone-500 max-w-xs mx-auto mb-3">
            Select an image directly from your mobile phone, tablet, or desktop file manager.
          </p>

          <button
            type="button"
            className="px-4 py-2 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl hover:bg-stone-800 shadow-md inline-flex items-center gap-2"
          >
            <FileImage className="w-4 h-4" />
            <span>Upload Image File</span>
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200">
          {error}
        </p>
      )}

      {helperText && !value && <p className="text-[10px] text-stone-400 font-medium">{helperText}</p>}
    </div>
  );
};
