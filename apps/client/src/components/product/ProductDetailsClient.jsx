// apps/client/src/components/products/ProductDetailsClient.jsx

"use client";
import { useState } from "react";
import ProductGallery from "./ProductGallery";
// import ProductReviews from "./ProductReviews";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import {
  Typography,
  Stack,
  Box,
  // Tabs,
  // Tab,
  IconButton,
  Button as MuiButton,
  Chip,
} from "@mui/material";
import { Add, Remove, Call, WhatsApp } from "@mui/icons-material";
import Link from "next/link";
import BuyNowButton from "@/components/common/BuyNowButton";
import Image from "next/image"; // Added for payment icons
import ProductCarousel from "../common/ProductCarousel";

// Helper component for rendering a single detail row
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-1">
    <span className="font-medium text-gray-700 capitalize">{label}:</span>
    <span className="text-gray-900">{value || "—"}</span>
  </div>
);

// Helper component for MUI Tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 1, sm: 3 } }}>{children}</Box>}
    </div>
  );
}

export default function ProductDetailsClient({ product, similarProducts }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  // const [tab, setTab] = useState(0);
  const phoneOrderNumber = "01345304161";

  // --- 1. Price Calculation ---
  let finalPrice = product.price;
  let originalPrice = null;

  if (product.discount?.discountAmount > 0) {
    originalPrice = product.price; // Store the old price
    if (product.discount.discountType === "percentage") {
      finalPrice =
        product.price - (product.price * product.discount.discountAmount) / 100;
    } else {
      // Assumes "fixed" discount
      finalPrice = product.price - product.discount.discountAmount;
    }
  }
  // Ensure final price isn't negative
  if (finalPrice < 0) finalPrice = 0;
  // --- End Price Calculation ---

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }
    // The addToCart function from the context already shows a toast
    addToCart(product, quantity, selectedSize);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => (prev < 10 ? prev + 1 : 10)); // Cap at 10
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // Min of 1
  };

  const formatDetailKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  // const handleTabChange = (event, newValue) => {
  //   setTab(newValue);
  // };

  return (
    <div className="bg-white">
      <div className="pt-6">
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
            {/* 1. Product Gallery */}
            <ProductGallery images={product.images} altText={product.name} />

            {/* 2. Product Info */}
            <div className="m-2 lg:pl-8 mt-8 lg:mt-0 md:m-0">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {product.name}
              </h1>
              {product.model && (
                <p className="text-lg text-gray-600">Model: {product.model}</p>
              )}

              {/* --- Price --- */}
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "baseline",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: "primary.main",
                    fontWeight: "bold",
                  }}
                >
                  {formatPrice(finalPrice)}
                </Typography>
                {originalPrice && (
                  <Typography
                    variant="h5"
                    sx={{
                      color: "text.secondary",
                      textDecoration: "line-through",
                    }}
                  >
                    {formatPrice(originalPrice)}
                  </Typography>
                )}
              </Box>

              {/* --- Size Selector --- */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {product.sizes?.map((size) => (
                    <Chip
                      key={size}
                      label={size}
                      clickable
                      onClick={() => setSelectedSize(size)}
                      color={selectedSize === size ? "primary" : "default"}
                      variant={selectedSize === size ? "filled" : "outlined"}
                      sx={{
                        fontSize: "0.9rem",
                        padding: "4px 8px",
                        ...(selectedSize === size && {
                          backgroundColor: "#AB1D79",
                        }),
                      }}
                    />
                  ))}
                  <Button
                    size="small"
                    onClick={() => setSelectedSize(null)}
                    sx={{ textTransform: "none", color: "text.secondary" }}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* --- Quantity Selector --- */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Quantity
                </h3>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    width: "fit-content",
                    backgroundColor: "#F1F1F1", // Match image green
                  }}
                >
                  <IconButton
                    onClick={decrementQuantity}
                    aria-label="decrease quantity"
                    sx={{ color: "#000" }}
                  >
                    <Remove />
                  </IconButton>
                  <Typography
                    sx={{
                      px: 2,
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton
                    onClick={incrementQuantity}
                    aria-label="increase quantity"
                    sx={{ color: "#000" }}
                  >
                    <Add />
                  </IconButton>
                </Box>
              </div>

              {/* --- Action Buttons --- */}
              <Stack direction="column" spacing={1.5} className="mt-8">
                <MuiButton
                  onClick={handleAddToCart}
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#004D40", // Dark blue from image
                    "&:hover": {
                      backgroundColor: "#00382e",
                    },
                    py: 1.5,
                    fontSize: "1rem",
                  }}
                >
                  Add to Cart
                </MuiButton>

                <BuyNowButton
                  product={product}
                  size={selectedSize}
                  quantity={quantity}
                  variant="contained"
                  fullWidth
                  // size="large"
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

                <MuiButton
                  variant="contained"
                  size="large"
                  startIcon={<Call />}
                  component="a"
                  href={`tel:${phoneOrderNumber}`}
                  sx={{
                    backgroundColor: "#0288D1", // Lighter blue
                    "&:hover": {
                      backgroundColor: "#01579B",
                    },
                    py: 1.5,
                    fontSize: "1rem",
                  }}
                >
                  ফোনে অর্ডার করুন: {phoneOrderNumber}
                </MuiButton>
              </Stack>

              {/* --- Payment Icons --- */}
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "center",
                  filter: "grayscale(100%)",
                  opacity: 0.7,
                }}
              >
                <Image
                  src="/payments/cod.png"
                  alt="Cash On Delivery"
                  width={50}
                  height={30}
                  style={{ objectFit: "contain" }}
                />
                <Image
                  src="/payments/bkash.png"
                  alt="bKash"
                  width={70}
                  height={30}
                  style={{ objectFit: "contain" }}
                />
                {/* Add Nagad if you have the icon */}
                {/* <Image src="/payments/nagad.png" alt="Nagad" width={70} height={30} style={{ objectFit: 'contain' }} /> */}
              </Box>
            </div>
          </div>
          {/* --- Description / Details (No Tabs) --- */}
          <Box
            sx={{
              width: "100%",
              mt: 10,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Box sx={{ p: { xs: 1, sm: 3 } }}>
              <Box>
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <div className="mt-4 prose prose-sm text-gray-700">
                  <p>{product.description}</p>
                </div>
              </Box>
              <Box mt={4}>
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                {product.details && Object.keys(product.details).length > 0 ? (
                  <Stack spacing={1}>
                    {Object.entries(product.details)
                      .filter(([key, value]) => value && value.trim() !== "")
                      .map(([key, value]) => (
                        <DetailRow
                          key={key}
                          label={formatDetailKey(key)}
                          value={value}
                        />
                      ))}
                  </Stack>
                ) : (
                  <p className="text-gray-500">
                    No additional details available.
                  </p>
                )}
              </Box>
            </Box>
          </Box>

          {/* --- Description / Reviews Tabs --- */}
          {/* <Box
            sx={{
              width: "100%",
              mt: 10,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tab}
                onChange={handleTabChange}
                aria-label="product details tabs"
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Description" id="product-tab-0" />
                <Tab
                  label={`Reviews (${product.numReviews || 0})`}
                  id="product-tab-1"
                />
              </Tabs>
            </Box>
            <TabPanel value={tab} index={0}>
              <Box>
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <div className="mt-4 prose prose-sm text-gray-700">
                  <p>{product.description}</p>
                </div>
              </Box>
              <Box mt={4}>
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                {product.details && Object.keys(product.details).length > 0 ? (
                  <Stack spacing={1}>
                    {Object.entries(product.details)
                      .filter(([key, value]) => value && value.trim() !== "")
                      .map(([key, value]) => (
                        <DetailRow
                          key={key}
                          label={formatDetailKey(key)}
                          value={value}
                        />
                      ))}
                  </Stack>
                ) : (
                  <p className="text-gray-500">
                    No additional details available.
                  </p>
                )}
              </Box>
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <ProductReviews
                productSlug={product.slug}
                reviews={product.reviews}
                initialRating={product.rating}
                initialNumReviews={product.numReviews}
              />
            </TabPanel>
          </Box> */}
        </div>
      </div>

      {/* --- Similar Products --- */}
      {/* {similarProducts?.length > 0 && (
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
      )} */}
      <ProductCarousel title={"Similat Products"} products={similarProducts} />
    </div>
  );
}

