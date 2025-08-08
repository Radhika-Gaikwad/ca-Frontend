import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import CommonRoutes from "./routes/CommonRoutes";

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* User side routes */}
        <Route path="/*" element={<UserRoutes />} />

        {/* Admin side routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Common routes for both */}
        <Route path="/*" element={<CommonRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;

