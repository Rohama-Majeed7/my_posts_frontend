import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp"; // Correctly import the component
import Login from "./components/Login"; // Correctly import the component
import Logout from "./components/Logout"
import { AuthContext } from "./context/Auth";
import { Toaster } from "react-hot-toast";
import UserData from "./components/UserData";
import EditPost from "./components/EditPost";
import { useContext } from "react";

const App = () => {
  const { userAuth} = useContext(AuthContext);
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp />} />{" "}
          {/* Use `path` instead of `to` */}
          <Route path="/login" element={<Login />} />{" "}
          <Route path="/logout" element={<Logout />} />{" "}

          {/* Use `path` instead of `to` */}
          <Route
            path="/profile"
            element={ <UserData />}
          />
          <Route path="/profile/:id" element={<EditPost />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;
