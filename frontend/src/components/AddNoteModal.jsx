import { useState, useEffect } from "react";
import { addNote } from "../services/api";

/**
 * Modal component for adding a new note.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Function} props.onNoteAdded - Callback function to update the notes list.
 */
const AddNoteModal = ({ onClose, onNoteAdded }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  /**
   * Handles note submission.
   * Prevents submission if title or content is empty.
   *
   * @param {Event} e - Form submission event.
   */
  const handleAddNote = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!title.trim() || !content.trim()) {
      if (!title.trim() && !content.trim()) {
        setError("Both title and content are required.");
        return;
      }

      if (!title.trim()) {
        setError("Title is required.");
        return;
      }

      if (!content.trim()) {
        setError("Content is required.");
        return;
      }
    }

    try {
      const response = await addNote({ title, content });
      onNoteAdded(response.data);
      setMessage("Note added successfully!");
      setTitle("");
      setContent("");

      setTimeout(handleClose, 1000);
    } catch (error) {
      console.error("Error adding note:", error.response?.data);
      setError(error.response?.data?.message || "Failed to add note");
    }
  };

  /**
   * Handles modal close with animation effect.
   */
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-30 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-lg w-96 transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Add Note
        </h2>

        {error && <p className="text-center text-red-500">{error}</p>}

        {message && <p className="text-center text-green-500">{message}</p>}

        <form onSubmit={handleAddNote} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Content"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 cursor-pointer"
          >
            Add Note
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition duration-200 mt-2 cursor-pointer"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;
