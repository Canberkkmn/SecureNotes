const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware to verify JSON Web Token (JWT) and authenticate the user.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} Sends a 401 response if token is missing or invalid.
 */
tokenVerification = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res
        .status(401)
        .json({ message: "Invalid token. Authorization denied." });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found. Authorization denied." });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("JWT Authentication Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    } else if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Invalid token. Authorization denied." });
    } else {
      return res.status(500).json({ message: "Internal server error." });
    }
  }
};

module.exports = tokenVerification;
