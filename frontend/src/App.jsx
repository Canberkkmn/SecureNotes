import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useMemo } from "react";
import { useAuth, AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LogoutButton from "./components/LogoutButton";
import "./App.css";

/**
 * ProtectedRoute ensures that only authenticated users can access a route.
 *
 * @component
 * @param {Object} props
 * @param {JSX.Element} props.element - The element to render if authenticated.
 * @returns {JSX.Element} Redirects to login if not authenticated.
 */
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? element : <Navigate to="/" />;
};

/**
 * RedirectRoute ensures that authenticated users cannot access login/register pages.
 *
 * @component
 * @param {Object} props
 * @param {JSX.Element} props.element - The element to render if not authenticated.
 * @returns {JSX.Element} Redirects to dashboard if authenticated.
 */
const RedirectRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/dashboard" /> : element;
};

/**
 * AuthRoutes component that manages application routes.
 *
 * @component
 */
const AuthRoutes = () => {
  const { isAuthenticated } = useAuth();
  const memoizedAuth = useMemo(() => isAuthenticated, [isAuthenticated]);

  return (
    <>
      {memoizedAuth && <LogoutButton />}
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
