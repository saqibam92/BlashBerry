// File: apps/client/src/app/(shop)/category/page.jsx
"use client";

import { useState, useEffect } from "react";
import { getCategories } from "@/lib/productApi";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { generateSlug } from "@/lib/utils";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const result = await getCategories();
        setCategories(result.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Shop by Category
      </Typography>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress size={50} />
        </Box>
      ) : categories.length > 0 ? (
        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category._id}>
              <Link href={`/category/${generateSlug(category.name)}`} passHref>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  {category.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={category.image}
                      alt={category.name}
                      sx={{ objectFit: "cover" }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description ||
                        `Explore our ${category.name} collection.`}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" align="center" color="text.secondary">
          No categories found.
        </Typography>
      )}
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import ProductFilter from "@/components/product/ProductFilter";
// import ProductCard from "@/components/product/ProductCard";
// import { getAllProducts } from "@/lib/productApi";
// import { CircularProgress, Pagination, Box } from "@mui/material";
// import { useQuickView } from "@/hooks/useQuickView";
// import ProductColumnSelector from "@/components/product/ProductColumnSelector";
// import { useParams } from "next/navigation";

// export default function CategoryPage() {
//   const { slug } = useParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [pagination, setPagination] = useState({});
//   const [filters, setFilters] = useState({
//     page: 1,
//     limit: 9,
//     sort: "newest",
//     category: slug,
//   });
//   const [columns, setColumns] = useState(3);
//   const { handleOpenQuickView, QuickViewComponent } = useQuickView();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       const result = await getAllProducts(filters);
//       setProducts(result.data || []);
//       setPagination(result.pagination || {});
//       setLoading(false);
//     };
//     fetchProducts();
//   }, [filters]);

//   const handleFilterChange = (newFilters) => {
//     setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
//   };

//   const handlePageChange = (event, value) => {
//     setFilters((prev) => ({ ...prev, page: value }));
//   };

//   const handleColumnChange = (newColumns) => setColumns(newColumns);

//   return (
//     <>
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-4xl font-bold text-center mb-8">
//           Products in {slug}
//         </h1>
//         <Box
//           sx={{
//             mb: 4,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <ProductColumnSelector onColumnChange={handleColumnChange} />
//         </Box>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div className="col-span-1">
//             <ProductFilter onFilterChange={handleFilterChange} />
//           </div>
//           <div className={`col-span-3`}>
//             {loading ? (
//               <Box className="flex justify-center items-center h-96">
//                 <CircularProgress size={50} />
//               </Box>
//             ) : (
//               <>
//                 <div
//                   className="grid gap-6"
//                   style={{
//                     gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
//                   }}
//                 >
//                   {products.length > 0 ? (
//                     products.map((product) => (
//                       <ProductCard
//                         key={product._id}
//                         product={product}
//                         onQuickViewOpen={handleOpenQuickView}
//                       />
//                     ))
//                   ) : (
//                     <p className="col-span-full text-center text-gray-500">
//                       No products found in this category.
//                     </p>
//                   )}
//                 </div>
//                 <div className="flex justify-center mt-8">
//                   {pagination.pages > 1 && (
//                     <Pagination
//                       count={pagination.pages || 1}
//                       page={pagination.current || 1}
//                       onChange={handlePageChange}
//                       color="primary"
//                       size="large"
//                     />
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//       <QuickViewComponent />
//     </>
//   );
// }
