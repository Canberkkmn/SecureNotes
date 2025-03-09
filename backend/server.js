const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const csurf = require("csurf");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

/**
 * Security middleware:
 * - `cors`: Enables cross-origin requests only from allowed domains.
 * - `helmet`: Adds security headers to protect against vulnerabilities.
 */
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
  })
);
app.use(helmet());

/**
 * CSRF Protection:
 * - Uses a secure HTTP-only cookie to prevent CSRF attacks.
 * - Secure only in production.
 */
app.use(
  csurf({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    },
  })
);

/**
 * API Route to get the CSRF token.
 */
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

/**
 * Root route - API health check.
 */
app.get("/", (req, res) => {
  res.send("Secure Notes API is running...");
});

/**
 * Global error handler to catch unexpected errors.
 */
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
