# 🔍 Production Issues & Solutions Reference

Quick lookup guide for fixing deployment issues.

---

## Issue 1: 404 Error When Refreshing Routes

**Symptom:**

```
GET /jobs 404 Not Found
GET /profile 404 Not Found
```

**Root Cause:** Vercel treats routes as file requests, not SPA routes.

**Fix:**

```json
// Frontend/vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Verification:**

```bash
# Push changes
git push origin main

# Redeploy on Vercel
# Settings > Deployments > Redeploy
```

---

## Issue 2: "No token provided" Authentication Error

**Symptom:**

```
Login button → Navigate to /jobs → Error: "No token provided"
OR
Login works but refresh page → "No token provided"
```

**Root Cause:** Cookie not sent to backend OR token not in request.

**Check 1: Axios Configuration**

```javascript
// Frontend/src/utils/api.js - MUST HAVE:
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // ← CRITICAL! Sends cookies
  headers: { "Content-Type": "application/json" },
});
```

**Check 2: Backend CORS Setup**

```javascript
// Backend/index.js - MUST HAVE:
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // ← CRITICAL! Allows credentials
  }),
);
```

**Check 3: Cookie Configuration**

```javascript
// Backend/controllers/user.controller.js - MUST HAVE:
res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // HTTPS only
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
  maxAge: 24 * 60 * 60 * 1000,
});
```

**Check 4: Environment Variables**

```env
# Frontend - Vercel Settings > Environment Variables
VITE_API_BASE_URL=https://your-backend.onrender.com

# Backend - Render Settings > Environment Variables
CORS_ORIGINS=https://your-domain.vercel.app
NODE_ENV=production
```

**Debug Steps:**

```javascript
// 1. Open DevTools Console
console.log(import.meta.env.VITE_API_BASE_URL);
// Should show: https://your-backend.onrender.com

// 2. Check cookies sent
api
  .get("/api/users/profile")
  .then((res) => console.log("Success:", res.data))
  .catch((err) => {
    console.log("Error status:", err.response?.status);
    console.log("Error message:", err.response?.data?.message);
  });

// 3. Check DevTools > Network > Request Headers
// Should see: Cookie: token=...

// 4. Check DevTools > Application > Cookies
// Should see token in cookies for backend domain
```

---

## Issue 3: CORS Error - "No 'Access-Control-Allow-Origin' header"

**Symptom:**

```
Access to XMLHttpRequest at 'https://job-portal-api.onrender.com/api/users/login'
blocked by CORS policy: No 'Access-Control-Allow-Origin' header
```

**Root Cause:** Backend doesn't allow Vercel frontend domain.

**Fix:**

1. On Render Dashboard:
   - Go to Settings > Environment Variables
   - Find `CORS_ORIGINS`
   - Update to your Vercel domain:

   ```
   https://your-project.vercel.app,https://www.your-project.vercel.app
   ```

   - Save (auto-redeploys in 1-2 minutes)

2. Verify backend code has CORS enabled:

```javascript
// Backend/index.js
const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "http://localhost:5173,http://localhost:5174,http://localhost:5175"
)
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow in production
      }
    },
    credentials: true,
  }),
);
```

**Testing:**

```bash
# Test backend directly
curl -X OPTIONS https://your-backend.onrender.com/api/users/login \
  -H "Origin: https://your-domain.vercel.app" \
  -H "Access-Control-Request-Method: POST"

# Should return 200 with CORS headers
```

---

## Issue 4: Network Error - "Cannot POST https://..."

**Symptom:**

```
❌ Network error - Cannot reach server
Attempted: https://job-portal-api.onrender.com
```

**Root Cause:** Backend URL wrong OR backend not running.

**Fix:**

**Step 1:** Verify Backend URL

```javascript
// Check in frontend console
console.log(import.meta.env.VITE_API_BASE_URL);
```

**Step 2:** Test Backend Directly

```bash
# Test from browser console or curl
fetch('https://job-portal-api.onrender.com/').then(r => r.json()).then(console.log);

# Expected response:
// {message: "Job Portal backend is running 🚀", success: true}
```

**Step 3:** Update Vercel Env Var

```
Settings > Environment Variables > VITE_API_BASE_URL
Value: https://job-portal-api.onrender.com
```

**Step 4:** Redeploy Frontend

- Push to GitHub OR
- Click "Redeploy" in Vercel dashboard

---

## Issue 5: File Upload Fails

**Symptom:**

```
Error uploading file OR file upload hangs
```

**Root Cause:** Cloudinary credentials not set on backend.

**Fix:**

1. Check Render environment variables:

```env
CLOUD_NAME=your_cloudinary_account_name
CLOUD_API=your_api_key
API_SECRET=your_api_secret
```

2. Verify backend can access variables:

```javascript
// Backend/utils/cloud.js
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.API_SECRET,
});
```

3. Test upload manually:

```javascript
// Frontend - try uploading a file
const formData = new FormData();
formData.append("file", fileInputElement.files[0]);

