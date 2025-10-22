// apps/client/src/components/product/QuickViewModal

"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Rating,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { X, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import ProductGallery from "./ProductGallery";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", md: "70%", lg: "60%" },
  maxWidth: 900,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  gap: 3,
  maxHeight: "90vh",
  overflowY: "auto",
};

export default function QuickViewModal({ product, open, onClose }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Reset state when modal opens for a new product
  useState(() => {
    if (product) {
      setSelectedSize(null);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const handleSizeChange = (event, newSize) => {
    setSelectedSize(newSize);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    onClose(); // Close modal after adding to cart
  };

  const displayImage =
    product.images?.find((img) => img?.url)?.url ||
    product.images?.[0] ||
    "https://placehold.co/600x600/f8fafc/64748b?text=No+Image";

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <X />
        </IconButton>

        {/* Image Section */}
        <Box sx={{ flex: 1, aspectRatio: "1 / 1", position: "relative" }}>
          {/* <Image
            src={displayImage}
            alt={product.name}
            fill
            className="object-cover rounded-md"
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 40vw, 450px"
          /> */}
          <ProductGallery images={product.images} altText={product.name} />
        </Box>

        {/* Details Section */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="h4" component="h2" fontWeight="bold">
            {product.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
            <Rating value={product.rating} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary">
              ({product.reviews?.length || 0} reviews)
            </Typography>
          </Box>
          <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
            {formatPrice(product.price)}
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            {product.description}
          </Typography>

          {/* Size Selection */}
          <Typography variant="subtitle1" fontWeight="medium">
            Size:
          </Typography>
          <ToggleButtonGroup
            value={selectedSize}
            exclusive
            onChange={handleSizeChange}
            aria-label="product size"
            sx={{ my: 1 }}
          >
            {product.sizes?.map((size) => (
              <ToggleButton key={size} value={size} aria-label={size}>
                {size}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={!selectedSize}
            sx={{ mt: "auto" }}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
