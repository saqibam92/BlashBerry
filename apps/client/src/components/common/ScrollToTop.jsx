// File: apps/client/src/components/common/ScrollToTop.jsx
"use client";

import { useState, useEffect } from "react";
import { Fab, Zoom } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <Zoom in={isVisible}>
      <Fab
        color="primary"
        size="small"
        onClick={scrollToTop}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 100,
        }}
      >
        <ArrowUpwardIcon />
      </Fab>
    </Zoom>
  );
}
