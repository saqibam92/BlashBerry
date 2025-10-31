// File: apps/client/src/app/admin/orders/[id]/page.jsx

"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAuth } from "@/contexts/AuthContext";
import { getOrder } from "@/lib/authApi";
import { updateAdminOrderStatus } from "@/lib/adminApi";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { formatPrice } from "@/lib/utils";

// Styled components for visual appeal
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius * 2,
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

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

const ProductImage = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(2),
}));

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusOptions = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  // Fetch order details
  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const config = isAuthenticated
        ? { headers: { Authorization: `Bearer ${token}` } }
        : phone
        ? { params: { phone } }
        : {};
      const response = await getOrder(id, config);
      setOrder(response.data.data);
      setError(null);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch order details.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, phone]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusChange = async (newStatus) => {
    await toast.promise(updateAdminOrderStatus(id, newStatus), {
      loading: "Updating order status...",
      success: "Status updated!",
      error: "Failed to update status.",
    });
    fetchOrder();
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            {error || "Order not found."}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Order Details
      </Typography>

      {/* Order Summary Card */}
      <StyledCard>
        <CardHeader
          title={`Order #${order.orderNumber}`}
          subheader={`Placed on ${new Date(
            order.createdAt
          ).toLocaleDateString()}`} // --- 4. Replaced StatusChip with Select ---
          action={
            <Select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              size="small"
              sx={{ minWidth: 120, fontWeight: "bold" }}
            >
              {statusOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                Total Amount
              </Typography>
              <Typography>{formatPrice(order.totalAmount)}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                Payment Method
              </Typography>
              <Typography>{order.paymentMethod}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      {/* Shipping Address Card */}
      <StyledCard>
        <CardHeader title="Shipping Address" />
        <CardContent>
          <Typography>{order.shippingAddress.fullName}</Typography>
          <Typography>{order.shippingAddress.address}</Typography>
          <Typography>
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </Typography>
          <Typography>{order.shippingAddress.country}</Typography>
          <Typography>Phone: {order.shippingAddress.phone}</Typography>
        </CardContent>
      </StyledCard>

      {/* Products Card */}
      <StyledCard>
        <CardHeader title="Ordered Products" />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.products.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ProductImage
                          src={item.product?.images[0] || "/placeholder.png"}
                          alt={item.product?.name}
                        />
                        <Typography>
                          {item.product?.name || "Unknown Product"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{item.size || "-"}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      {formatPrice(item.price)}
                    </TableCell>
                    <TableCell align="right">
                      {formatPrice(item.price * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </StyledCard>

      {/* Status History Card (Table) */}
      <StyledCard>
        <CardHeader title="Order Status History" />
        <CardContent>
          {order.statusHistory.length === 0 ? (
            <Typography>No status updates available.</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Note</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.statusHistory.map((history, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <StatusChip
                          label={history.status}
                          status={history.status}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(history.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{history.note || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </StyledCard>
    </Container>
  );
}
