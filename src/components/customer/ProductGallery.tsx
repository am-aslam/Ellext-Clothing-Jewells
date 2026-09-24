'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Maximize2, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const touchStartX = useRef<number | null>(null);

  const displayImages = images.length > 0 ? images : ['/assets/editorial/the-edit.jpg'];

  const nextImage = () => {
    setActiveIndex(prev => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setActiveIndex(prev => (prev - 1 + displayImages.length) % displayImages.length);
  };

  // Keyboard navigation for carousel & modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, displayImages.length]);

  // Handle Zoom tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) nextImage();
    if (diff < -50) prevImage();

    touchStartX.current = null;
  };

  return (
    <div className="elx-product-gallery">
      {/* Desktop Thumbnail Sidebar */}
      <div className="gallery-thumbnails-rail" aria-label="Product image thumbnails">
        {displayImages.map((img, idx) => (
          <button
            key={img + idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`gallery-thumb-btn ${idx === activeIndex ? 'active' : ''}`}
            aria-label={`Show photo ${idx + 1} of ${productName}`}
          >
            <Image
              src={img}
              alt=""
              width={76}
              height={98}
              style={{ objectFit: 'cover' }}
            />
          </button>
        ))}
      </div>

      {/* Main Image Stage */}
      <div className="gallery-main-stage">
        <div
          className={`main-image-viewport ${isZoomed ? 'zoomed' : ''}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={displayImages[activeIndex]}
            alt={`${productName} photograph ${activeIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="main-view-image"
            style={{
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              transform: isZoomed ? 'scale(1.8)' : 'scale(1)'
            }}
          />

          {/* Quick indicator hint */}
          <span className="gallery-zoom-hint">
            <ZoomIn size={14} /> Hover to inspect craftsmanship
          </span>
        </div>

        {/* Gallery Overlay Controls */}
        <div className="gallery-controls">
          {displayImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="gallery-nav-btn prev"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="gallery-nav-btn next"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="gallery-fullscreen-btn"
            aria-label="View full screen high-resolution image"
          >
            <Maximize2 size={18} />
          </button>
        </div>

        {/* Mobile Slide Counter Dots */}
        {displayImages.length > 1 && (
          <div className="gallery-dots-mobile">
            {displayImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`gallery-dot ${idx === activeIndex ? 'active' : ''}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="gallery-fullscreen-modal" role="dialog" aria-modal="true">
          <div className="lightbox-backdrop" onClick={() => setIsFullscreen(false)} />
          <div className="lightbox-content">
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="lightbox-close-btn"
              aria-label="Close fullscreen"
            >
              <X size={24} />
            </button>

            <div className="lightbox-image-wrap">
              <Image
                src={displayImages[activeIndex]}
                alt={`${productName} full screen view`}
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>

            {displayImages.length > 1 && (
              <div className="lightbox-nav-strip">
                <button
                  type="button"
                  onClick={prevImage}
                  className="lightbox-nav-btn"
                  aria-label="Previous"
                >
                  <ChevronLeft size={28} />
                </button>
                <span className="lightbox-counter">
                  {activeIndex + 1} / {displayImages.length}
                </span>
                <button
                  type="button"
                  onClick={nextImage}
                  className="lightbox-nav-btn"
                  aria-label="Next"
                >
                  <ChevronRight size={28} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
