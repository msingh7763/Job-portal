import axios from "axios";

// Always use env variable in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Global response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: handle errors globally
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Unauthorized - Please login again");
      }
    } else {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
