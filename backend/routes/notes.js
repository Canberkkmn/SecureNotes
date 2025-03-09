const express = require("express");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });

    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/",
  authMiddleware,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content } = req.body;
      const newNote = new Note({
        userId: req.user.id,
        title,
        content,
      });

      await newNote.save();
      res.status(201).json(newNote);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully", noteId: req.params.id });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Server error" });
  }
});
