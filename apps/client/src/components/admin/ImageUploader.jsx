// apps/client/src/components/admin/ImageUploader.jsx
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { uploadProductImages } from "@/lib/adminApi";

export default function ImageUploader({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || images.length + files.length > 6) return;

    setUploading(true);
    try {
      const urls = await uploadProductImages(files);
      onChange([...images, ...urls]);
      toast.success("Uploaded!");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };
  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const updateUrl = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    onChange(newImages);
  };

  const addUrl = (e) => {
    const url = e.target.value.trim();
    if (url && images.length < 6 && !images.includes(url)) {
      onChange([...images, url]);
      e.target.value = "";
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Product Images (1–6)
      </Typography>

      {images.map((url, i) => (
        <Box
          key={i}
          sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}
        >
          <Box
            sx={{ width: 60, height: 60, borderRadius: 1, overflow: "hidden" }}
          >
            <img
              src={url}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
          <TextField
            value={url}
            onChange={(e) => updateUrl(i, e.target.value)}
            size="small"
            fullWidth
          />
          <Button color="error" size="small" onClick={() => removeImage(i)}>
            Remove
          </Button>
        </Box>
      ))}

      {images.length < 6 && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            component="label"
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            Upload Images
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleUpload}
            />
          </Button>

          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Or paste image URL
          </Typography>
          <TextField
            placeholder="https://..."
            size="small"
            fullWidth
            onKeyPress={(e) => e.key === "Enter" && addUrl(e)}
            sx={{ mt: 0.5 }}
          />
        </Box>
      )}
    </Box>
  );
}
