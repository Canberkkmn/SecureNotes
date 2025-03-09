import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const getCsrfToken = async () => {
  const response = await API.get("/csrf-token");

  return response.data.csrfToken;
};

export const registerUser = async (userData) => {
  const csrfToken = await getCsrfToken();

  return API.post("/auth/register", userData, {
    headers: { "x-csrf-token": csrfToken },
  });
};

export const loginUser = async (userData) => {
  const csrfToken = await getCsrfToken();

  return API.post("/auth/login", userData, {
    headers: { "x-csrf-token": csrfToken },
  });
};

export const addNote = async (noteData) => {
  const token = sessionStorage.getItem("token");
  const csrfToken = await getCsrfToken();

  return API.post("/notes", noteData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-csrf-token": csrfToken,
    },
  });
};

export const getUserNotes = async () => {
  const token = sessionStorage.getItem("token");

  return API.get("/notes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteNote = async (noteId) => {
  const token = sessionStorage.getItem("token");
  const csrfToken = await getCsrfToken();

  return API.delete(`/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-csrf-token": csrfToken,
    },
  });
};
