# 🔐 Environment Variables Setup Guide

## Frontend Environment Variables (Vercel)

### How to Set Them:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your **job-portal** (Frontend) project
3. Click **Settings** → **Environment Variables**
4. Add each variable as shown below

---

## Required Frontend Variables

### 1. VITE_API_BASE_URL (CRITICAL ⚠️)
```
Name:  VITE_API_BASE_URL
Value: https://job-portal-api.onrender.com
Type:  Plain Text
Environments: Production, Preview, Development
```
**Purpose:** Tells frontend where the backend API is located  
**Must be set or:** All API calls will fail (login, logout, post job)  
**Example value:** `https://job-portal-api.onrender.com`

### 2. VITE_API_TIMEOUT (Optional but Recommended)
```
Name:  VITE_API_TIMEOUT
Value: 10000
Type:  Plain Text
Environments: Production, Preview, Development
```
**Purpose:** Request timeout in milliseconds (prevents hanging)  
**Default:** 10 seconds (10000ms)  
**Use:** Currently unused but available for future use

---

## Backend Environment Variables (Render)

### How to Set Them:
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **job-portal-api** service
3. Click **Settings** → **Environment** section
4. Update or add each variable as shown below

---

## Required Backend Variables

### 1. NODE_ENV (CRITICAL ⚠️)
```
NODE_ENV=production
```
**Purpose:** Controls security features (cookies, CORS, etc.)  
**Values:** `production` or `development`  
**Production Settings:** Enables `secure: true` and `sameSite: "None"` for cookies

### 2. CORS_ORIGINS (CRITICAL ⚠️)
```
CORS_ORIGINS=https://job-portal-pearl-omega.vercel.app,https://www.job-portal-pearl-omega.vercel.app,http://localhost:5173,http://localhost:5174
```
**Purpose:** Allows frontend to communicate with backend  
**Must include:** Your Vercel frontend URL  
**Format:** Comma-separated list of allowed domains  
**Common values:**
- Production: `https://job-portal-pearl-omega.vercel.app`
- With www: Add both with and without www
- Development: `http://localhost:5173`, `http://localhost:5174`

### 3. PORT (Optional)
```
PORT=5001
```
**Purpose:** What port backend runs on  
**Default:** 5001 (if not set)  
**Note:** Render automatically sets this

### 4. MONGODB_URI (CRITICAL ⚠️)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job-portal
```
**Purpose:** Connection string for MongoDB Atlas database  
**Where to get:** MongoDB Atlas dashboard
**Format:** `mongodb+srv://user:pass@cluster/database`

### 5. JWT_SECRET (CRITICAL ⚠️)
```
JWT_SECRET=your-super-secret-key-min-32-chars
```
**Purpose:** Secret key for signing JWT tokens  
**Requirements:**
- At least 32 characters
- Keep it secret!
- Same value for all instances
- Can be any random string

### 6. CLOUDINARY_NAME (Optional - if using image upload)
```
CLOUDINARY_NAME=your-cloudinary-name
```
**Purpose:** Cloudinary account name for image uploads  
**Where to get:** Cloudinary dashboard

### 7. CLOUDINARY_API_KEY (Optional)
```
CLOUDINARY_API_KEY=your-api-key
```
**Purpose:** Cloudinary API key  
**Where to get:** Cloudinary dashboard

### 8. CLOUDINARY_API_SECRET (Optional)
```
CLOUDINARY_API_SECRET=your-api-secret
```
**Purpose:** Cloudinary API secret  
**Where to get:** Cloudinary dashboard

---

## Quick Setup Checklist

### Frontend (Vercel) - MUST DO:
- [ ] Add `VITE_API_BASE_URL` = `https://job-portal-api.onrender.com`
- [ ] Redeploy after adding
- [ ] Wait for "Ready" status

### Backend (Render) - MUST DO:
- [ ] Verify `NODE_ENV` = `production`
- [ ] Update `CORS_ORIGINS` to include Vercel URL
- [ ] Verify `MONGODB_URI` is set
- [ ] Verify `JWT_SECRET` is set
- [ ] Add Cloudinary variables if using image upload

---

## Testing After Setup

