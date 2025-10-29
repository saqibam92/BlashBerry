const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");

const connectDB = require("./config/database");
const { loadRoutes } = require("./routes");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5000;

    require("dotenv").config({
      path: path.resolve(__dirname, "../.env"),
    });

    this.connectToDatabase();
    this.createUploadDirectories();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  connectToDatabase() {
    connectDB();
  }

  createUploadDirectories() {
    const directories = [
      path.join(__dirname, "../../client/public/uploads/products"),
      path.join(__dirname, "../../client/public/uploads/csv"),
      path.join(__dirname, "../../client/public/uploads/categories"),
      path.join(__dirname, "../../client/public/uploads/banners"),
    ];

    directories.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log("📁 Created directory:", dir);
      }
    });
  }

  initializeMiddleware() {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3005",
    ];

    // Core Security & CORS
    this.app.use(
      helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
      })
    );

    this.app.use(
      cors({
        origin: function (origin, callback) {
          if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(
              new Error(
                "The CORS policy for this site does not allow access from your origin."
              ),
              false
            );
          }
        },
        credentials: true,
      })
    );

    // Body Parsers
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Serve static files from uploads directory
    this.app.use(
      "/uploads",
      express.static(path.join(__dirname, "../../client/public/uploads"))
    );
    this.app.use(express.static("public"));

    // Rate Limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);

    // Logging
    if (process.env.NODE_ENV === "development") {
      this.app.use(morgan("dev"));
    }
  }

  initializeRoutes() {
    loadRoutes(this.app);
  }

  initializeErrorHandling() {
    // 404 handler for API routes
    this.app.use((req, res, next) => {
      res.status(404).json({
        success: false,
        message: `API endpoint not found: ${req.originalUrl}`,
      });
    });

    // Global error handling middleware
    this.app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        success: false,
        message: err.message || "Something went wrong!",
      });
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 BlashBerry server running on port ${this.port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  }
}

module.exports = Server;

// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const rateLimit = require("express-rate-limit");
// const fs = require("fs");
// const path = require("path");

// const connectDB = require("./config/database");
// const { loadRoutes } = require("./routes"); // We will create this loader next

// class Server {
//   constructor() {
//     this.app = express();
//     this.port = process.env.PORT || 5000;

//     // Load environment variables reliably
//     require("dotenv").config({
//       path: path.resolve(__dirname, "../.env"),
//     });

//     this.connectToDatabase();
//     this.initializeMiddleware();
//     this.initializeRoutes();
//     this.initializeErrorHandling();
//   }

//   connectToDatabase() {
//     connectDB();
//   }

//   initializeMiddleware() {
//     const uploadsDir = path.join(__dirname, "uploads", "products");
//     if (!fs.existsSync(uploadsDir)) {
//       fs.mkdirSync(uploadsDir, { recursive: true });
//       console.log("📁 Created uploads directory:", uploadsDir);
//     }

//     // Define the whitelist of allowed origins
//     const allowedOrigins = [
//       process.env.CLIENT_URL,
//       "http://localhost:3000",
//       "http://localhost:3001",
//       "http://localhost:3005",
//     ];

//     // Core Security & CORS (must come first)
//     this.app.use(helmet());
//     this.app.use(
//       cors({
//         origin: function (origin, callback) {
//           if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//             callback(null, true);
//           } else {
//             callback(
//               new Error(
//                 "The CORS policy for this site does not allow access from your origin."
//               ),
//               false
//             );
//           }
//         },
//         credentials: true,
//       })
//     );

//     // Body Parsers
//     this.app.use(express.json({ limit: "10mb" }));
//     this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
//     this.app.use(express.static("public"));

//     // Rate Limiting
//     const limiter = rateLimit({
//       windowMs: 15 * 60 * 1000,
//       max: 200,
//       standardHeaders: true,
//       legacyHeaders: false,
//     });
//     this.app.use(limiter);

//     // Logging
//     if (process.env.NODE_ENV === "development") {
//       this.app.use(morgan("dev"));
//     }
//   }

//   initializeRoutes() {
//     loadRoutes(this.app); // Use the centralized route loader
//   }

//   initializeErrorHandling() {
//     // 404 handler for API routes
//     this.app.use((req, res, next) => {
//       res.status(404).json({
//         success: false,
//         message: `API endpoint not found: ${req.originalUrl}`,
//       });
//     });

//     // Final, global error handling middleware (for 500 errors)
//     this.app.use((err, req, res, next) => {
//       console.error(err.stack);
//       res.status(500).json({
//         success: false,
//         message: "Something went wrong!",
//       });
//     });
//   }

//   listen() {
//     this.app.listen(this.port, () => {
//       console.log(`🚀 BlashBerry server running on port ${this.port}`);
//       console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
//     });
//   }
// }

// module.exports = Server;
