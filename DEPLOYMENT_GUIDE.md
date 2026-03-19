# 🚀 Full Stack Deployment Guide

Deploy **Backend** on Render and **Frontend** on Vercel.

---

## 📋 Prerequisites

- [GitHub](https://github.com) account with your repo pushed
- [Render](https://render.com) account
- [Vercel](https://vercel.com) account
- MongoDB Atlas (or local MongoDB accessible from internet)
- Cloudinary account
- SMTP credentials (Gmail, SendGrid, etc.)

---

## 🔧 STEP 1: Backend Deployment (Render)

### 1.1 Prepare Backend Repository

Ensure these files exist in your Backend folder:

- ✅ `package.json` (with `"start": "node index.js"`)
- ✅ `index.js` (configured for production)
- ✅ `.env.example` (with all required variables)
- ✅ `render.yaml` (deployment config)

### 1.2 Push Backend to GitHub

```bash
cd Backend
git add .
git commit -m "Backend ready for Render deployment"
git push origin main
```

### 1.3 Create Render Web Service

1. Go to [render.com](https://render.com) → Sign up/Login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `job-portal-api` (or your choice)
   - **Environment:** Node
   - **Region:** Choose closest to users
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (spins down after 15 min) or Starter ($7/month)

### 1.4 Add Environment Variables on Render

In Render dashboard → **Settings** → **Environment**:

```
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/job-portal
JWT_SECRET=your_very_secure_secret_key_here
CLOUD_NAME=your_cloudinary_name
CLOUD_API=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
RECRUITER_SECRET=recruiter_unique_secret
ADMIN_SECRET=admin_unique_secret
CORS_ORIGINS=https://yourdomain.vercel.app,https://www.yourdomain.vercel.app
```

### 1.5 Deploy Backend

- Render automatically deploys on GitHub push
- Monitor deployment in **Logs** tab
- Once deployed, you'll get a URL like: `https://job-portal-api.onrender.com`

---

## 🎨 STEP 2: Frontend Deployment (Vercel)

### 2.1 Prepare Frontend Repository

Ensure these files exist in your Frontend folder:

- ✅ `package.json` (with build scripts)
- ✅ `vite.config.js` (configured correctly)
- ✅ `.env.example` (with API URL placeholder)
- ✅ `vercel.json` (deployment config)

### 2.2 Create .env.production locally (DO NOT commit)

```bash
cd Frontend
cp .env.example .env.production
```

Edit `.env.production`:

```
VITE_API_BASE_URL=https://job-portal-api.onrender.com
```

### 2.3 Push Frontend to GitHub

```bash
cd Frontend
git add .
git commit -m "Frontend ready for Vercel deployment"
git push origin main
```

### 2.4 Deploy on Vercel

**Option A: Simple (Recommended)**

1. Go to [vercel.com](https://vercel.com) → Sign up/Login with GitHub
2. Click **"Add New..."** → **"Project"**
3. Select your repository
4. Vercel auto-detects Vite setup
5. Configure:
   - **Root Directory:** `Frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

**Option B: Advanced CLI**

```bash
# Install Vercel CLI
npm install -g vercel

cd Frontend
# Deploy
vercel
```

### 2.5 Add Environment Variables on Vercel

In Vercel Dashboard → **Settings** → **Environment Variables**:

```
VITE_API_BASE_URL=https://job-portal-api.onrender.com
```

- Select environments: **Production**, **Preview**, **Development**
- Click **Save**

### 2.6 Deploy Frontend

- Either push to GitHub (auto-deploy) or run `vercel --prod`
- Monitor deployment in Vercel dashboard
- Your frontend URL: `https://your-project.vercel.app`

---

## ✅ STEP 3: Verification & Configuration

### 3.1 Update Backend CORS

Once frontend is deployed on Vercel:

1. Go to Render Dashboard → Your Job Portal API service
2. **Settings** → **Environment Variables**
3. Update `CORS_ORIGINS`:
   ```
   https://your-project.vercel.app,https://www.your-project.vercel.app
   ```
4. **Save** (auto-redeploys)

### 3.2 Update Frontend API URL

If your Render backend URL is different:

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Update `VITE_API_BASE_URL` with actual Render URL
3. **Save** and redeploy

### 3.3 Test API Connectivity

1. Go to deployed frontend: `https://your-project.vercel.app`
2. Open Browser DevTools → **Network** tab
3. Try logging in or fetching jobs
4. Check that requests go to your Render backend

### 3.4 MongoDB Atlas Whitelist

Ensure Render can access your MongoDB:

1. Go to MongoDB Atlas → **Network Access**
2. Click **Add IP Address**
3. Add Render IPs or allow `0.0.0.0/0` (all IPs)

---

## 🏗️ Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Vercel (Frontend)               │
│  https://your-project.vercel.app        │
│  - React + Vite                         │
│  - Static files hosting                 │
│  - Auto-redeploy on GitHub push         │
└────────────────┬────────────────────────┘
                 │
                 │ API Calls (axios)
                 ↓
┌─────────────────────────────────────────┐
│         Render (Backend)                │
│  https://job-portal-api.onrender.com    │
│  - Express API                          │
│  - Node.js runtime                      │
│  - Auto-redeploy on GitHub push         │
└────────────────┬────────────────────────┘
                 │
                 │ MongoDB Connection
                 ↓
┌─────────────────────────────────────────┐
│       MongoDB Atlas (Database)          │
│  mongodb+srv://...                      │
│  - Cloud MongoDB cluster                │
└─────────────────────────────────────────┘
```

---

## 🔐 Environment Variables Checklist

### Backend (Render) - Required

- [ ] `NODE_ENV=production`
- [ ] `MONGO_URI` → MongoDB Atlas connection string
- [ ] `JWT_SECRET` → 32+ character random string
- [ ] `CLOUD_NAME` → Cloudinary account name
- [ ] `CLOUD_API` → Cloudinary API key
- [ ] `API_SECRET` → Cloudinary API secret
- [ ] `RECRUITER_SECRET` → Random string for recruiter auth
- [ ] `ADMIN_SECRET` → Random string for admin auth
- [ ] `CORS_ORIGINS` → Your Vercel frontend URL

### Frontend (Vercel) - Required

- [ ] `VITE_API_BASE_URL` → Your Render backend URL

---

## 🆘 Troubleshooting

### Frontend Build Fails

```
Error: Cannot find module 'react'
```

→ Run `npm install` in Frontend folder before pushing

### API Calls Return 502 Bad Gateway

```
→ Backend crashed on Render
→ Check Render Logs for errors
→ Verify MONGO_URI and other env vars are set
```

### CORS Error: "No 'Access-Control-Allow-Origin' header"

```
→ Update CORS_ORIGINS on Render with your Vercel URL
→ Wait for Render to auto-redeploy (1-2 min)
```

### MongoDB Connection Timeout

```
→ Add Render IP to MongoDB Atlas whitelist
→ Or allow all IPs (0.0.0.0/0)
```

### Render Backend Spins Down

```
→ Expected on free plan (15 min inactivity)
→ First request after spin-down will be slow (30 sec)
→ Upgrade to Starter plan ($7/month) for always-on
```

### Vercel: "Environment variable not found"

```
→ Verify VITE_ prefix in variable name
→ Only env vars with VITE_ prefix work in Vite build-time
→ Redeploy after adding variables
```

---

## 📊 Monitoring

### Backend (Render)

- Logs: Dashboard → Your service → **Logs** tab
- Metrics: Dashboard → Your service → **Metrics** tab
- Alerts: Settings → **Monitoring & Alerts**

### Frontend (Vercel)

- Logs: Dashboard → Your project → **Deployments** → Click build
- Analytics: Dashboard → **Analytics** tab

---

## 🎯 Next Steps (Optional)

- [ ] Setup custom domain for both services
- [ ] Enable HTTPS (automatic on both platforms)
- [ ] Configure email notifications for deployments
- [ ] Setup automatic backups for MongoDB
- [ ] Monitor API performance with tools like New Relic
- [ ] Implement error tracking (Sentry)
- [ ] Setup CI/CD with GitHub Actions for testing

---

## Links

- Render: https://render.com
- Vercel: https://vercel.com
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Cloudinary: https://cloudinary.com

**Good luck! 🚀**
