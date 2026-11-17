import React, { useEffect, useState, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Calendar, MapPin, Tag, FileText, Loader2, Sparkles, RotateCw, RotateCcw } from 'lucide-react';
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
  const [rotation, setRotation] = useState<number>(0);
  const filmstripRef = useRef<HTMLDivElement | null>(null);

  const currentIndex = item ? items.findIndex((m) => m.id === item.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < items.length - 1;

  const thumbUrl = item?.url.replace('/media/roka/photos/', '/media/roka/thumbs/');

  // Preload adjacent images in background cache for instant navigation
  useEffect(() => {
    if (currentIndex >= 0) {
      setIsFullLoaded(false);
      setIsThumbReady(false);
      setRotation(0); // Reset rotation on new image
      const nextUrls = [
        items[currentIndex + 1]?.url,
        items[currentIndex + 2]?.url,
        items[currentIndex - 1]?.url,
      ].filter(Boolean) as string[];
      AssetManager.preloadBatch(nextUrls);
    }
  }, [currentIndex, items]);

  // Automatically scroll filmstrip to keep active thumbnail centered
  useEffect(() => {
    if (!filmstripRef.current || currentIndex < 0) return;
    const activeThumb = filmstripRef.current.querySelector<HTMLButtonElement>(`[data-thumb-index="${currentIndex}"]`);
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentIndex]);

  const handleRotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleRotateCounterClockwise = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

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
      if (e.key === 'r' || e.key === 'R') handleRotateClockwise();
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
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300 select-none overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar */}
      <div className="p-3 sm:p-5 flex items-center justify-between z-20 bg-gradient-to-b from-black/90 to-transparent">
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
          {/* Rotate Control Button */}
          {item.type === 'image' && (
            <div className="flex items-center bg-white/10 rounded-full border border-white/10 p-0.5">
              <button
                onClick={handleRotateCounterClockwise}
                className="p-1.5 sm:p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-all"
                title="Rotate 90° Left"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              {rotation !== 0 && (
                <span className="text-[10px] font-mono px-1 text-[#f3e5ab]">
                  {rotation}°
                </span>
              )}
              <button
                onClick={handleRotateClockwise}
                className="p-1.5 sm:p-2 rounded-full hover:bg-white/20 text-[#c5a059] hover:text-[#f3e5ab] transition-all"
                title="Rotate 90° Right (Shortcut: R)"
              >
                <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}

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
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
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
            className="absolute left-2 sm:left-6 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-[#c5a059] hover:text-black text-white backdrop-blur-md border border-white/10 transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {hasNext && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-[#c5a059] hover:text-black text-white backdrop-blur-md border border-white/10 transition-all"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {item.type === 'image' ? (
          <div 
            className="relative max-h-full max-w-full flex items-center justify-center transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {/* 1. Low-Resolution Instant Blur Preview */}
            {!isFullLoaded && thumbUrl && (
              <img
                src={thumbUrl}
                alt=""
                aria-hidden="true"
                onLoad={() => setIsThumbReady(true)}
                className={`max-h-[62vh] md:max-h-[68vh] max-w-full object-contain rounded-lg filter blur-md scale-[1.02] transition-opacity duration-500 ${
                  isThumbReady ? 'opacity-80' : 'opacity-0'
                }`}
              />
            )}

            {/* 2. Full High-Resolution Sharp Image */}
            <img
              src={item.url}
              alt={item.title}
              onLoad={() => setIsFullLoaded(true)}
              className={`max-h-[62vh] md:max-h-[68vh] max-w-full object-contain rounded-lg shadow-2xl transition-all duration-700 ease-out ${
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
            className={`max-h-[62vh] md:max-h-[68vh] max-w-full rounded-lg shadow-2xl border border-white/10 transition-all duration-300 ${
              isFullLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </div>

      {/* BOTTOM SECTION: Thumbnail Filmstrip Ribbon & Meta Details */}
      <div className="z-20 bg-gradient-to-t from-black via-black/90 to-transparent pt-2 pb-3 sm:pb-4 px-3 sm:px-6 flex flex-col gap-2">
        {/* Thumbnail Filmstrip Ribbon */}
        <div className="flex items-center gap-2">
          {/* Scroll filmstrip left button */}
          <button
            onClick={() => {
              if (filmstripRef.current) filmstripRef.current.scrollBy({ left: -240, behavior: 'smooth' });
            }}
            className="p-1 rounded-full text-white/50 hover:text-[#c5a059] hover:bg-white/10 transition-colors shrink-0"
            title="Scroll Filmstrip Left"
            aria-label="Scroll Filmstrip Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Filmstrip Track */}
          <div
            ref={filmstripRef}
            className="flex items-center gap-2 overflow-x-auto py-1 scroll-smooth no-scrollbar flex-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((m, idx) => {
              const isCurrent = idx === currentIndex;
              const mThumb = m.type === 'video'
                ? (m.thumbnailUrl || m.url)
                : m.url.replace('/media/roka/photos/', '/media/roka/thumbs/');

              return (
                <button
                  key={m.id}
                  data-thumb-index={idx}
                  onClick={() => onSelect(m)}
                  className={`relative shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all duration-300 group cursor-pointer ${
                    isCurrent
                      ? 'ring-2 ring-[#c5a059] ring-offset-2 ring-offset-black scale-105 opacity-100 shadow-lg shadow-[#c5a059]/40'
                      : 'opacity-50 hover:opacity-85 hover:scale-102 border border-white/10'
                  }`}
                  title={m.title}
                >
                  <img
                    src={mThumb}
                    alt={m.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Subtle index badge */}
                  <div className={`absolute bottom-0.5 right-0.5 text-[8px] font-mono px-1 rounded ${
                    isCurrent ? 'bg-[#c5a059] text-black font-bold' : 'bg-black/70 text-white/70'
                  }`}>
                    {idx + 1}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scroll filmstrip right button */}
          <button
            onClick={() => {
              if (filmstripRef.current) filmstripRef.current.scrollBy({ left: 240, behavior: 'smooth' });
            }}
            className="p-1 rounded-full text-white/50 hover:text-[#c5a059] hover:bg-white/10 transition-colors shrink-0"
            title="Scroll Filmstrip Right"
            aria-label="Scroll Filmstrip Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Info Bar */}
        <div className="flex items-center justify-between text-xs text-white/70 px-1 pt-1 border-t border-white/5">
          <div className="flex items-center gap-3 text-[10px] sm:text-xs">
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
              <Tag className="w-3 h-3 text-[#c5a059]" /> {item.category}
            </span>
            <span className="text-white/60 font-mono text-[10px] sm:text-xs">
              <span className="text-[#f3e5ab] font-bold">{currentIndex + 1}</span> of {items.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
