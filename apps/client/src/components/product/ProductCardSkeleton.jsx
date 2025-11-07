// File: apps/client/src/components/product/ProductCardSkeleton.jsx
"use client";

import { Card, CardContent, Box, Skeleton } from "@mui/material";

export default function ProductCardSkeleton() {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Image Skeleton */}
      <Skeleton
        variant="rectangular"
        sx={{
          aspectRatio: "1 / 1", // Matches your ProductCard image
          width: "100%",
        }}
      />

      {/* Content Skeleton */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="80%" />
        <Skeleton variant="text" sx={{ fontSize: "1.25rem" }} width="40%" />
      </CardContent>

      {/* Button Skeleton */}
      <Box sx={{ p: 2, pt: 0, mt: "auto" }}>
        <Skeleton variant="rectangular" height={36} />
      </Box>
    </Card>
  );
}
