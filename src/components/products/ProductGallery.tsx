"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { Product } from "@/types/product";

export function ProductGallery({ product }: { product: Product }) {
  const images = product.images.length
    ? product.images
    : product.image_url
      ? [{ id: product.id, image_url: product.image_url, alt_text: product.name, sort_order: 0 }]
      : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const zoomButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyOpen = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const image = images[Math.min(activeIndex, Math.max(images.length - 1, 0))];
  const showImage = (index: number) => setActiveIndex((index + images.length) % images.length);

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    const touch = event.changedTouches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }
  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (!touchStart.current || images.length < 2) return;
    const start = touchStart.current;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    touchStart.current = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) showImage(activeIndex + (dx < 0 ? 1 : -1));
  }

  useEffect(() => {
    if (!zoomOpen) {
      if (previouslyOpen.current) zoomButtonRef.current?.focus();
      previouslyOpen.current = false;
      return;
    }
    previouslyOpen.current = true;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setZoomOpen(false);
      }
      if (event.key === "ArrowRight" && images.length > 1) showImage(activeIndex + 1);
      if (event.key === "ArrowLeft" && images.length > 1) showImage(activeIndex - 1);
      if (event.key === "Tab" && dialogRef.current) {
        const buttons = [...dialogRef.current.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")];
        if (!buttons.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === dialogRef.current) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === dialogRef.current) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomOpen, images.length, activeIndex]);

  if (!image) return <div className="detail-gallery-empty">Product images will appear here.</div>;
  return (
    <div className="product-gallery">
      <div className="detail-image" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <Image
          src={image.image_url}
          alt={image.alt_text || product.name}
          fill
          priority
          sizes="(max-width: 760px) 100vw, 55vw"
          className="detail-product-img"
        />
        <button
          ref={zoomButtonRef}
          className="gallery-zoom"
          type="button"
          onClick={() => setZoomOpen(true)}
          aria-label="Zoom product image"
        >
          <Maximize2 size={17} />
        </button>
        {images.length > 1 && (
          <div className="gallery-arrows">
            <button type="button" aria-label="Previous image" onClick={() => showImage(activeIndex - 1)}>
              <ChevronLeft size={19} />
            </button>
            <span>
              {activeIndex + 1} / {images.length}
            </span>
            <button type="button" aria-label="Next image" onClick={() => showImage(activeIndex + 1)}>
              <ChevronRight size={19} />
            </button>
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbnails" aria-label="Product images">
          {images.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={index === activeIndex ? "active" : ""}
              aria-label={`Show image ${index + 1}: ${item.alt_text}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              <Image src={item.image_url} alt="" fill sizes="80px" />
            </button>
          ))}
        </div>
      )}
      {zoomOpen && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Zoomed image of ${product.name}`}
          tabIndex={-1}
          ref={dialogRef}
        >
          <button
            className="lightbox-close"
            type="button"
            onClick={() => setZoomOpen(false)}
            aria-label="Close image zoom"
          >
            <X size={22} />
          </button>
          {images.length > 1 && (
            <button
              className="lightbox-prev"
              type="button"
              onClick={() => showImage(activeIndex - 1)}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <Image
            src={image.image_url}
            alt={image.alt_text || product.name}
            fill
            sizes="100vw"
            className="lightbox-image"
          />
          {images.length > 1 && (
            <button
              className="lightbox-next"
              type="button"
              onClick={() => showImage(activeIndex + 1)}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
