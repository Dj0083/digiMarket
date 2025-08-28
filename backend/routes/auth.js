const express = require("express");
const router = express.Router();
const { pool } = require("../config/database"); // notice: pool not db
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

console.log("🔍 Pool object debug:", {
  type: typeof pool,
  hasExecute: typeof pool.execute === 'function',
  hasQuery: typeof pool.query === 'function',
  hasPromise: typeof pool.promise === 'function',
  keys: Object.keys(pool)
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    // Check if email already exists
    const [existing] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password, phone, address, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [name, email, hashedPassword, phone || null, address || null]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: { user: { id: result.insertId, name, email }, token },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const [users] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (users.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email not registered" });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      data: { user: { id: user.id, name: user.name, email: user.email }, token },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
