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
} from "@mui/material";
import {
  createAdminProduct,
  updateAdminProduct,
  getAdminCategories,
} from "@/lib/adminApi";
import toast from "react-hot-toast";
import CategoryCreator from "@/components/admin/CategoryCreator";

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

export default function ProductForm({ productData, isEditMode = false }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    sku: "",
    price: "",
    stockQuantity: "",
    sizes: "",
    tags: "",
    colors: "",
    unit: "pc",
    discount: { discountType: "percentage", discountAmount: 0 },
    images: [""],
    isFeatured: false,
    isActive: true,
    details: {
      material: "",
      model: "",
      braDesign: "",
      supportType: "",
      cupShape: "",
      closureType: "",
      strapType: "",
      decoration: "",
      feature: "",
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
        images: Array.isArray(productData.images) ? productData.images : [""],
        isFeatured: productData.isFeatured || false,
        isActive: productData.isActive ?? true,
        details: {
          material: productData.details?.material || "",
          model: productData.details?.model || "",
          braDesign: productData.details?.braDesign || "",
          supportType: productData.details?.supportType || "",
          cupShape: productData.details?.cupShape || "",
          closureType: productData.details?.closureType || "",
          strapType: productData.details?.strapType || "",
          decoration: productData.details?.decoration || "",
          feature: productData.details?.feature || "",
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
    getAdminCategories().then((res) => setCategories(res.data.data));
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

  // ... handleCategoryChange, handleImageChange, etc. (unchanged) ...

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
          {/* ... existing sections ... */}

          {/* === NEW: Lingerie Details Section === */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Lingerie Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="details.model"
                  label="Model"
                  value={formData.details.model}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Material</InputLabel>
                  <Select
                    name="details.material"
                    value={formData.details.material}
                    label="Material"
                    onChange={handleChange}
                  >
                    {DROPDOWNS.material.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {[
                "braDesign",
                "supportType",
                "cupShape",
                "closureType",
                "strapType",
                "decoration",
                "pantyType",
                "riseType",
              ].map((field) => (
                <Grid item xs={12} sm={6} key={field}>
                  <FormControl fullWidth>
                    <InputLabel>
                      {field.replace(/([A-Z])/g, " $1").trim()}
                    </InputLabel>
                    <Select
                      name={`details.${field}`}
                      value={formData.details[field]}
                      label={field.replace(/([A-Z])/g, " $1").trim()}
                      onChange={handleChange}
                    >
                      {DROPDOWNS[field].map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              ))}

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Sample Lead Time</InputLabel>
                  <Select
                    name="details.sampleLeadTime"
                    value={formData.details.sampleLeadTime}
                    label="Sample Lead Time"
                    onChange={handleChange}
                  >
                    {DROPDOWNS.sampleLeadTime.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Origin</InputLabel>
                  <Select
                    name="details.origin"
                    value={formData.details.origin}
                    label="Origin"
                    onChange={handleChange}
                  >
                    {DROPDOWNS.origin.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

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

              <Grid item xs={12}>
                <TextField
                  name="details.feature"
                  label="Feature (comma separated)"
                  value={formData.details.feature}
                  onChange={handleChange}
                  fullWidth
                  helperText="E.g., Eco-Friendly, Sexy Style"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* ... rest of form ... */}
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

// // File: apps / client / src / components / admin / ProductForm.jsx;

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Box,
//   Button,
//   Typography,
//   Paper,
//   Grid,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Switch,
//   FormControlLabel,
//   CircularProgress,
// } from "@mui/material";
// import {
//   createAdminProduct,
//   updateAdminProduct,
//   getAdminCategories,
// } from "@/lib/adminApi";
// import toast from "react-hot-toast";
// import CategoryCreator from "@/components/admin/CategoryCreator";

// export default function ProductForm({ productData, isEditMode = false }) {
//   const router = useRouter();
//   const [categories, setCategories] = useState([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     category: "",
//     brand: "",
//     sku: "",
//     price: "",
//     stockQuantity: "",
//     sizes: "",
//     tags: "",
//     colors: "",
//     unit: "pc",
//     discount: { discountType: "percentage", discountAmount: 0 },
//     images: [""],
//     isFeatured: false,
//     isActive: true,
//   });
//   const [loading, setLoading] = useState(false);
//   const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

//   useEffect(() => {
//     if (isEditMode && productData) {
//       setFormData({
//         name: productData.name || "",
//         description: productData.description || "",
//         category: productData.category?._id || "",
//         brand: productData.brand || "",
//         sku: productData.sku || "",
//         price: productData.price || "",
//         stockQuantity: productData.stockQuantity || "",
//         sizes: Array.isArray(productData.sizes)
//           ? productData.sizes.join(", ")
//           : "",
//         tags: Array.isArray(productData.tags)
//           ? productData.tags.join(", ")
//           : "",
//         colors: Array.isArray(productData.colors)
//           ? productData.colors.join(", ")
//           : "",
//         unit: productData.unit || "pc",
//         discount: {
//           discountType: productData.discount?.discountType || "percentage",
//           discountAmount: productData.discount?.discountAmount || 0,
//         },
//         images: Array.isArray(productData.images) ? productData.images : [""],
//         isFeatured: productData.isFeatured || false,
//         isActive: productData.isActive ?? true,
//       });
//     }
//     getAdminCategories().then((res) => setCategories(res.data.data));
//   }, [productData, isEditMode]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes("discount.")) {
//       const key = name.split(".")[1];
//       setFormData((prev) => ({
//         ...prev,
//         discount: { ...prev.discount, [key]: value },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleToggle = (name) => (e) => {
//     setFormData((prev) => ({ ...prev, [name]: e.target.checked }));
//   };

//   const handleCategoryChange = (e) => {
//     if (e.target.value === "add-new-category") {
//       setIsCategoryModalOpen(true);
//     } else {
//       handleChange(e);
//     }
//   };

//   const handleCategoryCreated = (newCategory) => {
//     setCategories((prev) => [...prev, newCategory]);
//     setFormData((prev) => ({ ...prev, category: newCategory._id }));
//   };

//   const handleImageChange = (index, value) => {
//     const newImages = [...formData.images];
//     newImages[index] = value;
//     setFormData((prev) => ({ ...prev, images: newImages }));
//   };

//   const addImageField = () => {
//     if (formData.images.length < 6) {
//       setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
//     }
//   };

//   const removeImageField = (index) => {
//     if (formData.images.length > 1) {
//       const newImages = formData.images.filter((_, i) => i !== index);
//       setFormData((prev) => ({ ...prev, images: newImages }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Validate inputs
//     if (formData.images.length > 6 || formData.images.length < 1) {
//       toast.error("Must have between 1 and 6 images.");
//       setLoading(false);
//       return;
//     }
//     if (formData.images.some((img) => !img)) {
//       toast.error("All image URLs must be filled.");
//       setLoading(false);
//       return;
//     }
//     if (formData.discount.discountAmount < 0) {
//       toast.error("Discount amount cannot be negative.");
//       setLoading(false);
//       return;
//     }

//     const payload = {
//       ...formData,
//       sizes:
//         typeof formData.sizes === "string"
//           ? formData.sizes
//               .split(",")
//               .map((s) => s.trim())
//               .filter((s) => s)
//           : formData.sizes,
//       tags:
//         typeof formData.tags === "string"
//           ? formData.tags
//               .split(",")
//               .map((t) => t.trim())
//               .filter((t) => t)
//           : formData.tags,
//       colors:
//         typeof formData.colors === "string"
//           ? formData.colors
//               .split(",")
//               .map((c) => c.trim())
//               .filter((c) => c)
//           : formData.colors,
//       price: Number(formData.price),
//       stockQuantity: Number(formData.stockQuantity),
//       discount: {
//         discountType: formData.discount.discountType,
//         discountAmount: Number(formData.discount.discountAmount),
//       },
//     };

//     const apiCall = isEditMode
//       ? updateAdminProduct(productData._id, payload)
//       : createAdminProduct(payload);

//     await toast.promise(apiCall, {
//       loading: `${isEditMode ? "Updating" : "Creating"} product...`,
//       success: () => {
//         router.push("/admin/products");
//         return `Product ${isEditMode ? "updated" : "created"}!`;
//       },
//       error: (err) => err.response?.data?.message || "Operation failed.",
//     });
//     setLoading(false);
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit}>
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={8}>
//           {/* General Information */}
//           <Paper sx={{ p: 2, mb: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               General Information
//             </Typography>
//             <TextField
//               name="name"
//               label="Product Name"
//               value={formData.name}
//               onChange={handleChange}
//               fullWidth
//               required
//               sx={{ my: 2 }}
//             />
//             <TextField
//               name="description"
//               label="Description"
//               value={formData.description}
//               onChange={handleChange}
//               fullWidth
//               multiline
//               rows={4}
//               required
//               sx={{ my: 2 }}
//             />
//             <TextField
//               name="sku"
//               label="SKU"
//               value={formData.sku}
//               onChange={handleChange}
//               fullWidth
//               sx={{ my: 2 }}
//             />
//           </Paper>

//           {/* Grouping */}
//           <Paper sx={{ p: 2, mb: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Grouping
//             </Typography>
//             <FormControl fullWidth sx={{ mt: 2 }}>
//               <InputLabel>Category</InputLabel>
//               <Select
//                 name="category"
//                 value={formData.category}
//                 label="Category"
//                 onChange={handleCategoryChange}
//                 required
//               >
//                 {categories.map((cat) => (
//                   <MenuItem key={cat._id} value={cat._id}>
//                     {cat.name}
//                   </MenuItem>
//                 ))}
//                 <MenuItem value="add-new-category">
//                   <em>+ Create New Category</em>
//                 </MenuItem>
//               </Select>
//             </FormControl>
//             <TextField
//               name="brand"
//               label="Brand"
//               value={formData.brand}
//               onChange={handleChange}
//               fullWidth
//               sx={{ mt: 2 }}
//             />
//           </Paper>

//           {/* Pricing & Stock */}
//           <Paper sx={{ p: 2, mb: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Pricing & Stock
//             </Typography>
//             <TextField
//               name="price"
//               label="Unit Price"
//               type="number"
//               value={formData.price}
//               onChange={handleChange}
//               fullWidth
//               required
//               inputProps={{ min: 0, step: "0.01" }}
//               sx={{ mt: 2 }}
//             />
//             <TextField
//               name="stockQuantity"
//               label="Stock Quantity"
//               type="number"
//               value={formData.stockQuantity}
//               onChange={handleChange}
//               fullWidth
//               required
//               inputProps={{ min: 0 }}
//               sx={{ mt: 2 }}
//             />
//             <FormControl fullWidth sx={{ mt: 2 }}>
//               <InputLabel>Discount Type</InputLabel>
//               <Select
//                 name="discount.discountType"
//                 value={formData.discount.discountType}
//                 label="Discount Type"
//                 onChange={handleChange}
//               >
//                 <MenuItem value="percentage">Percentage</MenuItem>
//                 <MenuItem value="fixed">Fixed</MenuItem>
//               </Select>
//             </FormControl>
//             <TextField
//               name="discount.discountAmount"
//               label="Discount Amount"
//               type="number"
//               value={formData.discount.discountAmount}
//               onChange={handleChange}
//               fullWidth
//               inputProps={{ min: 0, step: "0.01" }}
//               sx={{ mt: 2 }}
//             />
//           </Paper>

//           {/* Attributes */}
//           <Paper sx={{ p: 2, mb: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Product Attributes
//             </Typography>
//             <TextField
//               name="sizes"
//               label="Sizes (comma separated)"
//               value={formData.sizes}
//               onChange={handleChange}
//               fullWidth
//               sx={{ mt: 2 }}
//               helperText="E.g., S, M, L, XL"
//             />
//             <TextField
//               name="colors"
//               label="Colors (comma separated)"
//               value={formData.colors}
//               onChange={handleChange}
//               fullWidth
//               sx={{ mt: 2 }}
//               helperText="E.g., Red, Blue, Green"
//             />
//             <TextField
//               name="tags"
//               label="Tags (comma separated)"
//               value={formData.tags}
//               onChange={handleChange}
//               fullWidth
//               sx={{ mt: 2 }}
//               helperText="E.g., summer, casual, premium"
//             />
//             <FormControl fullWidth sx={{ mt: 2 }}>
//               <InputLabel>Unit</InputLabel>
//               <Select
//                 name="unit"
//                 value={formData.unit}
//                 label="Unit"
//                 onChange={handleChange}
//               >
//                 <MenuItem value="pc">Piece (pc)</MenuItem>
//                 <MenuItem value="kg">Kilogram (kg)</MenuItem>
//                 <MenuItem value="g">Gram (g)</MenuItem>
//                 <MenuItem value="l">Liter (l)</MenuItem>
//                 <MenuItem value="m">Meter (m)</MenuItem>
//               </Select>
//             </FormControl>
//           </Paper>

//           {/* Product Images */}
//           <Paper sx={{ p: 2, mb: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Product Images (1-6 URLs)
//             </Typography>
//             {formData.images.map((img, index) => (
//               <Box
//                 key={index}
//                 sx={{ display: "flex", alignItems: "center", mb: 1 }}
//               >
//                 <TextField
//                   label={`Image URL ${index + 1}`}
//                   value={img}
//                   onChange={(e) => handleImageChange(index, e.target.value)}
//                   fullWidth
//                   required
//                   sx={{ mr: 1 }}
//                 />
//                 {formData.images.length > 1 && (
//                   <Button color="error" onClick={() => removeImageField(index)}>
//                     Remove
//                   </Button>
//                 )}
//               </Box>
//             ))}
//             <Button
//               onClick={addImageField}
//               disabled={formData.images.length >= 6}
//               sx={{ mt: 1 }}
//             >
//               Add Another Image
//             </Button>
//           </Paper>

//           {/* Status */}
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Status
//             </Typography>
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={formData.isFeatured}
//                   onChange={handleToggle("isFeatured")}
//                   name="isFeatured"
//                 />
//               }
//               label="Featured"
//             />
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={formData.isActive}
//                   onChange={handleToggle("isActive")}
//                   name="isActive"
//                 />
//               }
//               label="Active"
//             />
//           </Paper>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 2, position: "sticky", top: "80px" }}>
//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={loading}
//             >
//               {loading ? (
//                 <CircularProgress size={24} />
//               ) : isEditMode ? (
//                 "Update Product"
//               ) : (
//                 "Save Product"
//               )}
//             </Button>
//           </Paper>
//         </Grid>
//       </Grid>
//       <CategoryCreator
//         open={isCategoryModalOpen}
//         onClose={() => setIsCategoryModalOpen(false)}
//         onCategoryCreated={handleCategoryCreated}
//       />
//     </Box>
//   );
// }
