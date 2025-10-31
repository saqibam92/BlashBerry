// apps/client/src/components/common/ProductCarousel.jsx
"use client";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { motion } from "framer-motion";
import { useQuickView } from "@/hooks/useQuickView";

export default function ProductCarousel({ title, products = [] }) {
  const scrollRef = useRef(null);

  const { handleOpenQuickView, QuickViewComponent } = useQuickView();

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <>
      <div className="relative mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full shadow"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full shadow"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Scroll shadows */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <motion.div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar"
            whileTap={{ cursor: "grabbing" }}
          >
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="flex-shrink-0 w-48 sm:w-56">
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickViewOpen={handleOpenQuickView}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 ml-4">No products available.</p>
            )}
          </motion.div>
        </div>
      </div>
      <QuickViewComponent />
    </>
  );
}
