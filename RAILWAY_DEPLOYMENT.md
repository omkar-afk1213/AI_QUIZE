# 🚀 Deploy Backend to Railway (5 Minutes)

## Why Railway?
- ✅ Completely FREE
- ✅ Automatic deployments from GitHub
- ✅ Permanent URL that never changes
- ✅ Perfect for Node.js/Express

---

## Step-by-Step Instructions

### 1. Go to Railway
Visit: **https://railway.app**

### 2. Sign Up/Login
- Click "Login"
- Choose "GitHub" (use your GitHub account)
- Authorize Railway

### 3. Create New Project
- Click "New Project"
- Select "Deploy from GitHub"

### 4. Connect Repository
- Find: **omkar-afk1213/AI_QUIZE**
- Click to select it
- Authorize Railway to access your repo

### 5. Configure Service
- Root Directory: `.` (current directory)
- Start Command: `node server.js`
- Click "Deploy"

### 6. Add Environment Variables
Once deployed, click the project → "Variables" → Add these:

```
PORT=5000
SUPABASE_URL=https://kqgjokbdvgkcnledgkw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[Your actual key from .env]
OPENROUTER_API_KEY=[Your OpenRouter API key]
OPENROUTER_MODEL=openai/gpt-4o-mini
```

### 7. Get Your Backend URL
- Go to Deployments
- Copy the URL (looks like: `https://yourapp-prod.railway.app`)
- This is your permanent backend!

---

## Update Your Frontend

Once you have the Railway URL:

1. Go to **Vercel Dashboard**
2. Select your project: **ai-quize**
3. Go to **Settings** → **Environment Variables**
4. Add/Update:
   ```
   VITE_API_URL=https://yourapp-prod.railway.app
   ```
5. Click **Deployments** → **Redeploy**
6. Wait 1-2 minutes

---

## Verify It Works

Your app will now use the **permanent backend URL** instead of localhost!

✅ Done! Your app is now **fully production-ready**!
