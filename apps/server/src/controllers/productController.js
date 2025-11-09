// File: apps/server/src/controllers/productController.js

const Category = require("../models/Category");
const Product = require("../models/Product");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const { fetchPaginatedProducts } = require("../utils/pagination");
const { uploadCsv, uploadImage } = require("../middleware/multerUpload");

// --- HELPER FUNCTIONS FOR CSV IMPORT ---

// Finds a category by name, case-insensitive
const findCategoryByName = async (name) => {
  if (!name || name.trim() === "") return null;
  // Use a case-insensitive regex to find the category
  const category = await Category.findOne({
    name: { $regex: `^${name.trim()}$`, $options: "i" },
  });
  return category ? category._id : null;
};

// Splits a comma-separated string from CSV into a trimmed array
const parseCsvArray = (str) => {
  if (!str) return [];
  return str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

// Parses all dynamic 'details.' columns from a CSV row
const parseDetails = (row) => {
  const details = {};
  for (const key in row) {
    if (key.startsWith("details.")) {
      const detailKey = key.substring(8); // Get key name after "details."
      if (row[key] && row[key].trim() !== "") {
        details[detailKey] = row[key].trim();
      }
    }
  }
  return details;
};

// Get all products with filtering and pagination
// const getProducts = async (req, res) => {
//   try {
//     const {
//       category,
//       size,
//       minPrice,
//       maxPrice,
//       rating,
//       sort = "createdAt",
//       page = 1,
//       limit = 12,
//       search,
//       onSale,
//       isNewArrival,
//     } = req.query;

//     let query = { isActive: true };

//     if (category) {
//       query.category = { $in: category.split(",") };
//     }
//     if (size) query.sizes = { $in: [size] };
//     if (minPrice || maxPrice) {
//       query.price = {};
//       if (minPrice) query.price.$gte = Number(minPrice);
//       if (maxPrice) query.price.$lte = Number(maxPrice);
//     }
//     if (rating) query.rating = { $gte: Number(rating) };
//     if (search) {
//       query.name = { $regex: search, $options: "i" };
//     }
//     if (onSale === "true") {
//       query["discount.discountAmount"] = { $gt: 0 };
//     }

//     if (isNewArrival === "true") {
//       query.isNewArrival = true;
//     }

//     let sortObj = {};
//     switch (sort) {
//       case "price_asc":
//         sortObj.price = 1;
//         break;
//       case "price_desc":
//         sortObj.price = -1;
//         break;
//       case "rating":
//         sortObj.rating = -1;
//         break;
//       case "newest":
//         sortObj.createdAt = -1;
//         break;
//       default:
//         sortObj.createdAt = -1;
//     }

//     const skip = (page - 1) * limit;
//     const products = await Product.find(query)
//       .populate("category", "name")
//       .sort(sortObj)
//       .skip(skip)
//       .limit(Number(limit));

//     const total = await Product.countDocuments(query);

//     res.json({
//       success: true,
//       data: products,
//       pagination: {
//         current: Number(page),
//         pages: Math.ceil(total / limit),
//         total,
//         hasNext: page * limit < total,
//         hasPrev: page > 1,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// Get products with cursor-based pagination
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      sort = "newest",
      category,
      onSale,
      isNewArrival,
      minPrice,
      maxPrice,
      color,
    } = req.query;

    const queryLimit = parseInt(limit);
    const skip = (parseInt(page) - 1) * queryLimit;

    // Build the query object
    const query = { isActive: true };
    if (category && category !== "undefined") {
      query.category = { $in: category.split(",") };
    }
    if (onSale === "true") {
      query["discount.discountAmount"] = { $gt: 0 };
    }
    if (isNewArrival === "true") {
      query.isNewArrival = true;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (color && color !== "undefined") {
      query.colors = { $in: color.split(",") };
    }

    // Build the sort object
    let sortObj = {};
    switch (sort) {
      case "price_asc":
        sortObj = { price: 1 };
        break;
      case "price_desc":
        sortObj = { price: -1 };
        break;
      case "rating":
        sortObj = { rating: -1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "newest":
      default:
        sortObj = { createdAt: -1 };
    }

    // Execute queries in parallel
    const [data, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name")
        .sort(sortObj)
        .skip(skip)
        .limit(queryLimit),
      Product.countDocuments(query),
    ]);

    const pages = Math.ceil(total / queryLimit);
    const hasNext = Number(page) < pages;
    const hasPrev = Number(page) > 1;

    res.json({
      success: true,
      data,
      pagination: {
        current: Number(page),
        limit: queryLimit,
        total,
        pages,
        hasNext,
        hasPrev,
      },
    });
  } catch (err) {
    console.error("getAllProducts error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
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

// NEW API: Download Sample CSV
// ---
const downloadSampleCSV = (req, res) => {
  const filePath = path.join(
    __dirname,
    "../../../server/public/csv-template.csv"
  );
  console.log("file path: ", filePath);

  if (!fs.existsSync(filePath)) {
    return res
      .status(404)
      .json({ success: false, message: "Sample file not found." });
  }

  res.download(filePath, "blashberry-product-template.csv", (err) => {
    if (err) {
      console.error("Error downloading CSV:", err);
      res
        .status(500)
        .json({ success: false, message: "Could not download file." });
    }
  });
};

// ---
// PREVIEW CSV
// ---
const previewCSVImport = (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No CSV file uploaded" });
  }

  const results = [];
  const errors = [];
  let rowNum = 1;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      rowNum++;
      let rowError = false;

      // Basic Validation
      if (!row.name || row.name.trim() === "") {
        errors.push(`Row ${rowNum}: 'name' is missing.`);
        rowError = true;
      }
      if (isNaN(parseFloat(row.price))) {
        errors.push(`Row ${rowNum}: 'price' is missing or invalid.`);
        rowError = true;
      }
      if (isNaN(parseInt(row.stockQuantity))) {
        errors.push(`Row ${rowNum}: 'stockQuantity' is missing or invalid.`);
        rowError = true;
      }
      if (!row.categoryName || row.categoryName.trim() === "") {
        errors.push(`Row ${rowNum}: 'categoryName' is missing.`);
        rowError = true;
      }

      if (!rowError) {
        // Process data for preview
        const productPreview = {
          name: row.name.trim(),
          description: row.description?.trim(),
          price: parseFloat(row.price),
          stockQuantity: parseInt(row.stockQuantity),
          categoryName: row.categoryName.trim(), // Keep name for confirm step
          sku: row.sku?.trim(),
          model: row.model?.trim(),
          brand: row.brand?.trim(),
          images: parseCsvArray(row.images),
          sizes: parseCsvArray(row.sizes),
          colors: parseCsvArray(row.colors),
          tags: parseCsvArray(row.tags),
          isFeatured: row.isFeatured?.toLowerCase() === "true",
          isNewArrival: row.isNewArrival?.toLowerCase() === "true",
          isTrending: row.isTrending?.toLowerCase() === "true",
          isBestSeller: row.isBestSeller?.toLowerCase() === "true",
          details: parseDetails(row),
        };
        results.push(productPreview);
      }
    })
    .on("end", () => {
      fs.unlinkSync(req.file.path);
      console.log("previewCSVImport: results : ", results);
      res.json({
        success: true,
        preview: results,
        // preview: results.slice(0, 10),
        total: results.length,
        errors,
      });
    });
};

