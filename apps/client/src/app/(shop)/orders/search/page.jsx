// File: apps/client/src/app/(shop)/orders/search/page.jsx

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getOrdersByPhone } from "@/lib/orderApi";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === "Delivered"
      ? theme.palette.success.main
      : status === "Shipped"
      ? theme.palette.info.main
      : status === "Processing"
      ? theme.palette.warning.main
      : status === "Cancelled"
      ? theme.palette.error.main
      : theme.palette.grey[500],
  color: theme.palette.common.white,
  fontWeight: "bold",
}));

export default function OrderSearchPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrders([]);

    // Validate phone number format
    const phoneRegex = /^(\+8801\d{9}|01\d{9})$/;
    if (!phoneRegex.test(phone)) {
      setError(
        "Phone number must be in the format +88 followed by 11 digits (e.g., +88017123456789 or 017123456789)"
      );
      setLoading(false);
      toast.error("Invalid phone number format");
      return;
    }

    try {
      const response = await getOrdersByPhone(phone);
      setOrders(response.data.data || []);
      if (response.data.data.length === 0) {
        setError("No orders found for this phone number.");
        toast.error("No orders found.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders.");
      toast.error(err.response?.data?.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (orderId) => {
    router.push(`/orders/${orderId}?phone=${phone}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        Search Orders by Phone Number
      </Typography>
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Phone Number (01xxxxxxxxx)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="017123456789"
          error={!!error}
          helperText={error}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : "Search Orders"}
        </Button>
      </Box>

      {orders.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order._id}
                  hover
                  onClick={() => handleRowClick(order._id)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                  <TableCell>
                    <StatusChip label={order.status} status={order.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