api
  .post("/api/users/profile/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  .then((res) => console.log("Upload success:", res.data))
  .catch((err) => console.log("Upload error:", err.response?.data));
```

---

## Issue 6: API Routes Not Found (404)

**Symptom:**

```
POST /api/job/post → 404 Not Found
GET /api/company → 404 Not Found
```

**Root Cause:** Frontend calling wrong endpoint.

**Verify Endpoints:**

| Feature          | Endpoint                     | Method |
| ---------------- | ---------------------------- | ------ |
| Login            | `/api/users/login`           | POST   |
| Register         | `/api/users/register`        | POST   |
| Logout           | `/api/users/logout`          | POST   |
| Get Profile      | `/api/users/profile`         | GET    |
| Update Profile   | `/api/users/profile/update`  | PUT    |
| Get Jobs         | `/api/job/get`               | GET    |
| Post Job         | `/api/job/post`              | POST   |
| Get Companies    | `/api/company/get`           | GET    |
| Apply Job        | `/api/application/apply/:id` | POST   |
| Get Applications | `/api/application/get`       | GET    |

**Debug:**

```javascript
// Check actual request
api
  .get("/api/job/get")
  .then((res) => console.log("Jobs:", res.data))
  .catch((err) => {
    console.log("Error:", err.response?.status);
    console.log("Message:", err.response?.data?.message);
    // If 404: wrong endpoint
    // If 401: no auth token
    // If 500: backend error
  });
```

---

## Issue 7: Cookie Not Being Saved

**Symptom:**

```
Login successful BUT no token cookie in DevTools > Application > Cookies
```

**Root Cause:** Cookie settings wrong OR HTTPS not enabled.

**Check Cookie Configuration:**

```javascript
// Backend/controllers/user.controller.js
res.cookie("token", token, {
  httpOnly: true, // ✅ Required
  secure: process.env.NODE_ENV === "production", // ✅ HTTPS only
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", // ✅ Cross-origin
  maxAge: 24 * 60 * 60 * 1000, // ✅ 24 hours
});
```

**Verify Production Settings:**

```env
# Backend Render environment
NODE_ENV=production
```

---

## Issue 8: Login Works But Then "Unauthorized"

**Symptom:**

```
1. Login successful
2. Navigate to protected route
3. Error: "No token provided" OR "Invalid token"
```

**Root Cause:** Token exists but not sent with next request.

**Fix:**

**Option A:** Check `withCredentials`

```javascript
// Frontend/src/utils/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // ← Must be TRUE
});
```

**Option B:** Verify All Protected Routes Use API Instance

```javascript
// ✅ Good
import api from "../utils/api.js";
api.get("/api/users/profile");

// ❌ Bad (won't send cookies)
import axios from "axios";
axios.get("https://backend.com/api/users/profile");
```

**Option C:** Check Backend Auth Middleware

```javascript
// Backend/middleware/isAuthenticated.js
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // ← Reads from cookies
  if (!token) {
    return res.status(401).json({
      message: "No token provided",
      success: false,
    });
  }
  // ... rest of verification
};
```

---

## Issue 9: Cookies Work Locally But Not on Production

**Symptom:**

```
Works: http://localhost:3000 → http://localhost:5001
Broken: https://vercel.app → https://onrender.com
```

**Root Cause:** `secure`, `sameSite` settings wrong for production.

**Fix:**

```javascript
// Backend/controllers/user.controller.js
const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

res.cookie("token", token, {
  httpOnly: true,
  secure: isProduction, // true in production, false locally
  sameSite: isProduction ? "None" : "Strict", // "None" for cross-origin
  maxAge: 24 * 60 * 60 * 1000,
});
```

**Verify Render Settings:**

```
Settings > Environment Variables
NODE_ENV=production
```

---

## Issue 10: Render Backend Freezes After Inactivity

**Symptom:**

```
First request after 15 min wait → Very slow
Connection timeout
```

**Root Cause:** Free Render plan spins down after 15 minutes.

**Solutions:**

1. **Keep it running:** Upgrade to Starter plan ($7/month)
2. **Accept slowness:** First request after inactivity takes 30 seconds
3. **Ping backend:** No solution - just upgrade

**Workaround for Free Plan:**

```javascript
// Optional: Ping backend every 5 minutes to keep it warm
setInterval(
  () => {
    fetch("https://your-backend.onrender.com/").catch(() => {});
  },
  5 * 60 * 1000,
);
```

---

## Debug Checklist

When something breaks, check in order:

1. **Is backend running?**

   ```bash
   curl https://your-backend.onrender.com/
   ```

2. **Is frontend env var set?**

   ```javascript
   console.log(import.meta.env.VITE_API_BASE_URL);
   ```

3. **Are cookies being sent?**
   - DevTools > Network > Request Header > Check for `Cookie:`

4. **Does backend allow CORS?**
   - Render > Environment > CORS_ORIGINS includes your Vercel domain

5. **Is token in cookie?**
   - DevTools > Application > Cookies > Check for `token`

6. **Backend logs - any errors?**
   - Render > Logs tab - check for error messages

---

## Common Error Messages & Fixes

| Error                | Cause                      | Fix                                 |
| -------------------- | -------------------------- | ----------------------------------- |
| "No token provided"  | Cookie not sent            | Check `withCredentials: true`       |
| "Invalid token"      | Token expired              | Login again                         |
| "CORS blocked"       | Backend denies domain      | Update `CORS_ORIGINS` on Render     |
| "Cannot POST ..."    | Backend URL wrong          | Check `VITE_API_BASE_URL` on Vercel |
| "Network error"      | Backend unreachable        | Deploy backend to Render            |
| "File upload failed" | Cloudinary not configured  | Set Cloudinary env vars on Render   |
| "404 on refresh"     | SPA routing not configured | Verify `vercel.json` rewrites       |

---

**Last updated:** March 20, 2026
**Status:** All fixes applied and tested ✅
