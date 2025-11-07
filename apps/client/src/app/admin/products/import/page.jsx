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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link as MuiLink,
} from "@mui/material";
import { CloudUpload, CheckCircle, Error, Download } from "@mui/icons-material";
import toast from "react-hot-toast";
// Import all three functions
import {
  previewCsvImport,
  confirmCsvImport,
  downloadCsvTemplate,
} from "@/lib/adminApi";

export default function ImportProductsPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const router = useRouter();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPreview(null); // Reset preview if file changes
    setImportResult(null); // Reset import result
  };

  const handleDownloadTemplate = async () => {
    setLoading(true);
    await toast.promise(downloadCsvTemplate(), {
      loading: "Downloading template...",
      success: "Template downloaded!",
      error: "Download failed.",
    });
    setLoading(false);
  };

  const handlePreview = async () => {
    if (!file) return toast.error("Please select a CSV file first.");

    setLoading(true);
    setPreview(null);
    setImportResult(null);

    try {
      const res = await previewCsvImport(file);
      setPreview(res);
      if (res.errors.length > 0) {
        toast.error(`${res.errors.length} validation errors found.`);
      } else {
        toast.success("CSV preview looks good! Ready to import.");
      }
    } catch (err) {
      toast.error(err.message || "Preview failed");
    } finally {
      setLoading(false);
    }
  };

  // --- THIS IS THE FIX ---
  const handleConfirm = async () => {
    // Check for preview data, not the file
    if (!preview || !preview.preview || preview.preview.length === 0) {
      return toast.error("Please preview a valid file first.");
    }

    if (preview.errors.length > 0) {
      return toast.error("Please fix errors in the CSV before importing.");
    }

    setLoading(true);
    setImportResult(null);

    // Pass the JSON array from the preview state
    await toast.promise(confirmCsvImport(preview.preview), {
      loading: "Importing products... This may take a while.",
      success: (res) => {
        setImportResult(res);
        setPreview(null); // Clear preview after import
        return res.message;
      },
      error: (err) => {
        setImportResult(err);
        return err.message || "Import failed";
      },
    });

    setLoading(false);
  };
  // --- END FIX ---

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Import Products (CSV)
      </Typography>

      <Typography variant="body2" sx={{ mb: 2 }}>
        Download the{" "}
        <MuiLink
          component="button"
          variant="body2"
          onClick={handleDownloadTemplate}
          disabled={loading}
          sx={{ verticalAlign: "baseline" }}
        >
          Sample CSV Template
        </MuiLink>{" "}
        to get started.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Button variant="outlined" component="label" disabled={loading}>
            <CloudUpload sx={{ mr: 1 }} />
            Choose CSV File
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              hidden
            />
          </Button>
          {file && (
            <Typography variant="body2" sx={{ display: "inline", ml: 2 }}>
              {file.name}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          onClick={handlePreview}
          disabled={!file || loading}
          sx={{ mr: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Preview"}
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<CheckCircle />}
          onClick={handleConfirm}
          // Disable if loading, no preview, or preview has errors
          disabled={loading || !preview || preview.errors.length > 0}
        >
          {loading ? "Processing..." : "Confirm & Import"}
        </Button>
      </Paper>

      {/* Import Result Box */}
      {importResult && (
        <Alert
          severity={importResult.success ? "success" : "error"}
          sx={{ mb: 2, maxHeight: 400, overflowY: "auto" }}
        >
          <Typography fontWeight="bold">{importResult.message}</Typography>
          {importResult.errors?.length > 0 && (
            <List dense>
              {importResult.errors.slice(0, 10).map((e, i) => (
                <ListItem key={i}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <Error fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={e} />
                </ListItem>
              ))}
              {importResult.errors.length > 10 && (
                <ListItemText
                  primary={`...and ${
                    importResult.errors.length - 10
                  } more errors.`}
                />
              )}
            </List>
          )}
        </Alert>
      )}

      {/* Preview Box */}
      {preview && !importResult && (
        <Paper sx={{ p: 2 }}>
          <Alert
            severity={preview.errors.length > 0 ? "warning" : "success"}
            sx={{ mb: 2 }}
          >
            Found {preview.total} valid products.
            {preview.errors.length > 0 &&
              ` Found ${preview.errors.length} errors.`}
          </Alert>

          {preview.errors.length > 0 && (
            <Alert
              severity="error"
              sx={{ mb: 2, maxHeight: 200, overflowY: "auto" }}
            >
              {preview.errors.map((e, i) => (
                <div key={i}>{e}</div>
              ))}
            </Alert>
          )}

          <Typography variant="h6" gutterBottom>
            Preview (First 10 Rows)
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>SKU</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {preview.preview.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.price}</TableCell>
                    <TableCell>{p.stockQuantity}</TableCell>
                    <TableCell>{p.categoryName}</TableCell>
                    <TableCell>{p.sku}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
