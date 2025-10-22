"use client";

import { useState } from "react";
import QuickViewModal from "@/components/product/QuickViewModal";

/**
 * A custom hook to manage the state and rendering of the Product Quick View Modal.
 * @returns {{handleOpenQuickView: function, QuickViewComponent: function}}
 * - handleOpenQuickView: A function to open the modal with a specific product.
 * - QuickViewComponent: A component that renders the modal.
 */
export const useQuickView = () => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const handleOpenQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  // This component is returned by the hook, pre-configured with the correct state and handlers.
  const QuickViewComponent = () => (
    <QuickViewModal
      product={quickViewProduct}
      open={!!quickViewProduct}
      onClose={handleCloseQuickView}
    />
  );

  return {
    handleOpenQuickView,
    QuickViewComponent,
  };
};
