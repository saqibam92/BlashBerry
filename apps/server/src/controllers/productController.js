// File: apps/server/src/controllers/productController.js

const Category = require("../models/Category");
const Product = require("../models/Product");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

// Configure multer for CSV upload
const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/csv/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage: csvStorage });

// --- Multer for image upload ---
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../../../client/public/uploads/products");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
  },
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    if (allowed.test(ext) && allowed.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png, webp) allowed"));
    }
  },
});

// Get all products with filtering and pagination
const getProducts = async (req, res) => {
  try {
    const {
      category,
      size,
      minPrice,
      maxPrice,
      rating,
      sort = "createdAt",
      page = 1,
      limit = 12,
      search,
    } = req.query;

    let query = { isActive: true };

    if (category) {
      query.category = { $in: category.split(",") };
    }
    if (size) query.sizes = { $in: [size] };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) query.rating = { $gte: Number(rating) };
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    let sortObj = {};
    switch (sort) {
      case "price_asc":
        sortObj.price = 1;
        break;
      case "price_desc":
        sortObj.price = -1;
        break;
      case "rating":
        sortObj.rating = -1;
        break;
      case "newest":
        sortObj.createdAt = -1;
        break;
      default:
        sortObj.createdAt = -1;
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .populate("category", "name")
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { term } = req.query;
    if (!term) {
      return res.json({ success: true, data: [] });
    }

    const products = await Product.find({
      name: { $regex: term, $options: "i" },
      isActive: true,
    }).limit(4);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate("category", "name");

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
    }).limit(8);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isTrending: true, isActive: true })
      .limit(10)
      .sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBestSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true, isActive: true })
      .limit(10)
      .sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getNewArrivalProducts = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true, isActive: true })
      .limit(10)
      .sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSimilarProducts = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product || !product.category) {
      return res
        .status(404)
        .json({ success: false, message: "Product or category not found" });
    }

    const similarProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .populate("category", "name")
      .limit(4);

    res.json({ success: true, data: similarProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const importProductsCSV = (req, res) => {
  upload.single("csvFile")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: "Upload failed" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No CSV file uploaded" });
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          const products = results.map((row) => ({
            name: row.name,
            description: row.description,
            price: parseFloat(row.price),
            stockQuantity: parseInt(row.stockQuantity),
            category: row.categoryId,
            images: [row.imageUrl],
            brand: row.brand,
            sku: row.sku,
            sizes: row.sizes ? row.sizes.split(",") : [],
            colors: row.colors ? row.colors.split(",") : [],
            tags: row.tags ? row.tags.split(",") : [],
            details: {
              material: row.material,
              model: row.model,
              braDesign: row.braDesign,
              supportType: row.supportType,
              cupShape: row.cupShape,
              closureType: row.closureType,
              strapType: row.strapType,
              decoration: row.decoration,
              feature: row.feature,
              pantyType: row.pantyType,
              riseType: row.riseType,
              removablePads: row.removablePads === "true",
              ecoFriendly: row.ecoFriendly === "true",
              oemOdm: row.oemOdm === "true",
              sampleLeadTime: row.sampleLeadTime,
              origin: row.origin,
            },
            isActive: true,
            isFeatured: false,
          }));

          const inserted = await Product.insertMany(products);
          fs.unlinkSync(req.file.path);

          res.json({
            success: true,
            message: `${inserted.length} products imported`,
            data: inserted,
          });
        } catch (error) {
          fs.unlinkSync(req.file.path);
          res.status(500).json({ success: false, message: error.message });
        }
      });
  });
};

const previewCSVImport = (req, res) => {
  upload.single("csvFile")(req, res, async (err) => {
    if (err || !req.file) {
      return res
        .status(400)
        .json({ success: false, message: "CSV upload failed" });
    }

    const results = [];
    const errors = [];
    let rowNum = 1;

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        rowNum++;
        const product = {
          name: row.name?.trim(),
          description: row.description?.trim(),
          price: parseFloat(row.price),
          stockQuantity: parseInt(row.stockQuantity),
          category: row.categoryId?.trim(),
          images: row.imageUrl ? [row.imageUrl.trim()] : [],
          brand: row.brand?.trim(),
          sku: row.sku?.trim(),
          sizes: row.sizes ? row.sizes.split(",").map((s) => s.trim()) : [],
          colors: row.colors ? row.colors.split(",").map((c) => c.trim()) : [],
          tags: row.tags ? row.tags.split(",").map((t) => t.trim()) : [],
          details: {
            material: row.material?.trim(),
            model: row.model?.trim(),
            braDesign: row.braDesign?.trim(),
            supportType: row.supportType?.trim(),
            cupShape: row.cupShape?.trim(),
            closureType: row.closureType?.trim(),
            strapType: row.strapType?.trim(),
            decoration: row.decoration?.trim(),
            feature: row.feature?.trim(),
            pantyType: row.pantyType?.trim(),
            riseType: row.riseType?.trim(),
            removablePads: row.removablePads === "true",
            ecoFriendly: row.ecoFriendly === "true",
            oemOdm: row.oemOdm === "true",
            sampleLeadTime: row.sampleLeadTime?.trim(),
            origin: row.origin?.trim(),
          },
        };

        if (!product.name) errors.push(`Row ${rowNum}: Name missing`);
        if (isNaN(product.price)) errors.push(`Row ${rowNum}: Invalid price`);
        if (isNaN(product.stockQuantity))
          errors.push(`Row ${rowNum}: Invalid stock`);
        if (!product.category)
          errors.push(`Row ${rowNum}: Category ID missing`);

        results.push(product);
      })
      .on("end", () => {
        fs.unlinkSync(req.file.path);
        res.json({
          success: true,
          preview: results.slice(0, 10),
          total: results.length,
          errors,
        });
      });
  });
};

const confirmCSVImport = async (req, res) => {
  const { products } = req.body;
  try {
    const inserted = await Product.insertMany(products);
    res.json({
      success: true,
      message: `${inserted.length} products imported`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { slug } = req.params;

  if (!rating || !comment) {
    return res
      .status(400)
      .json({ success: false, message: "Rating and comment are required." });
  }

  try {
    const product = await Product.findOne({ slug });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ success: false, message: "Product already reviewed" });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res
      .status(201)
      .json({ success: true, message: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCategoryProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, sort = "createdAt", search } = req.query;
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    let query = { isActive: true, category: categoryId };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    let sortObj = {};
    switch (sort) {
      case "price_asc":
        sortObj.price = 1;
        break;
      case "price_desc":
        sortObj.price = -1;
        break;
      case "rating":
        sortObj.rating = -1;
        break;
      case "newest":
        sortObj.createdAt = -1;
        break;
      default:
        sortObj.createdAt = -1;
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .populate("category", "name")
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category", { isActive: true });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getProducts,
  searchProducts,
  getProduct,
  getFeaturedProducts,
  getTrendingProducts,
  getBestSellerProducts,
  getNewArrivalProducts,
  getSimilarProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getCategories,
  getCategoryProducts,
  importProductsCSV,
  uploadImage,
  previewCSVImport,
  confirmCSVImport,
};
