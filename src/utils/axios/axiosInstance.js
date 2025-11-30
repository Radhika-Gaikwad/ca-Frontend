import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/",
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
