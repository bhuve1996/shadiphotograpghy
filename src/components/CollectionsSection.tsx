import { Play, Sparkles, MapPin, Calendar, Clock } from 'lucide-react';
import { INITIAL_COLLECTIONS } from '../data/initialData';
import type { CoupleCollection } from '../types/media';

interface CollectionsSectionProps {
  onSelectCollection: (collection: CoupleCollection) => void;
  onPlayFilm: (filmUrl: string, title: string, couple: string) => void;
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  onSelectCollection,
  onPlayFilm,
}) => {
  return (
    <section id="collections" className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#c5a059]/30 text-[#f3e5ab] text-xs uppercase tracking-widest font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" /> Auspicious Roka Milestone
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-wide font-normal mb-4">
          The Ceremony
        </h2>
        <p className="text-sm sm:text-base text-gray-400 font-sans leading-relaxed">
          A bespoke archive dedicated exclusively to Harsha & Bhuvesh’s Roka day.
        </p>
      </div>

      <div className="flex justify-center">
        {INITIAL_COLLECTIONS.map((col) => (
          <div
            key={col.id}
            className="w-full max-w-2xl group relative rounded-2xl overflow-hidden bg-[#131722] border border-white/5 hover:border-[#c5a059]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#c5a059]/15 flex flex-col justify-between"
          >
            {/* Cover Image Container */}
            <div className="relative aspect-[16/11] sm:aspect-[16/9] overflow-hidden">
              <img
                src={col.coverImage}
                alt={col.coupleName}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131722] via-[#131722]/30 to-black/30" />

              {/* Top Bar with Badge and Play Button (Responsive Stacking on Mobile) */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-10 flex flex-wrap items-center justify-between gap-2">
                <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono text-[#f3e5ab] border border-white/10 shrink-0">
                  {col.highlightsCount} Curated Memories
                </div>

                {col.filmUrl && (
                  <button
                    onClick={() => onPlayFilm(col.filmUrl!, `The Roka Film — ${col.coupleName}`, col.coupleName)}
                    className="px-3 sm:px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-[#c5a059] text-white hover:text-black backdrop-blur-md text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-all shadow-lg shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Roka Film ({col.filmDuration})</span>
                  </button>
                )}
              </div>

              {/* Overlay Text */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-10">
                <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-[#c5a059] font-medium tracking-wider uppercase mb-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" /> {col.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 shrink-0" /> {col.date}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-serif text-white tracking-wide font-normal mb-1 sm:mb-2">
                  {col.coupleName}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 italic font-serif opacity-90 leading-relaxed line-clamp-2 sm:line-clamp-none">
                  "{col.storyQuote}"
                </p>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="p-4 bg-[#10131c] border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-white/50 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#c5a059]" /> 4K Ultra HD & Full Photo Suite
              </span>
              <button
                onClick={() => onSelectCollection(col)}
                className="text-xs font-medium text-[#f3e5ab] hover:text-[#c5a059] transition-colors tracking-wider uppercase flex items-center gap-1"
              >
                View Roka Moments &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
