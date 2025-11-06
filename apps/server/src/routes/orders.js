// File: apps/server/src/routes/order.js

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  createOrder,
  getAllOrders,
  getOrder,
  getUserOrders,
  updateOrderStatus,
  mergeGuestOrders,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/auth");

// Validation rules for creating an order
const createOrderValidation = [
  body("customerDetails.fullName", "Full name is required").not().isEmpty(),
  body("customerDetails.phone", "Please provide a valid Phone number").matches(
    /^(\+8801\d{9}|01\d{9})$/
  ),
  body("customerDetails.address", "Address is required").not().isEmpty(),
  // body("customerDetails.city", "City is required").not().isEmpty(),
  // body("customerDetails.postalCode", "Postal code is required").not().isEmpty(),
  // body("customerDetails.country", "Country is required").not().isEmpty(),
  body("items", "Your cart is empty").isArray({ min: 1 }),
];

// POST /api/orders - Create a new order (public for guests and logged-in users)
router.post("/", createOrderValidation, createOrder);

// GET /api/orders/my-orders - Get user orders (authenticated or by phone)
router.get("/my-orders", getUserOrders);

// GET /api/orders/:id - Get a single order (public for guest confirmation)
router.get("/:id", getOrder);

// --- Admin Only Routes ---
router.get("/", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);
router.post("/merge", protect, mergeGuestOrders);

module.exports = router;
