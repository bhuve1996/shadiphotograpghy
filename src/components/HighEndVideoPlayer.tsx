import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, RotateCcw, Download } from 'lucide-react';

interface HighEndVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  coupleName?: string;
  autoPlay?: boolean;
  className?: string;
  gdriveId?: string;
  onClose?: () => void;
}

export const HighEndVideoPlayer: React.FC<HighEndVideoPlayerProps> = ({
  src,
  poster,
  title,
  coupleName,
  autoPlay = false,
  className = '',
  gdriveId,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);

  const controlsTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => {
      setDuration(video.duration);
      if (autoPlay) {
        video.play().catch(() => {
          // Autoplay policy prevented playback, keep muted fallback
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
      }
    };
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
    };
  }, [autoPlay, src]);

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec)) return '00:00';
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative group bg-black overflow-hidden rounded-2xl shadow-2xl border border-white/10 select-none ${className}`}
    >
      {/* Ambient Cinema Backlight Glow */}
      <div 
        className="absolute -inset-1 bg-gradient-to-r from-[#c5a059]/20 via-[#f3e5ab]/10 to-[#c5a059]/20 blur-xl opacity-60 pointer-events-none transition-opacity duration-1000" 
      />

      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Buffering Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
          <div className="w-12 h-12 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Centered Play Button when Paused */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          aria-label="Play Video"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-black/60 hover:bg-[#c5a059] text-white hover:text-black rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 transform hover:scale-110 border border-white/20 shadow-2xl"
        >
          <Play className="w-8 h-8 ml-1 fill-current" />
        </button>
      )}

      {/* Top Overlay Badge / Titles */}
      <div
        className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 via-black/30 to-transparent transition-opacity duration-500 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-[#c5a059]/40 text-[#f3e5ab] text-xs uppercase tracking-widest font-medium mb-1 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
              Cinematic Master Reel
            </div>
            {coupleName && (
              <h3 className="text-xl md:text-2xl font-serif text-white tracking-wide font-normal">
                {coupleName}
              </h3>
            )}
            {title && (
              <p className="text-sm text-gray-300 font-sans tracking-normal opacity-90">
                {title}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs tracking-wider px-2.5 py-1 bg-white/10 rounded-md border border-white/10 text-white/80 font-mono">
              4K ULTRA HD
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-all duration-500 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {/* Progress Bar Container */}
        <div className="relative mb-3 group/progress">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#c5a059] focus:outline-none transition-all"
            style={{
              background: `linear-gradient(to right, #c5a059 ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)`
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between text-white text-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white hover:text-[#f3e5ab]"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  videoRef.current.play();
                }
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
              title="Replay from start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-red-400" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#c5a059] focus:outline-none"
              />
            </div>

            {/* Time Stamp */}
            <span className="font-mono text-xs text-white/70 tracking-wider">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {gdriveId && (
              <a
                href={`https://drive.google.com/uc?export=download&id=${gdriveId}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#c5a059]/20 hover:bg-[#c5a059] hover:text-black text-[#f3e5ab] text-xs font-mono rounded-md border border-[#c5a059]/50 transition-all"
                title="Download Full Resolution Raw Video from Google Drive"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Raw</span>
              </a>
            )}
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
