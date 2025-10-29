const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      let token;

      token = req.headers.authorization.split(" ")[1];

      console.log("Auth middleware - Token:", token);

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, no token",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Auth middleware - Decoded:", decoded);

      req.user = await User.findById(decoded.id).select("-password");
      console.log("Auth middleware - User:", req.user);

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  } else {
    console.log("Auth middleware - No token provided"); // Debug log
    next(); // Allow unauthenticated access for guestEmail routes
  }
};

// const protect = (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       console.log("Auth middleware - Token:", token);

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log("Auth middleware - Decoded:", decoded);

//       User.findById(decoded.id)
//         .select("-password")
//         .exec((err, user) => {
//           if (err) {
//             console.error("Auth middleware error:", err.message);
//             return res.status(401).json({
//               success: false,
//               message: "Not authorized, token failed",
//             });
//           }
//           if (!user) {
//             return res.status(401).json({
//               success: false,
//               message: "User not found",
//             });
//           }
//           req.user = user;
//           console.log("Auth middleware - User:", req.user);
//           next();
//         });
//     } catch (error) {
//       console.error("Auth middleware error:", error.message);
//       return res.status(401).json({
//         success: false,
//         message: "Not authorized, token failed",
//       });
//     }
//   } else {
//     console.log("Auth middleware - No token provided");
//     next();
//   }
// };

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. Admin role required.",
    });
  }
};

module.exports = { protect, admin };
