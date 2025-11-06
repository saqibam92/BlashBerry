// apps/client/src/components/admin/ProductForm.jsx
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress,
  Checkbox,
  ListItemText,
  Chip,
  OutlinedInput,
} from "@mui/material";
import {
  createAdminProduct,
  updateAdminProduct,
  getAdminCategories,
} from "@/lib/adminApi";
import toast from "react-hot-toast";
import CategoryCreator from "@/components/admin/CategoryCreator";
import ImageUploader from "./ImageUploader";

// === Dropdown Options ===
const DROPDOWNS = {
  material: ["Spandex", "Cotton", "Lace", "Silk", "Polyester"],
  braDesign: ["Padded", "Seamless", "Push-Up", "Wireless", "Balconette"],
  supportType: ["Underwire", "Wireless", "Light Support"],
  cupShape: ["Full Cup", "Demi", "Plunge", "Others"],
  closureType: [
    "Two Hook-and-Eye",
    "Three Hook-and-Eye",
    "Front Closure",
    "None",
  ],
  strapType: ["Non-adjustable Straps", "Adjustable Straps", "Convertible"],
  decoration: ["Lace", "Machine Embroidery", "Bow", "None"],
  feature: ["Eco-Friendly", "Comfortable Fit", "Sexy Style", "Breathable"],
  pantyType: ["Thongs", "Briefs", "Boyshorts", "G-String"],
  riseType: ["Low", "Mid", "High"],
  sampleLeadTime: ["3 days", "5 days", "7 days", "10 days", "14 days"],
  origin: ["Zhejiang, China", "Guangdong, China", "India", "Vietnam"],
};

// Multi-select fields that should be stored as arrays
const MULTI_SELECT_FIELDS = ["decoration", "feature"];