// CONFIRM & IMPORT CSV (Reads from req.body, NOT req.file)
// ---
const confirmCSVImport = async (req, res) => {
  console.log("conFirmCSVImport: req.body: ", req.body);
  const { products } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No products to import." });
  }

  let importedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < products.length; i++) {
    const row = products[i];
    const rowNum = i + 1; // Use 1-based index for errors

    try {
      // --- FIX 1: Validate required fields ---
      if (!row.name || row.name.trim() === "") {
        throw new Error(
          "Product 'name' is missing. This is required for the slug."
        );
      }
      if (row.price === undefined || isNaN(parseFloat(row.price))) {
        throw new Error("Invalid or missing 'price'.");
      }
      if (
        row.stockQuantity === undefined ||
        isNaN(parseInt(row.stockQuantity))
      ) {
        throw new Error("Invalid or missing 'stockQuantity'.");
      }

      // --- FIX 2: Find category, but don't fail ---
      let categoryId = null;
      let isActive = true;

      if (row.categoryName && row.categoryName.trim() !== "") {
        categoryId = await findCategoryByName(row.categoryName);
        if (!categoryId) {
          // Not found: Set category to null, make product inactive
          isActive = false;
          errors.push(
            `Row ${rowNum} (${row.name}): Category "${row.categoryName}" not found. Product imported as INACTIVE.`
          );
        }
      } else {
        isActive = false;
        errors.push(
          `Row ${rowNum} (${row.name}): 'categoryName' is missing. Product imported without a category.`
        );
      }

      // --- Build Product Object ---
      const productData = {
        name: row.name,
        description: row.description,
        price: row.price,
        stockQuantity: row.stockQuantity,
        category: categoryId,
        sku: row.sku || undefined,
        model: row.model,
        brand: row.brand,
        images: row.images,
        sizes: row.sizes,
        colors: row.colors,
        tags: row.tags,
        isFeatured: row.isFeatured,
        isNewArrival: row.isNewArrival,
        isTrending: row.isTrending,
        isBestSeller: row.isBestSeller,
        isActive: isActive,
        details: row.details,
      };

      // --- 3. Upsert: Update if SKU exists, Create if not ---
      if (productData.sku) {
        const result = await Product.findOneAndUpdate(
          { sku: productData.sku },
          productData,
          { upsert: true, new: true, runValidators: true }
        );
        // Check if it was an insert or an update
        if (result.createdAt.getTime() === result.updatedAt.getTime()) {
          importedCount++;
        } else {
          updatedCount++;
        }
      } else {
        // No SKU, just create a new product
        await Product.create(productData);
        importedCount++;
      }
    } catch (error) {
      errorCount++;
      errors.push(`Row ${rowNum} (${row.name || "N/A"}): ${error.message}`);
    }
  }

  res.status(201).json({
    success: true,
    message: `Import complete: ${importedCount} created, ${updatedCount} updated, ${errorCount} errors.`,
    errors,
  });
};

// ---
// UPDATED: Confirm & Import CSV
// ---

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
    const { categoryId } = req.params;
    const { cursor, sort = "createdAt", limit = 12, search } = req.query;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID" });
    }

    let query = { isActive: true, category: categoryId };
    if (search) query.name = { $regex: search, $options: "i" };

    let sortObj = {};
    switch (sort) {
      case "price_asc":
        sortObj = { price: 1, _id: 1 };
        break;
      case "price_desc":
        sortObj = { price: -1, _id: -1 };
        break;
      case "rating":
        sortObj = { rating: -1, _id: -1 };
        break;
      default:
        sortObj = { createdAt: -1, _id: -1 };
    }

    const { products, nextCursor } = await fetchPaginatedProducts(
      query,
      sortObj,
      limit,
      cursor
    );

    res.json({
      success: true,
      data: products,
      pagination: {
        limit: Number(limit),
        nextCursor,
        hasMore: Boolean(nextCursor),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
  downloadSampleCSV,
  // importProductsCSV,
  // uploadImage,
  previewCSVImport,
  confirmCSVImport,
};
