import { Video, Image as ImageIcon } from 'lucide-react';
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
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0c10]/85 backdrop-blur-xl border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo with Royal H&B Crest */}
        <div 
          onClick={() => {
            setActiveTab('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <Logo size={46} />
          <div>
            <span className="block font-serif text-lg sm:text-xl tracking-[0.2em] font-semibold text-white uppercase group-hover:text-[#f3e5ab] transition-colors">
              HARSHA & BHUVESH
            </span>
            <span className="block text-[9px] uppercase tracking-[0.35em] text-[#c5a059] font-sans">
              The Roka Memoir & Cinema
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-6 sm:gap-8">
          <button
            onClick={() => {
              setActiveTab('all');
              document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`text-xs uppercase tracking-widest transition-colors font-medium ${
              activeTab === 'all' ? 'text-[#f3e5ab] border-b-2 border-[#c5a059] pb-1' : 'text-gray-400 hover:text-white'
            }`}
          >
            All Memories ({itemsCount})
          </button>

          <button
            onClick={() => {
              setActiveTab('videos');
              document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex items-center gap-1.5 text-xs uppercase tracking-widest transition-colors font-medium ${
              activeTab === 'videos' ? 'text-[#f3e5ab] border-b-2 border-[#c5a059] pb-1' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" /> Cinema Films
          </button>

          <button
            onClick={() => {
              setActiveTab('images');
              document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex items-center gap-1.5 text-xs uppercase tracking-widest transition-colors font-medium ${
              activeTab === 'images' ? 'text-[#f3e5ab] border-b-2 border-[#c5a059] pb-1' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Stills & Portraits
          </button>

          <button
            onClick={() => {
              document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden sm:inline-block text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors font-medium"
          >
            The Story
          </button>
        </nav>
      </div>
    </header>
  );
};
