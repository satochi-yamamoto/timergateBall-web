import { useEffect } from 'react';

const PreloadResources = () => {
  useEffect(() => {
    // Preload critical CSS and JS chunks
    const criticalChunks = [
      'react-vendor',
      'supabase-vendor',
      'utils-vendor'
    ];

    criticalChunks.forEach(chunk => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = `/assets/${chunk}.js`;
      document.head.appendChild(link);
    });

    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    fontLink.href = '/fonts/timer-font.woff2';
    document.head.appendChild(fontLink);

    // Cleanup
    return () => {
      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      preloadLinks.forEach(link => link.remove());
    };
  }, []);

  return null;
};

export default PreloadResources;