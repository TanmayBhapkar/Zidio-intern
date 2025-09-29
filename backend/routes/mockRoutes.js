// backend/routes/mockRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Reference to the mock database (will be set in server.js)
let mockDB;

export const setMockDB = (db) => {
  mockDB = db;
};

// Middleware to verify token
const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = mockDB.users.find((u) => u._id === decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Not authorized" });
  }
};

// --------------------- AUTH ROUTES ---------------------
router.post("/auth/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (mockDB.users.find((user) => user.email === email)) {
    return res.status(400).json({ success: false, error: "User already exists" });
  }

  const newUser = {
    _id: uuidv4(),
    name,
    email,
    password: password || "password123",
    role: "user",
    createdAt: new Date().toISOString(),
  };

  mockDB.users.push(newUser);

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || "secret", {
    expiresIn: process.env.JWT_EXPIRE || "1h",
  });

  res.status(201).json({ success: true, token, user: newUser });
});

router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = mockDB.users.find((u) => u.email === email);
  if (!user || (user.password && password !== user.password)) {
    return res.status(401).json({ success: false, error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
    expiresIn: process.env.JWT_EXPIRE || "1h",
  });

  res.status(200).json({ success: true, token, user });
});

// --------------------- BLOG ROUTES ---------------------
router.get("/blogs", (req, res) => {
  res.status(200).json({ success: true, count: mockDB.blogs.length, data: mockDB.blogs });
});

router.get("/blogs/:id", (req, res) => {
  const blog = mockDB.blogs.find((b) => b._id === req.params.id);
  if (!blog) return res.status(404).json({ success: false, error: "Blog not found" });
  res.status(200).json({ success: true, data: blog });
});

router.post("/blogs", protect, (req, res) => {
  const { title, content, tags, images } = req.body;

  const newBlog = {
    _id: uuidv4(),
    title,
    content,
    tags: tags || [],
    images: images || [],
    author: { _id: req.user._id, name: req.user.name, email: req.user.email },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: "Other",
    likes: [],
    comments: [],
  };

  mockDB.blogs.push(newBlog);
  res.status(201).json({ success: true, data: newBlog });
});

router.put("/blogs/:id", protect, (req, res) => {
  const { title, content, tags, images, replaceImages } = req.body;

  const blogIndex = mockDB.blogs.findIndex((b) => b._id === req.params.id);
  if (blogIndex === -1) return res.status(404).json({ success: false, error: "Blog not found" });

  const blog = mockDB.blogs[blogIndex];
  blog.title = title || blog.title;
  blog.content = content || blog.content;
  blog.tags = tags || blog.tags;
  blog.updatedAt = new Date().toISOString();

  if (images) {
    blog.images = replaceImages === "true" ? images : [...blog.images, ...images];
  }

  mockDB.blogs[blogIndex] = blog;
  res.status(200).json({ success: true, data: blog });
});

router.delete("/blogs/:id", protect, (req, res) => {
  const blogIndex = mockDB.blogs.findIndex((b) => b._id === req.params.id);
  if (blogIndex === -1) return res.status(404).json({ success: false, error: "Blog not found" });

  mockDB.blogs.splice(blogIndex, 1);
  res.status(200).json({ success: true, data: {} });
});

// --------------------- UPLOAD ROUTE ---------------------
router.post("/upload", protect, (req, res) => {
  // Mock successful upload
  res.status(200).json({
    success: true,
    url: "https://res.cloudinary.com/demo/image/upload/v1612345678/blogging-platform/mock-image.jpg",
    public_id: "blogging-platform/mock-image",
  });
});

export default router;