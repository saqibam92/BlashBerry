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
  AccountCircle,
  Home,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

export default function MobileBottomNav({
  phoneNumber = "01790680578",
  chatNumber = "01790680578",
}) {
  const pathname = usePathname();
  const { getCartItemCount } = useCart();
  const [value, setValue] = useState("shop");

  // Update nav based on path
  useEffect(() => {
    if (pathname === "/") {
      setValue("home");
    } else if (
      pathname.startsWith("/products") ||
      pathname.startsWith("/cart")
    ) {
      setValue("shop");
    } else if (pathname.startsWith("/orders")) {
      setValue("track");
    } else {
      setValue("home");
    }
  }, [pathname]);

  const handleWhatsAppChat = () => {
    const message = "Hello, I'm interested in your products.";
    window.open(
      `https://wa.me/${chatNumber}?text=${encodeURIComponent(message)}`
    );
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
        <Fab
          color="error" // Red color like in the image
          aria-label="home"
          //   aria-label="live-chat"
          //   onClick={handleWhatsAppChat}
          href="/"
          sx={{
            position: "absolute",
            top: -20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 101,
            backgroundColor: "#b70673", // Red
            "&:hover": {
              backgroundColor: "#b10b5b",
            },
          }}
        >
          <Home />
        </Fab>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
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
          <BottomNavigationAction
            label="Call"
            value="call"
            icon={<Call />}
            component="a"
            href={`tel:${phoneNumber}`}
          />
          {/* Placeholder for the Fab */}
          <BottomNavigationAction label="home" />
          <BottomNavigationAction
            label="Track"
            value="track"
            icon={<Message />}
            component={Link}
            href="/orders/tracking"
          />
          <BottomNavigationAction
            label="Chat"
            value="chat"
            icon={<Chat />}
            onClick={handleWhatsAppChat}
            // icon={<Home />}
            // component={Link}
            // href="/"
          />
        </BottomNavigation>
      </Box>
    </Paper>
  );
}
