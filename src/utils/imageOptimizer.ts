/**
 * Utility to optimize image URLs for responsive mobile devices and WebP/AVIF formats.
 * For Unsplash images, dynamically injects optimal width, quality, and auto=format parameters.
 */
export function getOptimizedImageUrl(url: string, width: number = 320, quality: number = 75): string {
  if (!url) return '';
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fit', 'crop');
      parsed.searchParams.set('w', width.toString());
      parsed.searchParams.set('q', quality.toString());
      return parsed.toString();
    } catch {
      return url;
    }
  }
  return url;
}

/**
 * Generate srcset for responsive mobile-first image delivery
 */
export function getResponsiveImageSrcSet(url: string): string {
  if (!url || !url.includes('images.unsplash.com')) return '';
  return `${getOptimizedImageUrl(url, 240, 70)} 240w, ${getOptimizedImageUrl(url, 380, 75)} 380w, ${getOptimizedImageUrl(url, 520, 80)} 520w`;
}
