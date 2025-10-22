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

      // --- ROBUSTNESS FIX ---
      // Ensure the product price is a valid number before calculation.
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
      shippingAddress: {
        fullName: customerDetails.fullName,
        address: customerDetails.address,
        city: customerDetails.city,
        postalCode: customerDetails.postalCode,
        phone: customerDetails.phone,
        country: customerDetails.country,
      },
      paymentMethod: "COD",
    };

    if (req.user) {
      orderData.user = req.user._id;
    } else {
      orderData.guestEmail = customerDetails.email;
    }

    const order = await Order.create(orderData);
    await order.populate("products.product", "name imageUrl");

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

// const createOrder = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: "Validation failed",
//         errors: errors.array(),
//       });
//     }

//     const { items, customerDetails } = req.body;

//     let totalAmount = 0;
//     const orderProducts = [];

//     for (const item of items) {
//       const product = await Product.findById(item.product);

//       if (!product || !product.isActive) {
//         return res.status(404).json({
//           success: false,
//           message: `Product with ID ${item.product} not found or is inactive.`,
//         });
//       }

//       // --- ROBUSTNESS FIX ---
//       // Ensure the product price is a valid number before calculation.
//       if (typeof product.price !== "number" || isNaN(product.price)) {
//         return res.status(500).json({
//           success: false,
//           message: `Product '${product.name}' has an invalid price in the database.`,
//         });
//       }

//       if (product.stockQuantity < item.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient stock for ${product.name}.`,
//         });
//       }

//       totalAmount += product.price * item.quantity;

//       orderProducts.push({
//         product: product._id,
//         quantity: item.quantity,
//         price: product.price,
//         size: item.size,
//       });

//       product.stockQuantity -= item.quantity;
//       await product.save();
//     }

//     const orderData = {
//       products: orderProducts,
//       totalAmount,
//       shippingAddress: {
//         fullName: customerDetails.fullName,
//         address: customerDetails.address,
//         city: customerDetails.city,
//         postalCode: customerDetails.postalCode,
//         phone: customerDetails.phone,
//       },
//       paymentMethod: "COD",
//     };

//     if (req.user) {
//       orderData.user = req.user._id;
//     } else {
//       orderData.guestEmail = customerDetails.email;
//     }

//     const order = await Order.create(orderData);
//     await order.populate("products.product", "name imageUrl");

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       orderId: order._id,
//       data: order,
//     });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error: " + error.message,
//     });
//   }
// };

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("products.product", "name imageUrl")
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

// Get single order
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("products.product", "name images");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // For now, allow public access to order by ID for guest confirmation page.
    // When you add user auth, you will add a check here.

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

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("products.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
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

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product", "name imageUrl")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
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
};
