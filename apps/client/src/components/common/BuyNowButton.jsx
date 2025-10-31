// File: apps/client/src/components/common/BuyNowButton.jsx
"use client";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";
import { Button } from "@mui/material"; // Using MUI Button for consistency

/**
 * A button to skip the cart and go directly to checkout with one item.
 * @param {object} product - The product object.
 * @param {string} size - The selected size.
 * @param {number} quantity - The quantity (defaults to 1).
 * @param {object} props - Other props to pass to the MUI Button component (e.g., variant, fullWidth, children).
 */
export default function BuyNowButton({
  product,
  size,
  quantity = 1,
  children = "Buy Now", // Default text
  ...props // Pass down other props like variant, fullWidth, etc.
}) {
  const router = useRouter();
  const { setBuyNowItem } = useCart();

  const handleBuyNow = (e) => {
    e.preventDefault(); // Prevent link navigation if wrapped
    e.stopPropagation(); // Prevent card click-through

    if (!size) {
      toast.error("Please select a size first.");
      return;
    } // 1. Set the single item in the context

    setBuyNowItem({ product, quantity, size }); // 2. Redirect to checkout with a flag

    router.push("/checkout?buyNow=true");
  };

  return (
    <Button onClick={handleBuyNow} {...props}>
      {children}
    </Button>
  );
}
