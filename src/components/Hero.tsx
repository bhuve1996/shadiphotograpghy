import { useState } from 'react';
import { Play, Sparkles } from 'lucide-react';
import { HighEndVideoPlayer } from './HighEndVideoPlayer';

interface HeroProps {
  onExploreGallery: () => void;
  onOpenUpload?: () => void;
}

// Curated luxury tilted photo frames scattered aesthetically in background
const BACKGROUND_FRAMES = [
  {
    src: "/media/roka/photos/Roka_Pro_Photo_073_orig_IMG_9525.JPG.jpg",
    className: "top-10 left-6 sm:left-14 w-28 sm:w-44 md:w-52 rotate-[-12deg] hover:rotate-0",
    caption: "Sacred Rituals",
    delay: "0s"
  },
  {
    src: "/media/roka/photos/Roka_P2_Photo_444_orig_P2_IMG_0001.JPG.jpg",
    className: "top-14 right-6 sm:right-16 w-32 sm:w-48 md:w-56 rotate-[10deg] hover:rotate-0",
    caption: "Chunni Ceremony",
    delay: "0.2s"
  },
  {
    src: "/media/roka/photos/Roka_Pro_Photo_091_orig_IMG_9553.JPG.jpg",
    className: "bottom-12 left-4 sm:left-24 w-28 sm:w-40 md:w-48 rotate-[8deg] hover:rotate-0",
    caption: "Family Blessings",
    delay: "0.4s"
  },
  {
    src: "/media/roka/photos/Roka_P2_Photo_500_orig_P2_IMG_0070.JPG.jpg",
    className: "bottom-14 right-4 sm:right-28 w-30 sm:w-44 md:w-52 rotate-[-9deg] hover:rotate-0",
    caption: "Golden Smiles",
    delay: "0.6s"
  },
  {
    src: "/media/roka/photos/Roka_Pro_Photo_154_orig_IMG_9630.JPG.jpg",
    className: "hidden lg:block top-1/2 left-8 -translate-y-1/2 w-36 rotate-[-5deg] hover:rotate-0 opacity-40 hover:opacity-100",
    caption: "Roka Memoir",
    delay: "0.8s"
  },
  {
    src: "/media/roka/photos/Roka_P2_Photo_550_orig_P2_IMG_0138.JPG.jpg",
    className: "hidden lg:block top-1/2 right-10 -translate-y-1/2 w-36 rotate-[6deg] hover:rotate-0 opacity-40 hover:opacity-100",
    caption: "Celebrations",
    delay: "1s"
  }
];

export const Hero: React.FC<HeroProps> = ({ onExploreGallery }) => {
  const [isPlayingTeaser, setIsPlayingTeaser] = useState(false);

  return (
    <section className="relative min-h-[75vh] md:min-h-[82vh] flex items-center justify-center overflow-hidden bg-[#07080b] text-white">
      {/* Background Soft Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0d1017] to-[#07080b]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(197,160,89,0.12)_0%,_transparent_75%)]" />

      {/* Floating Tilted Polaroid/Photo Frames */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {BACKGROUND_FRAMES.map((frame, index) => (
          <div
            key={index}
            className={`absolute ${frame.className} pointer-events-auto transition-all duration-700 ease-out hover:scale-105 hover:z-20 cursor-pointer group`}
            style={{ animationDelay: frame.delay }}
            onClick={onExploreGallery}
          >
            {/* Elegant Polaroid Luxury Matte Border */}
            <div className="p-1.5 sm:p-2 pb-4 sm:pb-6 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg shadow-2xl shadow-black/80 border border-white/20 transition-all duration-300">
              <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded bg-black">
                <img
                  src={frame.src}
                  alt={frame.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
              </div>
              <div className="mt-1.5 sm:mt-2 text-center">
                <span className="font-serif italic text-[10px] sm:text-xs text-[#f3e5ab] tracking-wider block truncate">
                  {frame.caption}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Foreground Minimalist Direct Button Centerpiece */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-20 flex flex-col items-center">
        {/* Subtle Luxury Monogram / Aura */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-[#c5a059]/40 backdrop-blur-md mb-8 shadow-lg shadow-black/50">
          <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#f3e5ab] font-medium">
            Harsha & Bhuvesh • Roka Ceremony & Cinema
          </span>
        </div>

        {/* Headline with Champagne Gradient */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight text-white mb-8 leading-[1.1]">
          The Sacred Roka Memoir
        </h1>

        {/* Clean Direct Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md">
          <button
            onClick={() => setIsPlayingTeaser(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#c5a059] via-[#dfba73] to-[#c5a059] text-black font-semibold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#c5a059]/40 flex items-center justify-center gap-2.5 active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            Watch Roka Film
          </button>

          <button
            onClick={onExploreGallery}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-black/60 hover:bg-white/10 text-white font-medium text-xs sm:text-sm tracking-widest uppercase backdrop-blur-xl border border-white/20 hover:border-[#c5a059]/50 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
          >
            Explore Gallery (624)
          </button>
        </div>
      </div>

      {/* Video Modal with Local Fast Web Video & Drive Download */}
      {isPlayingTeaser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={() => setIsPlayingTeaser(false)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white text-xs font-mono tracking-wider flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full"
            >
              CLOSE THEATRE &times;
            </button>
            <HighEndVideoPlayer
              src="/media/roka/web_videos/IMG_9347.mp4"
              poster="/media/roka/photos/Roka_Moment_01_orig_IMG_4345.JPG.jpeg_.jpg"
              coupleName="Harsha & Bhuvesh"
              title="Official 4K Roka Ceremony Film"
              gdriveId="1O5aPL_89CebKWTF_U2K_iKXx1mbL3Kp9"
              autoPlay={true}
              className="aspect-video w-full"
            />
          </div>
        </div>
      )}
    </section>
  );
};
