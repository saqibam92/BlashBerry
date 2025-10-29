// apps/server/src/controllers/categoryController.js

const Category = require("../models/Category");

// Fetches all active categories for public display (e.g., in filters)
exports.getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ priority: 1 })
      .select("name slug image _id");
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc    Fetch a single category by its slug
 * @route   GET /api/categories/:slug
 * @access  Public
 */
exports.getCategoryBySlug = async (req, res, next) => {
  const { slug } = req.params;
  const category = await Category.findOne({ slug, isActive: true });

  if (!category) {
    return next(new AppError("No category found with that slug", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
};
