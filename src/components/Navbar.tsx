import { useState } from 'react';
import { Video, Image as ImageIcon, Menu, X, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenUpload?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  itemsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  itemsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: string, scrollTargetId?: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (scrollTargetId) {
      document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0c10]/90 backdrop-blur-xl border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Logo with Royal H&B Crest */}
        <div 
          onClick={() => {
            setActiveTab('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group"
        >
          <Logo size={42} />
          <div>
            <span className="block font-serif text-base sm:text-lg md:text-xl tracking-[0.15em] sm:tracking-[0.2em] font-semibold text-white uppercase group-hover:text-[#f3e5ab] transition-colors leading-tight">
              HARSHA & BHUVESH
            </span>
            <span className="block text-[8px] sm:text-[9px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#c5a059] font-sans">
              The Roka Memoir & Cinema
            </span>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <button
            onClick={() => handleNavClick('all', 'gallery-section')}
            className={`text-xs uppercase tracking-widest transition-colors font-medium ${
              activeTab === 'all' ? 'text-[#f3e5ab] border-b-2 border-[#c5a059] pb-1' : 'text-gray-400 hover:text-white'
            }`}
          >
            All Memories ({itemsCount})
          </button>

          <button
            onClick={() => handleNavClick('videos', 'gallery-section')}
            className={`flex items-center gap-1.5 text-xs uppercase tracking-widest transition-colors font-medium ${
              activeTab === 'videos' ? 'text-[#f3e5ab] border-b-2 border-[#c5a059] pb-1' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" /> Cinema Films
          </button>

          <button
            onClick={() => handleNavClick('images', 'gallery-section')}
            className={`flex items-center gap-1.5 text-xs uppercase tracking-widest transition-colors font-medium ${
              activeTab === 'images' ? 'text-[#f3e5ab] border-b-2 border-[#c5a059] pb-1' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Stills & Portraits
          </button>

          <button
            onClick={() => handleNavClick('all', 'collections')}
            className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors font-medium"
          >
            The Story
          </button>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0f15] border-b border-white/10 px-6 py-5 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => handleNavClick('all', 'gallery-section')}
            className={`block w-full text-left py-2 text-xs uppercase tracking-widest font-medium ${
              activeTab === 'all' ? 'text-[#f3e5ab] font-bold' : 'text-white/70'
            }`}
          >
            All Memories ({itemsCount})
          </button>

          <button
            onClick={() => handleNavClick('videos', 'gallery-section')}
            className={`flex items-center gap-2 w-full text-left py-2 text-xs uppercase tracking-widest font-medium ${
              activeTab === 'videos' ? 'text-[#f3e5ab] font-bold' : 'text-white/70'
            }`}
          >
            <Video className="w-4 h-4 text-[#c5a059]" /> Cinema Films (6)
          </button>

          <button
            onClick={() => handleNavClick('images', 'gallery-section')}
            className={`flex items-center gap-2 w-full text-left py-2 text-xs uppercase tracking-widest font-medium ${
              activeTab === 'images' ? 'text-[#f3e5ab] font-bold' : 'text-white/70'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#c5a059]" /> Stills & Portraits (72)
          </button>

          <button
            onClick={() => handleNavClick('all', 'collections')}
            className="flex items-center gap-2 w-full text-left py-2 text-xs uppercase tracking-widest font-medium text-white/70"
          >
            <Sparkles className="w-4 h-4 text-[#c5a059]" /> The Story & Ceremony
          </button>
        </div>
      )}
    </header>
  );
};
