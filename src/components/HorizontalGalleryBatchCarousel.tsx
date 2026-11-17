import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Maximize2, Sparkles } from 'lucide-react';
import type { MediaItem } from '../types/media';

interface HorizontalGalleryBatchCarouselProps {
  items: MediaItem[];
  batchSize?: number;
  onOpenLightbox: (item: MediaItem) => void;
  onPlayFilm: (filmUrl: string, title: string, couple: string, poster?: string, gdriveId?: string) => void;
}

export const HorizontalGalleryBatchCarousel: React.FC<HorizontalGalleryBatchCarouselProps> = ({
  items,
  batchSize = 24,
  onOpenLightbox,
  onPlayFilm,
}) => {
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const pillTrackRef = useRef<HTMLDivElement | null>(null);

  const totalBatches = Math.ceil(items.length / batchSize) || 1;
  const currentBatchItems = items.slice(
    currentBatchIndex * batchSize,
    (currentBatchIndex + 1) * batchSize
  );

  // Reset batch index if total items change (e.g. search filter applied)
  useEffect(() => {
    setCurrentBatchIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
    if (pillTrackRef.current) {
      pillTrackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [items.length]);

  // Keep active pill scrolled into view inside the pill bar
  useEffect(() => {
    if (!pillTrackRef.current) return;
    const activePill = pillTrackRef.current.querySelector<HTMLButtonElement>(`[data-batch="${currentBatchIndex}"]`);
    if (activePill) {
      activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentBatchIndex]);

  const handleScrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -450, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 450, behavior: 'smooth' });
  };

  const handleSelectBatch = (index: number) => {
    const validIndex = Math.max(0, Math.min(index, totalBatches - 1));
    setCurrentBatchIndex(validIndex);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const handlePillScrollLeft = () => {
    if (!pillTrackRef.current) return;
    pillTrackRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const handlePillScrollRight = () => {
    if (!pillTrackRef.current) return;
    pillTrackRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative bg-gradient-to-b from-[#101420] via-[#141826] to-[#0c0f17] p-5 sm:p-8 rounded-3xl border border-[#c5a059]/30 shadow-2xl overflow-hidden my-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#c5a059] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
            Horizontal Story Carousel • Page {currentBatchIndex + 1} of {totalBatches}
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-wide font-normal">
            Browse Moments Horizontally
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Showing {currentBatchItems.length} curated memories ({currentBatchIndex * batchSize + 1}–{Math.min((currentBatchIndex + 1) * batchSize, items.length)} of {items.length})
          </p>
        </div>

        {/* Carousel Arrow Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleScrollLeft}
            className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-[#c5a059] hover:text-black text-white/80 border border-white/10 transition-all shadow-md active:scale-95"
            aria-label="Scroll Carousel Left"
            title="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleScrollRight}
            className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-[#c5a059] hover:text-black text-white/80 border border-white/10 transition-all shadow-md active:scale-95"
            aria-label="Scroll Carousel Right"
            title="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Horizontal Carousel Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto py-2 scroll-smooth no-scrollbar snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {currentBatchItems.map((item) => (
          <div
            key={item.id}
            className="snap-start shrink-0 w-64 sm:w-72 md:w-80 group/card relative rounded-2xl overflow-hidden bg-black/80 border border-white/10 hover:border-[#c5a059]/70 transition-all duration-500 shadow-xl cursor-pointer"
            onClick={() => {
              if (item.type === 'video') {
                onPlayFilm(item.url, item.title, item.coupleName || 'Harsha & Bhuvesh', item.thumbnailUrl, item.gdriveId);
              } else {
                onOpenLightbox(item);
              }
            }}
          >
            {/* Visual Cover */}
            <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#0c0e14]">
              <img
                src={item.type === 'video' ? (item.thumbnailUrl || item.url) : item.url}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover/card:opacity-50 transition-opacity" />

              {/* Video Play Badge or Photo Lightbox Pill */}
              {item.type === 'video' ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-black/70 group-hover/card:bg-[#c5a059] text-white group-hover/card:text-black flex items-center justify-center transition-all duration-300 shadow-2xl group-hover/card:scale-110">
                    <Play className="w-6 h-6 ml-0.5 fill-current" />
                  </div>
                </div>
              ) : (
                <div className="absolute top-3 right-3 opacity-0 group-hover/card:opacity-100 transition-opacity p-2 rounded-full bg-black/60 text-[#f3e5ab] backdrop-blur-md">
                  <Maximize2 className="w-4 h-4" />
                </div>
              )}

              {/* Tag Pill */}
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/80 text-[#f3e5ab] border border-white/15 backdrop-blur-md">
                  {item.type === 'video' ? 'Cinema Reel' : 'Photo'}
                </span>
              </div>

              {/* Bottom Card Meta Details */}
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-sm sm:text-base font-serif text-white truncate font-normal group-hover/card:text-[#f3e5ab] transition-colors">
                  {item.title}
                </p>
                {item.originalFilename && (
                  <p className="text-[10px] font-mono text-[#f3e5ab]/75 truncate mt-1">
                    {item.originalFilename}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM UNIFIED PAGE NAVIGATION PILL WITH FULL CONTINUOUS SCROLL */}
      <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center">
        <div className="relative max-w-full flex items-center gap-1.5 sm:gap-2 bg-[#0f131d] px-3 sm:px-4 py-2 rounded-full border border-white/10 shadow-2xl select-none">
          {/* Previous Page Arrow */}
          <button
            onClick={() => handleSelectBatch(currentBatchIndex - 1)}
            disabled={currentBatchIndex === 0}
            className="p-1.5 rounded-full text-white/60 hover:text-white disabled:opacity-20 disabled:hover:text-white/60 transition-colors shrink-0"
            title="Previous Page"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Horizontally scrollable track containing ALL numbers (1 through 26) with zero ellipses */}
          <div
            ref={pillTrackRef}
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-[260px] sm:max-w-[420px] md:max-w-[560px] scroll-smooth no-scrollbar py-0.5 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {Array.from({ length: totalBatches }, (_, i) => {
              const pageNum = i + 1;
              const isSelected = currentBatchIndex === i;
              return (
                <button
                  key={pageNum}
                  data-batch={i}
                  onClick={() => handleSelectBatch(i)}
                  className={`min-w-8 h-8 sm:min-w-9 sm:h-9 px-2 rounded-full flex items-center justify-center text-xs sm:text-sm font-mono font-medium transition-all shrink-0 ${
                    isSelected
                      ? 'bg-[#dfba73] text-black font-bold shadow-lg shadow-[#c5a059]/40 scale-105 ring-2 ring-[#c5a059]/50'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title={`Go to Page ${pageNum}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Page Arrow */}
          <button
            onClick={() => handleSelectBatch(currentBatchIndex + 1)}
            disabled={currentBatchIndex === totalBatches - 1}
            className="p-1.5 rounded-full text-white/60 hover:text-white disabled:opacity-20 disabled:hover:text-white/60 transition-colors shrink-0"
            title="Next Page"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
