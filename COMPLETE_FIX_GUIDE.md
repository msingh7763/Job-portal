# 🔧 Complete Fix for Login/Logout/Post Job Issues

## Root Cause
All API calls (login, logout, post job) are failing because:
1. **Frontend API base URL not configured** on Vercel
2. **CORS not allowing Vercel** on Render backend
3. **Cookies not being sent/cleared** properly in production

---

## ✅ SOLUTION PART 1: Configure Vercel Environment Variables (2 minutes)

### Step 1: Go to Vercel Dashboard
1. Open: https://vercel.com/dashboard
2. Find your **job-portal** (Frontend) project
3. Click it to open

### Step 2: Add Environment Variables
1. Click **Settings** (top menu)
2. Click **Environment Variables** (left sidebar)
3. Click **Add New** → **Environment Variable**

### Step 3: Add These Variables

**Variable 1: API Base URL**
```
Name: VITE_API_BASE_URL
Value: https://job-portal-api.onrender.com
Environments: Production, Preview, Development (select all)
```
Click **Add**

**Variable 2: API Timeout (optional but helpful)**
```
Name: VITE_API_TIMEOUT
Value: 10000
Environments: Production, Preview, Development
```
Click **Add**

### Step 4: Redeploy Frontend
1. Click **Deployments** (top menu)
2. Click the **...** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for status to change to **Ready** (usually 2-3 min)

✅ **Frontend is now configured!**

---

## ✅ SOLUTION PART 2: Configure Render Backend (2 minutes)

### Step 1: Go to Render Dashboard
1. Open: https://dashboard.render.com
2. Click **job-portal-api** service

### Step 2: Add/Update Environment Variables
1. Click **Settings** (top menu)
2. Scroll to **Environment** section
3. Look for `CORS_ORIGINS`

### Step 3: Update CORS_ORIGINS

**If it exists, edit it:**
```
https://job-portal-pearl-omega.vercel.app,https://www.job-portal-pearl-omega.vercel.app,http://localhost:5173,http://localhost:5174
```

**If it doesn't exist, add it:**
- Click **Add Environment Variable**
- Name: `CORS_ORIGINS`
- Value: (use above)
- Click **Add**

### Step 4: Check Other Required Variables
Ensure these are also set:
```
NODE_ENV: production
JWT_SECRET: (should be set)
MONGODB_URI: (should be set)
CLOUDINARY_NAME: (should be set)
CLOUDINARY_API_KEY: (should be set)
CLOUDINARY_API_SECRET: (should be set)
```

**Save changes** - Render auto-redeploys (1-2 minutes)

✅ **Backend is now configured!**

---

## ✅ SOLUTION PART 3: Verify Backend is Running (1 minute)

### Open new browser tab and visit:
```
https://job-portal-api.onrender.com/
```

### You should see:
```json
{
  "message": "Job Portal backend is running 🚀",
  "success": true,
  "timestamp": "2026-03-20T10:30:00.000Z"
}
```

✅ **Backend is accessible!**

---

## ✅ SOLUTION PART 4: Test All Operations

### Test 1: LOGIN
1. Go to: https://job-portal-pearl-omega.vercel.app
2. Click **Login**
3. Use your credentials:
   - Email: (your registered email)
   - Password: (your password)
   - Role: Student or Recruiter
4. Click **Login**

**Expected:** Redirected to dashboard, logged in successfully

### Test 2: LOGOUT
1. Click your profile icon (top right)
2. Click **Logout**

**Expected:** Redirected to login page, successfully logged out

### Test 3: POST JOB (if Recruiter)
1. Make sure logged in as **Recruiter**
2. Navigate to **Post Job** page
3. Fill in job details and click **Post Job**

**Expected:** Job posted successfully, redirected to dashboard

---

## 🐛 If Still Not Working - Debug Steps

### Open Browser Console (F12 → Console)

