// File: apps/client/src/app/admin/videos/add/page.jsx

import VideoForm from "@/components/admin/VideoForm";
import { Box, Typography } from "@mui/material";

export default function AddVideoPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add New Video
      </Typography>
      <VideoForm />
    </Box>
  );
}
