// File: apps/client/src/components/product/ProductCard.jsx
"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Collapse,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { ShoppingCart, Eye, Plus, Zap } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import BuyNowButton from "@/components/common/BuyNowButton";

// Pass onQuickViewOpen as a prop
const ProductCard = ({ product, onQuickViewOpen }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isSizeSelectorOpen, setIsSizeSelectorOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  if (!product || !product.slug) {
    return null;
  }

  const displayImage =
    product.images?.find((img) => {
      if (!img) return false;
      if (typeof img === "string") return img.length > 0;
      if (typeof img === "object" && typeof img.url === "string")
        return img.url.length > 0;
      return false;
    })?.url ||
    product.images?.[0] ||
    "https://placehold.co/400x400/f8fafc/64748b?text=No+Image";

  const handleToggleSizeSelector = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSizeSelectorOpen((prev) => !prev);
  };

  const handleSizeChange = (event, newSize) => {
    // newSize can be null if the same button is clicked again
    if (newSize !== null) {
      setSelectedSize(newSize);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedSize) {
      addToCart(product, 1, selectedSize);
      setIsSizeSelectorOpen(false); // Close selector after adding
      setSelectedSize(null); // Reset size
    } else {
      // This case is unlikely if button is disabled, but good for safety
      alert("Please select a size.");
    }
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickViewOpen(product);
  };

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "box-shadow 0.3s, transform 0.3s",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-4px)",
        },
      }}
    >
      <Link
        href={`/products/${product.slug}`}
        passHref
        className="flex flex-col flex-grow"
      >
        <Box sx={{ aspectRatio: "1 / 1", width: "100%", position: "relative" }}>
          <Image
            src={displayImage}
            alt={product.name || "Product Image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Hover Overlay for Icons */}
          <Collapse in={isHovered} timeout="auto">
            <Box
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "50px",
                padding: "4px",
              }}
            >
              <IconButton
                size="small"
                onClick={handleQuickViewClick}
                sx={{
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "grey.200" },
                }}
              >
                <Eye size={18} />
              </IconButton>
              {/* You can add other icons like wishlist here */}
            </Box>
          </Collapse>
        </Box>
        <CardContent
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <Typography
            gutterBottom
            variant="body1"
            component="div"
            className="truncate"
            fontWeight="medium"
          >
            {product.name}
          </Typography>
          <Typography
            variant="body1"
            color="text.primary"
            // sx={{ mt: "auto" }}
            fontWeight="light"
          >
            {formatPrice(product.price)}
          </Typography>
        </CardContent>
      </Link>

      {/* "Select Options" Button and Size Selector */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Collapse in={!isSizeSelectorOpen && isHovered} timeout="auto">
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Plus size={16} />}
            onClick={handleToggleSizeSelector}
          >
            Select options
          </Button>
        </Collapse>
        <Collapse in={isSizeSelectorOpen} timeout="auto">
          <Box className="flex flex-col gap-2">
            <ToggleButtonGroup
              value={selectedSize}
              exclusive
              fullWidth
              size="small"
              onChange={handleSizeChange}
            >
              {product.sizes?.map((size) => (
                <ToggleButton key={size} value={size}>
                  {size}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Button
              variant="contained"
              fullWidth
              startIcon={<ShoppingCart size={16} />}
              onClick={handleAddToCart}
              disabled={!selectedSize}
            >
              Add to Cart
            </Button>
            {/* <BuyNowButton
              product={product}
              size={selectedSize}
              quantity={1}
              variant="outlined"
              fullWidth
              startIcon={<Zap size={16} />}
              disabled={!selectedSize}
            >
              Buy Now
            </BuyNowButton> */}
            {/* <div className="flex flex-row justify-between items-center">
            </div> */}
          </Box>
        </Collapse>
      </Box>
    </Card>
  );
};

export default ProductCard;
