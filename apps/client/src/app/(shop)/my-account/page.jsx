// File: apps/client/src/app/(shop)/my-account/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Collapse,
} from "@mui/material";
import { Visibility, ExpandMore, ExpandLess } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { getUserOrders, mergeGuestOrders } from "@/lib/authApi";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { formatPrice } from "@/lib/utils";

export default function MyAccountPage() {
  const {
    isAuthenticated,
    user,
    updateUser,
    logout,
    loading: authLoading,
  } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState(searchParams.get("tab") || "login");
  const [profileTab, setProfileTab] = useState("profile");
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [guestEmail, setGuestEmail] = useState("");
  const [mergeEmail, setMergeEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Initialize form data with user info
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData({ name: user.name || "", password: "" });
    }
  }, [isAuthenticated, user]);

  // Handle profile tab change
  const handleProfileTabChange = (event, newValue) => {
    setProfileTab(newValue);
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle guest email input change
  const handleGuestEmailChange = (e) => {
    setGuestEmail(e.target.value);
  };

  // Handle merge email input change
  const handleMergeEmailChange = (e) => {
    setMergeEmail(e.target.value);
  };

  // Fetch orders (authenticated or guest)
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const token = Cookies.get("token");
      console.log("Token:", token);
      console.log(
        "Fetch orders - isAuthenticated:",
        isAuthenticated,
        "Token:",
        token,
        "GuestEmail:",
        guestEmail
      );
      let config = {};

      if (isAuthenticated && token) {
        config = { headers: { Authorization: `Bearer ${token}` } };
      } else if (guestEmail) {
        config = { params: { guestEmail } };
      } else {
        throw new Error("Authentication or guest email required");
      }

      const response = await getUserOrders(guestEmail, config);
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error(error.message || "Failed to fetch orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch orders when isAuthenticated changes or guestEmail is provided
  useEffect(() => {
    if (isAuthenticated || guestEmail) {
      fetchOrders();
    }
  }, [isAuthenticated, guestEmail]);

  // Handle guest order fetch
  const handleFetchGuestOrders = () => {
    if (!guestEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    fetchOrders();
  };

  // Handle merge guest orders
  const handleMergeGuestOrders = async () => {
    if (!mergeEmail) {
      toast.error("Please enter a guest email to merge orders.");
      return;
    }
    setLoading(true);
    try {
      const response = await mergeGuestOrders(mergeEmail);
      toast.success(response.data.message);
      await fetchOrders(); // Refresh orders after merging
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to merge orders.");
    } finally {
      setLoading(false);
      setMergeEmail("");
    }
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateUser(
      formData.name,
      formData.password || undefined
    );
    if (result.success) {
      toast.success("Profile updated successfully!");
      setFormData((prev) => ({ ...prev, password: "" }));
    } else {
      toast.error(result.error || "Failed to update profile.");
    }
    setLoading(false);
  };

  // Toggle order details
  const handleToggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (!isAuthenticated && tab !== "login" && tab !== "register") {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            My Account
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Box
              sx={{
                p: 2,
                borderBottom: tab === "login" ? 2 : 0,
                borderColor: "primary.main",
                cursor: "pointer",
                mr: 4,
              }}
              onClick={() => {
                setTab("login");
                window.history.pushState({}, "", "/my-account?tab=login");
              }}
            >
              <Typography variant="h6">Login</Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                borderBottom: tab === "register" ? 2 : 0,
                borderColor: "primary.main",
                cursor: "pointer",
              }}
              onClick={() => {
                setTab("register");
                window.history.pushState({}, "", "/my-account?tab=register");
              }}
            >
              <Typography variant="h6">Register</Typography>
            </Box>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              {tab === "login" && <LoginForm />}
              {tab === "register" && <RegisterForm />}
            </Grid>
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              View Guest Orders
            </Typography>
            <TextField
              label="Guest Email"
              value={guestEmail}
              onChange={handleGuestEmailChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleFetchGuestOrders}
              disabled={ordersLoading}
            >
              {ordersLoading ? (
                <CircularProgress size={24} />
              ) : (
                "Fetch Guest Orders"
              )}
            </Button>
            {orders.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Order History
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order Number</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>{order.orderNumber}</TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {formatPrice(order.totalAmount)}
                          </TableCell>
                          <TableCell>{order.status}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              onClick={() =>
                                router.push(`/orders/${order._id}`)
                              }
                            >
                              <Visibility />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    );
  }

  if (authLoading || !user) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading user data...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Account
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Tabs
            value={profileTab}
            onChange={handleProfileTabChange}
            sx={{ mb: 4 }}
          >
            <Tab label="Profile" value="profile" />
            <Tab label="Orders" value="orders" />
          </Tabs>
          <Button onClick={logout} variant="outlined" color="error">
            Logout
          </Button>
        </Box>

        {profileTab === "profile" && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Profile Details
            </Typography>
            <Box sx={{ mb: 4 }}>
              <Typography>
                <strong>Name:</strong> {user.name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography>
                <strong>Role:</strong> {user.role}
              </Typography>
            </Box>
            <Typography variant="h6" gutterBottom>
              Update Profile
            </Typography>
            <Box component="form" onSubmit={handleUpdateProfile}>
              <TextField
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                name="password"
                label="New Password (leave blank to keep current)"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : "Update Profile"}
              </Button>
            </Box>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Merge Guest Orders
              </Typography>
              <TextField
                label="Guest Email"
                value={mergeEmail}
                onChange={handleMergeEmailChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleMergeGuestOrders}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Merge Orders"}
              </Button>
            </Box>
          </Box>
        )}

        {profileTab === "orders" && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order History
            </Typography>
            {ordersLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress />
              </Box>
            ) : orders.length === 0 ? (
              <Typography>No orders found.</Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>Order Number</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <>
                        <TableRow key={order._id}>
                          <TableCell>
                            <IconButton
                              onClick={() =>
                                handleToggleOrderDetails(order._id)
                              }
                            >
                              {expandedOrder === order._id ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )}
                            </IconButton>
                          </TableCell>
                          <TableCell>{order.orderNumber}</TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {formatPrice(order.totalAmount)}
                          </TableCell>
                          <TableCell>{order.status}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              onClick={() =>
                                router.push(`/orders/${order._id}`)
                              }
                            >
                              <Visibility />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={6}
                          >
                            <Collapse
                              in={expandedOrder === order._id}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box sx={{ margin: 1 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Status History
                                </Typography>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Status</TableCell>
                                      <TableCell>Date</TableCell>
                                      <TableCell>Note</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {order.statusHistory.map(
                                      (history, index) => (
                                        <TableRow key={index}>
                                          <TableCell>
                                            {history.status}
                                          </TableCell>
                                          <TableCell>
                                            {new Date(
                                              history.timestamp
                                            ).toLocaleString()}
                                          </TableCell>
                                          <TableCell>
                                            {history.note || "-"}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
}