// "use client";
// import { useState } from "react";
// import Button from "@/components/ui/Button";
// import ProductCard from "./ProductCard";
// import ProductGallery from "./ProductGallery";
// import ProductReviews from "./ProductReviews";
// import { formatPrice } from "@/lib/utils";
// import { useCart } from "@/contexts/CartContext";
// import toast from "react-hot-toast";
// import { Breadcrumbs, Typography, Chip, Divider, Stack } from "@mui/material";
// import Link from "next/link";
// import BuyNowButton from "@/components/common/BuyNowButton";

// const DetailRow = ({ label, value }) => (
//   <div className="flex justify-between py-1">
//     <span className="font-medium text-gray-700 capitalize">{label}:</span>
//     <span className="text-gray-900">{value || "—"}</span>
//   </div>
// );

// export default function ProductDetailsClient({ product, similarProducts }) {
//   const { addToCart } = useCart();
//   const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
//   const [quantity, setQuantity] = useState(1);

//   const handleAddToCart = () => {
//     if (!selectedSize) {
//       toast.error("Please select a size.");
//       return;
//     }
//     addToCart(product, quantity, selectedSize);
//     toast.success(`${product.name} added to cart!`);
//   };

//   const formatDetailKey = (key) => {
//     return key
//       .replace(/([A-Z])/g, " $1")
//       .replace(/^./, (str) => str.toUpperCase());
//   };

