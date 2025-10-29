// File: apps/server/src/controllers/orderController.js

const Order = require("../models/Order");
const Product = require("../models/Product");
const { validationResult } = require("express-validator");

// @desc    Create a new order (for guests or logged-in users)
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { items, customerDetails } = req.body;

    let totalAmount = 0;
    const orderProducts = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} not found or is inactive.`,
        });
      }

      if (typeof product.price !== "number" || isNaN(product.price)) {
        return res.status(500).json({
          success: false,
          message: `Product '${product.name}' has an invalid price in the database.`,
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}.`,
        });
      }

      totalAmount += product.price * item.quantity;

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        size: item.size,
      });

      product.stockQuantity -= item.quantity;
      await product.save();
    }

    const orderData = {
      products: orderProducts,
      totalAmount,
      orderNumber: `BB-${Date.now()}-${Math.random()
        .toString(36)
        .toUpperCase()}`,
      shippingAddress: {
        fullName: customerDetails.fullName,
        address: customerDetails.address,
        city: customerDetails.city,
        postalCode: customerDetails.postalCode,
        phone: customerDetails.phone,
        country: customerDetails.country,
      },
      paymentMethod: "COD",
      status: "Pending",
      statusHistory: [{ status: "Pending", timestamp: new Date() }],
    };

    if (req.user) {
      orderData.user = req.user._id;
    } else {
      orderData.phone = customerDetails.phone;
    }

    const order = await Order.create(orderData);
    await order.populate("products.product", "name images");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: order._id,
      data: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Data validation failed",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// @desc    Get user orders (authenticated or by phone number)
// @route   GET /api/orders/my-orders
// @access  Private (or public with phone query)
const getUserOrders = async (req, res) => {
  try {
    const { phone } = req.query;
    let query = {};
    console.log("getUserOrders - Headers:", req.headers);
    console.log("getUserOrders - Query:", req.query);
    console.log("getUserOrders - User:", req.user, "Phone:", phone);

    if (req.user) {
      query.user = req.user._id;
    } else if (phone) {
      query.phone = phone;
    } else {
      return res.status(400).json({
        success: false,
        message: "Authentication or phone number required",
      });
    }

    const orders = await Order.find(query)
      .populate("products.product", "name images")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("getUserOrders error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .populate("user", "name email, phone")
      .populate("products.product", "name images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Public
const getOrder = async (req, res) => {
  try {
    const { phone } = req.query;
    console.log("getOrder - query: ", req.query);
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("products.product", "name images");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // For guest access, verify phone matches
    if (!req.user && phone && order.phone !== phone) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Phone number does not match order",
      });
    }

    // For authenticated users, verify user ownership
    if (
      req.user &&
      order.user &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: User does not own this order",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    order.statusHistory.push({ status, timestamp: new Date(), note });
    await order.save();

    await order.populate("products.product", "name images");

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Merge guest orders to user account
// @route   POST /api/orders/merge
// @access  Private
const mergeGuestOrders = async (req, res) => {
  try {
    const { guestEmail } = req.body;
    if (!guestEmail) {
      return res.status(400).json({
        success: false,
        message: "Guest email is required",
      });
    }

    const result = await Order.updateMany(
      { guestEmail, user: null },
      { $set: { user: req.user._id }, $unset: { guestEmail: "" } }
    );

    res.json({
      success: true,
      message: `Merged ${result.modifiedCount} orders successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  getUserOrders,
  mergeGuestOrders,
};
