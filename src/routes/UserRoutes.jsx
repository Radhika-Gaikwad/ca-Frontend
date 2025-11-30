import React from "react";
import { Routes, Route } from "react-router-dom";
import UserLayout from "../layout/UserLayout";
import Home from "../pages/user/Home";
import PurchaseForm from "../pages/user/PurchaseForm";
import PaymentProcess from "../pages/user/PaymentProcess";
import PurchasedPlan from "../pages/user/PurchasedPlan";
import Articles from "../pages/user/Articles";

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        {/* Default page inside user section */}
        <Route path="plan" element={<Home />} />
        <Route path="" element={<Home />} />  {/* /user shows Home */}

        <Route path="purchase-plan" element={<PurchaseForm />} />
        <Route path="payment-process" element={<PaymentProcess />} />
        <Route path="purchased-plan" element={<PurchasedPlan />} />
           <Route path="articles" element={<Articles />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
