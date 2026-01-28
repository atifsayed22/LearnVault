import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Load token + user from localStorage on page reload
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
          setToken(savedToken);
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // Only verify instructor data from server (they might have been approved by admin)
          // Skip this for students to reduce unnecessary API calls
          if (parsedUser.role === "instructor") {
            try {
              const response = await axiosInstance.get("/auth/me");
              if (response.data?.user) {
                // Update with fresh data from server
                setUser(response.data.user);
                localStorage.setItem("user", JSON.stringify(response.data.user));
              }
            } catch (err) {
              // If server call fails, keep using cached instructor data
              console.warn("Could not verify instructor data from server");
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🔥 login: save to state + localStorage
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);

    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 🔥 logout
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook (optional but recommended)
export const useAuth = () => useContext(AuthContext);
