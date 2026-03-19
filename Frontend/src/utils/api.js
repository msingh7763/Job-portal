import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Global response interceptor: can handle auth errors, logging, and toast messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can add global error handling here (e.g. 401 -> redirect to login)
    return Promise.reject(error);
  }
);

export default api;
