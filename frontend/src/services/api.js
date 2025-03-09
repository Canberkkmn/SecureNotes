import axios from "axios";

/**
 * Axios instance for API requests.
 */
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

/**
 * Retrieves the CSRF token from the API.
 * @returns {Promise<string>} The CSRF token.
 */
export const getCsrfToken = async () => {
  try {
    const response = await API.get("/csrf-token");

    return response.data.csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);

    throw error;
  }
};

/**
 * Retrieves authentication headers (JWT + CSRF token).
 * @returns {Promise<Object>} Headers object.
 */
const getAuthHeaders = async () => {
  const token = localStorage.getItem("token");
  const csrfToken = await getCsrfToken();

  return {
    Authorization: `Bearer ${token}`,
    "x-csrf-token": csrfToken,
  };
};

/**
 * Registers a new user.
 * @param {Object} userData - The user data (username, email, password).
 * @returns {Promise<Object>} API response.
 */
export const registerUser = async (userData) => {
  try {
    const csrfToken = await getCsrfToken();

    return API.post("/auth/register", userData, {
      headers: { "x-csrf-token": csrfToken },
    });
  } catch (error) {
    console.error("Registration error:", error);

    throw error;
  }
};

/**
 * Logs in the user.
 * @param {Object} userData - The user data (email, password).
 * @returns {Promise<Object>} API response.
 */
export const loginUser = async (userData) => {
  try {
    const csrfToken = await getCsrfToken();

    return API.post("/auth/login", userData, {
      headers: { "x-csrf-token": csrfToken },
    });
  } catch (error) {
    console.error("Login error:", error);

    throw error;
  }
};

/**
 * Adds a new note.
 * @param {Object} noteData - The note data (title, content).
 * @returns {Promise<Object>} API response.
 */
export const addNote = async (noteData) => {
  try {
    return API.post("/notes", noteData, {
      headers: await getAuthHeaders(),
    });
  } catch (error) {
    console.error("Error adding note:", error);

    throw error;
  }
};

/**
 * Retrieves all notes for the authenticated user.
 * @returns {Promise<Array>} List of notes.
 */
export const getUserNotes = async () => {
  try {
    return API.get("/notes", {
      headers: await getAuthHeaders(),
    });
  } catch (error) {
    console.error("Error fetching notes:", error);

    throw error;
  }
};

/**
 * Deletes a note by ID.
 * @param {string} noteId - The ID of the note to delete.
 * @returns {Promise<Object>} API response.
 */
export const deleteNote = async (noteId) => {
  try {
    return API.delete(`/notes/${noteId}`, {
      headers: await getAuthHeaders(),
    });
  } catch (error) {
    console.error("Error deleting note:", error);

    throw error;
  }
};

/**
 * Axios Interceptor to automatically attach auth headers to requests.
 */
API.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
