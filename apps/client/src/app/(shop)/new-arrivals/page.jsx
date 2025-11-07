// apps/client/src/app/(shop)/new-arrivals/page.jsx

"use client";

import ProductList from "@/components/product/ProductList";
import { getCategories } from "@/lib/productApi";
import { useState, useEffect } from "react";

export default function NewArrivalsPage() {
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
      title="New Arrivals"
      // Pass the new 'isNewArrival' filter
      initialFilters={{
        isNewArrival: "true",
        limit: 9,
        sort: "newest",
      }}
      categories={categories}
    />
  );
}
