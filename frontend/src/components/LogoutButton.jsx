import { useAuth } from "../context/AuthContext";

/**
 * Logout button component that allows authenticated users to sign out.
 *
 * @component
 * @returns {JSX.Element | null} Logout button or null if user is not authenticated.
 */
const LogoutButton = () => {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  /**
   * Handles logout confirmation and execution.
   */
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (confirmLogout) {
      logout();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 text-white px-4 py-2 rounded-md cursor-pointer bg-red-500 hover:bg-red-600 transition duration-200 shadow-md"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
