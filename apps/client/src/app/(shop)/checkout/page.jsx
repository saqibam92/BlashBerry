// apps/client/src/app/(shop)/checkout/page.jsx
"use client";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { Container, Typography, Grid, Paper, Box } from "@mui/material";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart, loading: isCartLoading } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isCartLoading && items.length === 0 && !orderPlaced) {
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
      customerDetails: formData,
      items: items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        size: item.size,
        price: item.product.price,
      })),
    };

    try {
      const response = await api.post("/api/orders", orderData);

      toast.success("Order placed successfully!");
      setOrderPlaced(true);
      clearCart();

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
            <OrderSummary items={items} total={getCartTotal()} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
