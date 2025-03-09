import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

/**
 * AuthProvider component that manages authentication state.
 *
 * @component
 * @param {Object} props
 * @param {JSX.Element} props.children - Child components that require authentication context.
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Checks authentication status by verifying JWT token.
   */
  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");

          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();

    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  /**
   * Logs in the user by storing token and updating state.
   * @param {string} token - JWT token received from API.
   */
  const login = (token) => {
    localStorage.setItem("token", token);

    checkAuthStatus();
  };

  /**
   * Logs out the user by removing token and updating state.
   */
  const logout = () => {
    localStorage.removeItem("token");
    
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access authentication context.
 * @returns {Object} Authentication state and functions.
 */
export const useAuth = () => useContext(AuthContext);
