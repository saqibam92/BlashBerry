// File: apps/client/src/app/(shop)/products/[slug]/page.jsx

import { getProductBySlug, getSimilarProducts } from "@/lib/productApi";
import ProductDetailsClient from "@/components/product/ProductDetailsClient";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }) {
  const { slug } = params;

  if (!slug || slug === "undefined") {
    notFound();
  }

  const [product, similarProducts] = await Promise.all([
    getProductBySlug(slug),
    getSimilarProducts(slug),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailsClient product={product} similarProducts={similarProducts} />
  );
}
