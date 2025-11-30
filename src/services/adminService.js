// src/services/adminService.js
import axiosInstance from "../utils/axios/axiosInstance";

export const getAdminStats = async () => {
  try {
    const { data } = await axiosInstance.get("/admin/stats");
    console.log(data)
    return data;
  } catch (error) {
    console.error("Admin stats API error:", error);
    throw error;
  }
};
