import { useState, useEffect, useRef } from 'react';
import { Play, Trash2, MapPin, Calendar, FileText, ImageOff } from 'lucide-react';
import type { MediaItem } from '../types/media';
import { AssetManager } from '../services/assetManager';

interface MediaCardProps {
  item: MediaItem;
  onOpenLightbox: (item: MediaItem) => void;
  onOpenVideoPlayer?: (item: MediaItem) => void;
  onDelete?: (id: string) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  onOpenLightbox,
  onOpenVideoPlayer,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(() => AssetManager.isFailed(item.url));
  const [isLoaded, setIsLoaded] = useState(() => AssetManager.isLoaded(item.url));
  const isVideo = item.type === 'video';
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    // If browser already has cached image complete, mark loaded immediately
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
      AssetManager.preloadImage(item.url);
    }
  }, [item.url]);

  const handleClick = () => {
    if (isVideo && onOpenVideoPlayer) {
      onOpenVideoPlayer(item);
    } else {
      onOpenLightbox(item);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-xl bg-[#141824] border border-white/5 transition-all duration-500 hover:border-[#c5a059]/40 hover:shadow-2xl hover:shadow-[#c5a059]/10 cursor-pointer break-inside-avoid mb-6"
      onClick={handleClick}
    >
      {/* Media container with guaranteed minimum height */}
      <div className="relative w-full overflow-hidden bg-[#10131d] min-h-[280px] flex items-center justify-center">
        {isVideo ? (
          <div className="relative w-full min-h-[280px] aspect-[16/10] bg-black">
            {item.thumbnailUrl && !hasError ? (
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                onError={() => setHasError(true)}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <video
                src={item.url}
                className="w-full h-full object-cover"
                muted
                playsInline
                preload="metadata"
              />
            )}
            {/* Video Play Pill */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
              <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-[#c5a059]/60 flex items-center justify-center text-[#f3e5ab] group-hover:scale-110 group-hover:bg-[#c5a059] group-hover:text-black transition-all duration-300 shadow-xl">
                <Play className="w-6 h-6 ml-0.5 fill-current" />
              </div>
            </div>
            {/* Duration Tag */}
            <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[11px] font-mono text-[#f3e5ab] border border-white/10 z-10">
              {item.duration || 'VIDEO'}
            </span>
          </div>
        ) : (
          <div className="w-full relative min-h-[280px] bg-[#0e111a] flex items-center justify-center">
            {/* Elegant Luxury Shimmer Skeleton loader while loading */}
            {!isLoaded && !hasError && (
              <div className="absolute inset-0 skeleton-shimmer z-0 flex flex-col items-center justify-center p-4">
                <div className="w-8 h-8 rounded-full border border-[#c5a059]/40 border-t-[#c5a059] animate-spin mb-2" />
                <span className="text-[10px] font-serif tracking-widest text-[#f3e5ab]/50 uppercase">Loading Memoir...</span>
              </div>
            )}

            {!hasError ? (
              <img
                ref={imgRef}
                src={item.url}
                alt={item.title}
                loading="lazy"
                decoding="async"
                onLoad={() => {
                  setIsLoaded(true);
                  AssetManager.preloadImage(item.url);
                }}
                onError={() => {
                  setHasError(true);
                  setIsLoaded(true);
                }}
                className={`w-full h-auto min-h-[280px] max-h-[580px] object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center p-6 text-white/40">
                <ImageOff className="w-8 h-8 text-[#c5a059]/60 mb-2" />
                <span className="text-xs font-serif text-white/60">{item.title}</span>
                <span className="text-[10px] font-mono text-white/30 mt-1">{item.originalFilename}</span>
              </div>
            )}
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute top-3 left-3 z-20">
          <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] tracking-wider uppercase font-medium text-[#f3e5ab] border border-white/10 shadow-lg">
            {item.category}
          </span>
        </div>

        {/* Delete option for user uploads */}
        {item.sourceType === 'user-upload' && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 hover:bg-red-500/80 text-white transition-all opacity-0 group-hover:opacity-100"
            title="Delete this media"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Hover Overlay with Dual-name Metadata */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-5 flex flex-col justify-end transition-opacity duration-300 z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {item.coupleName && (
            <p className="text-xs uppercase tracking-widest text-[#c5a059] font-medium mb-1">
              {item.coupleName}
            </p>
          )}
          <h3 className="text-base font-serif text-white font-normal line-clamp-1">
            {item.title}
          </h3>

          {item.originalFilename && (
            <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-mono text-gray-300 truncate">
              <FileText className="w-3 h-3 text-[#c5a059] shrink-0" />
              <span className="truncate">Orig: <span className="text-[#f3e5ab]">{item.originalFilename}</span></span>
            </div>
          )}

          <div className="flex items-center gap-3 mt-2 text-[11px] text-white/70">
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
        </div>
      </div>
    </div>
  );
};
