import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LogoutButton from "./components/LogoutButton";

import "./App.css";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? element : <Navigate to="/" />;
};

const RedirectRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/dashboard" /> : element;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <LogoutButton />
        <Routes>
          <Route path="/" element={<RedirectRoute element={<Login />} />} />
          <Route
            path="/register"
            element={<RedirectRoute element={<Register />} />}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
