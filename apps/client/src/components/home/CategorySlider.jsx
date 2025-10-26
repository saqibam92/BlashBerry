// File: apps/client/src/components/home/CategorySlider.jsx
"use client";
import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Changed component to accept 'children' instead of 'categories' prop
export default function CategorySlider({ children }) {
  // Initialize Embla Carousel with Autoplay plugin for infinite loop
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  ]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative py-8 sm:py-12">
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 z-10">
        <div className="flex justify-between items-center">
          <button
            onClick={scrollPrev}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            aria-label="Previous category"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            aria-label="Next category"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Embla Carousel Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* Embla Container */}
        <div className="flex">
          {/* Render children directly */}
          {children}
        </div>
      </div>
    </div>
  );
}
