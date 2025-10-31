// apps/client/src/components/products/ProductDetailsClient.jsx
"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import ProductCard from "./ProductCard";
import ProductGallery from "./ProductGallery";
import ProductReviews from "./ProductReviews";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";
import { Breadcrumbs, Typography, Chip, Divider, Stack } from "@mui/material";
import Link from "next/link";
import BuyNowButton from "@/components/common/BuyNowButton";

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-1">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-900">{value || "—"}</span>
  </div>
);

export default function ProductDetailsClient({ product, similarProducts }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }
    addToCart(product, quantity, selectedSize);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white">
      <div className="pt-6">
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
          {/* <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/products" className="hover:underline">
              Shop
            </Link>
            <Typography color="text.primary">
              {product.category?.name}
            </Typography>
          </Breadcrumbs> */}

          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
            <ProductGallery images={product.images} altText={product.name} />

            <div className="lg:border-l lg:border-gray-200 lg:pl-8 mt-8 lg:mt-0">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {product.name}
              </h1>
              {product.model && (
                <p className="text-lg text-gray-600">Model: {product.model}</p>
              )}

              {/* --- Description --- */}
              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">
                  Description
                </h3>
                <div className="mt-4 prose prose-sm text-gray-700">
                  <p>{product.description}</p>
                </div>
              </div>
              <p className="text-3xl tracking-tight text-gray-900 mt-4">
                {formatPrice(product.price)}
              </p>

              {/* --- NEW: Product Details Table --- */}
              <div className="mt-10 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                <Stack spacing={1}>
                  <DetailRow
                    label="Material"
                    value={product.details.material}
                  />
                  <DetailRow
                    label="Bra Design"
                    value={product.details.braDesign}
                  />
                  <DetailRow
                    label="Support Type"
                    value={product.details.supportType}
                  />
                  <DetailRow
                    label="Cup Shape"
                    value={product.details.cupShape}
                  />
                  <DetailRow
                    label="Closure"
                    value={product.details.closureType}
                  />
                  <DetailRow label="Straps" value={product.details.strapType} />
                  <DetailRow
                    label="Decoration"
                    value={product.details.decoration}
                  />
                  <DetailRow
                    label="Panty Type"
                    value={product.details.pantyType}
                  />
                  <DetailRow label="Rise" value={product.details.riseType} />
                  <DetailRow
                    label="Removable Pads"
                    value={product.removablePads ? "Yes" : "No"}
                  />
                  <DetailRow
                    label="Eco-Friendly"
                    value={product.ecoFriendly ? "Yes" : "No"}
                  />
                  <DetailRow
                    label="OEM/ODM"
                    value={product.oemOdm ? "Supported" : "No"}
                  />
                  <DetailRow
                    label="Sample Lead Time"
                    value={product.sampleLeadTime}
                  />
                  <DetailRow label="Origin" value={product.origin} />
                </Stack>

                {product.feature && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <div>
                      <strong>Features:</strong> {product.feature}
                    </div>
                  </>
                )}
              </div>

              {/* --- Size Selector --- */}
              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border rounded-md py-2 px-4 text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? "bg-primary-600 text-white border-primary-600"
                          : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* <Button
                onClick={handleAddToCart}
                className="mt-10 w-full bg-pink-500/90 hover:bg-pink-600 text-white"
                size="lg"
              >
                Add to Cart
              </Button> */}
              <Stack direction="column" spacing={2} className="mt-10">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-pink-500/90 hover:bg-pink-600 text-white"
                  size="lg"
                >
                  Add to Cart
                </Button>
                {/* 2. Add the BuyNowButton */}
                <BuyNowButton
                  product={product}
                  size={selectedSize}
                  quantity={quantity}
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: "pink.500",
                    color: "pink.500",
                    "&:hover": {
                      borderColor: "pink.600",
                      backgroundColor: "pink.50",
                    },
                  }}
                >
                  Buy Now
                </BuyNowButton>
              </Stack>
            </div>
          </div>
        </div>
      </div>

      {/* --- Similar Products --- */}
      {similarProducts?.length > 0 && (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Frequently Bought Together
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {similarProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* --- Reviews --- */}
      <ProductReviews
        productSlug={product.slug}
        reviews={product.reviews}
        initialRating={product.rating}
        initialNumReviews={product.numReviews}
      />
    </div>
  );
}
