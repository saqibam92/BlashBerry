// File Location: apps/client/src/app/(shop)/order-confirmation/[orderId]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  ListItemIcon,
} from "@mui/material";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const router = useRouter();
  const { orderId } = params;

  useEffect(() => {
    if (!orderId) {
      setError("No order ID found.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await api.get(`/api/orders/${orderId}`);
        setOrder(response.data.data);
      } catch (err) {
        setError(
          "Could not find your order. Please check the ID or contact support."
        );
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" color="error">
            {error}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => router.push("/products")}
          >
            Go to Shop
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Paper sx={{ p: { xs: 2, sm: 4 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            mb: 4,
          }}
        >
          <CheckCircle color="green" size={64} />
          <Typography variant="h3" component="h1" gutterBottom sx={{ mt: 2 }}>
            Thank You For Your Order!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Your order has been placed successfully.
          </Typography>
          <Typography>
            Order Number: <strong>{order.orderNumber}</strong>
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>
            <List disablePadding>
              {order.products.map(({ product, quantity, size, price }) => (
                <ListItem key={product._id + size} divider>
                  <ListItemIcon>
                    <Image
                      src={product.images[0] || "https://placehold.co/100x100"}
                      alt={product.name}
                      width={64}
                      height={64}
                      style={{ borderRadius: "8px" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={product.name}
                    secondary={`Size: ${size} - Quantity: ${quantity}`}
                  />
                  <Typography variant="body1">
                    {formatPrice(price * quantity)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography variant="h5" gutterBottom>
              Shipping Information
            </Typography>
            <Box>
              <Typography>
                <strong>{order.shippingAddress.fullName}</strong>
              </Typography>
              <Typography>{order.shippingAddress.address}</Typography>
              <Typography>{`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`}</Typography>
              <Typography>Phone: {order.shippingAddress.phone}</Typography>
              <Typography>Email: {order.guestEmail}</Typography>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5">Total</Typography>
              <Typography variant="h5" color="primary">
                <strong>{formatPrice(order.totalAmount)}</strong>
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Button
            variant="contained"
            startIcon={<ShoppingBag />}
            onClick={() => router.push("/products")}
            size="large"
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
