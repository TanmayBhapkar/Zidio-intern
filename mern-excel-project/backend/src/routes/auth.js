import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already in use" });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, name, password: hashed });
    await user.save();
    const token = createToken(user);
    res.json({ message: "User registered successfully", token, user: user.toJSON() });
  } catch (e) {
    console.error("❌ Register error:", e.message);
    res.status(500).json({ error: "Failed to register" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });
    const token = createToken(user);
    res.json({ message: "Login successful", token, user: user.toJSON() });
  } catch (e) {
    console.error("❌ Login error:", e.message);
    res.status(500).json({ error: "Failed to login" });
  }
});

// Google Sign-In
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ error: "Google token missing" });

    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;
    if (!email) return res.status(400).json({ error: "Invalid Google account" });

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name, googleId, password: await bcrypt.hash(crypto.randomUUID(), 10), role: 'user' });
      await user.save();
    }
    const token = createToken(user);
    res.json({ message: "Google Sign-In successful", token, user: user.toJSON() });
  } catch (e) {
    console.error("❌ Google Sign-In error:", e.message);
    res.status(500).json({ error: "Failed Google Sign-In" });
  }
});

export default router;
