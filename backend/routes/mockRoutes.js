import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Reference to the mock database (will be set in server.js)
let mockDB;

export const setMockDB = (db) => {
  mockDB = db;
};

// Auth routes
router.post('/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if user exists
  const userExists = mockDB.users.find(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ success: false, error: 'User already exists' });
  }
  
  // Create new user
  const newUser = {
    _id: uuidv4(),
    name,
    email,
    role: 'user',
    createdAt: new Date().toISOString()
  };
  
  mockDB.users.push(newUser);
  
  // Create token
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
  
  res.status(201).json({
    success: true,
    token,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = mockDB.users.find(user => user.email === email);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
  
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
  
  res.status(200).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// Blog routes
router.get('/blogs', (req, res) => {
  res.status(200).json({
    success: true,
    count: mockDB.blogs.length,
    pagination: {},
    data: mockDB.blogs
  });
});

router.get('/blogs/:id', (req, res) => {
  const blog = mockDB.blogs.find(blog => blog._id === req.params.id);
  
  if (!blog) {
    return res.status(404).json({ success: false, error: 'Blog not found' });
  }
  
  res.status(200).json({
    success: true,
    data: blog
  });
});

router.post('/blogs', (req, res) => {
  const { title, content, tags, images } = req.body;
  
  // Get user from request (set by auth middleware)
  const user = req.user || mockDB.users[0];
  
  const newBlog = {
    _id: uuidv4(),
    title,
    content,
    tags: tags || [],
    images: images || [],
    author: {
      _id: user._id,
      name: user.name,
      email: user.email
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'Other',
    likes: [],
    comments: []
  };
  
  mockDB.blogs.push(newBlog);
  
  res.status(201).json({
    success: true,
    data: newBlog
  });
});

router.put('/blogs/:id', (req, res) => {
  const { title, content, tags, images, replaceImages } = req.body;
  
  const blogIndex = mockDB.blogs.findIndex(blog => blog._id === req.params.id);
  
  if (blogIndex === -1) {
    return res.status(404).json({ success: false, error: 'Blog not found' });
  }
  
  const blog = mockDB.blogs[blogIndex];
  
  // Update blog
  blog.title = title || blog.title;
  blog.content = content || blog.content;
  blog.tags = tags || blog.tags;
  blog.updatedAt = new Date().toISOString();
  
  // Handle images
  if (images) {
    if (replaceImages === 'true') {
      blog.images = images;
    } else {
      blog.images = [...blog.images, ...images];
    }
  }
  
  mockDB.blogs[blogIndex] = blog;
  
  res.status(200).json({
    success: true,
    data: blog
  });
});

// Delete blog route
router.delete('/blogs/:id', (req, res) => {
  const blogIndex = mockDB.blogs.findIndex(blog => blog._id === req.params.id);
  
  if (blogIndex === -1) {
    return res.status(404).json({ success: false, error: 'Blog not found' });
  }
  
  // Remove blog from array
  mockDB.blogs.splice(blogIndex, 1);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// Upload route
router.post('/upload', (req, res) => {
  // Mock successful upload
  res.status(200).json({
    success: true,
    url: 'https://res.cloudinary.com/demo/image/upload/v1612345678/blogging-platform/mock-image.jpg',
    public_id: 'blogging-platform/mock-image'
  });
});

export default router;