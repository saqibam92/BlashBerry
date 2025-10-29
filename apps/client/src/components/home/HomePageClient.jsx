// File: apps/client/src/components/home/HomePageClient
"use client";

import ProductCard from "@/components/product/ProductCard";
import { useQuickView } from "@/hooks/useQuickView";

export default function HomePageClient({ products }) {
  const { handleOpenQuickView, QuickViewComponent } = useQuickView();

  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-12">
        Featured Products
      </h2>

      {products.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickViewOpen={handleOpenQuickView}
            />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-gray-500">
          Could not load featured products at this time. Please check back
          later.
        </p>
      )}

      <QuickViewComponent />
    </>
  );
}
