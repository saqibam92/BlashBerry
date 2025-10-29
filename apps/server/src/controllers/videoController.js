// File: apps/server/src/controllers/videoController.js

const mongoose = require("mongoose");
const Video = require("../models/Video");

// Get all videos (admin)
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new video
const createVideo = async (req, res) => {
  try {
    const { title, url, isActive } = req.body;
    const video = new Video({ title, url, isActive });
    await video.save();
    res.status(201).json({ success: true, data: video });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update a video
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid video ID" });
    }
    const video = await Video.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }
    res.json({ success: true, data: video });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a video
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid video ID" });
    }
    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }
    res.json({ success: true, message: "Video deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get the selected video (public)
const getSelectedVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ isSelected: true, isActive: true });
    res.json({ success: true, data: video || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVideos,
  getSelectedVideo,
  createVideo,
  updateVideo,
  deleteVideo,
};
