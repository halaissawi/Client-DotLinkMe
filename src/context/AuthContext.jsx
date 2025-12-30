import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const tokenFromStorage = localStorage.getItem("token");
  const refreshTokenFromStorage = localStorage.getItem("refreshToken");
  const userFromStorage = localStorage.getItem("user");

  let parsedUser = null;
  try {
    parsedUser = userFromStorage ? JSON.parse(userFromStorage) : null;
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
    parsedUser = null;
    localStorage.removeItem("user");
  }

  const [token, setToken] = useState(tokenFromStorage);
  const [refreshToken, setRefreshToken] = useState(refreshTokenFromStorage);
  const [user, setUser] = useState(parsedUser);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // Check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  // ✅ UNIFIED LOGOUT FUNCTION - Use this everywhere
  const logout = async () => {
    console.log("🚪 Logging out user...");

    // Call logout API to invalidate refresh token
    if (user?.id) {
      try {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        });
        console.log("✅ Backend logout API called");
      } catch (error) {
        console.error("❌ Error during logout API call:", error);
      }
    }

    // ✅ Clear ALL storage items
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("profile"); // ✅ Added
    sessionStorage.clear(); // ✅ Added

    // ✅ Reset all state
    setToken(null);
    setRefreshToken(null);
    setUser(null);

    console.log("✅ Logout complete - all storage cleared");
  };

  // ✅ Logout and refresh page (for critical auth failures)
  const logoutAndRefresh = async () => {
    console.log("🔄 Logout and refresh triggered");
    await logout();
    window.location.href = "/";
  };

  // Refresh access token
  const refreshAccessToken = async () => {
    if (isRefreshing) return null;

    setIsRefreshing(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();

        // Update tokens
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        setToken(data.token);
        setRefreshToken(data.refreshToken);

        setIsRefreshing(false);
        return data.token;
      } else {
        await logoutAndRefresh();
        setIsRefreshing(false);
        return null;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      await logoutAndRefresh();
      setIsRefreshing(false);
      return null;
    }
  };

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!token || !refreshToken) return;

    const checkTokenExpiry = () => {
      if (isTokenExpired(token)) {
        refreshAccessToken();
      }
    };

    // Check immediately
    checkTokenExpiry();

    // Check every 5 minutes
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token, refreshToken]);

  // Check if user exists and token is valid on mount and when they change
  useEffect(() => {
    const validateSession = async () => {
      // If no user or no token, clear everything
      if (!user && token) {
        console.log("⚠️ Token without user - logging out");
        await logoutAndRefresh();
        return;
      }

      // If token exists but is expired and refresh token also expired
      if (
        token &&
        isTokenExpired(token) &&
        refreshToken &&
        isTokenExpired(refreshToken)
      ) {
        console.log("⚠️ Both tokens expired - logging out");
        await logoutAndRefresh();
        return;
      }

      // If user exists but no token, clear everything
      if (user && !token) {
        console.log("⚠️ User without token - logging out");
        await logoutAndRefresh();
        return;
      }
    };

    validateSession();
  }, []); // ✅ Empty dependency array - only run on mount

  // Verify user still exists in backend (optional but recommended)
  useEffect(() => {
    const verifyUser = async () => {
      if (!token || !user?.id) return;

      try {
        const response = await fetch(`${API_URL}/api/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 404) {
          // User doesn't exist or token is invalid
          console.log("❌ User verification failed - logging out");
          await logoutAndRefresh();
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        // Don't logout on network errors, only on auth errors
      }
    };

    // Verify user on mount
    verifyUser();

    // Verify user every 10 minutes
    const interval = setInterval(verifyUser, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token, user]);

  const login = (token, refreshToken, userData) => {
    console.log("✅ User logged in:", userData.email);
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setRefreshToken(refreshToken);
    setUser(userData);
  };

  const isAuthenticated = () => !!token && !isTokenExpired(token);

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        user,
        login,
        logout, // ✅ This is now the complete logout function
        isAuthenticated,
        refreshAccessToken,
        isRefreshing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
