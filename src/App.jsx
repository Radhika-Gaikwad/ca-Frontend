import React from "react"; 
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import CommonRoutes from "./routes/CommonRoutes";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect base path to user/plan */}
        <Route path="/" element={<Navigate to="/user/plan" replace />} />

        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/user/*" element={<UserRoutes />} />

        {/* Only login/signup */}
        <Route path="/*" element={<CommonRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
