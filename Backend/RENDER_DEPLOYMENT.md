# Render Deployment Guide

## Changes Made for Render Deployment

### 1. **package.json** ✅

- Added `"start": "node index.js"` script
- Render uses this to start your application

### 2. **index.js** ✅

- Updated server initialization to listen on `0.0.0.0` and environment PORT
- Added proper startup sequence that connects DB first
- Proper error handling during startup

### 3. **.env.example** ✅

- Added `NODE_ENV=production` variable
- Added `CORS_ORIGINS` for frontend URLs
- Document shows production-ready configuration

### 4. **render.yaml** ✅

- Configuration template for Render deployment
- Specifies Node.js runtime and environment variables

---

## Deployment Steps

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare backend for Render deployment"
git push origin main
```

### Step 2: Create Render Account

- Go to https://render.com
- Sign up with GitHub (recommended)

### Step 3: Create New Web Service

1. Click "New Web Service"
2. Connect your GitHub repository
3. Select the repository containing your backend
4. Fill in the following:
   - **Name:** `job-portal-api` (or your preferred name)
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Region:** Choose closest to your users

### Step 4: Add Environment Variables

In Render dashboard, add these environment variables in Settings > Environment:

```
NODE_ENV = production
PORT = 10000
MONGO_URI = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret
CLOUD_NAME = your_cloudinary_name
CLOUD_API = your_cloudinary_key
API_SECRET = your_cloudinary_secret
RECRUITER_SECRET = your_recruiter_secret
ADMIN_SECRET = your_admin_secret
CORS_ORIGINS = https://yourdomain.com,https://www.yourdomain.com
```

### Step 5: Update Frontend CORS

Once you get your Render backend URL (e.g., `https://job-portal-api.onrender.com`):

1. Update `CORS_ORIGINS` environment variable on Render with your frontend production URL
2. Update frontend API base URL to point to your Render backend URL

### Step 6: Database Connection

- Make sure your MongoDB connection string allows connections from Render IPs
  - For MongoDB Atlas: Whitelist `0.0.0.0/0` (all IPs) or specific Render regions
  - Or use environment IP whitelist in MongoDB Atlas

---

## Important Notes

✅ **Free Plan Limitations:**

- Spins down after 15 minutes of inactivity (response will be slow on first request)
- Upgrade to Starter ($7/month) for always-on instances

✅ **Port Configuration:**

- Render automatically assigns PORT via environment variable
- Our code reads from `process.env.PORT || 5001`

✅ **Socket.io Production:**

- Working with CORS configuration
- Ensure frontend Socket.io client connects to Render backend URL

✅ **Logs:**

- View real-time logs in Render dashboard under "Logs"

---

## Testing Before Deployment

Locally test with production-like settings:

```bash
NODE_ENV=production node index.js
```

---

## Troubleshooting

### Build fails

- Check `npm install` completes without errors
- Ensure `package.json` has all required dependencies

### MongoDB connection error

- Verify `MONGO_URI` is correct and accessible from Render
- Check MongoDB Atlas IP whitelist

### CORS errors

- Update `CORS_ORIGINS` with your frontend production domain
- Format: `https://domain.com,https://www.domain.com`

### Application crashes after deployment

- Check Render logs for specific errors
- Verify all environment variables are set

---

## Your Backend URL

Once deployed, your API will be available at:

```
https://job-portal-api.onrender.com
```

(Render generates the exact URL after deployment)

Update your frontend to use this URL for all API calls.
