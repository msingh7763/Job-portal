# 🚀 Quick Deployment Checklist

## Pre-Deployment

### Backend (Render)

- [ ] `Backend/package.json` has `"start": "node index.js"`
- [ ] `Backend/index.js` listens on environment PORT
- [ ] `Backend/.env.example` has all required variables
- [ ] `Backend/render.yaml` exists in root
- [ ] All sensitive data in `.env` (NOT in code)
- [ ] GitHub repo is updated and pushed

### Frontend (Vercel)

- [ ] `Frontend/package.json` has `"build": "vite build"` script
- [ ] `Frontend/vite.config.js` is properly configured
- [ ] `Frontend/.env.example` shows all environment variables
- [ ] `Frontend/vercel.json` exists
- [ ] `.env.local` is in `.gitignore` (don't commit real values)
- [ ] GitHub repo is updated and pushed

---

## Backend Deployment (Render)

1. **Create Service**
   - [ ] Go to render.com → New Web Service
   - [ ] Select GitHub repo
   - [ ] Name: `job-portal-api`
   - [ ] Runtime: Node
   - [ ] Build: `npm install`
   - [ ] Start: `npm start`

2. **Add Environment Variables**

   ```
   NODE_ENV=production
   MONGO_URI=<mongodb_atlas_connection_string>
   JWT_SECRET=<random_32_char_string>
   CLOUD_NAME=<cloudinary>
   CLOUD_API=<cloudinary_key>
   API_SECRET=<cloudinary_secret>
   RECRUITER_SECRET=<random_string>
   ADMIN_SECRET=<random_string>
   CORS_ORIGINS=http://localhost:5175,http://localhost:5173,http://localhost:5174
   ```

3. **Deploy**
   - [ ] Render auto-starts build
   - [ ] Wait for "Live" status
   - [ ] Copy backend URL: `https://job-portal-api.onrender.com`

---

## Frontend Deployment (Vercel)

1. **Create Project**
   - [ ] Go to vercel.com → Add New → Project
   - [ ] Select GitHub repo
   - [ ] Root Directory: `Frontend`
   - [ ] Build Command: `npm run build`
   - [ ] Output: `dist`

2. **Add Environment Variables**

   ```
   VITE_API_BASE_URL=https://job-portal-api.onrender.com
   ```

   (Select: Production, Preview, Development)

3. **Deploy**
   - [ ] Vercel auto-starts build
   - [ ] Wait for "Ready" status
   - [ ] Copy frontend URL: `https://your-project.vercel.app`

---

## Post-Deployment

1. **Update Backend CORS**
   - [ ] Render → Settings → Environment Variables
   - [ ] Update `CORS_ORIGINS` with Vercel frontend URL
   - [ ] Save (auto-redeploys)

2. **Test API Connection**
   - [ ] Open Vercel frontend in browser
   - [ ] Try login or fetch data
   - [ ] Check Network tab → verify calls go to Render backend

3. **Setup Database Access**
   - [ ] MongoDB Atlas → Network Access
   - [ ] Add Render IP or allow `0.0.0.0/0`

---

## Verification URLs

After deployment:

- Frontend: `https://your-project.vercel.app`
- Backend: `https://job-portal-api.onrender.com`
- Health Check: `https://job-portal-api.onrender.com/` (should return JSON)

---

## Quick Reference

| Service  | Platform      | URL          | Environment |
| -------- | ------------- | ------------ | ----------- |
| Frontend | Vercel        | vercel.app   | Production  |
| Backend  | Render        | onrender.com | Production  |
| Database | MongoDB Atlas | mongodb.net  | Production  |

---

## Helpful Commands

```bash
# Verify backend is accessible
curl https://job-portal-api.onrender.com

# Check frontend build locally
cd Frontend
npm run build
npm run preview

# Check backend configuration locally
cd Backend
npm install
npm start
```

---

## Support

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB:** https://docs.atlas.mongodb.com
- **CORS Issues:** Check both Render env var and API configuration