export default function ProductForm({ productData, isEditMode = false }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    sku: "",
    model: "",
    price: "",
    stockQuantity: "",
    sizes: "",
    tags: "",
    colors: "",
    unit: "pc",
    discount: { discountType: "percentage", discountAmount: 0 },
    images: [],
    isFeatured: false,
    isActive: true,
    details: {
      material: "",
      braDesign: "",
      supportType: "",
      cupShape: "",
      closureType: "",
      strapType: "",
      decoration: [],
      feature: [],
      pantyType: "",
      riseType: "",
      removablePads: false,
      ecoFriendly: false,
      oemOdm: false,
      sampleLeadTime: "",
      origin: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    if (isEditMode && productData) {
      // Helper function to parse comma-separated strings into arrays
      const parseToArray = (value) => {
        if (Array.isArray(value)) return value;
        if (typeof value === "string" && value) {
          return value.split(",").map((item) => item.trim());
        }
        return [];
      };

      setFormData({
        name: productData.name || "",
        description: productData.description || "",
        category: productData.category?._id || "",
        brand: productData.brand || "",
        sku: productData.sku || "",
        price: productData.price || "",
        stockQuantity: productData.stockQuantity || "",
        sizes: Array.isArray(productData.sizes)
          ? productData.sizes.join(", ")
          : "",
        tags: Array.isArray(productData.tags)
          ? productData.tags.join(", ")
          : "",
        colors: Array.isArray(productData.colors)
          ? productData.colors.join(", ")
          : "",
        unit: productData.unit || "pc",
        discount: {
          discountType: productData.discount?.discountType || "percentage",
          discountAmount: productData.discount?.discountAmount || 0,
        },
        model: productData.model || "",
        images: Array.isArray(productData.images) ? productData.images : [],
        isFeatured: productData.isFeatured || false,
        isActive: productData.isActive ?? true,
        details: {
          material: productData.details?.material || "",
          braDesign: productData.details?.braDesign || "",
          supportType: productData.details?.supportType || "",
          cupShape: productData.details?.cupShape || "",
          closureType: productData.details?.closureType || "",
          strapType: productData.details?.strapType || "",
          decoration: parseToArray(productData.details?.decoration),
          feature: parseToArray(productData.details?.feature),
          pantyType: productData.details?.pantyType || "",
          riseType: productData.details?.riseType || "",
          removablePads: productData.details?.removablePads ?? false,
          ecoFriendly: productData.details?.ecoFriendly ?? false,
          oemOdm: productData.details?.oemOdm ?? false,
          sampleLeadTime: productData.details?.sampleLeadTime || "",
          origin: productData.details?.origin || "",
        },
      });
    }
    getAdminCategories()
      .then((res) => {
        setCategories(res.data.data);
        setCategoriesLoading(false);
      })
      .catch(() => setCategoriesLoading(false));
  }, [productData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("details.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        details: { ...prev.details, [key]: value },
      }));
    } else if (name.includes("discount.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        discount: { ...prev.discount, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggle = (path) => (e) => {
    const [parent, key] = path.split(".");
    if (parent === "details") {
      setFormData((prev) => ({
        ...prev,
        details: { ...prev.details, [key]: e.target.checked },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [path]: e.target.checked }));
    }
  };

  const handleCategoryChange = (e) => {
    if (e.target.value === "add-new-category") {
      setIsCategoryModalOpen(true);
    } else {
      handleChange(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert multi-select arrays to comma-separated strings for storage
    const processedDetails = { ...formData.details };
    MULTI_SELECT_FIELDS.forEach((field) => {
      if (Array.isArray(processedDetails[field])) {
        processedDetails[field] = processedDetails[field].join(", ");
      }
    });

    const payload = {
      ...formData,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
      discount: {
        discountType: formData.discount.discountType,
        discountAmount: Number(formData.discount.discountAmount),
      },
      sizes: formData.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      colors: formData.colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      images: formData.images.filter((url) => url && url.trim()),
      details: processedDetails,
    };

    const apiCall = isEditMode
      ? updateAdminProduct(productData._id, payload)
      : createAdminProduct(payload);

    await toast.promise(apiCall, {
      loading: `${isEditMode ? "Updating" : "Creating"} product...`,
      success: () => {
        router.push("/admin/products");
        return `Product ${isEditMode ? "updated" : "created"}!`;
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
              General Information
            </Typography>
            <TextField
              name="name"
              label="Product Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              sx={{ my: 2 }}
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              required
              sx={{ my: 2 }}
            />
            <TextField
              name="sku"
              label="SKU"
              value={formData.sku}
              onChange={handleChange}
              fullWidth
              sx={{ my: 2 }}
            />
            <TextField
              name="model"
              label="Model"
              value={formData.model}
              onChange={handleChange}
              fullWidth
              sx={{ my: 2 }}
            />
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Grouping
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleCategoryChange}
                required
                disabled={categoriesLoading}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
                <MenuItem value="add-new-category">
                  <em>+ Create New Category</em>
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="brand"
              label="Brand"
              value={formData.brand}
              onChange={handleChange}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Lingerie Details
            </Typography>
            <Grid container spacing={2}>
              {/* <Grid item xs={12} sm={6}>
                <TextField name="details.model" label="Model"
                  value={formData.details.model} onChange={handleChange} fullWidth
                />
              </Grid> */}

              {/* {Object.entries(DROPDOWNS).map(([key, options]) => {
                const isMultiSelect = MULTI_SELECT_FIELDS.includes(key);

                return (
                  <Grid item xs={12} sm={6} key={key}>
                    <FormControl fullWidth>
                      <InputLabel>
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </InputLabel>
                      <Select
                        name={`details.${key}`}
                        value={
                          formData.details[key] || (isMultiSelect ? [] : "")
                        }
                        label={key.replace(/([A-Z])/g, " $1").trim()}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            details: { ...prev.details, [key]: value },
                          }));
                        }}
                        multiple={isMultiSelect}
                        input={
                          isMultiSelect ? (
                            <OutlinedInput
                              label={key.replace(/([A-Z])/g, " $1").trim()}
                            />
                          ) : undefined
                        }
                        renderValue={
                          isMultiSelect
                            ? (selected) => (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                  }}
                                >
                                  {selected.map((value) => (
                                    <Chip
                                      key={value}
                                      label={value}
                                      size="small"
                                    />
                                  ))}
                                </Box>
                              )
                            : undefined
                        }
                      >
                        {!isMultiSelect && (
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                        )}
                        {options.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                );
              })} */}

              {Object.entries(DROPDOWNS).map(([key, options]) => {
                const isMulti = MULTI_SELECT_FIELDS.includes(key);
                const value = isMulti
                  ? formData.details[key] || []
                  : formData.details[key] || "";

                return (
                  <Grid item xs={12} sm={6} key={key}>
                    <FormControl fullWidth>
                      <InputLabel>
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </InputLabel>
                      <Select
                        name={`details.${key}`}
                        value={value}
                        label={key.replace(/([A-Z])/g, " $1").trim()}
                        onChange={handleChange}
                        multiple={isMulti}
                        input={
                          isMulti ? (
                            <OutlinedInput
                              label={key.replace(/([A-Z])/g, " $1").trim()}
                            />
                          ) : undefined
                        }
                        renderValue={
                          isMulti
                            ? (selected) => (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                  }}
                                >
                                  {selected.map((v) => (
                                    <Chip key={v} label={v} size="small" />
                                  ))}
                                </Box>
                              )
                            : undefined
                        }
                      >
                        {!isMulti && (
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                        )}
                        {options.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {isMulti && (
                              <Checkbox checked={value.includes(opt)} />
                            )}
                            {isMulti && <ListItemText primary={opt} />}
                            {!isMulti && opt}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                );
              })}

              {["removablePads", "ecoFriendly", "oemOdm"].map((field) => (
                <Grid item xs={12} sm={4} key={field}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.details[field]}
                        onChange={handleToggle(`details.${field}`)}
                      />
                    }
                    label={field.replace(/([A-Z])/g, " $1").trim()}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pricing & Stock
            </Typography>
            <TextField
              name="price"
              label="Unit Price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 0, step: "0.01" }}
              sx={{ mt: 2 }}
            />
            <TextField
              name="stockQuantity"
              label="Stock Quantity"
              type="number"
              value={formData.stockQuantity}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 0 }}
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Discount Type</InputLabel>
              <Select
                name="discount.discountType"
                value={formData.discount.discountType}
                label="Discount Type"
                onChange={handleChange}
              >
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="fixed">Fixed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="discount.discountAmount"
              label="Discount Amount"
              type="number"
              value={formData.discount.discountAmount}
              onChange={handleChange}
              fullWidth
              inputProps={{ min: 0, step: "0.01" }}
              sx={{ mt: 2 }}
            />
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Product Attributes
            </Typography>
            <TextField
              name="sizes"
              label="Sizes (comma separated)"
              value={formData.sizes}
              onChange={handleChange}
              fullWidth
              sx={{ mt: 2 }}
              helperText="E.g., S, M, L, XL"
            />
            <TextField
              name="colors"
              label="Colors (comma separated)"
              value={formData.colors}
              onChange={handleChange}
              fullWidth
              sx={{ mt: 2 }}
              helperText="E.g., Red, Blue, Green"
            />
            <TextField
              name="tags"
              label="Tags (comma separated)"
              value={formData.tags}
              onChange={handleChange}
              fullWidth
              sx={{ mt: 2 }}
              helperText="E.g., summer, casual, premium"
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Unit</InputLabel>
              <Select
                name="unit"
                value={formData.unit}
                label="Unit"
                onChange={handleChange}
              >
                <MenuItem value="pc">Piece (pc)</MenuItem>
                <MenuItem value="kg">Kilogram (kg)</MenuItem>
                <MenuItem value="g">Gram (g)</MenuItem>
                <MenuItem value="l">Liter (l)</MenuItem>
                <MenuItem value="m">Meter (m)</MenuItem>
              </Select>
            </FormControl>
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <ImageUploader
              images={formData.images}
              onChange={(newImages) =>
                setFormData((prev) => ({ ...prev, images: newImages }))
              }
            />
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Status
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isFeatured}
                  onChange={handleToggle("isFeatured")}
                  name="isFeatured"
                />
              }
              label="Featured"
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
                "Update"
              ) : (
                "Save"
              )}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <CategoryCreator
        open={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryCreated={(cat) => {
          setCategories((prev) => [...prev, cat]);
          setFormData((prev) => ({ ...prev, category: cat._id }));
        }}
      />
    </Box>
  );
}
