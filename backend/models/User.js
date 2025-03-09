const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [20, "Username cannot exceed 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
});

/**
 * Hash password before saving the user to the database.
 * Runs only if the password is modified.
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare provided password with stored hashed password.
 *
 * @param {string} enteredPassword - The plain text password provided by the user.
 * @returns {Promise<boolean>} - Returns true if passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

/**
 * Mongoose Model for Users.
 * @typedef {Object} User
 * @property {string} username - Unique username (3-20 characters).
 * @property {string} email - Unique and valid email address.
 * @property {string} password - Hashed password (at least 6 characters).
 * @property {Date} createdAt - Timestamp of account creation.
 * @property {Date} updatedAt - Timestamp of last account update.
 */
const User = mongoose.model("User", userSchema);

module.exports = User;
