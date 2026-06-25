import React, { useEffect } from "react";
import { useAuth } from "../context/Auth";
import { Navigate } from "react-router-dom";
const Logout = () => {
  const {LogoutUser,setState} = useAuth()
  useEffect(() =>{
  LogoutUser()
  setState()
  },[Logout])

  return (
    <Navigate to={"/login"} />
  );
};

export default Logout;
