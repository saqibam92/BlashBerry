// File: apps/client/src/app/(shop)/orders/tracking/page.jsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDebounce } from "@/hooks/useDebounce";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { useOrderSearch } from "@/hooks/useOrderSearch";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import ClearIcon from "@mui/icons-material/Clear";

const StatusChip = styled(Chip)(({ status }) => ({
  backgroundColor:
    status === "Delivered"
      ? "#4caf50"
      : status === "Shipped"
      ? "#2196f3"
      : status === "Processing"
      ? "#ff9800"
      : status === "Cancelled"
      ? "#f44336"
      : "#9e9e9e",
  color: "white",
  fontWeight: "bold",
}));

const STATUS_OPTIONS = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function OrderTrackingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phone, setPhone] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [anchorEl, setAnchorEl] = useState(null);

  const debouncedPhone = useDebounce(phone, 300);
  const { recent, add: addRecent, remove: removeRecent } = useRecentSearches();
  const { orders, loading, error } = useOrderSearch(debouncedPhone);

  // Sync URL with current phone
  const pushPhoneToUrl = (p) => {
    const url = new URL(window.location.href);
    if (p) url.searchParams.set("phone", p);
    else url.searchParams.delete("phone");
    router.replace(url.pathname + url.search, { scroll: false });
  };

  // Load phone from URL
  useEffect(() => {
    const urlPhone = searchParams.get("phone");
    if (urlPhone) setPhone(urlPhone);
  }, [searchParams]);

  // Add to recent after successful search
  useEffect(() => {
    if (debouncedPhone && orders.length > 0) {
      addRecent(debouncedPhone);
    }
  }, [debouncedPhone, orders.length, addRecent]);

  // Filter by status
  const filteredOrders = orders.filter((o) =>
    statusFilter === "All" ? true : o.status === statusFilter
  );

  // Clear input & URL

  const handleClear = () => {
    setPhone("");
    pushPhoneToUrl("");
    toast.success("Search cleared");
  };

  // Redirect to order detail with current phone
  const handleRowClick = (id) => {
    if (!phone.trim()) {
      toast.error("Enter a phone number first");
      return;
    }
    router.push(`/orders/${id}?phone=${encodeURIComponent(phone)}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        Order Tracking
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ position: "relative", mb: 2 }}>
          <TextField
            fullWidth
            label="Phone Number"
            placeholder="017123456789 or +88017123456789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={!!error}
            helperText={error}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "action.active" }} />
              ),
              endAdornment:
                recent.length > 0 ? (
                  <IconButton
                    size="small"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                  >
                    <HistoryIcon />
                  </IconButton>
                ) : null,
            }}
          />

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { maxHeight: 200 } }}
          >
            {recent.map((num) => (
              <MenuItem
                key={num}
                onClick={() => {
                  setPhone(num);
                  setAnchorEl(null);
                }}
              >
                <ListItemIcon>
                  <HistoryIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={num} />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeRecent(num);
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            disabled={loading || !debouncedPhone}
            startIcon={
              loading ? <CircularProgress size={20} /> : <SearchIcon />
            }
            sx={{ flex: 1 }}
          >
            {loading ? "Searching..." : "Search"}
          </Button>

          <Button variant="outlined" color="error" onClick={handleClear}>
            Clear
          </Button>
        </Box>
      </Box>

      {filteredOrders.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
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
                  <TableCell align="right">
                    {formatPrice(order.totalAmount)}
                  </TableCell>
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
