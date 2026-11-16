"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

type HomeProductCarouselProps = {
  ariaLabel: string;
  children: ReactNode;
};

function getScrollStep(viewport: HTMLDivElement) {
  const firstCard = viewport.querySelector<HTMLElement>(".product-card");
  if (!firstCard) return viewport.clientWidth * 0.8;
  const grid = viewport.firstElementChild;
  const styles = grid ? window.getComputedStyle(grid) : null;
  const gap = Number.parseFloat(styles?.columnGap || styles?.gap || "0") || 0;
  return firstCard.getBoundingClientRect().width + gap;
}

export function HomeProductCarousel({ ariaLabel, children }: HomeProductCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const suppressClickRef = useRef(false);
  const carouselId = useId();
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isViewportFocused, setIsViewportFocused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [isInView, setIsInView] = useState(false);

  const updateScrollState = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    setHasOverflow(maxScroll > 2);
    setCanScrollBack(viewport.scrollLeft > 2);
    setCanScrollForward(viewport.scrollLeft < maxScroll - 2);
  }, []);

  const scrollByCard = useCallback(
    (direction: -1 | 1) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      setIsPaused(true);
      viewport.scrollBy({
        left: direction * getScrollStep(viewport),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    },
    [prefersReducedMotion],
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    updateScrollState();
    viewport.addEventListener("scroll", updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(viewport);
    if (viewport.firstElementChild) resizeObserver.observe(viewport.firstElementChild);
    const intersectionObserver = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.05,
    });
    intersectionObserver.observe(viewport);

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(motionPreference.matches);
    const updatePageVisibility = () => setPageVisible(!document.hidden);
    updateMotionPreference();
    updatePageVisibility();
    motionPreference.addEventListener("change", updateMotionPreference);
    document.addEventListener("visibilitychange", updatePageVisibility);

    return () => {
      viewport.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionPreference.removeEventListener("change", updateMotionPreference);
      document.removeEventListener("visibilitychange", updatePageVisibility);
    };
  }, [updateScrollState]);

  useEffect(() => {
    if (
      isPaused ||
      isHovered ||
      isViewportFocused ||
      prefersReducedMotion ||
      !pageVisible ||
      !isInView ||
      !hasOverflow
    ) {
      return;
    }
    const timer = window.setInterval(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      if (maxScroll <= 2) return;
      if (viewport.scrollLeft >= maxScroll - 8) {
        viewport.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        viewport.scrollBy({ left: getScrollStep(viewport), behavior: "smooth" });
      }
    }, 4800);
    return () => window.clearInterval(timer);
  }, [hasOverflow, isHovered, isInView, isPaused, isViewportFocused, pageVisible, prefersReducedMotion]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByCard(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByCard(1);
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    setIsPaused(true);
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest("button, input, select, textarea")) return;

    const viewport = event.currentTarget;
    const startX = event.clientX;
    const startScrollLeft = viewport.scrollLeft;
    let dragged = false;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== event.pointerId) return;
      const distance = moveEvent.clientX - startX;
      if (!dragged && Math.abs(distance) > 5) {
        dragged = true;
        viewport.classList.add("is-dragging");
      }
      if (dragged) {
        moveEvent.preventDefault();
        viewport.scrollLeft = startScrollLeft - distance;
      }
    };

    const stopDragging = (endEvent: PointerEvent) => {
      if (endEvent.pointerId !== event.pointerId) return;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
      viewport.classList.remove("is-dragging");
      if (dragged) {
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);
  };

  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  return (
    <div className="home-product-carousel">
      <div
        className="home-product-carousel-controls"
        role="group"
        aria-label={`${ariaLabel} carousel controls`}
      >
        {!prefersReducedMotion && (
          <button
            type="button"
            className="home-product-carousel-button"
            aria-label={
              isPaused
                ? `Resume automatic scrolling for ${ariaLabel}`
                : `Pause automatic scrolling for ${ariaLabel}`
            }
            title={isPaused ? "Resume automatic scrolling" : "Pause automatic scrolling"}
            onClick={() => {
              setIsHovered(false);
              setIsPaused((paused) => !paused);
            }}
          >
            {isPaused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}
          </button>
        )}
        <button
          type="button"
          className="home-product-carousel-button"
          aria-label={`Previous ${ariaLabel}`}
          aria-controls={carouselId}
          disabled={!hasOverflow || !canScrollBack}
          onClick={() => scrollByCard(-1)}
        >
          <ChevronLeft size={19} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="home-product-carousel-button"
          aria-label={`Next ${ariaLabel}`}
          aria-controls={carouselId}
          disabled={!hasOverflow || !canScrollForward}
          onClick={() => scrollByCard(1)}
        >
          <ChevronRight size={19} aria-hidden="true" />
        </button>
      </div>
      <div
        id={carouselId}
        ref={viewportRef}
        className="home-product-carousel-viewport"
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onClickCapture={handleClickCapture}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocusCapture={() => setIsViewportFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsViewportFocused(false);
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}
