import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://ca-y12j.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Update Authorization header
export const updateAuthHeader = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// Load token on refresh
const savedToken = localStorage.getItem("token");
if (savedToken) updateAuthHeader(savedToken);

export default axiosInstance;
