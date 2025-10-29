// File: apps/server/src/models/Product.js
// apps/server/src/models/Product.js
const mongoose = require("mongoose");
const slugify = require("slugify").default;

// --- Review Schema (unchanged) ---
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    model: { type: String, trim: true }, // NEW
    images: {
      type: [String],
      required: true,
      validate: [(v) => v.length > 0 && v.length <= 6, "1–6 images required"],
    },
    description: { type: String, required: true },

    details: {
      material: { type: String, trim: true },
      braDesign: { type: String, trim: true },
      supportType: { type: String, trim: true },
      cupShape: { type: String, trim: true },
      closureType: { type: String, trim: true },
      strapType: { type: String, trim: true },
      decoration: { type: String, trim: true },
      feature: { type: String, trim: true },
      pantyType: { type: String, trim: true },
      riseType: { type: String, trim: true },
      removablePads: { type: Boolean, default: false },
      ecoFriendly: { type: Boolean, default: false },
      oemOdm: { type: Boolean, default: false },
      sampleLeadTime: { type: String, trim: true },
      origin: { type: String, trim: true },
    },

    price: { type: Number, required: true, min: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stockQuantity: { type: Number, required: true, default: 0, min: 0 },
    brand: { type: String, trim: true },
    sku: { type: String, trim: true, sparse: true },
    // sku: { type: String, trim: true, unique: true, sparse: true },
    tags: [{ type: String, trim: true }],
    discount: {
      discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "percentage",
      },
      discountAmount: { type: Number, default: 0 },
    },
    colors: [{ type: String, trim: true }],
    unit: { type: String, default: "pc" },
    sizes: [{ type: String }],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// --- Pre-save: slug + discount normalization ---
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

productSchema.pre("validate", function (next) {
  if (this.discount?.discountType) {
    const lower = this.discount.discountType.toLowerCase();
    if (["percent", "percentage"].includes(lower))
      this.discount.discountType = "percentage";
    else if (["fixed", "amount"].includes(lower))
      this.discount.discountType = "fixed";
  }
  next();
});

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, price: 1, rating: -1 });

module.exports = mongoose.model("Product", productSchema);
