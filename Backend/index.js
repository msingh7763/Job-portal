// import express from 'express';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import connectDB from './utils/db.js';
// import userRoute from './routes/user.routes.js';

// dotenv.config();
// const app = express();

// // MIDDLEWARE
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// const corsOptions = {
//   origin: ['http://localhost:5121'],
//   credentials: true,
// };
// app.use(cors(corsOptions));

// // ROOT ROUTE
// app.get('/', (req, res) => {
//   return res.status(200).json({
//     message: 'Welcome to new project',
//     timestamp: new Date().toISOString(),
//     success: true,
//   });
// });

// // API ROUTES
// app.use('/api/users', userRoute);

// // CONNECT DB AND START SERVER
// const PORT = process.env.PORT || 5001;

// const startServer = async () => {
//   try {
//     await connectDB(); // ensure DB connects first
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   } catch (err) {
//     console.error('Failed to connect to DB:', err.message);
//     process.exit(1); // stop server if DB connection fails
//   }
// };

// startServer();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.routes.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { Company } from "./models/company.model.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5175",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  },
});

// attach io for real-time notifications
app.set("io", io);

// CORE MIDDLEWARE
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// SECURITY
app.use(helmet());
app.set("trust proxy", 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// CORS – allow your Vite frontends
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5175,http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// HEALTH CHECK / ROOT
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Job Portal backend is running",
    timestamp: new Date().toISOString(),
    success: true,
  });
});

// API ROUTES
app.use("/api/users", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);

// GLOBAL 404 + ERROR HANDLING
app.use(notFound);
app.use(errorHandler);

// SIMPLE SOCKET.IO SETUP
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// START SERVER AFTER DB CONNECTS
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    // If the old global unique index on `name` exists, drop it.
    // We now enforce uniqueness per recruiter (userId + name).
    try {
      await Company.collection.dropIndex("name_1");
      console.log("Dropped old Company name unique index (name_1)");
    } catch (err) {
      if (err?.codeName !== "IndexNotFound") {
        console.warn("Could not drop old company name index:", err.message || err);
      }
    }

    // Ensure schema indexes are in sync (creates compound userId+name unique index)
    await Company.syncIndexes();

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB:", error.message);
    process.exit(1);
  }
};

startServer();
