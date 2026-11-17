import { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Video, 
  Image as ImageIcon, 
  Layers, 
  Play,
  RefreshCw,
  ArrowUp,
  LayoutGrid,
  Grid3X3,
  Columns4,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Rows3
} from 'lucide-react';
import type { EventCategory, MediaItem, CoupleCollection } from './types/media';
import { MediaService } from './services/mediaService';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CollectionsSection } from './components/CollectionsSection';
import { MediaCard } from './components/MediaCard';
import { MediaLightbox } from './components/MediaLightbox';
import { HighEndVideoPlayer } from './components/HighEndVideoPlayer';
import { HighlightsCarousel } from './components/HighlightsCarousel';
import { HorizontalGalleryBatchCarousel } from './components/HorizontalGalleryBatchCarousel';

const EVENT_CATEGORIES: EventCategory[] = [
  'All',
  'Roka Ceremony',
];

export function App() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => MediaService.getMedia());
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('All');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [viewMode, setViewMode] = useState<'horizontal' | 'grid'>('horizontal');
  const [gridColumns, setGridColumns] = useState<'3' | '4' | '2'>('3');
  const [showCarousel, setShowCarousel] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 36; // Crisp, balanced batch of memories per page

  // Reset to page 1 whenever search, category, or type filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, typeFilter, searchQuery]);
  
  // Track scroll position to reveal "Scroll to Top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Modals & Overlays state
  const [activeLightboxItem, setActiveLightboxItem] = useState<MediaItem | null>(null);
  
  // Dedicated Video Cinema Theatre Overlay
  const [cinemaPlayer, setCinemaPlayer] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
    coupleName?: string;
    poster?: string;
    gdriveId?: string;
  }>({
    isOpen: false,
    url: '',
    title: '',
  });

  // Filtered Media
  const filteredItems = useMemo(() => {
    return MediaService.filterMedia(mediaItems, selectedCategory, typeFilter, searchQuery);
  }, [mediaItems, selectedCategory, typeFilter, searchQuery]);

  // Paginated Batch of items
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Video-only items for Cinema showcase
  const cinemaVideos = useMemo(() => {
    return mediaItems.filter((m) => m.type === 'video');
  }, [mediaItems]);

  const handleDeleteMedia = (id: string) => {
    if (window.confirm('Remove this photo/video from your gallery?')) {
      MediaService.deleteMedia(id);
      setMediaItems(MediaService.getMedia());
      if (activeLightboxItem?.id === id) setActiveLightboxItem(null);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset gallery to Harsha & Bhuvesh defaults?')) {
      MediaService.resetToDefaults();
      setMediaItems(MediaService.getMedia());
    }
  };

  const handlePlayFilm = (filmUrl: string, title: string, couple: string, poster?: string, gdriveId?: string) => {
    setCinemaPlayer({
      isOpen: true,
      url: filmUrl,
      title,
      coupleName: couple,
      poster,
      gdriveId,
    });
  };

  const handleSelectCollection = (collection: CoupleCollection) => {
    setSearchQuery(collection.coupleName);
    setSelectedCategory('All');
    document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e0e2ec] font-sans selection:bg-[#c5a059] selection:text-black">
      {/* Top Luxury Navbar */}
      <Navbar
        activeTab={typeFilter}
        setActiveTab={(tab) => {
          if (tab === 'all') setTypeFilter('all');
          if (tab === 'videos') setTypeFilter('video');
          if (tab === 'images') setTypeFilter('image');
        }}
        itemsCount={mediaItems.length}
      />

      {/* Hero with Atmospheric Cinema Loop */}
      <Hero
        onExploreGallery={() => {
          document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 1. TOP: Main Gallery Exploration Section (Images & Memories) */}
      <section id="gallery-section" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#c5a059]/30 text-[#f3e5ab] text-xs uppercase tracking-widest font-medium mb-3">
              <Layers className="w-3.5 h-3.5 text-[#c5a059]" /> Roka Archives
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-wide font-normal">
              Roka Celebrations
            </h2>
          </div>

          {/* Search bar & Type Toggles */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search moments, captions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-[#141824] border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Type Filter Buttons */}
            <div className="flex items-center bg-[#141824] border border-white/10 rounded-full p-1 text-xs">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  typeFilter === 'all' ? 'bg-[#c5a059] text-black font-semibold' : 'text-white/60 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter('image')}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                  typeFilter === 'image' ? 'bg-[#c5a059] text-black font-semibold' : 'text-white/60 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Photos
              </button>
              <button
                onClick={() => setTypeFilter('video')}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                  typeFilter === 'video' ? 'bg-[#c5a059] text-black font-semibold' : 'text-white/60 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" /> Films
              </button>
            </div>

            {/* View Mode Toggle: Horizontal Stream (Default) vs Multi-Grid */}
            <div className="flex items-center bg-[#141824] border border-white/10 rounded-full p-1 text-xs shrink-0">
              <button
                onClick={() => setViewMode('horizontal')}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                  viewMode === 'horizontal' ? 'bg-[#c5a059] text-black font-semibold' : 'text-white/60 hover:text-white'
                }`}
                title="Horizontal Panoramic Stream View (Default)"
              >
                <Rows3 className="w-3.5 h-3.5" />
                <span>Horizontal</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                  viewMode === 'grid' ? 'bg-[#c5a059] text-black font-semibold' : 'text-white/60 hover:text-white'
                }`}
                title="Vertical Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
            </div>

            {/* Grid Column Selector Controls - Available in Grid Mode */}
            {viewMode === 'grid' && (
              <div className="flex items-center justify-center bg-[#141824] border border-white/10 rounded-full p-1 text-xs shrink-0">
                <button
                  onClick={() => setGridColumns('2')}
                  className={`px-2.5 sm:px-2 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                    gridColumns === '2' ? 'bg-[#c5a059] text-black font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                  title="2-Column Grid (Large)"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="text-[10px] sm:hidden font-mono">2x</span>
                </button>
                <button
                  onClick={() => setGridColumns('3')}
                  className={`px-2.5 sm:px-2 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                    gridColumns === '3' ? 'bg-[#c5a059] text-black font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                  title="3-Column Grid (Standard)"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  <span className="text-[10px] sm:hidden font-mono">3x</span>
                </button>
                <button
                  onClick={() => setGridColumns('4')}
                  className={`px-2.5 sm:px-2 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                    gridColumns === '4' ? 'bg-[#c5a059] text-black font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                  title="4-Column Grid (Compact)"
                >
                  <Columns4 className="w-3.5 h-3.5" />
                  <span className="text-[10px] sm:hidden font-mono">4x</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category Pill Tabs & Carousel Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            {EVENT_CATEGORIES.map((cat) => {
              const count = mediaItems.filter(
                (m) => (cat === 'All' || m.category === cat) && (typeFilter === 'all' || m.type === typeFilter)
              ).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-all duration-300 border flex items-center gap-2 ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-[#c5a059] to-[#dfba73] text-black border-[#dfba73] font-semibold shadow-lg shadow-[#c5a059]/20 scale-105'
                      : 'bg-[#121622] hover:bg-white/10 text-white/70 hover:text-white border-white/5'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      selectedCategory === cat ? 'bg-black/20 text-black' : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Toggle Carousel Stream Button */}
          <button
            onClick={() => setShowCarousel(!showCarousel)}
            className={`hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-mono transition-all shrink-0 ${
              showCarousel
                ? 'bg-[#c5a059]/15 text-[#f3e5ab] border-[#c5a059]/40'
                : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>{showCarousel ? 'Hide Carousel' : 'Show Carousel'}</span>
          </button>
        </div>

        {/* Story Highlights Carousel */}
        {showCarousel && filteredItems.length > 0 && (
          <HighlightsCarousel
            items={filteredItems.slice(0, 20)}
            onOpenLightbox={(selected) => setActiveLightboxItem(selected)}
            onPlayFilm={handlePlayFilm}
          />
        )}

        {/* Dynamic Multi-Column Grid or Horizontal Editorial Stream */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-24 bg-[#121520] rounded-2xl border border-dashed border-white/10 p-12">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-[#c5a059]">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-serif text-white mb-2">No moments found in this filter</h3>
            <p className="text-xs text-white/50 max-w-md mx-auto mb-6">
              Try adjusting your search query or selecting a different filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setTypeFilter('all');
                setSearchQuery('');
              }}
              className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider font-medium transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'horizontal' ? (
          /* DEFAULT: Horizontal Batch Carousel View */
          <HorizontalGalleryBatchCarousel
            items={filteredItems}
            batchSize={24}
            onOpenLightbox={(selected) => setActiveLightboxItem(selected)}
            onPlayFilm={handlePlayFilm}
          />
        ) : (
          /* Grid View Mode */
          <>
            <div className={`gap-4 sm:gap-6 space-y-4 sm:space-y-6 ${
              gridColumns === '2'
                ? 'columns-1 sm:columns-2'
                : gridColumns === '4'
                ? 'columns-2 sm:columns-3 md:columns-4'
                : 'columns-1 sm:columns-2 lg:columns-3'
            }`}>
              {paginatedItems.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onOpenLightbox={(selected) => setActiveLightboxItem(selected)}
                  onOpenVideoPlayer={(selected) =>
                    handlePlayFilm(selected.url, selected.title, selected.coupleName || 'Harsha & Bhuvesh', selected.thumbnailUrl, selected.gdriveId)
                  }
                  onDelete={handleDeleteMedia}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-3 select-none">
                <div className="flex items-center gap-1.5 p-1 bg-[#131722] border border-white/10 rounded-full shadow-xl">
                  {/* Previous Page Button */}
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 sm:p-2.5 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-white transition-all"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`min-w-8 h-8 sm:min-w-9 sm:h-9 px-2 text-xs font-mono rounded-full transition-all flex items-center justify-center ${
                              currentPage === page
                                ? 'bg-gradient-to-r from-[#c5a059] to-[#dfba73] text-black font-bold shadow-md shadow-[#c5a059]/30'
                                : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-1 text-white/30 text-xs font-mono">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* Next Page Button */}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 sm:p-2.5 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-white transition-all"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-[11px] font-mono text-[#f3e5ab]/70">
                  Batch {currentPage} of {totalPages} ({paginatedItems.length} items shown)
                </div>
              </div>
            )}
          </>
        )}

        {/* Reset & Stats Footer Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <div>
            Showing <span className="text-[#f3e5ab] font-medium">{filteredItems.length}</span> of{' '}
            <span className="text-white font-medium">{mediaItems.length}</span> curated Roka moments
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 hover:text-[#c5a059] transition-colors"
              title="Reset gallery to default Roka memories"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Restore Default Gallery
            </button>
          </div>
        </div>
      </section>

      {/* 2. THEN: The Ceremony Section (A bespoke archive dedicated exclusively to Harsha & Bhuvesh’s Roka day) */}
      <CollectionsSection
        onSelectCollection={handleSelectCollection}
        onPlayFilm={handlePlayFilm}
      />

      {/* 3. AND THEN: Cinematic Roka Films & Reels Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#0b0c10] via-[#10131d] to-[#0b0c10] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#f3e5ab] text-xs uppercase tracking-widest font-medium mb-3">
                <Video className="w-3.5 h-3.5 text-[#c5a059]" /> 4K Cinema Suite
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-wide font-normal">
                Cinematic Roka Films & Reels
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                Experience high-bitrate color graded reels of Harsha & Bhuvesh’s auspicious Roka ceremony.
              </p>
            </div>
          </div>

          {/* Master Video Feature Display */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <HighEndVideoPlayer
                src={cinemaVideos[0]?.url || '/media/roka/videos/Roka_Cinema_Highlight_01__[orig__IMG_4344.MOV].mp4'}
                poster={cinemaVideos[0]?.thumbnailUrl || '/media/roka/video_thumbs/IMG_9347_thumb.jpg'}
                coupleName={cinemaVideos[0]?.coupleName || 'Harsha & Bhuvesh'}
                title={cinemaVideos[0]?.title || 'The Roka Ceremony Film'}
                className="w-full aspect-video"
              />
            </div>

            {/* Side Playlist */}
            <div className="flex flex-col gap-4">
              <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">
                Cinema Highlights ({cinemaVideos.length} Films)
              </span>

              <div className="space-y-3.5 overflow-y-auto max-h-[460px] pr-2">
                {cinemaVideos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => handlePlayFilm(vid.url, vid.title, vid.coupleName || 'Harsha & Bhuvesh', vid.thumbnailUrl, vid.gdriveId)}
                    className="group flex items-center gap-4 p-3 rounded-xl bg-[#141824] hover:bg-[#1c2233] border border-white/5 hover:border-[#c5a059]/40 cursor-pointer transition-all"
                  >
                    <div className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0 bg-black">
                      <img
                        src={vid.thumbnailUrl || '/media/roka/video_thumbs/IMG_9347_thumb.jpg'}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-black/60 group-hover:bg-[#c5a059] text-white group-hover:text-black flex items-center justify-center transition-colors">
                          <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                        </div>
                      </div>
                      {vid.duration && (
                        <span className="absolute bottom-1 right-1 text-[10px] font-mono bg-black/80 px-1 rounded text-[#f3e5ab]">
                          {vid.duration}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#c5a059]">
                        {vid.category}
                      </span>
                      <h4 className="text-sm font-serif text-white group-hover:text-[#f3e5ab] truncate transition-colors">
                        {vid.title}
                      </h4>
                      <p className="text-xs text-white/50 truncate mt-0.5">
                        {vid.coupleName} • {vid.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-[#07080a] border-t border-white/5 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="font-serif text-2xl tracking-[0.25em] font-semibold text-white uppercase mb-2">
            HARSHA & BHUVESH
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#c5a059] mb-6">
            The Roka Celebration & Memoir
          </p>
          <div className="mt-8 text-[11px] text-white/30 font-mono">
            &copy; {new Date().getFullYear()} Harsha & Bhuvesh. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      <MediaLightbox
        item={activeLightboxItem}
        items={filteredItems}
        onClose={() => setActiveLightboxItem(null)}
        onSelect={(next) => setActiveLightboxItem(next)}
      />

      {/* Dedicated Cinema High-End Video Player Modal */}
      {cinemaPlayer.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={() => setCinemaPlayer({ ...cinemaPlayer, isOpen: false })}
              className="absolute -top-12 right-0 text-white/80 hover:text-white text-xs font-mono tracking-wider flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full"
            >
              CLOSE THEATRE &times;
            </button>
            <HighEndVideoPlayer
              src={cinemaPlayer.url}
              poster={cinemaPlayer.poster}
              coupleName={cinemaPlayer.coupleName}
              title={cinemaPlayer.title}
              gdriveId={cinemaPlayer.gdriveId}
              autoPlay={true}
              className="aspect-video w-full"
            />
          </div>
        </div>
      )}

      {/* Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 p-3 sm:p-3.5 rounded-full bg-[#131722]/90 hover:bg-[#c5a059] text-[#f3e5ab] hover:text-black border border-[#c5a059]/40 hover:border-[#c5a059] backdrop-blur-xl shadow-2xl shadow-black/80 transition-all duration-300 flex items-center justify-center group ${
          showScrollTop 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
        title="Scroll to Top"
      >
        <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1" />
      </button>
    </div>
  );
}

export default App;
