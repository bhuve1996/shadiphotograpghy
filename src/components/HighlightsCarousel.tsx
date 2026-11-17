import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Maximize2 } from 'lucide-react';
import type { MediaItem } from '../types/media';

interface HighlightsCarouselProps {
  items: MediaItem[];
  onOpenLightbox: (item: MediaItem) => void;
  onPlayFilm: (filmUrl: string, title: string, couple: string, poster?: string, gdriveId?: string) => void;
}

export const HighlightsCarousel: React.FC<HighlightsCarouselProps> = ({
  items,
  onOpenLightbox,
  onPlayFilm,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -420 : 420;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative mb-14 bg-gradient-to-r from-[#11141f] via-[#161a29] to-[#11141f] p-5 sm:p-7 rounded-3xl border border-[#c5a059]/25 shadow-2xl overflow-hidden group/carousel">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#c5a059]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
            Curated Carousel Stream
          </div>
          <h3 className="text-xl sm:text-2xl font-serif text-white tracking-wide mt-0.5">
            Story Highlights Reel
          </h3>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-[#c5a059] hover:text-black text-white/80 border border-white/10 transition-all"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-[#c5a059] hover:text-black text-white/80 border border-white/10 transition-all"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 pt-1 scroll-smooth no-scrollbar snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="snap-start shrink-0 w-64 sm:w-72 md:w-80 group/card relative rounded-2xl overflow-hidden bg-black/60 border border-white/10 hover:border-[#c5a059]/60 transition-all duration-500 shadow-xl cursor-pointer"
            onClick={() => {
              if (item.type === 'video') {
                onPlayFilm(item.url, item.title, item.coupleName || 'Harsha & Bhuvesh', item.thumbnailUrl, item.gdriveId);
              } else {
                onOpenLightbox(item);
              }
            }}
          >
            {/* Visual Cover */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[#0c0e14]">
              <img
                src={item.type === 'video' ? (item.thumbnailUrl || item.url) : item.url}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover/card:opacity-60 transition-opacity" />

              {/* Video Play Badge or Photo Indicator */}
              {item.type === 'video' ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/70 group-hover/card:bg-[#c5a059] text-white group-hover/card:text-black flex items-center justify-center transition-all duration-300 shadow-xl group-hover/card:scale-110">
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </div>
                </div>
              ) : (
                <div className="absolute top-3 right-3 opacity-0 group-hover/card:opacity-100 transition-opacity p-2 rounded-full bg-black/60 text-[#f3e5ab] backdrop-blur-md">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Category Pill */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/70 text-[#f3e5ab] border border-white/10 backdrop-blur-md">
                  {item.type === 'video' ? 'Cinema' : 'Photo'}
                </span>
              </div>

              {/* Bottom Info Overlay */}
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-xs sm:text-sm font-serif text-white truncate font-normal">
                  {item.title}
                </p>
                {item.originalFilename && (
                  <p className="text-[10px] font-mono text-[#f3e5ab]/70 truncate mt-0.5">
                    {item.originalFilename}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
