// File: apps/client/src/components/product/ProductList.jsx
"use client";

import { useState, useEffect } from "react";
import ProductFilter from "@/components/product/ProductFilter";
import ProductCard from "@/components/product/ProductCard";
import ProductColumnSelector from "@/components/product/ProductColumnSelector";
import { getAllProducts } from "@/lib/productApi";
import { CircularProgress, Pagination, Box } from "@mui/material";
import { useQuickView } from "@/hooks/useQuickView";

export default function ProductList({
  title = "Shop All Products",
  initialFilters = { page: 1, limit: 9, sort: "newest" },
  categories = [],
  initialProducts = null,
}) {
  const [products, setProducts] = useState(initialProducts?.data || []);
  const [pagination, setPagination] = useState(
    initialProducts?.pagination || {}
  );
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(!initialProducts); // Skip loading if initialProducts provided
  const [columns, setColumns] = useState(3);
  const { handleOpenQuickView, QuickViewComponent } = useQuickView();

  useEffect(() => {
    // Only fetch if filters have changed or no initialProducts
    if (
      JSON.stringify(filters) !== JSON.stringify(initialFilters) ||
      !initialProducts
    ) {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const result = await getAllProducts(filters);
          setProducts(result.data || []);
          setPagination(result.pagination || {});
        } catch (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
          setPagination({});
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [filters, initialFilters, initialProducts]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (event, value) => {
    setFilters((prev) => ({ ...prev, page: value }));
  };

  const handleColumnChange = (newColumns) => setColumns(newColumns);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">{title}</h1>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ProductColumnSelector onColumnChange={handleColumnChange} />
        </Box>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <ProductFilter
              onFilterChange={handleFilterChange}
              categories={categories}
            />
          </div>
          <div className="col-span-3">
            {loading ? (
              <Box className="flex justify-center items-center h-96">
                <CircularProgress size={50} />
              </Box>
            ) : (
              <>
                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  }}
                >
                  {products.length > 0 ? (
                    products.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onQuickViewOpen={handleOpenQuickView}
                      />
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-500">
                      No products found with the current filters.
                    </p>
                  )}
                </div>
                <div className="flex justify-center mt-8">
                  {pagination.pages > 1 && (
                    <Pagination
                      count={pagination.pages || 1}
                      page={pagination.current || 1}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <QuickViewComponent />
    </>
  );
}
