// File: apps/server/src/routes/video.js

const express = require("express");
const {
  getVideos,
  getSelectedVideo,
  createVideo,
  updateVideo,
  deleteVideo,
} = require("../controllers/videoController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

router.get("/", getSelectedVideo);
router.get("/admin", protect, admin, getVideos);
router.post("/", protect, admin, createVideo);
router.put("/:id", protect, admin, updateVideo);
router.delete("/:id", protect, admin, deleteVideo);

module.exports = router;