//   return (
//     <div className="bg-white">
//       <div className="pt-6">
//         <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
//           <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
//             <ProductGallery images={product.images} altText={product.name} />

//             <div className="lg:border-l lg:border-gray-200 lg:pl-8 mt-8 lg:mt-0">
//               <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
//                 {product.name}
//               </h1>
//               {product.model && (
//                 <p className="text-lg text-gray-600">Model: {product.model}</p>
//               )}

//               {/* --- Description --- */}
//               <div className="mt-10">
//                 <h3 className="text-sm font-medium text-gray-900">
//                   Description
//                 </h3>
//                 <div className="mt-4 prose prose-sm text-gray-700">
//                   <p>{product.description}</p>
//                 </div>
//               </div>
//               <p className="text-3xl tracking-tight text-gray-900 mt-4">
//                 {formatPrice(product.price)}
//               </p>
//               {/* --- Size Selector --- */}
//               <div className="mt-10">
//                 <h3 className="text-sm font-medium text-gray-900">Size</h3>
//                 <div className="flex flex-wrap gap-2 mt-4">
//                   {product.sizes?.map((size) => (
//                     <button
//                       key={size}
//                       onClick={() => setSelectedSize(size)}
//                       className={`border rounded-md py-2 px-4 text-sm font-medium transition-colors ${
//                         selectedSize === size
//                           ? "bg-[#AB1D79] text-white border-primary-600"
//                           : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
//                       }`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <Stack direction="column" spacing={2} className="mt-10">
//                 <Button
//                   onClick={handleAddToCart}
//                   className="w-full bg-pink-500/90 hover:bg-pink-600 text-white"
//                   size="lg"
//                 >
//                   Add to Cart
//                 </Button>
//                 {/* 2. Add the BuyNowButton */}
//                 <BuyNowButton
//                   product={product}
//                   size={selectedSize}
//                   quantity={quantity}
//                   variant="outlined"
//                   fullWidth
//                   sx={{
//                     borderColor: "pink.500",
//                     color: "pink.500",
//                     "&:hover": {
//                       borderColor: "pink.600",
//                       backgroundColor: "pink.50",
//                     },
//                   }}
//                 >
//                   Buy Now
//                 </BuyNowButton>
//               </Stack>

//               {/* --- Product Details Table --- */}
//               <div className="mt-10 bg-gray-50 p-6 rounded-lg">
//                 <h3 className="text-lg font-semibold mb-4">Product Details</h3>

//                 {/* Check if details object exists and has keys */}
//                 {product.details && Object.keys(product.details).length > 0 ? (
//                   <Stack spacing={1}>
//                     {Object.entries(product.details)
//                       // Filter out any key/value pair where the value is empty
//                       .filter(([key, value]) => value && value.trim() !== "")
//                       .map(([key, value]) => (
//                         <DetailRow
//                           key={key}
//                           label={formatDetailKey(key)}
//                           value={value}
//                         />
//                       ))}
//                   </Stack>
//                 ) : (
//                   <p className="text-gray-500">
//                     No additional details available.
//                   </p>
//                 )}

//                 {/* This separate 'feature' block is no longer needed
//                     as it's part of the 'details' map now. */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- Similar Products --- */}
//       {similarProducts?.length > 0 && (
//         <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
//           <h2 className="text-2xl font-bold tracking-tight text-gray-900">
//             Frequently Bought Together
//           </h2>
//           <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
//             {similarProducts.map((p) => (
//               <ProductCard key={p._id} product={p} />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* --- Reviews --- */}
//       <ProductReviews
//         productSlug={product.slug}
//         reviews={product.reviews}
//         initialRating={product.rating}
//         initialNumReviews={product.numReviews}
//       />
//     </div>
//   );
// }