**Run this diagnostic:**
```javascript
console.log("=== DIAGNOSTIC ===");

// 1. Check API URL is set
console.log("1. VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);

// 2. Test backend connectivity
fetch('https://job-portal-api.onrender.com/')
  .then(r => r.json())
  .then(d => console.log("2. Backend status:", d))
  .catch(e => console.log("2. Backend error:", e.message));

// 3. Check cookies
console.log("3. Cookies:", document.cookie || 'None set');

// 4. Check localStorage
console.log("4. Redux persist data:", localStorage.getItem('persist:auth') ? 'EXISTS' : 'NOT SET');

// 5. Try login
const testLogin = async () => {
  try {
    const res = await fetch('https://job-portal-api.onrender.com/api/users/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'TestPassword123',
        role: 'Student'
      })
    });
    const data = await res.json();
    console.log("5. Login test:", data);
  } catch (e) {
    console.log("5. Login error:", e.message);
  }
};
testLogin();
```

### Check Network Tab
1. DevTools → **Network** tab
2. Try Login
3. Look for POST request to `/api/users/login`
4. Click it
5. Check Status column for response code

**Status codes:**
- **200** = Success ✅
- **400** = Bad request (check input)
- **401** = Unauthorized (wrong credentials)
- **404** = Not found (wrong endpoint/URL)
- **500** = Server error (backend issue)
- **Network error** = Can't reach backend

---

## ✨ Quick Checklist

- [ ] Added `VITE_API_BASE_URL` to Vercel environment
- [ ] Redeployed Vercel frontend
- [ ] Updated `CORS_ORIGINS` on Render backend
- [ ] Backend showing as "Live" on Render dashboard
- [ ] Backend `/` endpoint returns JSON
- [ ] Login works
- [ ] Logout works
- [ ] Post job works (if recruiter)

---

## 📊 Summary of What Was Fixed

| Issue | Solution | File |
|-------|----------|------|
| **API not reachable from frontend** | Set `VITE_API_BASE_URL` env var on Vercel | Vercel Dashboard |
| **Frontend domain blocked by backend** | Updated `CORS_ORIGINS` on Render | Render Dashboard |
| **Logout not working** | Added `persistor.purge()` in logout handler | Frontend/src/components/components_lite/Navbar.jsx |
| **Redux keeping user logged in** | Redux Persist now properly cleared on logout | Redux store config |
| **Cookies not sent to backend** | `withCredentials: true` in Axios config | Frontend/src/utils/api.js |

---

## 🚀 After All Fixes Are Applied

All three operations should work:
- ✅ **Login:** Frontend → Backend → MongoDB → User logged in
- ✅ **Logout:** Frontend → Backend → Token cleared → localStorage cleared
- ✅ **Post Job:** Frontend → Backend → MongoDB → Job created

---

## 📝 Code Files That Were Already Fixed

### Frontend/src/utils/api.js
- ✅ `withCredentials: true` enabled for cookies
- ✅ Error interceptors logging issues
- ✅ Fallback to localhost if env var not set

### Frontend/src/components/components_lite/Navbar.jsx
- ✅ Logout handler calls backend
- ✅ Clears Redux state
- ✅ Purges Redux Persist localStorage
- ✅ Navigates to home
- ✅ Shows success/error toast

### Backend/index.js
- ✅ CORS configured with credentials
- ✅ Allows requests from frontend domains
- ✅ Health check endpoint at `/`

### Backend/controllers/user.controller.js
- ✅ Login sets HTTP-only cookie
- ✅ Logout clears cookie with maxAge: 0

---

## 🎯 If You're Still Stuck

**Most common issue:** `VITE_API_BASE_URL` not set on Vercel

**How to verify:**
1. Go to Vercel project
2. Go to Settings → Environment Variables
3. Search for `VITE_API_BASE_URL`
4. If it shows `https://job-portal-api.onrender.com` ✅ it's set
5. If it's not there ❌ add it (see SOLUTION PART 1)

**After adding it:**
- Redeploy the project
- Wait for "Ready" status
- Try login again

---

## 📞 Support Information

**Your Deployment URLs:**
- Frontend: https://job-portal-pearl-omega.vercel.app
- Backend: https://job-portal-api.onrender.com
- Backend Health: https://job-portal-api.onrender.com/

**Dashboards:**
- Vercel: https://vercel.com/dashboard
- Render: https://dashboard.render.com

