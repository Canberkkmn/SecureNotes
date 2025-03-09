const express = require("express");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const sanitizeHtml = require("sanitize-html");
const rateLimiter = require("../middleware/rateLimit");

const router = express.Router();

/**
 * Generates a JWT token for authenticated users.
 *
 * @param {string} userId - The user's unique ID.
 * @returns {string} JWT token valid for 1 hour.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user and return a token
 * @access  Public
 */
router.post(
  "/register",
  rateLimiter,
  (req, res, next) => {
    const csrfToken = req.headers["x-csrf-token"];

    if (!csrfToken) {
      return res.status(403).json({ message: "CSRF token missing" });
    }

    next();
  },
  [
    body("username")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    req.body.username = sanitizeHtml(req.body.username);
    req.body.email = sanitizeHtml(req.body.email);

    try {
      const { username, email, password } = req.body;
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await User.create({ username, email, password });

      const token = generateToken(user._id);

      res.status(201).json({
        message: "User created successfully!",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          token: token,
        },
      });
    } catch (error) {
      console.error("Registration Error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return a token
 * @access  Public
 */
router.post(
  "/login",
  rateLimiter,
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    req.body.email = sanitizeHtml(req.body.email);

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken(user._id);

      res.json({ token });
    } catch (error) {
      console.error("Login Error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
