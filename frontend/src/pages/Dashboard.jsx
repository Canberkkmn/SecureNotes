import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import { getUserNotes } from "../services/api";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
/*
        const response = await getUserNotes(token);
        setNotes(response.data);
        */
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [navigate]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Secure Notes</h1>
      {loading ? (
        <p>Loading...</p>
      ) : notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note._id} className="bg-gray-100 p-3 rounded-md shadow-md">
              <h2 className="font-semibold">{note.title}</h2>
              <p>{note.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