### Terminal Command (Windows PowerShell):
```powershell
# Test frontend can reach backend
Invoke-WebRequest -Uri "https://job-portal-api.onrender.com/" -UseBasicParsing | ConvertFrom-Json

# Should show:
# message : Job Portal backend is running 🚀
# success : True
```

### Browser Console:
```javascript
// Test API configuration
console.log("API URL:", import.meta.env.VITE_API_BASE_URL);

// Test backend connectivity
fetch('https://job-portal-api.onrender.com/')
  .then(r => r.json())
  .then(d => console.log("Backend status:", d))
  .catch(e => console.log("Error:", e.message));
```

---

## Troubleshooting

### Issue: "Cannot reach server"
**Solution:**
1. Check `VITE_API_BASE_URL` is set on Vercel
2. Verify Render backend is "Live"
3. Test: `https://job-portal-api.onrender.com/` in browser

### Issue: "CORS error"
**Solution:**
1. Check `CORS_ORIGINS` includes Vercel domain
2. Format should be: `https://job-portal-pearl-omega.vercel.app`
3. Redeploy Render backend after update

### Issue: "401 Unauthorized"
**Solution:**
1. Check `JWT_SECRET` is set on Render
2. Verify user credentials are correct
3. Check cookies are being sent/received

### Issue: "Cookie not being set"
**Solution:**
1. Verify `CORS_ORIGINS` has correct domain
2. Check `NODE_ENV` is `production`
3. Verify `withCredentials: true` in frontend API client

### Issue: "Cannot upload profile photo"
**Solution:**
1. Add Cloudinary environment variables:
   - `CLOUDINARY_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
2. Redeploy backend

---

## Production vs Development

### Development (localhost)
```
# Frontend (.env.local)
VITE_API_BASE_URL=http://localhost:5001

# Backend (.env)
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

### Production (Vercel + Render)
```
# Frontend (Vercel Environment Variables)
VITE_API_BASE_URL=https://job-portal-api.onrender.com

# Backend (Render Environment Variables)
NODE_ENV=production
CORS_ORIGINS=https://job-portal-pearl-omega.vercel.app,https://www.job-portal-pearl-omega.vercel.app
```

---

## Vercel Environment Variables Reference

**Location:** Vercel Dashboard → Your Project → Settings → Environment Variables

**Available in all environments by default:**
- `VITE_API_BASE_URL`
- `VITE_API_TIMEOUT`

**Filtered by environment:**
- Production: Deployed version
- Preview: Pull request previews
- Development: Local `vercel dev` command

---

## Render Environment Variables Reference

**Location:** Render Dashboard → Service → Settings → Environment

**Auto-set by Render:**
- `PORT` (usually 5001)
- `NODE_ENV` (inherits from settings)

**Must set manually:**
- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGINS`
- `CLOUDINARY_*` (if using image uploads)

---

## Security Best Practices

✅ **DO:**
- Keep `JWT_SECRET` secret (don't commit to GitHub)
- Use strong secrets (min 32 characters)
- Keep `CLOUDINARY_API_SECRET` secret
- Rotate secrets periodically
- Use different secrets per environment

❌ **DON'T:**
- Commit `.env` files to Git
- Share environment variables in chat/email
- Use weak secrets like "password123"
- Use same secret across environments
- Leave secrets in code comments

---

## Deployment Checklist

Before considering deployment complete:

- [ ] `VITE_API_BASE_URL` set on Vercel
- [ ] Frontend redeployed after adding env var
- [ ] `CORS_ORIGINS` includes Vercel domain on Render
- [ ] Backend is "Live" on Render
- [ ] Backend `/` endpoint returns JSON
- [ ] Login works
- [ ] Logout works
- [ ] Post job works (if Recruiter)
- [ ] Profile photo upload works (if using)

---

## Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Render Dashboard:** https://dashboard.render.com
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Cloudinary Dashboard:** https://cloudinary.com/console

---

## Need Help?

1. **API not working?** Check `VITE_API_BASE_URL` on Vercel
2. **CORS errors?** Check `CORS_ORIGINS` on Render
3. **Upload not working?** Add Cloudinary variables
4. **Still stuck?** Run diagnostic console commands (see Testing section)

