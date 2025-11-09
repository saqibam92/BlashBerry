// apps/client/src/components/layout/MobileBottomNav.jsx

// apps/client/src/components/layout/MobileBottomNav.jsx

"use client";
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Fab,
  Paper,
  Badge,
} from "@mui/material";
import {
  Call,
  Chat,
  Message,
  ShoppingBag,
  Home,
  LocalShipping,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

export default function MobileBottomNav({
  phoneNumber = "01769900180",
  chatNumber = "01769900180",
}) {
  const pathname = usePathname();
  const { getCartItemCount } = useCart();
  const [value, setValue] = useState("shop");

  // Update nav value based on the current URL path
  useEffect(() => {
    if (pathname === "/") {
      setValue("home");
    } else if (
      pathname.startsWith("/products") ||
      pathname.startsWith("/cart") ||
      pathname.startsWith("/category")
    ) {
      setValue("shop");
    } else if (
      pathname.startsWith("/orders") ||
      pathname.startsWith("/my-account")
    ) {
      // Grouping orders/account under 'track' or a new account tab if added
      setValue("track");
    } else {
      // Fallback for other pages, preventing incorrect 'home' highlight
      // Setting to null/undefined will clear the highlight if no match is found
      setValue(null);
    }
  }, [pathname]);

  const handleWhatsAppChat = () => {
    const message = "Hello, I'm interested in your products.";
    window.open(
      `https://wa.me/${chatNumber}?text=${encodeURIComponent(message)}`
    );
    // Manually set value to 'chat' since there's no href navigation
    setValue("chat");
  };

  const handleFabClick = () => {
    // Manually set value state to 'home' when the FAB is clicked
    setValue("home");
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: { xs: "block", md: "none" }, // Only show on mobile
      }}
      elevation={3}
    >
      <Box sx={{ position: "relative", height: "70px" }}>
        {/* === CENTRAL HOME FAB (The visual and primary home action) === */}
        <Fab
          color="error" // Red color like in the image
          aria-label="home"
          href="/"
          onClick={handleFabClick}
          component={Link}
          sx={{
            position: "absolute",
            top: -20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 101,
            backgroundColor: "#b70673", // Primary color (from your theme)
            "&:hover": {
              backgroundColor: "#b10b5b",
            },
          }}
        >
          <Home />
        </Fab>

        {/* === BOTTOM NAVIGATION === */}
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          {/* 1. Shop/Cart */}
          <BottomNavigationAction
            label="Shop"
            value="shop"
            icon={
              <Badge badgeContent={getCartItemCount()} color="primary">
                <ShoppingBag />
              </Badge>
            }
            component={Link}
            href="/products"
          />

          {/* 2. Call */}
          <BottomNavigationAction
            label="Call"
            value="call"
            icon={<Call />}
            component="a"
            href={`tel:${phoneNumber}`}
          />

          {/* 3. Placeholder for the Fab (MUST be present for spacing) */}
          <BottomNavigationAction
            label="Home" // Label for accessibility/screen readers
            value="home"
            sx={{
              opacity: 0,
              pointerEvents: "none", // Prevent click interaction
            }}
          />

          {/* 4. Track Orders/My Account */}
          <BottomNavigationAction
            label="Track"
            value="track"
            icon={<LocalShipping />}
            component={Link}
            href="/orders/tracking"
          />

          {/* 5. Chat/WhatsApp */}
          <BottomNavigationAction
            label="Chat"
            value="chat"
            icon={<Chat />}
            onClick={handleWhatsAppChat}
          />
        </BottomNavigation>
      </Box>
    </Paper>
  );
}

// "use client";
// import {
//   Box,
//   BottomNavigation,
//   BottomNavigationAction,
//   Fab,
//   Paper,
//   Badge,
// } from "@mui/material";
// import {
//   Call,
//   Chat,
//   Message,
//   ShoppingBag,
//   AccountCircle,
//   Home,
// } from "@mui/icons-material";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useCart } from "@/contexts/CartContext";

// export default function MobileBottomNav({
//   phoneNumber = "01769900180",
//   chatNumber = "01769900180",
// }) {
//   const pathname = usePathname();
//   const { getCartItemCount } = useCart();
//   const [value, setValue] = useState("shop");

//   // Update nav based on path
//   useEffect(() => {
//     if (pathname === "/") {
//       setValue("home");
//     } else if (
//       pathname.startsWith("/products") ||
//       pathname.startsWith("/cart")
//     ) {
//       setValue("shop");
//     } else if (pathname.startsWith("/orders")) {
//       setValue("track");
//     } else {
//       setValue("home");
//     }
//   }, [pathname]);

//   const handleWhatsAppChat = () => {
//     const message = "Hello, I'm interested in your products.";
//     window.open(
//       `https://wa.me/${chatNumber}?text=${encodeURIComponent(message)}`
//     );
//   };

//   return (
//     <Paper
//       sx={{
//         position: "fixed",
//         bottom: 0,
//         left: 0,
//         right: 0,
//         zIndex: 100,
//         display: { xs: "block", md: "none" }, // Only show on mobile
//       }}
//       elevation={3}
//     >
//       <Box sx={{ position: "relative", height: "70px" }}>
//         <Fab
//           color="error" // Red color like in the image
//           aria-label="home"
//           //   aria-label="live-chat"
//           //   onClick={handleWhatsAppChat}
//           href="/"
//           sx={{
//             position: "absolute",
//             top: -20,
//             left: "50%",
//             transform: "translateX(-50%)",
//             zIndex: 101,
//             backgroundColor: "#b70673", // Red
//             "&:hover": {
//               backgroundColor: "#b10b5b",
//             },
//           }}
//         >
//           <Home />
//         </Fab>
//         <BottomNavigation
//           showLabels
//           value={value}
//           onChange={(event, newValue) => {
//             setValue(newValue);
//           }}
//         >
//           <BottomNavigationAction
//             label="Shop"
//             value="shop"
//             icon={
//               <Badge badgeContent={getCartItemCount()} color="primary">
//                 <ShoppingBag />
//               </Badge>
//             }
//             component={Link}
//             href="/products"
//           />
//           <BottomNavigationAction
//             label="Call"
//             value="call"
//             icon={<Call />}
//             component="a"
//             href={`tel:${phoneNumber}`}
//           />
//           {/* Placeholder for the Fab */}
//           <BottomNavigationAction label="home" />
//           <BottomNavigationAction
//             label="Track"
//             value="track"
//             icon={<Message />}
//             component={Link}
//             href="/orders/tracking"
//           />
//           <BottomNavigationAction
//             label="Chat"
//             value="chat"
//             icon={<Chat />}
//             onClick={handleWhatsAppChat}
//             // icon={<Home />}
//             // component={Link}
//             // href="/"
//           />
//         </BottomNavigation>
//       </Box>
//     </Paper>
//   );
// }
