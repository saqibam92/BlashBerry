// File: apps/server/src/routes/products.js

const express = require("express");
const { body } = require("express-validator");
const {
  getProducts,
  searchProducts,
  getProduct,
  getFeaturedProducts,
  getSimilarProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getCategories,
  getCategoryProducts,
  downloadSampleCSV,
  // importProductsCSV,
  previewCSVImport,
  confirmCSVImport,
  // uploadImage,
  getTrendingProducts,
  getBestSellerProducts,
  getNewArrivalProducts,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/auth");
const { uploadImage, uploadCsv } = require("../middleware/multerUpload");
const Banner = require("../models/Banner");

const router = express.Router();

// Validation rules
const productValidation = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Product name must be at least 2 characters long"),
  // body("slug")
  //   .trim()
  //   .isLength({ min: 2 })
  //   .withMessage("Product slug is required"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
  body("price")
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  // body("category")
  //   .trim()
  //   .isLength({ min: 2 })
  //   .withMessage("Category is required"),
  // body("imageUrl").isURL().withMessage("Please provide a valid image URL"),
  body("stockQuantity")
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be a non-negative integer"),
];

// Public routes
router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/featured", getFeaturedProducts);
router.get("/trending", getTrendingProducts);
router.get("/bestsellers", getBestSellerProducts);
router.get("/newarrivals", getNewArrivalProducts);
router.get("/:slug", getProduct);
router.get("/:slug/similar", getSimilarProducts);
router.get("/category/:categoryId", getCategoryProducts);
router.post("/:slug/reviews", protect, createProductReview);
router.get("/categories", getCategories);
router.get("/banners/active", async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ priority: 1 });
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Admin routes
router.post("/", protect, admin, productValidation, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.get("/import/sample-csv", protect, admin, downloadSampleCSV);
router.post(
  "/import/preview",
  protect,
  admin,
  uploadCsv.single("csvFile"),
  previewCSVImport
);
router.post("/import/confirm", protect, admin, confirmCSVImport);
// router.post(
//   "/upload-image",
//   protect,
//   admin,
//   uploadImage.array("images", 6),
//   (req, res) => {
//     if (!req.files?.length) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No files uploaded" });
//     }
//     const urls = req.files.map((f) => `/uploads/products/${f.filename}`);
//     res.json({ success: true, urls });
//   }
// );
router.post(
  "/upload-image",
  protect,
  admin,
  uploadImage.array("images", 6),
  (req, res) => {
    if (!req.files?.length) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }
    const urls = req.files.map((f) => `/uploads/products/${f.filename}`);
    res.json({ success: true, urls });
  }
);

module.exports = router;
