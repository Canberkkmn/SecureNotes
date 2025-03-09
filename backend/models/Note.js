const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true, // User ID should not be changed after creation
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [5, "Content must be at least 5 characters long"],
      maxlength: [2000, "Content cannot exceed 2000 characters"],
    },
  },
  { timestamps: true }
);

/**
 * Mongoose Model for Notes.
 * @typedef {Object} Note
 * @property {mongoose.Schema.Types.ObjectId} userId - The ID of the user who owns the note.
 * @property {string} title - The title of the note (3-100 characters).
 * @property {string} content - The content of the note (5-2000 characters).
 * @property {Date} createdAt - Timestamp of note creation.
 * @property {Date} updatedAt - Timestamp of last update.
 */
const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
