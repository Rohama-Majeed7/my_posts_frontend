import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState("");
  const [value, setValue] = useState(0);
  const setTokenLS = (serverToken) => {
    setToken(serverToken);
    return localStorage.setItem("token", serverToken);
  };
  const LogoutUser = () => {
    setToken("");
    setAuthUser("");
    return localStorage.removeItem("token");
  };
  let isLoggedIn = !!token;
  // userAuthentication
  const userAuthentication = async () => {
    try {
      const response = await fetch(`https://vercel-backend-8m5d.vercel.app/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAuthUser(data.userData);
      } else {
        const errorData = await response.json();
        console.error("Error during authentication:", errorData.message);
      }
    } catch (error) {
      console.error("Error during authentication:", error.message);
    }
  };

  useEffect(() => {
    if (token) {
      userAuthentication();
    }
  }, [value]);

  const manageState = () => {
    setValue(value+1);
  };
  const setState = () => {
    setValue(0);
  };
  return (
    <AuthContext.Provider
      value={{
        setTokenLS,
        LogoutUser,
        isLoggedIn,
        authUser,
        setAuthUser,
        token,
        value,
        manageState,
        setState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
