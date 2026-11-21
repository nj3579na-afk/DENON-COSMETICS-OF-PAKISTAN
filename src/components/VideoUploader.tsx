import React, { useRef, useState } from 'react';
import { Video, RefreshCw, Trash2, CheckCircle2, Link2, Upload } from 'lucide-react';
import { uploadVideoToSupabase } from '../lib/supabase';

interface VideoUploaderProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  className?: string;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const clean = (url || '').trim();
  if (!clean) return null;
  const match = clean.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  label = 'Product Video (Optional)',
  value,
  onChange,
  helperText = 'Optional: Upload an MP4, WebM, or MOV product demo video (max 50MB) or paste a video / YouTube link. Leave empty if you only want a product photo.',
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg', 'video/x-m4v'];
    if (!validTypes.includes(file.type.toLowerCase()) && !file.type.startsWith('video/')) {
      setError('Invalid format. Please select an MP4, WebM, or MOV video file.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('Video file is too large (max 50MB). Please upload a smaller clip or paste a video link.');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const uploadedUrl = await uploadVideoToSupabase(file, 'product_video');
      onChange(uploadedUrl);
    } catch {
      setError('Failed to upload video. Please try again or paste a direct video URL.');
    } finally {
      setIsProcessing(false);
    }
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

  const handleApplyUrl = () => {
    const clean = urlInput.trim();
    if (!clean) return;
    setError(null);
    onChange(clean);
    setUrlInput('');
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const youtubeEmbed = value ? getYouTubeEmbedUrl(value) : null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-bold text-stone-800">{label}</label>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
          Optional
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="video/mp4,video/webm,video/quicktime,video/ogg,.mp4,.webm,.mov"
        className="hidden"
      />

      {value ? (
        <div className="relative rounded-2xl border-2 border-stone-200 bg-stone-50 overflow-hidden shadow-xs hover:border-amber-700 transition-all">
          <div className="w-full h-56 bg-stone-950 relative flex items-center justify-center">
            {youtubeEmbed ? (
              <iframe
                src={youtubeEmbed}
                title="Product Video Preview"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={value}
                controls
                playsInline
                preload="metadata"
                className="max-h-full max-w-full rounded-lg"
              />
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-amber-300" />
                <span>Uploading Video...</span>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-stone-800 truncate">
                Optional Product Video Attached
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-amber-900 text-amber-100 hover:bg-amber-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace Video</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-rose-200 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-amber-700 bg-amber-50/80 scale-[0.99]'
                : 'border-stone-300 bg-stone-50/60 hover:bg-amber-50/30 hover:border-amber-600'
            }`}
          >
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mb-2 shadow-xs">
              {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            </div>

            <h4 className="text-xs font-bold text-stone-900 mb-0.5">
              {isProcessing ? 'Uploading Video to Cloud...' : 'Upload optional product video or drag & drop here'}
            </h4>
            <p className="text-[11px] text-stone-500 max-w-sm mx-auto mb-2.5">
              Optional MP4, WebM, or MOV video from your phone, gallery, or computer.
            </p>

            <button
              type="button"
              disabled={isProcessing}
              className="px-4 py-1.5 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl hover:bg-stone-800 shadow-sm inline-flex items-center gap-1.5 disabled:opacity-60"
            >
              <Video className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Uploading...' : 'Select Video File (Optional)'}</span>
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="url"
                placeholder="Or paste optional video / YouTube URL (https://...)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-700 focus:outline-hidden"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-900 text-xs font-bold rounded-xl shrink-0 cursor-pointer"
            >
              Attach URL
            </button>
          </div>
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
