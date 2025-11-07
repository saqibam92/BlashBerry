// // File: apps/client/src/components/product/ProductList.jsx

// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import ProductFilter from "@/components/product/ProductFilter";
// import ProductCard from "@/components/product/ProductCard";
// import ProductColumnSelector from "@/components/product/ProductColumnSelector";
// import { getAllProducts } from "@/lib/productApi";
// import {
//   CircularProgress,
//   Box,
//   Drawer,
//   Button,
//   useTheme,
//   useMediaQuery,
//   Typography,
// } from "@mui/material";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import { useQuickView } from "@/hooks/useQuickView";
// import ScrollToTop from "@/components/common/ScrollToTop";

// export default function ProductList({
//   title = "Shop All Products",
//   initialFilters = { limit: 9, sort: "newest" },
//   categories = [],
// }) {
//   const [products, setProducts] = useState([]);
//   const [pagination, setPagination] = useState({});
//   const [filters, setFilters] = useState({
//     sort: initialFilters.sort,
//     category: initialFilters.category,
//   });
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [hasMore, setHasMore] = useState(true);

//   const [columns, setColumns] = useState(4);
//   const { handleOpenQuickView, QuickViewComponent } = useQuickView();

//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
//   const theme = useTheme();
//   const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

//   const observer = useRef();
//   const lastProductElementRef = useCallback(
//     (node) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();
//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       });
//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore]
//   );

//   useEffect(() => {
//     setLoading(true);
//     const fetchProducts = async () => {
//       const allFilters = {
//         ...initialFilters,
//         ...filters,
//         page: page,
//         limit: initialFilters.limit || 9,
//       };

//       try {
//         const result = await getAllProducts(allFilters);
//         setProducts((prevProducts) => {
//           // If it's page 1, replace products. Otherwise, append.
//           return page === 1
//             ? result.data || []
//             : [...prevProducts, ...(result.data || [])];
//         });
//         setPagination(result.pagination || {});
//         setHasMore(result.pagination?.hasNext || false);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setHasMore(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [filters, page, initialFilters.category, initialFilters.sort]); // Re-run on filter or page change

//   // Refactored handleFilterChange
//   const handleFilterChange = (newFilters) => {
//     setFilters((prev) => ({ ...prev, ...newFilters }));
//     setPage(1);
//     setProducts([]);
//     setHasMore(true);
//   };

//   const handleColumnChange = (newColumns) => setColumns(newColumns);

//   const filterComponent = (
//     <ProductFilter
//       onFilterChange={handleFilterChange}
//       categories={categories}
//       onMobileClose={() => setMobileFiltersOpen(false)}
//     />
//   );

//   return (
//     <>
//       <Drawer
//         anchor="left"
//         open={mobileFiltersOpen}
//         onClose={() => setMobileFiltersOpen(false)}
//       >
//         {filterComponent}
//       </Drawer>
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-4xl font-bold text-center mb-8">{title}</h1>
//         <Box
//           sx={{
//             mb: 4,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Button
//             className="md:hidden"
//             onClick={() => setMobileFiltersOpen(true)}
//             startIcon={<FilterListIcon />}
//           >
//             Filters
//           </Button>
//           <Box className="hidden md:block" sx={{ ml: "auto" }}>
//             <ProductColumnSelector onColumnChange={handleColumnChange} />
//           </Box>
//         </Box>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* <div className="hidden md:block col-span-1">{filterComponent}</div> */}

//           <div className="col-span-1 md:col-span-3">
//             {products.length > 0 ? (
//               <div
//                 className="grid gap-4 md:gap-6"
//                 style={{
//                   gridTemplateColumns: isDesktop
//                     ? `repeat(${columns}, minmax(0, 1fr))`
//                     : "repeat(2, minmax(0, 1fr))",
//                 }}
//               >
//                 {products.map((product, index) => {
//                   // Add the observer ref to the last element
//                   if (products.length === index + 1) {
//                     return (
//                       <div ref={lastProductElementRef} key={product._id}>
//                         <ProductCard
//                           product={product}
//                           onQuickViewOpen={handleOpenQuickView}
//                         />
//                       </div>
//                     );
//                   } else {
//                     return (
//                       <ProductCard
//                         key={product._id}
//                         product={product}
//                         onQuickViewOpen={handleOpenQuickView}
//                       />
//                     );
//                   }
//                 })}
//               </div>
//             ) : (
//               !loading && (
//                 <p className="col-span-full text-center text-gray-500">
//                   No products found with the current filters.
//                 </p>
//               )
//             )}

//             {loading && (
//               <Box className="flex justify-center items-center h-32">
//                 <CircularProgress size={40} />
//               </Box>
//             )}

//             {/* "No more products" message */}
//             {!loading && !hasMore && products.length > 0 && (
//               <Typography
//                 align="center"
//                 sx={{ mt: 4, color: "text.secondary" }}
//               >
//                 You've reached the end of the list.
//               </Typography>
//             )}
//           </div>
//         </div>
//       </div>
//       <QuickViewComponent />
//       <ScrollToTop />
//     </>
//   );
// }

// File: apps/client/src/app/(shop)/products/page.jsx
"use client";

import ProductList from "@/components/product/ProductList";
import { getCategories } from "@/lib/productApi";
import { useState, useEffect } from "react";

export default function ProductsPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getCategories();
      setCategories(result.data || []);
    };
    fetchCategories();
  }, []);

  return (
    <ProductList
      title="Shop All Products"
      initialFilters={{ limit: 9, sort: "newest" }}
      categories={categories}
      // initialProducts is removed, ProductList will fetch on its own
    />
  );
}
