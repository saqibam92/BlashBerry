// File: apps/client/src/app/admin/videos/edit/[id]/page.jsx

"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";
import { getAdminVideos } from "@/lib/adminApi";
import VideoForm from "@/components/admin/VideoForm";

export default function EditVideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getAdminVideos()
        .then((res) => {
          const videoData = res.data.find((v) => v._id === id);
          setVideo(videoData);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!video) return <Typography>Video not found.</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Edit Video
      </Typography>
      <VideoForm videoData={video} isEditMode={true} />
    </Box>
  );
}
