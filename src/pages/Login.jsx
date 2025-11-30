import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import caIllustration from "../assets/login.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

const handleLogin = async (e) => {
  e.preventDefault();

  const res = await loginUser(form);

  if (res.success) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(res.user));
    window.dispatchEvent(new Event("authChange"));

    toast.success("Logged in successfully", { autoClose: 2000 });

    setTimeout(() => {
      if (res.user.role === "ca") {
        navigate("/admin/dashboard");  // redirect to admin
      } else {
        navigate("/user/plan");        // redirect normal user
      }
    }, 1500);
  } else {
    toast.error(res?.message || "Login failed");
  }
};


  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] text-white relative">
      <ToastContainer position="top-center" />

      {/* ===== Background Orbs ===== */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25, y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 w-72 h-72 bg-blue-400/40 rounded-full blur-3xl"
        ></motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25, y: [0, 25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/40 rounded-full blur-3xl"
        ></motion.div>
      </div>

      {/* ===== LEFT SIDE Illustration ===== */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="hidden md:flex flex-1 items-center justify-center p-4 z-10"
      >
        <motion.img
          src={caIllustration}
          alt="CA Illustration"
          className="max-w-lg drop-shadow-2xl rounded-2xl"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ===== RIGHT SIDE FORM ===== */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="flex-1 flex items-center justify-center p-4 md:p-6 relative z-10"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
            Welcome Back 👋
          </h2>
          <p className="text-center text-gray-300 mb-8 text-sm">
            Login to your Chartered Accountant Portal
          </p>

          {/* ===== Login Form ===== */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-200 text-sm mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </div>

            <div>
              <label className="block text-gray-200 text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 text-white py-2.5 rounded-lg shadow-lg font-semibold transition duration-300 hover:shadow-xl hover:opacity-90"
            >
              Login
            </motion.button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-300">
            Don’t have an account?{" "}
            <span
              className="text-indigo-300 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
