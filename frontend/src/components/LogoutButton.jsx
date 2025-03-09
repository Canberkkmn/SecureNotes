import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return null;

  console.log("LogoutButton rendered", isAuthenticated);

  return (
    <button
      onClick={logout}
      className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
