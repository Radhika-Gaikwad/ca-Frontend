import React from "react";
import { Routes, Route } from "react-router-dom";
import UserLayout from "../layout/UserLayout";

import Home from "../pages/user/Home";
import Categories from "../pages/user/Categories";
import Orders from "../pages/user/Orders";
import Cart from "../pages/user/Cart";
import Products from "../pages/user/Products";
import PlaceOrder from "../pages/user/PlaceOrder";

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<Products />} />
        <Route path="/place-order" element={<PlaceOrder />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
