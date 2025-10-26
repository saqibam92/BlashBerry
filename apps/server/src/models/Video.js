// File: apps/server/src/models/Video.js

const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Video title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    url: {
      type: String,
      required: [true, "Video URL is required"],
      trim: true,
      match: [
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|facebook\.com|instagram\.com)/,
        "Please provide a valid YouTube, Facebook, or Instagram URL",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Ensure only one video is selected at a time
videoSchema.pre("save", async function (next) {
  if (this.isSelected) {
    await this.model("Video").updateMany(
      { _id: { $ne: this._id }, isSelected: true },
      { isSelected: false }
    );
  }
  next();
});

module.exports = mongoose.model("Video", videoSchema);
