// apps/client/src/app/(shop)/checkout/page.jsx
"use client";
import { useCart } from "@/contexts/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Typography, Grid, Paper, Box } from "@mui/material";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const {
    items,
    getCartTotal,
    clearCart,
    loading: isCartLoading,
    buyNowItem,
    setBuyNowItem,
  } = useCart();

  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("buyNow") === "true";

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  // Determine which items and total to display
  const [displayItems, setDisplayItems] = useState([]);
  const [displayTotal, setDisplayTotal] = useState(0);

  useEffect(() => {
    if (isBuyNow) {
      if (buyNowItem) {
        setDisplayItems([buyNowItem]);
        setDisplayTotal(buyNowItem.product.price * buyNowItem.quantity);
      }
    } else {
      setDisplayItems(items);
      setDisplayTotal(getCartTotal());
    }
  }, [isBuyNow, buyNowItem, items, getCartTotal]);

  if (!isCartLoading && !orderPlaced) {
    if (isBuyNow && !buyNowItem) {
      router.push("/products");
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <Typography>Your cart is empty. Redirecting...</Typography>
        </Box>
      );
    } else if (!isBuyNow && items.length === 0) {
      router.push("/products");
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <Typography>Your cart is empty. Redirecting...</Typography>
        </Box>
      );
    }
    // router.push("/products");
  }

  // Loading state
  if (
    (isBuyNow && !buyNowItem && !orderPlaced) ||
    (!isBuyNow && !isCartLoading && items.length === 0 && !orderPlaced)
  ) {
    router.push("/products");
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Typography>Your cart is empty. Redirecting...</Typography>
      </Box>
    );
  }

  const handlePlaceOrder = async (formData) => {
    setIsProcessing(true);
    const orderData = {
      customerDetails: formData, // Use the new displayItems state
      items: displayItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        size: item.size,
        price: item.product.price,
      })),
    };

    try {
      const response = await api.post("/api/orders", orderData);
      toast.success("Order placed successfully!");
      setOrderPlaced(true); // --- MODIFIED CLEAR LOGIC ---

      if (isBuyNow) {
        setBuyNowItem(null); // Clear only the buy-now item
      } else {
        clearCart(); // Clear the entire cart
      }

      router.push(`/order-confirmation/${response.data.orderId}`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "There was an issue placing your order. Please try again.";
      toast.error(errorMessage);
      console.error("Order submission failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Checkout
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Shipping Information
            </Typography>
            <CheckoutForm
              onSubmit={handlePlaceOrder}
              isProcessing={isProcessing}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 4, position: "sticky", top: 100 }}>
            <OrderSummary items={displayItems} total={displayTotal} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
