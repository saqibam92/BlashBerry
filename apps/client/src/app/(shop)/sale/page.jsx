"use client";

import ProductList from "@/components/product/ProductList";
import { getCategories } from "@/lib/productApi";
import { useState, useEffect } from "react";

export default function SalePage() {
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
      title="Products on Sale"
      // Pass the new 'onSale' filter
      initialFilters={{
        onSale: "true",
        limit: 9,
        sort: "newest",
      }}
      categories={categories}
    />
  );
}
