import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface WelcomeIntroProps {
  onFinish?: () => void;
}

export const WelcomeIntro: React.FC<WelcomeIntroProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if user already saw the intro during this session
    const hasSeenIntro = sessionStorage.getItem('has_seen_roka_welcome');
    if (hasSeenIntro) {
      setIsVisible(false);
      onFinish?.();
      return;
    }

    // Auto-dismiss after 3.2 seconds
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2800);

    const endTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('has_seen_roka_welcome', 'true');
      onFinish?.();
    }, 3500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [onFinish]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('has_seen_roka_welcome', 'true');
      onFinish?.();
    }, 400);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#07080b] transition-all duration-700 ease-in-out select-none ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient Royal Gold Lighting Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(197,160,89,0.18)_0%,_transparent_70%)] pointer-events-none" />
      
      {/* Decorative Traditional Mandap Floating Gold Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#c5a059]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#dfba73]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Center Welcome Card with Royal Borders */}
      <div className="relative z-10 max-w-xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Sacred Auspicious Motif */}
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#161a26] to-[#0c0f17] border border-[#c5a059]/40 shadow-xl shadow-[#c5a059]/20 animate-bounce duration-1000">
          <Sparkles className="w-8 h-8 text-[#dfba73]" />
        </div>

        {/* Auspicious Sacred Greeting */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#c5a059]/30 text-[#f3e5ab] text-xs font-mono uppercase tracking-[0.3em] mb-4 shadow-sm">
          Auspicious Beginning
        </div>

        {/* Devanagari "सुस्वागतम्" Calligraphy with Golden Shimmer */}
        <h1 className="text-5xl sm:text-7xl font-serif tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#e5c578] via-[#fff5d0] to-[#c5a059] mb-4 drop-shadow-2xl">
          सुस्वागतम्
        </h1>

        {/* English Pronunciation & Translation */}
        <p className="text-sm sm:text-base font-serif italic text-[#f3e5ab]/90 tracking-widest mb-3">
          (Su-Swāgatam • A Heartfelt Welcome)
        </p>

        {/* Couple Dedication */}
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#c5a059] to-transparent my-3" />

        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-white/80 font-medium max-w-md leading-relaxed">
          To The Auspicious Roka Ceremony of
        </p>
        <p className="text-xl sm:text-2xl font-serif text-[#dfba73] tracking-wide mt-1">
          Harsha & Bhuvesh
        </p>

        {/* Skip button for quick entry */}
        <button
          onClick={handleSkip}
          className="mt-8 px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-[#f3e5ab] text-[11px] font-mono uppercase tracking-widest border border-white/10 transition-all cursor-pointer"
        >
          Enter Celebration &rarr;
        </button>
      </div>

      {/* Bottom Progress Shimmer Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-transparent via-[#dfba73] to-transparent w-full animate-pulse" />
      </div>
    </div>
  );
};
