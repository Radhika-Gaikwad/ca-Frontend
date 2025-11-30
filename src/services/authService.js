import axiosInstance, { updateAuthHeader } from "../utils/axios/axiosInstance";
import { toast } from "react-toastify";

// -------- LOGIN USER ----------
export const loginUser = async (payload) => {
  try {
    const res = await axiosInstance.post("auth/login", payload);

    const { token, user,  } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    updateAuthHeader(token);

 

    return { success: true, user, token };
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.response?.data?.errors?.[0]?.msg ||
      "Login failed";

    toast.error(msg);
    return { success: false, message: msg };
  }
};

// -------- REGISTER USER ----------
export const registerUser = async (payload) => {
  try {
    const res = await axiosInstance.post("auth/register", payload);

    const { token, user, message } = res.data;

    toast.success(message || "Account created successfully 🎉", {
      position: "top-right",
      autoClose: 2500,
      theme: "colored",
    });

    return { success: true, user, token };
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.response?.data?.errors?.[0]?.msg ||
      "Registration failed";

    toast.error(msg, {
      position: "top-right",
      autoClose: 2500,
      theme: "colored",
    });

    return { success: false, message: msg };
  }
};

export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token) updateAuthHeader(token);

    const res = await axiosInstance.get("auth/all-users");
    console.log("Fetched users:", res.data);
    return res.data.users || [];
  } catch (err) {
    const msg = err.response?.data?.message || "Failed to fetch users";
    toast.error(msg, { position: "top-right", autoClose: 2500, theme: "colored" });
    return [];
  }
};

