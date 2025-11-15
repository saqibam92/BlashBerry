// File: apps / server / src / routes / admin.js;

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect, admin } = require("../middleware/auth");
const {
  getDashboardStats,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  getOrders,
  updateOrderStatus,
  getUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  adminGetProductById,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerActiveStatus,
  uploadImage: handleBannerUploadController,
} = require("../controllers/adminController");
const { body } = require("express-validator");
const {
  uploadImage: productImageUploader,
  uploadCsv,
} = require("../middleware/multerUpload");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const bannerStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blashberry/banners", // Separate folder for banners
    allowed_formats: ["jpeg", "jpg", "png", "webp"],
    transformation: [{ width: 1200, crop: "limit" }],
  },
});
const bannerUpload = multer({ storage: bannerStorage });

const router = express.Router();
router.use(protect, admin);

// Validation for CREATING a product (strict)
const createProductValidation = [
  body("name").trim().notEmpty().withMessage("Product name is required."),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),
  body("category").isMongoId().withMessage("A valid category is required."),
  body("stockQuantity")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative number."),
  body("images")
    .isArray({ min: 1, max: 6 })
    .withMessage("Must have between 1 and 6 images."),
  body("images.*").isURL().withMessage("Each image must be a valid URL."),
];

// Validation for UPDATING a product (flexible)
const updateProductValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty."),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("A valid category is required."),
];

// Dashboard
router.get("/stats", getDashboardStats);

// Category Routes
router.route("/categories").get(getCategories).post(createCategory);
router.route("/categories/:id").put(updateCategory).delete(deleteCategory);

// Product Routes
router
  .route("/products")
  .get(adminGetProducts)
  .post(createProductValidation, adminCreateProduct);
router
  .route("/products/:id")
  .get(adminGetProductById)
  .put(updateProductValidation, adminUpdateProduct)
  .delete(adminDeleteProduct);

// User Routes
router.route("/users").get(getUsers).post(adminCreateUser);

router.route("/users/:id").put(adminUpdateUser).delete(adminDeleteUser);

// Order Routes
router.route("/orders").get(getOrders);
router.route("/orders/:id/status").put(updateOrderStatus);

// --- Banner Routes ---
router.route("/banners").get(getBanners).post(createBanner);

router.route("/banners/:id").put(updateBanner).delete(deleteBanner);

router.route("/banners/:id/toggle-active").put(toggleBannerActiveStatus);

// --- File Upload Route ---
// router.post(
//   "/upload/banner",
//   productImageUploader.single("file"),
//   handleBannerUploadController
// );
router.post("/upload/banner", bannerUpload.single("file"), (req, res, next) => {
  // Cloudinary saves URL to req.file.path. The controller can use this.
  req.file.imageUrl = req.file.path;
  handleBannerUploadController(req, res, next);
});

module.exports = router;
