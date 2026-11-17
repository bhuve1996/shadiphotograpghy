import { useState } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { HighEndVideoPlayer } from './HighEndVideoPlayer';

interface HeroProps {
  onExploreGallery: () => void;
  onOpenUpload?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreGallery }) => {
  const [isPlayingTeaser, setIsPlayingTeaser] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Cinematic Video Loop */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster="/media/roka/photos/Roka_Moment_01__[orig__IMG_4345.JPG.jpeg].jpg"
          className="w-full h-full object-cover opacity-45 scale-105 transform animate-pulse duration-[10000ms]"
        >
          <source
            src="/media/roka/videos/Roka_Cinema_Highlight_01__[orig__IMG_4344.MOV].mp4"
            type="video/mp4"
          />
        </video>
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0b0c10_90%)]" />
      </div>

      {/* Floating Audio Toggle */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-24 right-8 z-20 p-3 rounded-full bg-black/40 hover:bg-[#c5a059] hover:text-black text-white/80 backdrop-blur-md border border-white/10 transition-all text-xs flex items-center gap-2"
        title={isMuted ? 'Unmute Ambient Sound' : 'Mute'}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        <span className="hidden sm:inline text-[11px] font-mono tracking-wider">
          {isMuted ? 'SOUND OFF' : 'SOUND ON'}
        </span>
      </button>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-24">
        {/* Atelier Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#c5a059]/40 backdrop-blur-md mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#f3e5ab] font-medium">
            The Auspicious Beginning • Roka Ceremony
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-normal tracking-tight text-white mb-6 leading-[1.08]">
          Harsha & Bhuvesh <br />
          <span className="italic font-light text-[#f3e5ab] bg-gradient-to-r from-[#f3e5ab] via-[#c5a059] to-[#dfba73] bg-clip-text text-transparent">
            The Roka Memoir
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-300 font-sans font-light tracking-wide mb-10 leading-relaxed">
          The union of two hearts and two families. 
          A celebratory evening etched in sacred rituals, golden smiles, and cinematic memories.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setIsPlayingTeaser(true)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#c5a059] via-[#dfba73] to-[#c5a059] text-black font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#c5a059]/30 flex items-center justify-center gap-2.5"
          >
            <Play className="w-4 h-4 fill-current" />
            Watch Roka Film
          </button>

          <button
            onClick={onExploreGallery}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm tracking-wider uppercase backdrop-blur-md border border-white/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Explore Gallery
          </button>
        </div>
      </div>

      {/* Showreel Modal */}
      {isPlayingTeaser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={() => setIsPlayingTeaser(false)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white text-sm font-mono tracking-wider flex items-center gap-1.5"
            >
              CLOSE [ESC]
            </button>
            <HighEndVideoPlayer
              src="/media/roka/videos/Roka_Cinema_Highlight_01__[orig__IMG_4344.MOV].mp4"
              poster="/media/roka/photos/Roka_Moment_01__[orig__IMG_4345.JPG.jpeg].jpg"
              coupleName="Harsha & Bhuvesh"
              title="Official 4K Roka Ceremony Film"
              autoPlay={true}
              className="aspect-video w-full"
            />
          </div>
        </div>
      )}
    </section>
  );
};
