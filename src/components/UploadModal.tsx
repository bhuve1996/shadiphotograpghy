import { useState } from 'react';
import { X, UploadCloud, CheckCircle, Sparkles } from 'lucide-react';
import type { EventCategory, MediaType, MediaItem } from '../types/media';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (item: Omit<MediaItem, 'id'>) => void;
}

const CATEGORIES: EventCategory[] = [
  'Roka Ceremony'
];

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Roka Ceremony');
  const [coupleName, setCoupleName] = useState('Harsha & Bhuvesh');
  const [location, setLocation] = useState('Taj Palace, New Delhi');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<MediaType>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    const isVideo = file.type.startsWith('video');
    setType(isVideo ? 'video' : 'image');
    
    // Create local object URL for preview and storage
    const objUrl = URL.createObjectURL(file);
    setPreviewUrl(objUrl);
    setMediaUrl(objUrl);
    
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onUploadSuccess({
        title: title || 'Roka Moment',
        category,
        type,
        url: mediaUrl,
        coupleName: coupleName || 'Harsha & Bhuvesh',
        location: location || 'Taj Palace, New Delhi',
        description: description || undefined,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        sourceType: 'user-upload',
        featured: false,
      });

      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#12151e] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#c5a059]/10 rounded-xl border border-[#c5a059]/30 text-[#f3e5ab]">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-white tracking-wide">
                Upload Roka Ceremony Media
              </h2>
              <p className="text-xs text-white/60">
                Add photos or videos to Harsha & Bhuvesh’s Roka showcase.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-[#c5a059] bg-[#c5a059]/10 scale-[1.01]'
                : previewUrl
                ? 'border-emerald-500/50 bg-[#161b26]'
                : 'border-white/20 hover:border-white/40 bg-white/5'
            }`}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*,video/*';
              input.onchange = (e) => {
                const target = e.target as HTMLInputElement;
                if (target.files && target.files[0]) {
                  handleFileSelect(target.files[0]);
                }
              };
              input.click();
            }}
          >
            {previewUrl ? (
              <div className="flex flex-col items-center">
                <div className="relative max-h-48 rounded-lg overflow-hidden mb-3 border border-white/10">
                  {type === 'image' ? (
                    <img src={previewUrl} alt="Preview" className="h-44 object-cover rounded-lg" />
                  ) : (
                    <video src={previewUrl} className="h-44 rounded-lg object-cover" controls />
                  )}
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] uppercase font-mono text-[#f3e5ab] backdrop-blur-sm border border-white/10">
                    {type}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle className="w-4 h-4" /> Ready to upload (Click to replace)
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 text-[#c5a059]">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm text-white font-medium mb-1">
                  Click to select file or drag & drop here
                </p>
                <p className="text-xs text-white/50">
                  Supports high-res JPG, PNG, WEBP or MP4 / WEBM videos
                </p>
              </div>
            )}
          </div>

          {/* Alternatively Direct URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80 flex items-center justify-between">
              <span>Or Provide Public / S3 Media URL</span>
              <span className="text-[10px] text-[#c5a059]">AWS / Cloud ready</span>
            </label>
            <input
              type="url"
              placeholder="e.g. /my-roka-photo.jpg or https://.../reel.mp4"
              value={mediaUrl.startsWith('blob:') ? '' : mediaUrl}
              onChange={(e) => {
                setMediaUrl(e.target.value);
                setPreviewUrl(e.target.value);
                const isVid = e.target.value.match(/\.(mp4|webm|mov)(\?.*)?$/i);
                setType(isVid ? 'video' : 'image');
              }}
              className="w-full bg-[#1b202d] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          {/* Media Info Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/80">Title / Caption</label>
              <input
                type="text"
                placeholder="e.g. Roka Ceremony Ring Exchange"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-[#1b202d] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/80">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full bg-[#1b202d] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#c5a059]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#12151e]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/80">Couple Name</label>
              <input
                type="text"
                placeholder="Harsha & Bhuvesh"
                value={coupleName}
                onChange={(e) => setCoupleName(e.target.value)}
                className="w-full bg-[#1b202d] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/80">Location</label>
              <input
                type="text"
                placeholder="Taj Palace, New Delhi"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#1b202d] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80">Story / Notes</label>
            <textarea
              rows={2}
              placeholder="A brief description of this special moment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#1b202d] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!mediaUrl || isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#c5a059] to-[#dfba73] text-black font-semibold text-sm hover:shadow-lg hover:shadow-[#c5a059]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Adding to Gallery...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish to Gallery</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
