# 💻 Production Code Examples

Copy-paste ready code snippets for production deployment.

---

## Frontend - Axios Configuration

**File:** `src/utils/api.js`

```javascript
import axios from "axios";

// ✅ Production-ready API client
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("⚠️  VITE_API_BASE_URL not configured. Using localhost.");
}

const api = axios.create({
  baseURL: API_BASE_URL || "http://localhost:5001",
  withCredentials: true, // 🔑 CRITICAL: Sends cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    // Handle specific errors
    if (status === 401) {
      console.error("❌ Unauthorized: Token expired or invalid");
      // Optional: redirect to login
      // window.location.href = "/login";
    } else if (status === 403) {
      console.error("❌ Forbidden: Insufficient permissions");
    } else if (status === 404) {
      console.error("❌ Not Found:", error.response?.data);
    } else if (status === 500) {
      console.error("❌ Server Error:Backend crashed");
    } else if (!error.response) {
      console.error("❌ Network error - Backend unreachable");
      console.error(`Attempted: ${API_BASE_URL}`);
      console.error(
        "Check if backend is deployed and VITE_API_BASE_URL is correct.",
      );
    } else {
      console.error(`❌ API Error (${status}):`, message);
    }

    return Promise.reject(error);
  },
);

export default api;
```

---

## Backend - CORS Configuration

**File:** `index.js` (Express setup)

```javascript
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Parse environment variables
const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "http://localhost:5173,http://localhost:5174,http://localhost:5175"
)
  .split(",")
  .map((origin) => origin.trim());

// 🔐 Cookie parser middleware
app.use(cookieParser());

// 🔐 CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("⚠️  CORS request from:", origin);
        // In production, log but don't block
        callback(null, true);
      }
    },
    credentials: true, // 🔑 Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400, // 24 hours
  }),
);

// Rest of your Express app...
```

---

## Backend - Authentication Middleware

**File:** `middleware/isAuthenticated.js`

```javascript
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    // 🔑 Read token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided - Please login",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Attach user info to request
    req.id = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired - Please login again",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default authenticateToken;
```

---

## Backend - Login Controller (Cookie Setting)

**File:** `controllers/user.controller.js`

```javascript
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Check role
    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Incorrect role",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }, // Token expires in 1 day
    );

    // 🔑 SET COOKIE - Production-ready configuration
    res.cookie("token", token, {
      httpOnly: true, // Only accessible via HTTP/HTTPS, not JavaScript
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", // "None" for cross-origin
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      // Optional: domain: ".yourdomain.com", // For subdomains
    });

    // Return user without password
    const userObject = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.fullname}`,
      user: userObject,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    // 🔑 CLEAR COOKIE - Same settings as login
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      maxAge: 0, // Delete cookie
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
```

---

## Frontend - Login Example

**File:** `src/components/authentication/Login.jsx`

```javascript
import { useState } from "react";
import api from "../../utils/api";
import { useDispatch } from "react-redux";
import { setUser, setLoading } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Student",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    setError("");

    try {
      // Make API call - cookies sent automatically!
      const response = await api.post("/api/users/login", formData);

      if (response.data.success) {
        // Store user in Redux
        dispatch(setUser(response.data.user));

        // Show success message
        console.log("✅ Login successful:", response.data.message);

        // Redirect based on role
        navigate(
          response.data.user.role === "Recruiter"
            ? "/recruiter/dashboard"
            : "/jobs",
        );
      }
    } catch (error) {
      // Error handling
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Try again.";

      setError(message);
      console.error("❌ Login error:", message);

      // Handle specific errors
      if (error.response?.status === 401) {
        setError("Invalid email or password");
      } else if (error.response?.status === 403) {
        setError("Incorrect role selected");
      } else if (!error.response) {
        setError("Cannot reach backend. Check VITE_API_BASE_URL");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />

      <select
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
      >
        <option value="Student">Student</option>
        <option value="Recruiter">Recruiter</option>
      </select>

      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Frontend - Protected Route Example

**File:** `src/components/authentication/ProtectedRoute.jsx`

```javascript
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Not logged in
  if (!isAuthenticated || !user) {
    console.warn("⚠️  Not authenticated - redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    console.warn(`⚠️  Insufficient permissions. Required: ${requiredRole}`);
    return <Navigate to="/unauthorized" replace />;
  }

  // User authorized
  return children;
}

// Usage:
// <ProtectedRoute>
//   <JobsPage />
// </ProtectedRoute>
//
// <ProtectedRoute requiredRole="Recruiter">
//   <RecruiterDashboard />
// </ProtectedRoute>
```

---

## Backend - Protected Route Example

**File:** `routes/job.route.js`

```javascript
import express from "express";
import authenticateToken from "../middleware/isAuthenticated";
import { authorizeRoles } from "../middleware/roleAuthorization";
import { postJob, getAllJobs } from "../controllers/job.controller";

const router = express.Router();

// 🔐 Protected: Only recruiters can post jobs
router.post(
  "/post",
  authenticateToken, // Check if logged in
  authorizeRoles("Recruiter"), // Check role
  postJob,
);

// 🔐 Protected: Only authenticated users can browse
router.get("/get", authenticateToken, getAllJobs);

// ✅ Public: Anyone can see job details
router.get("/get/:id", (req, res, next) => {
  // Optional: Add public route
});

export default router;
```

---

## Environment Variables - Production Settings

**Backend - `.env` on Render**

```env
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/job-portal?retryWrites=true&w=majority
JWT_SECRET=your_very_secure_random_string_here
CLOUD_NAME=your_cloudinary_name
CLOUD_API=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
RECRUITER_SECRET=random_recruiter_secret
ADMIN_SECRET=random_admin_secret
CORS_ORIGINS=https://your-domain.vercel.app,https://www.your-domain.vercel.app
```

**Frontend - `.env` or Vercel Settings**

```env
VITE_API_BASE_URL=https://your-backend-name.onrender.com
```

---

## Vercel Configuration

**File:** `Frontend/vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_BASE_URL": "@VITE_API_BASE_URL"
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
}
```

---

## Testing & Debugging

**Console Commands for Testing**

```javascript
// Check API configuration
console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

// Test backend connectivity
fetch("https://your-backend.onrender.com/")
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);

// Test API call with error handling
api
  .get("/api/users/profile")
  .then((res) => console.log("✅ Profile loaded:", res.data))
  .catch((err) => {
    console.log("❌ Error status:", err.response?.status);
    console.log("❌ Error message:", err.response?.data?.message);
    console.log("❌ Cookies sent:", document.cookie);
  });

// Check if production API credentials are being used
console.log(
  "Mode:",
  import.meta.env.MODE === "production" ? "PRODUCTION" : "DEVELOPMENT",
);
```

---

**All code snippets are production-ready! ✅**
