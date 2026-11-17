import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Calendar, MapPin, Tag, FileText } from 'lucide-react';
import type { MediaItem } from '../types/media';

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
  if (!item) return null;

  const currentIndex = items.findIndex((m) => m.id === item.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const handlePrev = () => {
    if (hasPrev) onSelect(items[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) onSelect(items[currentIndex + 1]);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentIndex, items]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#c5a059] font-medium mb-1">
            {item.category} • {item.type === 'video' ? 'Cinematography Reel' : 'Still Photograph'}
          </div>
          <h2 className="text-lg md:text-xl font-serif text-white tracking-wide">
            {item.title}
          </h2>
          {item.originalFilename && (
            <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-[#f3e5ab]/80">
              <FileText className="w-3 h-3 text-[#c5a059]" />
              <span>Original: <span className="text-white underline">{item.originalFilename}</span></span>
              {item.curatedFilename && (
                <span>| Curated: <span className="text-[#f3e5ab]">{item.curatedFilename}</span></span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={item.url}
            download={item.originalFilename || item.title}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-full bg-white/10 hover:bg-[#c5a059] hover:text-black text-white/80 transition-all border border-white/10"
            title="Download Original Asset"
          >
            <Download className="w-5 h-5" />
          </a>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Prev Navigation */}
      {hasPrev && (
        <button
          onClick={handlePrev}
          className="absolute left-6 z-20 p-3 rounded-full bg-black/50 hover:bg-[#c5a059] hover:text-black text-white/90 backdrop-blur-md border border-white/10 transition-all transform hover:scale-110 hidden md:flex items-center justify-center"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next Navigation */}
      {hasNext && (
        <button
          onClick={handleNext}
          className="absolute right-6 z-20 p-3 rounded-full bg-black/50 hover:bg-[#c5a059] hover:text-black text-white/90 backdrop-blur-md border border-white/10 transition-all transform hover:scale-110 hidden md:flex items-center justify-center"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Content Container */}
      <div className="w-full h-full max-w-6xl max-h-[80vh] p-4 md:p-8 flex items-center justify-center">
        {item.type === 'image' ? (
          <img
            src={item.url}
            alt={item.title}
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300"
          />
        ) : (
          <video
            src={item.url}
            controls
            autoPlay
            playsInline
            className="max-h-full max-w-full rounded-lg shadow-2xl border border-white/10"
          />
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col md:flex-row items-center justify-between text-xs text-white/70 gap-3">
        <div className="flex items-center gap-6">
          {item.coupleName && (
            <span className="text-white font-medium">Couples: {item.coupleName}</span>
          )}
          {item.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#c5a059]" /> {item.location}
            </span>
          )}
          {item.date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#c5a059]" /> {item.date}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#f3e5ab] font-mono">
            <Tag className="w-3 h-3" /> {item.category}
          </span>
          <span className="text-white/40 font-mono">
            {currentIndex + 1} of {items.length}
          </span>
        </div>
      </div>
    </div>
  );
};
