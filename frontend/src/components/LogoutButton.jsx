import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
