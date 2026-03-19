import axios from "axios";

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("⚠️  VITE_API_BASE_URL not set. Using default http://localhost:5001");
}

const api = axios.create({
  baseURL: API_BASE_URL || "http://localhost:5001",
  withCredentials: true, // Essential for sending cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add token to headers if needed
api.interceptors.request.use(
  (config) => {
    // Cookies are sent automatically with withCredentials: true
    // This is just for additional logging in development
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    // Handle specific error cases
    if (status === 401) {
      console.error("❌ Unauthorized - Token expired or invalid");
      // Could trigger logout here
      // window.location.href = '/login';
    } else if (status === 403) {
      console.error("❌ Forbidden - Insufficient permissions");
    } else if (status === 404) {
      console.error("❌ Not found");
    } else if (status === 500) {
      console.error("❌ Server error");
    } else if (!error.response) {
      console.error("❌ Network error - Cannot reach server:", message);
      console.error(
        `Attempting to reach: ${API_BASE_URL}`,
        `Check if backend is running and VITE_API_BASE_URL is correct.`
      );
    } else {
      console.error(`❌ API Error (${status}):`, message);
    }

    return Promise.reject(error);
  }
);

export default api;
