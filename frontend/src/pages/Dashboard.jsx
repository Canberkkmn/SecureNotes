import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserNotes, deleteNote } from "../services/api";
import AddNoteModal from "../components/AddNoteModal";

/**
 * Dashboard page that displays user notes and allows adding/deleting notes.
 *
 * @component
 */
const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");

          return;
        }

        const response = await getUserNotes();

        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError("Failed to load notes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [navigate]);

  /**
   * Handles adding a new note to the list.
   * @param {Object} newNote - Newly added note object.
   */
  const handleNoteAdded = (newNote) => {
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  };

  /**
   * Handles note deletion.
   * @param {string} noteId - ID of the note to delete.
   */
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await deleteNote(noteId);

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error.response?.data);
      setError("Failed to delete note. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4 mb-4">
        <h1 className="text-2xl font-bold">Secure Notes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer shadow-md"
        >
          + Add Note
        </button>
      </div>

      {error && <p className="text-center text-red-500">{error}</p>}

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : notes.length === 0 ? (
        <p className="text-center text-gray-500">No notes available.</p>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li
              key={note._id}
              className="bg-gray-100 p-3 rounded-md shadow-md flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{note.title}</h2>
                <p className="text-gray-700">{note.content}</p>
              </div>
              <button
                onClick={() => handleDeleteNote(note._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition cursor-pointer shadow-md"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && (
        <AddNoteModal
          onClose={() => setIsModalOpen(false)}
          onNoteAdded={handleNoteAdded}
        />
      )}
    </div>
  );
};

export default Dashboard;
