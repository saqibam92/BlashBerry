// File: apps/client/src/app/admin/videos/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import {
  getAdminVideos,
  deleteAdminVideo,
  updateAdminVideo,
} from "@/lib/adminApi";
import toast from "react-hot-toast";

export default function AdminVideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "all" });

  const fetchData = async () => {
    try {
      const videosRes = await getAdminVideos();
      setVideos(videosRes.data);
      setFilteredVideos(videosRes.data);
    } catch (error) {
      toast.error("Failed to fetch videos.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = videos;
    if (filters.search) {
      result = result.filter((v) =>
        v.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.status !== "all") {
      result = result.filter(
        (v) => v.isActive === (filters.status === "active")
      );
    }
    setFilteredVideos(result);
  }, [filters, videos]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggle = async (id, field, currentValue) => {
    await toast.promise(updateAdminVideo(id, { [field]: !currentValue }), {
      loading: "Updating...",
      success: "Video updated!",
      error: "Update failed.",
    });
    fetchData();
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this video permanently?")
    ) {
      await toast.promise(deleteAdminVideo(id), {
        loading: "Deleting...",
        success: "Video deleted!",
        error: "Failed to delete video.",
      });
      fetchData();
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4">Video List</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push("/admin/videos/add")}
        >
          Add New Video
        </Button>
      </Box>

      {/* Filter Section */}
      <Card component={Paper} elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filter Videos
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="search"
                label="Search by Title"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={filters.status}
                  label="Status"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Videos Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SL</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Selected</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVideos.map((video, index) => (
              <TableRow key={video._id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{video.title}</TableCell>
                <TableCell>
                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                    {video.url}
                  </a>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={video.isActive}
                    onChange={() =>
                      handleToggle(video._id, "isActive", video.isActive)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={video.isSelected}
                    onChange={() =>
                      handleToggle(video._id, "isSelected", video.isSelected)
                    }
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() =>
                      router.push(`/admin/videos/edit/${video._id}`)
                    }
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(video._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
