// File: apps/server/src/middleware/multerUpload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

// 1. Configure Cloudinary
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (!isCloudinaryConfigured) {
  // Log an error if credentials are missing. This is often the cause of 500s.
  console.error("🚨 CLOUDINARY CREDENTIALS MISSING. IMAGE UPLOADS WILL FAIL.");
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// --- Multer for Image Upload (Cloudinary Storage) ---
const imageStorage = isCloudinaryConfigured
  ? new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: "blashberry/products", // Define a folder in Cloudinary
        allowed_formats: ["jpeg", "jpg", "png", "webp"],
        transformation: [{ width: 500, crop: "limit" }],
      },
    })
  : multer.diskStorage({
      // Fallback to a dummy storage to prevent app crash
      destination: (req, file, cb) =>
        cb(new Error("Cloudinary not configured!"), false),
      filename: (req, file, cb) =>
        cb(new Error("Cloudinary not configured!"), false),
    });

exports.uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// --- Multer for Product Image Upload ---
// const imageStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = path.join(__dirname, "../../public/uploads/products");
//     // const dir = path.join(__dirname, "../../../client/public/uploads/products");
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
//   },
// });

// exports.uploadImage = multer({
//   storage: imageStorage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter: (req, file, cb) => {
//     const allowed = /jpeg|jpg|png|webp/;
//     const ext = path.extname(file.originalname).toLowerCase();
//     const mime = file.mimetype;
//     if (allowed.test(ext) && allowed.test(mime)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only images (jpeg, jpg, png, webp) allowed"));
//     }
//   },
// });

// --- Multer for CSV Upload ---
const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/csv/"; // Temporary server directory
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

exports.uploadCsv = multer({ storage: csvStorage });
