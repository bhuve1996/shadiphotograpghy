import React, { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Calendar, MapPin, Tag, FileText, Loader2, Sparkles } from 'lucide-react';
import type { MediaItem } from '../types/media';
import { AssetManager } from '../services/assetManager';

interface MediaLightboxProps {
  item: MediaItem | null;
  items: MediaItem[];
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
}

export const MediaLightbox: React.FC<MediaLightboxProps> = ({
  item,
  items,
  onClose,
  onSelect,
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isFullLoaded, setIsFullLoaded] = useState(false);
  const [isThumbReady, setIsThumbReady] = useState(false);

  const currentIndex = item ? items.findIndex((m) => m.id === item.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < items.length - 1;

  const thumbUrl = item?.url.replace('/media/roka/photos/', '/media/roka/thumbs/');

  // Preload adjacent images in background cache for instant navigation
  useEffect(() => {
    if (currentIndex >= 0) {
      setIsFullLoaded(false);
      setIsThumbReady(false);
      const nextUrls = [
        items[currentIndex + 1]?.url,
        items[currentIndex + 2]?.url,
        items[currentIndex - 1]?.url,
      ].filter(Boolean) as string[];
      AssetManager.preloadBatch(nextUrls);
    }
  }, [currentIndex, items]);

  const handlePrev = useCallback(() => {
    if (hasPrev) onSelect(items[currentIndex - 1]);
  }, [hasPrev, currentIndex, items, onSelect]);

  const handleNext = useCallback(() => {
    if (hasNext) onSelect(items[currentIndex + 1]);
  }, [hasNext, currentIndex, items, onSelect]);

  useEffect(() => {
    if (!item) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [item, handlePrev, handleNext, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50 && hasNext) {
      handleNext();
    } else if (diff < -50 && hasPrev) {
      handlePrev();
    }
    setTouchStart(null);
  };

  if (!item) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar */}
      <div className="p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/90 to-transparent">
        <div className="min-w-0 pr-4">
          <div className="text-[10px] sm:text-xs uppercase tracking-widest text-[#c5a059] font-medium mb-0.5 truncate flex items-center gap-2">
            <span>{item.category} • {item.type === 'video' ? 'Cinema Reel' : 'High Resolution'}</span>
            {isFullLoaded && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#c5a059]/20 text-[#f3e5ab] border border-[#c5a059]/40">
                <Sparkles className="w-2.5 h-2.5" /> 2K HD Ready
              </span>
            )}
          </div>
          <h2 className="text-sm sm:text-lg md:text-xl font-serif text-white tracking-wide truncate">
            {item.title}
          </h2>
          {item.originalFilename && (
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] sm:text-[11px] font-mono text-[#f3e5ab]/80 truncate">
              <FileText className="w-3 h-3 text-[#c5a059] shrink-0" />
              <span className="truncate">Original Camera File: <span className="text-white underline">{item.originalFilename}</span></span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {item.gdriveId ? (
            <a
              href={`https://drive.google.com/uc?export=download&id=${item.gdriveId}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 sm:p-2.5 rounded-full bg-[#c5a059]/20 hover:bg-[#c5a059] hover:text-black text-[#f3e5ab] transition-all border border-[#c5a059]/50 flex items-center gap-1.5 text-xs font-mono"
              title="Download Full Raw Camera Quality from Google Drive"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#c5a059] group-hover:text-black" />
              <span className="hidden md:inline">Download Raw (Drive)</span>
            </a>
          ) : (
            <a
              href={item.url}
              download={item.originalFilename || item.title}
              target="_blank"
              rel="noreferrer"
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-[#c5a059] hover:text-black text-white/80 transition-all border border-white/10 flex items-center gap-1.5 text-xs font-mono"
              title="Download Full Resolution Asset"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden md:inline">Download</span>
            </a>
          )}
          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
            title="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Main Visual Display with Progressive Blur-Up */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 max-h-[72vh] md:max-h-[78vh] overflow-hidden">
        {/* Spinner when waiting */}
        {!isFullLoaded && (
          <div className="absolute top-4 right-6 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[11px] text-[#f3e5ab] font-mono">
            <Loader2 className="w-3.5 h-3.5 text-[#c5a059] animate-spin" />
            <span>Sharpening...</span>
          </div>
        )}

        {hasPrev && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-20 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-[#c5a059] hover:text-black text-white backdrop-blur-md border border-white/10 transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {hasNext && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-20 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-[#c5a059] hover:text-black text-white backdrop-blur-md border border-white/10 transition-all"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {item.type === 'image' ? (
          <div className="relative max-h-full max-w-full flex items-center justify-center">
            {/* 1. Low-Resolution Instant Blur Preview */}
            {!isFullLoaded && thumbUrl && (
              <img
                src={thumbUrl}
                alt=""
                aria-hidden="true"
                onLoad={() => setIsThumbReady(true)}
                className={`max-h-[70vh] md:max-h-[76vh] max-w-full object-contain rounded-lg filter blur-md scale-[1.02] transition-opacity duration-500 ${
                  isThumbReady ? 'opacity-80' : 'opacity-0'
                }`}
              />
            )}

            {/* 2. Full High-Resolution Sharp Image */}
            <img
              src={item.url}
              alt={item.title}
              onLoad={() => setIsFullLoaded(true)}
              className={`max-h-[70vh] md:max-h-[76vh] max-w-full object-contain rounded-lg shadow-2xl transition-all duration-700 ease-out ${
                isFullLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-98 absolute inset-0 m-auto'
              }`}
            />
          </div>
        ) : (
          <video
            src={item.url}
            controls
            autoPlay
            playsInline
            onLoadedData={() => setIsFullLoaded(true)}
            className={`max-h-full max-w-full rounded-lg shadow-2xl border border-white/10 transition-all duration-300 ${
              isFullLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col sm:flex-row items-center justify-between text-xs text-white/70 gap-2 sm:gap-3 z-20">
        <div className="flex items-center gap-4 text-[11px] sm:text-xs">
          {item.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#c5a059]" /> {item.location}
            </span>
          )}
          {item.date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#c5a059]" /> {item.date}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] sm:text-xs text-[#f3e5ab] font-mono flex items-center gap-1">
            <Tag className="w-3 h-3" /> {item.category}
          </span>
          <span className="text-white/40 font-mono text-[10px] sm:text-xs">
            {currentIndex + 1} of {items.length}
          </span>
        </div>
      </div>
    </div>
  );
};
