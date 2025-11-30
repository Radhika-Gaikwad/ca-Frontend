import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import SignUpForm from "../pages/Signup";

const CommonRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUpForm />} />
    </Routes>
  );
};

export default CommonRoutes;
