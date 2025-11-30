import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

import Dashboard from "../pages/admin/Dashboard";
import Plans from "../pages/admin/Plans";
import PurchasedPlansHistory from "../pages/admin/PlanHistory";
import Users from "../pages/admin/Users";
import Articles from "../pages/admin/Articles";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="plans" element={<Plans />} />
        <Route path="purchases" element={<PurchasedPlansHistory />} />
        <Route path="users" element={<Users />} />
        <Route path="articles" element={<Articles />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
