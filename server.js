// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

import mockRoutes, { setMockDB } from "./backend/routes/mockRoutes.js";

// Setup ES module paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("Using mock data instead of MongoDB");

// Mock database
const mockDB = {
  users: [
    {
      _id: "Tanmay",
      name: "User",
      email: "test@example.com",
      password: "password123",
      role: "user",
      createdAt: new Date().toISOString(),
    },
  ],
  blogs: [],
};

// Set mock database
setMockDB(mockDB);

// Routes
app.use("/api", mockRoutes);

// Basic test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Blogging Platform API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Server Error",
    message:
      process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
