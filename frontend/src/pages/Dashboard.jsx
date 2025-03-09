import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserNotes, deleteNote } from "../services/api";
import AddNoteModal from "../components/AddNoteModal";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await getUserNotes(token);
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [navigate]);

  const handleNoteAdded = (newNote) => {
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error.response?.data);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Secure Notes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
        >
          +
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li
              key={note._id}
              className="bg-gray-100 p-3 rounded-md shadow-md flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{note.title}</h2>
                <p>{note.content}</p>
              </div>
              <button
                onClick={() => handleDeleteNote(note._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition cursor-pointer"
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
