// File: apps/client/src/app/admin/layout.jsx

"use client";
import { useEffect, useState } from "react";
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
  useTheme,
  useMediaQuery,
} from "@mui/material";

import {
  Dashboard,
  ShoppingCart,
  Category,
  Group,
  ExitToApp,
  ExpandMore,
  Menu as MenuIcon,
  VideoLibrary,
  ListAlt,
  Image as BannerImage,
} from "@mui/icons-material";

const drawerWidth = 240;

const navItems = [
  { text: "Dashboard", icon: <Dashboard />, href: "/admin" },
  { text: "Products", icon: <ListAlt />, href: "/admin/products" },
  { text: "Categories", icon: <Category />, href: "/admin/categories" },
  { text: "Orders", icon: <ShoppingCart />, href: "/admin/orders" },
  { text: "Users", icon: <Group />, href: "/admin/users" },
  { text: "Banners", icon: <BannerImage />, href: "/admin/banners" },
  { text: "Videos", icon: <VideoLibrary />, href: "/admin/videos" },
];

// Loading screen
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // Redirect logic
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) router.push("/admin-login");
    if (isAuthenticated && user?.role !== "admin") router.push("/");
  }, [isAuthenticated, user, loading, router]);

  if (loading || !isAuthenticated || user?.role !== "admin") {
    return <LoadingScreen />;
  }

  // Profile menu handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    router.push("/admin-login");
  };

  // Mobile drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  // Drawer content
  const drawer = (
    <Box>
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={
                  pathname.startsWith(item.href) &&
                  (pathname.length === item.href.length ||
                    pathname.charAt(item.href.length) === "/")
                }
                onClick={!isDesktop ? handleDrawerToggle : undefined}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* TOP APP BAR */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#111827",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          // width: isDesktop ? `calc(100% - ${drawerWidth}px)` : "100%",
          width: "100%",
          ml: isDesktop ? `${drawerWidth}px` : 0,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div">
            BlashBerry Admin
          </Typography>

          {/* Top Right User Info */}
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

            <Typography
              variant="subtitle1"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              {user?.name}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "gray",
                fontSize: "0.75rem",
                textTransform: "capitalize",
                display: { xs: "none", sm: "block" },
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

      {/* SIDE DRAWERS */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          width: "100%",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

// // File: apps/client/src/app/admin/layout.jsx;

// "use client";
// import { useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import Link from "next/link";
// import { useAuth } from "@/contexts/AuthContext";
// import {
//   Box,
//   CssBaseline,
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Toolbar,
//   AppBar,
//   Typography,
//   CircularProgress,
//   IconButton,
//   Menu,
//   MenuItem,
//   Avatar,
//   useTheme, // <-- NEW
//   useMediaQuery, // <-- NEW
// } from "@mui/material";
// import {
//   Dashboard,
//   ShoppingCart,
//   Category,
//   Group,
//   Settings,
//   ExitToApp,
//   ExpandMore,
//   Menu as MenuIcon,
//   VideoLibrary,
//   ListAlt,
//   // ImageOutlined as BannerImage, // <-- NEW
//   Image as BannerImage, // <-- NEW
// } from "@mui/icons-material";
// import { useState } from "react";

// const drawerWidth = 240;

// const navItems = [
//   { text: "Dashboard", icon: <Dashboard />, href: "/admin" },
//   { text: "Products", icon: <ListAlt />, href: "/admin/products" },
//   { text: "Categories", icon: <Category />, href: "/admin/categories" },
//   { text: "Orders", icon: <ShoppingCart />, href: "/admin/orders" },
//   { text: "Users", icon: <Group />, href: "/admin/users" },
//   { text: "Banners", icon: <BannerImage />, href: "/admin/banners" },
//   { text: "Videos", icon: <VideoLibrary />, href: "/admin/videos" },
//   // { text: "Settings", icon: <Settings />, href: "/admin/settings" },
// ];

// // Simple loading screen
// const LoadingScreen = () => (
//   <Box
//     sx={{
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       height: "100vh",
//     }}
//   >
//     <CircularProgress />
//   </Box>
// );

// export default function AdminLayout({ children }) {
//   const { isAuthenticated, user, loading, logout } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();
//   const [anchorEl, setAnchorEl] = useState(null);

//   // NEW STATE: For mobile drawer toggle
//   const [mobileOpen, setMobileOpen] = useState(false);

//   // NEW HOOKS: For responsive design
//   const theme = useTheme();
//   const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

//   // Handle auth-based redirects
//   useEffect(() => {
//     if (loading) return;
//     if (!isAuthenticated) {
//       router.push("/admin-login");
//       return;
//     }
//     if (isAuthenticated && user?.role !== "admin") {
//       router.push("/");
//     }
//   }, [isAuthenticated, user, loading, router]);

//   // Show loader while verifying
//   if (loading || !isAuthenticated || user?.role !== "admin") {
//     return <LoadingScreen />;
//   }

//   // Menu handling for profile/logout
//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };
//   const handleLogout = () => {
//     logout();
//     handleMenuClose();
//     router.push("/admin-login");
//   };

//   // NEW: Toggle handler for mobile drawer
//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   // Content for the Drawer (Sidebar Menu)
//   const drawer = (
//     <Box>
//       {/* Toolbar is needed here to align with the AppBar */}
//       <Toolbar />
//       <Box sx={{ overflow: "auto" }}>
//         <List>
//           {navItems.map((item) => (
//             <ListItem key={item.text} disablePadding>
//               <ListItemButton
//                 component={Link}
//                 href={item.href}
//                 // Check if pathname starts with item.href (for nested routes like /admin/products/add)
//                 selected={
//                   pathname.startsWith(item.href) &&
//                   (pathname.length === item.href.length ||
//                     pathname.charAt(item.href.length) === "/")
//                 }
//                 onClick={isDesktop ? undefined : handleDrawerToggle} // Close mobile drawer on click
//               >
//                 <ListItemIcon>{item.icon}</ListItemIcon>
//                 <ListItemText primary={item.text} />
//               </ListItemButton>
//             </ListItem>
//           ))}
//         </List>
//       </Box>
//     </Box>
//   );

//   return (
//     <Box sx={{ display: "flex" }}>
//       <CssBaseline />

//       {/* === TOP APP BAR === */}
//       <AppBar
//         position="fixed"
//         sx={{
//           // On desktop, shift content over by drawerWidth
//           // width: { sm: `calc(100% - ${drawerWidth}px)` },
//           width: `100%`,
//           ml: { sm: `${drawerWidth}px` },
//           zIndex: (theme) => theme.zIndex.drawer + 1,
//           backgroundColor: "#111827",
//         }}
//       >
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           {/* Menu button for mobile */}
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={handleDrawerToggle}
//             sx={{ mr: 2, display: { md: "none" } }} // Show only on mobile/tablet
//           >
//             <MenuIcon />
//           </IconButton>

//           <Typography variant="h6" noWrap component="div">
//             BlashBerry Admin
//           </Typography>

//           {/* Admin Info & Logout */}
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <Avatar
//               sx={{
//                 bgcolor: "#ec4899",
//                 width: 32,
//                 height: 32,
//                 fontSize: 14,
//               }}
//             >
//               {user?.name?.[0]?.toUpperCase() || "A"}
//             </Avatar>
//             <Typography
//               variant="subtitle1"
//               sx={{ display: { xs: "none", sm: "block" } }}
//             >
//               {user?.name || "Admin"}
//             </Typography>
//             <Typography
//               variant="caption"
//               sx={{
//                 color: "gray",
//                 ml: 0.5,
//                 fontSize: "0.75rem",
//                 textTransform: "capitalize",
//                 display: { xs: "none", sm: "block" },
//               }}
//             >
//               ({user?.role})
//             </Typography>

//             <IconButton color="inherit" onClick={handleMenuOpen}>
//               <ExpandMore />
//             </IconButton>

//             <Menu
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleMenuClose}
//               anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//               transformOrigin={{ vertical: "top", horizontal: "right" }}
//             >
//               <MenuItem disabled>
//                 <Typography variant="body2">{user?.email}</Typography>
//               </MenuItem>
//               <MenuItem onClick={handleLogout}>
//                 <ExitToApp fontSize="small" sx={{ mr: 1 }} />
//                 Logout
//               </MenuItem>
//             </Menu>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* === SIDE DRAWER (Responsive Logic) === */}
//       <Box
//         component="nav"
//         sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
//       >
//         {/* 1. Mobile/Tablet Drawer (Temporary) */}
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{
//             keepMounted: true, // Better open performance on mobile.
//           }}
//           sx={{
//             display: { xs: "block", md: "none" }, // Show only on mobile
//             "& .MuiDrawer-paper": {
//               boxSizing: "border-box",
//               width: drawerWidth,
//             },
//           }}
//         >
//           {drawer}
//         </Drawer>

//         {/* 2. Desktop Drawer (Permanent) */}
//         <Drawer
//           variant="permanent"
//           sx={{
//             display: { xs: "none", md: "block" }, // Show only on desktop
//             "& .MuiDrawer-paper": {
//               boxSizing: "border-box",
//               width: drawerWidth,
//             },
//           }}
//           open
//         >
//           {drawer}
//         </Drawer>
//       </Box>

//       {/* === MAIN CONTENT === */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           // Adjust content margin for desktop
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//         }}
//       >
//         <Toolbar /> {/* Spacer for AppBar height */}
//         {children}
//       </Box>
//     </Box>
//   );
// }
