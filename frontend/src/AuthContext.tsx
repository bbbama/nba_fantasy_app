import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { User } from "./types"; // Import User type
import { getUsersMe } from "./services/api"; // Import API function

interface AuthContextType {
  token: string | null;
  user: User | null; // Add user to context
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  refreshUserData: () => Promise<void>; // Added refreshUserData
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); // Add user state
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  const login = async (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    try {
      const userData = await getUsersMe(newToken);
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user on login", error);
      // If user fetch fails, logout to prevent inconsistent state
      logout();
      // Re-throw the error so the calling component knows the login failed
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const userData = await getUsersMe(storedToken);
          setUser(userData);
        } catch (error) {
          console.error("Failed to restore session, logging out.", error);
          // Token is invalid, so clear it
          logout();
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const refreshUserData = async () => {
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      try {
        const userData = await getUsersMe(currentToken);
        setUser(userData);
      } catch (error) {
        console.error("Failed to refresh user data, logging out.", error);
        logout();
      }
    }
  };

  // Show a loading indicator while session is being restored
  if (loading) {
    return <div>Loading session...</div>;
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
