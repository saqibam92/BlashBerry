// apps/client/src/app/admin/banners/page.jsx

"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
  Avatar,
  Tooltip,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import {
  getAdminBanners,
  createAdminBanner,
  updateAdminBanner,
  deleteAdminBanner,
  uploadBannerImage,
  toggleBannerActiveStatus, // <-- NEW
} from "@/lib/adminApi";
import toast from "react-hot-toast";
import Image from "next/image"; // Import Next Image

// Reusable Form in a Dialog
const BannerForm = ({ open, onClose, onSave, banner }) => {
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    priority: 10,
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Note: The 'image' property is not part of the initial state but is merged in here
    setFormData(banner || { title: "", link: "", priority: 10, image: "" });
    setImageFile(null); // Clear file input on open/change
  }, [banner]);

  const handleSave = async () => {
    // Validation check for new banner without image
    if (!banner && !imageFile && !formData.image) {
      toast.error("Please select an image for the new banner.");
      return;
    }

    let imageUrl = formData.image;
    if (imageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append("file", imageFile);
      setUploading(true);
      try {
        const res = await uploadBannerImage(uploadFormData);
        // Assuming your uploadBannerImage response structure is { data: { imageUrl: "..." } }
        imageUrl = res.data.imageUrl;
      } catch (error) {
        toast.error("Image upload failed!");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // Pass the active status through on update, or default to active for create
    const payload = {
      ...formData,
      image: imageUrl,
      isActive: banner ? formData.isActive : true, // Preserve active status on edit
    };

    onSave(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{banner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pt: "16px !important",
        }}
      >
        <TextField
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <TextField
          label="Link URL (Optional)"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        />
        <TextField
          label="Priority (lower is higher)"
          type="number"
          value={formData.priority}
          onChange={(e) =>
            setFormData({ ...formData, priority: e.target.value })
          }
        />
        <Box>
          <Button variant="outlined" component="label" fullWidth>
            {imageFile ? `Change Image: ${imageFile.name}` : "Upload New Image"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </Button>

          {/* Display current/uploaded image preview */}
          <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
            {!imageFile && formData.image && (
              <Avatar
                src={formData.image}
                variant="rounded"
                sx={{ width: 100, height: 50 }}
              />
            )}
            <Typography variant="caption" color="textSecondary">
              {imageFile
                ? `New File: ${imageFile.name}`
                : formData.image
                ? "Current Image"
                : "No image selected"}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={uploading}>
          {uploading ? (
            <CircularProgress size={24} />
          ) : banner ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Page
export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const fetchBanners = () =>
    getAdminBanners().then((res) => setBanners(res.data.data));
  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSave = async (data) => {
    const apiCall = selectedBanner
      ? updateAdminBanner(selectedBanner._id, data)
      : createAdminBanner(data);

    await toast.promise(apiCall, {
      loading: "Saving banner...",
      success: "Banner saved!",
      error: (err) => err.response?.data?.message || "Failed to save banner.",
    });

    fetchBanners();
    setOpen(false);
  };

  const handleDelete = async (bannerId) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      const apiCall = deleteAdminBanner(bannerId);
      await toast.promise(apiCall, {
        loading: "Deleting banner...",
        success: "Banner deleted!",
        error: (err) =>
          err.response?.data?.message || "Failed to delete banner.",
      });
      fetchBanners();
    }
  };

  const handleToggleActive = async (bannerId, currentStatus) => {
    const apiCall = toggleBannerActiveStatus(bannerId);

    await toast.promise(apiCall, {
      loading: "Updating status...",
      success: `Banner status set to ${currentStatus ? "Inactive" : "Active"}`,
      error: (err) => err.response?.data?.message || "Failed to update status.",
    });

    fetchBanners();
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Banner Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedBanner(null);
            setOpen(true);
          }}
        >
          Add Banner
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Preview</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Link</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell align="center">Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banners.map((banner) => (
              <TableRow key={banner._id}>
                <TableCell>
                  <Box
                    sx={{
                      width: 100,
                      height: 50,
                      position: "relative",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    {/* View Banner Image component: Display the image using next/image */}
                    <Image
                      src={banner.image || "/path/to/placeholder.png"}
                      alt={banner.title}
                      layout="fill"
                      objectFit="cover"
                      priority
                    />
                  </Box>
                </TableCell>
                <TableCell>{banner.title}</TableCell>
                <TableCell>
                  <Tooltip title={banner.link}>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                      {banner.link || "#"}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>{banner.priority}</TableCell>
                <TableCell align="center">
                  <Switch
                    checked={banner.isActive}
                    onChange={() =>
                      handleToggleActive(banner._id, banner.isActive)
                    }
                    color="primary"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedBanner(banner);
                      setOpen(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(banner._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <BannerForm
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        banner={selectedBanner}
      />
    </Box>
  );
}
