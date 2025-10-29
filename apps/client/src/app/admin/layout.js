//File: apps/client/src/app/admin/layout.jsx;

"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  Dashboard,
  ShoppingCart,
  Category,
  Group,
  Settings,
  ExitToApp,
  ExpandMore,
} from "@mui/icons-material";
import { useState } from "react";

const drawerWidth = 240;

const navItems = [
  { text: "Dashboard", icon: <Dashboard />, href: "/admin" },
  { text: "Products", icon: <ShoppingCart />, href: "/admin/products" },
  { text: "Categories", icon: <Category />, href: "/admin/categories" },
  { text: "Orders", icon: <ShoppingCart />, href: "/admin/orders" },
  { text: "Users", icon: <Group />, href: "/admin/users" },
  { text: "Banners", icon: <Group />, href: "/admin/banners" },
  { text: "Videos", icon: <Settings />, href: "/admin/videos" },
  { text: "Settings", icon: <Settings />, href: "/admin/settings" },
];

// Simple loading screen
const LoadingScreen = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <CircularProgress />
  </Box>
);

export default function AdminLayout({ children }) {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle auth-based redirects
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.push("/admin-login");
      return;
    }
    if (isAuthenticated && user?.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, user, loading, router]);

  // Show loader while verifying
  if (loading || !isAuthenticated || user?.role !== "admin") {
    return <LoadingScreen />;
  }

  // Menu handling for profile/logout
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logout();
    handleMenuClose();
    router.push("/admin-login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* === TOP APP BAR === */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#111827",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            BlashBerry Admin
          </Typography>

          {/* Admin Info & Logout */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                bgcolor: "#ec4899",
                width: 32,
                height: 32,
                fontSize: 14,
              }}
            >
              {user?.name?.[0]?.toUpperCase() || "A"}
            </Avatar>
            <Typography variant="subtitle1">{user?.name || "Admin"}</Typography>
            <Typography
              variant="caption"
              sx={{
                color: "gray",
                ml: 0.5,
                fontSize: "0.75rem",
                textTransform: "capitalize",
              }}
            >
              ({user?.role})
            </Typography>

            <IconButton color="inherit" onClick={handleMenuOpen}>
              <ExpandMore />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem disabled>
                <Typography variant="body2">{user?.email}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* === SIDE DRAWER === */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  selected={pathname === item.href}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* === MAIN CONTENT === */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
