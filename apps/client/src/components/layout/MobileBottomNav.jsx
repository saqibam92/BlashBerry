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
  phoneNumber = "+8801769900180",
  chatNumber = "+8801769900180",
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
      setValue("track");
    } else {
      setValue(null);
    }
  }, [pathname]);

  const handleWhatsAppChat = () => {
    const message = "Hello, I'm interested in your products.";
    window.open(
      `https://wa.me/${chatNumber}?text=${encodeURIComponent(message)}`
    );
    setValue("chat");
  };

  const handleFabClick = () => {
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
        display: { xs: "block", md: "none" },
      }}
      elevation={3}
    >
      <Box sx={{ position: "relative", height: "70px" }}>
        <Fab
          color="#95106d"
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
            backgroundColor: "#b70673",
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
          <BottomNavigationAction
            label="Home"
            value="home"
            sx={{
              opacity: 0,
              pointerEvents: "none",
            }}
          />
          <BottomNavigationAction
            label="Track"
            value="track"
            icon={<LocalShipping />}
            component={Link}
            href="/orders/tracking"
          />
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
