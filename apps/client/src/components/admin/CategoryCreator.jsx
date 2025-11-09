// File: apps/client/src/components/admin/CategoryCreator.jsx

"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { createAdminCategory, updateAdminCategory } from "@/lib/adminApi";
import toast from "react-hot-toast";
import ImageUploader from "./ImageUploader";

export default function CategoryCreator({
  open,
  onClose,
  onCategorySaved,
  initialCategory,
}) {
  const isEdit = !!initialCategory;
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    images: [],
    priority: 10,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setFormData({
        name: initialCategory.name,
        image: initialCategory.image,
        images: initialCategory.image ? [initialCategory.image] : [],
        priority: initialCategory.priority || 10,
      });
    } else {
      setFormData({ name: "", image: "", images: [], priority: 10 });
    }
  }, [initialCategory, isEdit]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const finalImageUrl = formData.images[0] || formData.image;

    if (!formData.name || !finalImageUrl) {
      toast.error("Name and Image are required.");
      return;
    }

    const payload = {
      name: formData.name,
      image: finalImageUrl,
      priority: formData.priority,
    };

    setLoading(true);

    const apiCall = isEdit
      ? updateAdminCategory(initialCategory._id, payload)
      : createAdminCategory(payload);

    await toast.promise(apiCall, {
      loading: `${isEdit ? "Updating" : "Creating"} category...`,
      success: (res) => {
        onCategorySaved(res.data.data);
        onClose();
        return `Category ${isEdit ? "updated" : "created"} successfully!`;
      },
      error: (err) => {
        return (
          err.response?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} category.`
        );
      },
    });
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {isEdit ? "Edit Category" : "Create New Category"}
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pt: "16px !important",
        }}
      >
        <TextField
          label="Category Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Priority (lower is higher)"
          name="priority"
          type="number"
          value={formData.priority}
          onChange={handleInputChange}
        />
        <Typography variant="subtitle2" sx={{ mt: 1 }}>
          Category Image (Max 1)
        </Typography>
        <ImageUploader
          images={formData.images || []}
          onChange={(newImages) =>
            setFormData((prev) => ({ ...prev, images: newImages }))
          }
          maxImages={1}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {loading ? (
            <CircularProgress size={24} />
          ) : isEdit ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
