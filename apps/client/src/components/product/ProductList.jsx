// apps/client/src/components/product/ProductList.jsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ProductFilter from "@/components/product/ProductFilter";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import ProductColumnSelector from "@/components/product/ProductColumnSelector";
import { getAllProducts } from "@/lib/productApi";
import {
  CircularProgress,
  Box,
  Drawer,
  Button,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useQuickView } from "@/hooks/useQuickView";
import ScrollToTop from "@/components/common/ScrollToTop";

export default function ProductList({
  title = "Shop All Products",
  initialFilters = { limit: 9, sort: "newest" },
  categories = [],
}) {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    sort: initialFilters.sort,
    category: initialFilters.category,
    onSale: initialFilters.onSale,
    isNewArrival: initialFilters.isNewArrival,
    limit: initialFilters.limit || 9,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [columns, setColumns] = useState(4);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { handleOpenQuickView, QuickViewComponent } = useQuickView();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // --- Refs ---
  const observer = useRef(null);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(true);

  // Keep hasMore in sync
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // --- Fetch Products ---
  // const fetchProducts = useCallback(async () => {
  //   setLoading(true); // This sets isFetchingRef.current = true via useEffect
  //   setError(null);
  //   // if (isFetchingRef.current) return;

  //   isFetchingRef.current = true;
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const result = await getAllProducts({
  //       ...initialFilters,
  //       ...filters,
  //       page,
  //       limit: initialFilters.limit || 9,
  //     });

  //     const incoming = result.data || [];
  //     const { pagination: newPagination } = result;

  //     // Merge results
  //     setProducts((prev) => (page === 1 ? incoming : [...prev, ...incoming]));
  //     setPagination(newPagination || {});
  //     setHasMore(newPagination?.hasNext ?? false);

  //     // If out of range, reset
  //     if (newPagination?.pages && page > newPagination.pages) {
  //       setPage(1);
  //       setProducts([]);
  //       setHasMore(true);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching products:", err);
  //     setError("Failed to load products. Please try again.");
  //     setHasMore(false);
  //   } finally {
  //     setLoading(false);
  //     // Prevent rapid re-fetches
  //     setTimeout(() => {
  //       isFetchingRef.current = false;
  //     }, 300);
  //   }
  // }, [filters, page, initialFilters]);

  const fetchProducts = useCallback(async () => {
    setLoading(true); // This sets isFetchingRef.current = true via useEffect
    setError(null);

    try {
      const res = await getAllProducts({ ...filters, page });
      const { data, pagination: meta } = res;

      setProducts((prev) =>
        page === 1 ? data || [] : [...prev, ...(data || [])]
      );
      setPagination(meta);
      setHasMore(meta.hasNext);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
      setHasMore(false);
    } finally {
      setLoading(false); // This sets isFetchingRef.current = false
    }
  }, [filters, page]);

  // Fetch when filters/page change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- IntersectionObserver (infinite scroll) ---
  // const lastProductElementRef = useCallback(
  //   (node) => {
  //     if (observer.current) observer.current.disconnect();

  //     observer.current = new IntersectionObserver(
  //       (entries) => {
  //         const first = entries[0];
  //         if (
  //           first.isIntersecting &&
  //           hasMoreRef.current &&
  //           !isFetchingRef.current &&
  //           page < (pagination?.pages ?? Number.MAX_SAFE_INTEGER)
  //         ) {
  //           setPage((prev) => prev + 1);
  //         }
  //       },
  //       { threshold: 0.1, rootMargin: "100px" }
  //     );

  //     if (node) observer.current.observe(node);
  //   },
  //   [page, pagination?.pages]
  // );

  const lastProductRef = useCallback((node) => {
    // Disconnect any previous observer
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasMoreRef.current &&
        !isFetchingRef.current // Check the ref
      ) {
        isFetchingRef.current = true;

        setPage((p) => p + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, []);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => observer.current?.disconnect();
  }, []);

  // --- Reset when filters change ---
  const handleFilterChange = (newFilters) => {
    // isFetchingRef.current = false;
    // setFilters((prev) => ({ ...prev, ...newFilters }));
    setFilters((prev) => ({ ...prev, ...newFilters, limit: prev.limit }));

    setPage(1);
    setProducts([]);
    setHasMore(true);
    setError(null);
  };

  const handleRetry = () => {
    // isFetchingRef.current = false; // No need, will be set by fetch
    fetchProducts();
  };

  const handleColumnChange = (newColumns) => setColumns(newColumns);
  // const handleRetry = () => {
  //   isFetchingRef.current = false;
  //   fetchProducts();
  // };

  // const renderSkeletons = () => {
  //   const skeletonCount = initialFilters.limit || 9;
  //   return Array.from({ length: skeletonCount }).map((_, i) => (
  //     <ProductCardSkeleton key={`skeleton-${i}`} />
  //   ));
  // };

  const renderSkeletons = () =>
    Array.from({ length: filters.limit || 9 }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ));

  const filterComponent = (
    <ProductFilter
      onFilterChange={handleFilterChange}
      categories={categories}
      onMobileClose={() => setMobileFiltersOpen(false)}
    />
  );

  return (
    <>
      <Drawer
        anchor="left"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
      >
        {filterComponent}
      </Drawer>

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
          <Button
            className="md:hidden"
            onClick={() => setMobileFiltersOpen(true)}
            startIcon={<FilterListIcon />}
          >
            Filters
          </Button>
          <Box className="hidden md:block" sx={{ ml: "auto" }}>
            <ProductColumnSelector onColumnChange={handleColumnChange} />
          </Box>
        </Box>

        <div className="col-span-1 md:col-span-5">
          {error && (
            <Box className="flex justify-center items-center h-32">
              <Typography color="error">{error}</Typography>
              <Button onClick={handleRetry} sx={{ ml: 2 }}>
                Retry
              </Button>
            </Box>
          )}

          {loading && page === 1 ? (
            <div
              className="grid gap-4 md:gap-6"
              style={{
                gridTemplateColumns: isDesktop
                  ? `repeat(${columns}, minmax(0, 1fr))`
                  : "repeat(2, minmax(0, 1fr))",
              }}
            >
              {renderSkeletons()}
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <div
                  className="grid gap-4 md:gap-6"
                  style={{
                    gridTemplateColumns: isDesktop
                      ? `repeat(${columns}, minmax(0, 1fr))`
                      : "repeat(2, minmax(0, 1fr))",
                  }}
                >
                  {/* {products.map((product, i) => {
                    const isLast = i === products.length - 1;
                    return (
                      <div
                        key={product._id}
                        ref={isLast ? lastProductElementRef : null}
                      >
                        <ProductCard
                          product={product}
                          onQuickViewOpen={handleOpenQuickView}
                        />
                      </div>
                    );
                  })} */}
                  {products.map((p, i) => (
                    <div
                      key={p._id}
                      ref={i === products.length - 1 ? lastProductRef : null}
                    >
                      <ProductCard
                        product={p}
                        onQuickViewOpen={handleOpenQuickView}
                      />
                    </div>
                  ))}

                  {/* Render skeletons ONLY on initial page load */}
                  {loading && page === 1 && !error && renderSkeletons()}
                </div>
              ) : (
                !loading && (
                  <Typography
                    className="col-span-full text-center text-gray-500"
                    aria-live="polite"
                  >
                    No products found with the current filters.
                  </Typography>
                )
              )}

              {loading && page > 1 && (
                <Box className="flex justify-center items-center h-32">
                  <CircularProgress size={40} />
                </Box>
              )}

              {!loading && !hasMore && products.length > 0 && (
                <Typography
                  align="center"
                  sx={{ mt: 4, color: "text.secondary" }}
                >
                  You've reached the end of the list.
                </Typography>
              )}
            </>
          )}
        </div>
      </div>

      <QuickViewComponent />
      <ScrollToTop />
    </>
  );
}
