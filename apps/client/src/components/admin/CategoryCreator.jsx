// File: apps/client/src/components/admin/CategoryCreator.jsx

"use client";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { createAdminCategory } from "@/lib/adminApi";
import toast from "react-hot-toast";
import ImageUploader from "./ImageUploader";

export default function CategoryCreator({ open, onClose, onCategoryCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    images: [],
    priority: 10,
  });

  const handleSave = async () => {
    const payload = {
      name: formData.name,
      image: formData.images[0] || formData.image, // fallback
      priority: formData.priority,
    };
    await toast.promise(createAdminCategory(payload), {
      loading: "Creating category...",
      success: (res) => {
        onCategoryCreated(res.data.data);
        onClose();
        return "Category created!";
      },
      error: "Failed to create category.",
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Category</DialogTitle>
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
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {/* <TextField
          label="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })} */}
        {/* /> */}
        <ImageUploader
          images={formData.images || []}
          onChange={(newImages) =>
            setFormData((prev) => ({ ...prev, images: newImages }))
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
