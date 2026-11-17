export type EventCategory = 
  | 'All' 
  | 'Roka Ceremony';

export type MediaType = 'image' | 'video';

export type PhotoSubcategory = 'all' | 'photographer' | 'mobile';

export interface MediaItem {
  id: string;
  title: string;
  category: EventCategory;
  type: MediaType;
  url: string; // can be local /public URL, blob URL from local upload, or external S3/CDN URL
  thumbnailUrl?: string; // poster for video or thumbnail for image
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  featured?: boolean;
  coupleName?: string;
  location?: string;
  date?: string;
  description?: string;
  duration?: string;
  originalFilename?: string; // User's original file name (e.g. IMG_8219.JPG.jpeg)
  curatedFilename?: string;  // Curated title (e.g. Roka Celebration #2)
  gdriveId?: string;         // Google Drive direct file ID for full-resolution raw camera asset
  gdriveUrl?: string;        // Google Drive direct stream or download URL
  videoEmbedUrl?: string;
  sourceType: 'local-public' | 'user-upload' | 'remote-cloud';
}

export interface CoupleCollection {
  id: string;
  coupleName: string;
  coverImage: string;
  filmThumbnail?: string;
  filmUrl?: string;
  location: string;
  date: string;
  highlightsCount: number;
  filmDuration: string;
  storyQuote: string;
}
