// apps/client/src/app/admin/products/import/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { CloudUpload, CheckCircle, Error } from "@mui/icons-material";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function ImportProductsPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handlePreview = async () => {
    if (!file) return toast.error("Select a CSV file");

    setLoading(true);
    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      const res = await api.post("/api/products/import/preview", formData);
      setPreview(res.data);
      if (res.data.errors.length > 0) {
        toast.error(`${res.data.errors.length} validation errors`);
      } else {
        toast.success("CSV valid! Ready to import.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Preview failed");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await api.post("/api/products/import/confirm", {
        products: preview.preview,
      });
      toast.success("All products imported!");
      router.push("/admin/products");
    } catch (err) {
      toast.error("Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Import Products (CSV)
      </Typography>

      <Box sx={{ mb: 3 }}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <Button
          variant="contained"
          onClick={handlePreview}
          disabled={!file || loading}
          sx={{ ml: 2 }}
        >
          {loading ? <CircularProgress size={20} /> : "Preview"}
        </Button>
      </Box>

      {preview && (
        <>
          <Alert
            severity={preview.errors.length > 0 ? "warning" : "success"}
            sx={{ mb: 2 }}
          >
            {preview.total} products • {preview.errors.length} errors
          </Alert>

          {preview.errors.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {preview.errors.map((e, i) => (
                <div key={i}>{e}</div>
              ))}
            </Alert>
          )}

          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Model</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {preview.preview.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.price}</TableCell>
                    <TableCell>{p.stockQuantity}</TableCell>
                    <TableCell>{p.details.model}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={handleConfirm}
            disabled={loading || preview.errors.length > 0}
          >
            {loading ? "Importing..." : "Confirm Import"}
          </Button>
        </>
      )}

      <Typography variant="body2" sx={{ mt: 3 }}>
        Download{" "}
        <a href="/csv-template.csv" download>
          CSV Template
        </a>
      </Typography>
    </Box>
  );
}
