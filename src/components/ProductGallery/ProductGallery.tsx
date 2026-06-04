import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ProductGallery.module.scss';

interface ProductGalleryProps {
  images: string[];
  productTitle?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productTitle = 'Product' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset when image set changes (color switch)
  useEffect(() => {
    setActiveIndex(0);
    setIsImageLoaded(false);
  }, [images]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goTo(activeIndex - 1);
      if (e.key === 'ArrowRight') goTo(activeIndex + 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeIndex, images.length]); // eslint-disable-line

  const goTo = useCallback((index: number) => {
    const clamped = (index + images.length) % images.length;
    setActiveIndex(clamped);
    setIsImageLoaded(false);
  }, [images.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - left) / width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  return (
    <div className={styles.gallery}>
      {/* Main Image */}
      <div
        ref={containerRef}
        className={`${styles.mainContainer} ${isZoomed ? styles.zoomed : ''}`}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        role="img"
        aria-label={`${productTitle} image ${activeIndex + 1} of ${images.length}`}
      >
        {/* Loading shimmer */}
        {!isImageLoaded && <div className={styles.imageSkeleton} aria-hidden="true" />}

        <img
          ref={imageRef}
          key={images[activeIndex]}
          src={images[activeIndex]}
          alt={`${productTitle} view ${activeIndex + 1}`}
          className={`${styles.mainImage} ${isImageLoaded ? styles.imageLoaded : ''}`}
          style={isZoomed ? {
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            transform: 'scale(2.2)',
          } : undefined}
          onLoad={() => setIsImageLoaded(true)}
          draggable={false}
        />

        {/* Zoom hint */}
        {!isZoomed && isImageLoaded && (
          <div className={styles.zoomHint} aria-hidden="true">
            <ZoomIn size={14} />
            <span>Hover to zoom</span>
          </div>
        )}

        {/* Navigation arrows (visible on mobile, hover on desktop) */}
        {images.length > 1 && (
          <>
            <button
              className={`${styles.navArrow} ${styles.prevArrow}`}
              onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1); }}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className={`${styles.navArrow} ${styles.nextArrow}`}
              onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1); }}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image counter */}
        <div className={styles.counter} aria-hidden="true">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Mobile Dot Indicator */}
      <div className={styles.dotIndicator} aria-hidden="true">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.dot} ${idx === activeIndex ? styles.dotActive : ''}`}
            onClick={() => goTo(idx)}
            aria-label={`Go to image ${idx + 1}`}
            tabIndex={-1}
          />
        ))}
      </div>

      {/* Thumbnails */}
      <div className={styles.thumbnailsWrapper} role="tablist" aria-label="Product image thumbnails">
        {images.map((image, idx) => (
          <button
            key={image}
            role="tab"
            aria-selected={idx === activeIndex}
            aria-label={`View image ${idx + 1}`}
            className={`${styles.thumb} ${idx === activeIndex ? styles.thumbActive : ''}`}
            onClick={() => goTo(idx)}
          >
            <img src={image} alt="" aria-hidden="true" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
};
