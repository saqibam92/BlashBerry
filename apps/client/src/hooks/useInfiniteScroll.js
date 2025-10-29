// File: apps/client/src/hooks/useInfiniteScroll.js
import { useRef, useEffect } from "react";

export function useInfiniteScroll(itemCount) {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let isDragging = false;
    let startX, scrollLeft;
    let rafId = null;

    const startDrag = (e) => {
      isDragging = true;
      startX = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      slider.style.cursor = "grabbing";
    };

    const drag = (e) => {
      if (!isDragging) return;
      e.preventDefault();

      // Use requestAnimationFrame for smoother dragging
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const x = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
      });
    };

    const endDrag = () => {
      isDragging = false;
      slider.style.cursor = "grab";
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    // Optimized infinite loop with throttling
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollWidth = slider.scrollWidth;
        const clientWidth = slider.clientWidth;
        const sectionWidth = scrollWidth / 3;

        if (slider.scrollLeft <= 0) {
          slider.scrollLeft = sectionWidth;
        } else if (slider.scrollLeft >= scrollWidth - clientWidth) {
          slider.scrollLeft = sectionWidth * 2 - clientWidth;
        }
      }, 50); // Throttle to improve performance
    };

    // Event listeners with passive option for better scroll performance
    slider.addEventListener("mousedown", startDrag);
    slider.addEventListener("mousemove", drag);
    slider.addEventListener("mouseup", endDrag);
    slider.addEventListener("mouseleave", endDrag);
    slider.addEventListener("touchstart", startDrag, { passive: true });
    slider.addEventListener("touchmove", drag, { passive: false });
    slider.addEventListener("touchend", endDrag);
    slider.addEventListener("scroll", handleScroll, { passive: true });

    // Set initial scroll position
    requestAnimationFrame(() => {
      slider.scrollLeft = slider.scrollWidth / 3;
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(scrollTimeout);
      slider.removeEventListener("mousedown", startDrag);
      slider.removeEventListener("mousemove", drag);
      slider.removeEventListener("mouseup", endDrag);
      slider.removeEventListener("mouseleave", endDrag);
      slider.removeEventListener("touchstart", startDrag);
      slider.removeEventListener("touchmove", drag);
      slider.removeEventListener("touchend", endDrag);
      slider.removeEventListener("scroll", handleScroll);
    };
  }, [itemCount]);

  return sliderRef;
}
