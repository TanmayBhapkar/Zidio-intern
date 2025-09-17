import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./src/routes/auth.js";
import datasetRoutes from "./src/routes/datasets.js";
import User from "./src/models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// __dirname polyfill for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/datasets", datasetRoutes);

// Create default admin if doesn't exist
const createAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPass) {
      console.log("⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in .env");
      return;
    }

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPass, salt);

      admin = new User({
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      await admin.save();
      console.log(`✅ Admin created → Email: ${adminEmail} | Password: ${adminPass}`);
    } else {
      console.log("ℹ️  Admin user already exists");
    }
  } catch (err) {
    console.error("❌ Failed to create admin:", err.message);
  }
};

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env. Place it in backend root.");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "excel_analytics",
    });

    console.log("✅ MongoDB connected");
    await createAdmin();

    app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
