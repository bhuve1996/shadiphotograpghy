/**
 * High-performance In-Memory and CacheStorage Media Preloader
 * Tracks asset loading progress and prevents redundant network fetches.
 */
class AssetManagerClass {
  private memoryCache: Set<string> = new Set();
  private failedCache: Set<string> = new Set();
  private pendingPromises: Map<string, Promise<boolean>> = new Map();

  /**
   * Preload a single image URL and keep it in cache
   */
  public preloadImage(url: string): Promise<boolean> {
    if (this.memoryCache.has(url)) {
      return Promise.resolve(true);
    }
    if (this.failedCache.has(url)) {
      return Promise.resolve(false);
    }
    if (this.pendingPromises.has(url)) {
      return this.pendingPromises.get(url)!;
    }

    const promise = new Promise<boolean>((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        this.memoryCache.add(url);
        this.pendingPromises.delete(url);
        resolve(true);
      };
      img.onerror = () => {
        this.failedCache.add(url);
        this.pendingPromises.delete(url);
        resolve(false);
      };
    });

    this.pendingPromises.set(url, promise);
    return promise;
  }

  /**
   * Preload adjacent lightbox assets (e.g. Next / Prev 3 images)
   */
  public preloadBatch(urls: string[]) {
    urls.slice(0, 4).forEach((url) => {
      if (url && !this.memoryCache.has(url)) {
        this.preloadImage(url);
      }
    });
  }

  public isLoaded(url: string): boolean {
    return this.memoryCache.has(url);
  }

  public isFailed(url: string): boolean {
    return this.failedCache.has(url);
  }
}

export const AssetManager = new AssetManagerClass();
