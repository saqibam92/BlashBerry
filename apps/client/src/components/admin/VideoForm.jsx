// File: apps/client/src/components/admin/VideoForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { createAdminVideo, updateAdminVideo } from "@/lib/adminApi";
import toast from "react-hot-toast";

export default function VideoForm({ videoData, isEditMode = false }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    isActive: true,
    isSelected: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && videoData) {
      setFormData({
        title: videoData.title || "",
        url: videoData.url || "",
        isActive: videoData.isActive ?? true,
        isSelected: videoData.isSelected ?? false,
      });
    }
  }, [videoData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name) => (e) => {
    setFormData((prev) => ({ ...prev, [name]: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...formData };

    const apiCall = isEditMode
      ? updateAdminVideo(videoData._id, payload)
      : createAdminVideo(payload);

    await toast.promise(apiCall, {
      loading: `${isEditMode ? "Updating" : "Creating"} video...`,
      success: () => {
        router.push("/admin/videos");
        return `Video ${isEditMode ? "updated" : "created"}!`;
      },
      error: (err) => err.response?.data?.message || "Operation failed.",
    });
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Video Information
            </Typography>
            <TextField
              name="title"
              label="Video Title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
              sx={{ my: 2 }}
            />
            <TextField
              name="url"
              label="Video URL (YouTube, Facebook, Instagram)"
              value={formData.url}
              onChange={handleChange}
              fullWidth
              required
              sx={{ my: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleToggle("isActive")}
                  name="isActive"
                />
              }
              label="Active"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isSelected}
                  onChange={handleToggle("isSelected")}
                  name="isSelected"
                />
              }
              label="Selected for Homepage"
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, position: "sticky", top: "80px" }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : isEditMode ? (
                "Update Video"
              ) : (
                "Save Video"
              )}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
