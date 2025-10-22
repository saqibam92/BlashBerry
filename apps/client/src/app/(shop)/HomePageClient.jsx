// File: apps/client/src/app/(shop)/HomePageClient.js
"use client";

import ProductCard from "@/components/product/ProductCard";
import { useQuickView } from "@/hooks/useQuickView";

// This component receives the product data as props from its parent (the Server Component).
export default function HomePageClient({ products }) {
  // We can safely call the client-side hook here because of the "use client" directive.
  const { handleOpenQuickView, QuickViewComponent } = useQuickView();

  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-12">
        Featured Products
      </h2>

      {products.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              // The handler from the hook is passed down to each card.
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

      {/* The QuickView modal is rendered here. */}
      <QuickViewComponent />
    </>
  );
}
