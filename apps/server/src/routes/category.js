// apps/server/src/routes/category.js

const express = require("express");
const {
  getPublicCategories,
  getCategoryBySlug,
} = require("../controllers/categoryController");

const router = express.Router();

// This endpoint is used by the product filter on the shop page
router.get("/categories", getPublicCategories);
router.route("/:slug").get(getCategoryBySlug);

module.exports = router;
