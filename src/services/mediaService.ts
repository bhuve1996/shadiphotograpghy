import type { MediaItem, EventCategory } from '../types/media';
import { INITIAL_MEDIA_ITEMS } from '../data/initialData';

// Incremented to v6 to force client browsers to purge older unoptimized images
const STORAGE_KEY = 'shaadi_photography_media_items_v6_progressive';

export class MediaService {
  static getMedia(): MediaItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEDIA_ITEMS));
        return INITIAL_MEDIA_ITEMS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read from localStorage, using memory data', e);
      return INITIAL_MEDIA_ITEMS;
    }
  }

  static addMedia(item: Omit<MediaItem, 'id'>): MediaItem {
    const all = this.getMedia();
    const newItem: MediaItem = {
      ...item,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };
    
    const updated = [newItem, ...all];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage limit reached or disabled', e);
    }
    return newItem;
  }

  static deleteMedia(id: string): void {
    const all = this.getMedia();
    const updated = all.filter(m => m.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }

  static resetToDefaults(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEDIA_ITEMS));
    } catch (e) {
      console.error(e);
    }
  }

  static filterMedia(
    items: MediaItem[], 
    category: EventCategory, 
    typeFilter: 'all' | 'image' | 'video' = 'all',
    searchQuery: string = ''
  ): MediaItem[] {
    return items.filter(item => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.originalFilename?.toLowerCase().includes(q) ||
        item.curatedFilename?.toLowerCase().includes(q) ||
        item.coupleName?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q);

      return matchesCategory && matchesType && matchesSearch;
    });
  }
}
