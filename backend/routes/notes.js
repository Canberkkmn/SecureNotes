const express = require("express");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

/**
 * Handles asynchronous route execution and catches errors.
 * @param {Function} fn - Express route handler function.
 * @returns {Function} Wrapped function with error handling.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * @route   GET /api/notes
 * @desc    Get all notes of the authenticated user
 * @access  Private
 */
router.get(
  "/",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const notes = await Note.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(notes);
  })
);

/**
 * @route   POST /api/notes
 * @desc    Create a new note
 * @access  Private
 */
router.post(
  "/",
  authMiddleware,
  [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .trim()
      .escape()
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be between 3 and 100 characters"),
    body("content")
      .notEmpty()
      .withMessage("Content is required")
      .trim()
      .escape()
      .isLength({ min: 5, max: 2000 })
      .withMessage("Content must be between 5 and 2000 characters"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;

    const newNote = await Note.create({
      userId: req.user.id,
      title,
      content,
    });

    res.status(201).json(newNote);
  })
);

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete a note by ID
 * @access  Private
 */
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully", noteId: req.params.id });
  })
);

module.exports = router;
