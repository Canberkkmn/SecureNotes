import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      onClick={logout}
      className="fixed top-4 right-4 text-white px-4 py-2 rounded-md cursor-pointer bg-green-500 hover:bg-green-600 transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
