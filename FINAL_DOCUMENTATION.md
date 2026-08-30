# 🎓 AI Quiz App - Complete Documentation

**Live URL:** https://ai-quize.vercel.app

---

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Features](#features)
3. [How to Use](#how-to-use)
4. [Architecture](#architecture)
5. [Credentials](#credentials)
6. [Troubleshooting](#troubleshooting)
7. [Next Steps](#next-steps)

---

## ⚡ Quick Start

### Access the App
1. Open: **https://ai-quize.vercel.app**
2. You'll see the login page with two tabs:
   - **Admin Login** (create students, manage accounts)
   - **User Login** (students take quizzes)

### Default Admin Account
```
Username: admin
Password: admin123
```

### First Time Setup
1. Login as Admin
2. Go to "Manage Students" section
3. Create student accounts (e.g., john/john123, sara/sara123)
4. Share credentials with students

---

## ✨ Features

### For Admins
- ✅ **Manage Students**: Create, view, delete student accounts
- ✅ **Generate Invites**: Create shareable invite links
- ✅ **View Dashboard**: Monitor all student activity
- ✅ **Secure Access**: Only admins can create accounts

### For Students  
- ✅ **Free-Form Topics**: Choose any topic for quiz generation
- ✅ **AI-Generated Questions**: Powered by OpenRouter AI
- ✅ **Multiple Topics**: 
  - Artificial Intelligence
  - Machine Learning
  - Python Programming
  - Java Programming
  - Database Management
  - Computer Networks
  - Cyber Security
  - Web Development
  - Operating Systems
  - Software Engineering
- ✅ **Instant Feedback**: See score and answers immediately
- ✅ **Progress Tracking**: All attempts saved to Supabase

---

## 🎯 How to Use

### Admin Flow
```
1. Login: admin / admin123
   ↓
2. Click "Manage Students"
   ↓
3. Fill in student info:
   - Name: John Doe
   - Username: john
   - Password: john123
   ↓
4. Click "Create Student"
   ↓
5. Student can now login with john / john123
```

### Student Flow
```
1. Switch to "User Login" tab
   ↓
2. Enter credentials (created by admin)
   ↓
3. Select a topic from dropdown
   ↓
4. Click "Start Quiz"
   ↓
5. Answer each question
   ↓
6. Click "Next" to proceed
   ↓
7. After all questions: See score + review answers
   ↓
8. Can retake or select different topic
```

---

## 🏗️ Architecture

### Frontend (Vercel)
- **Framework**: React + Vite
- **Styling**: CSS3 + Bootstrap
- **Storage**: Browser localStorage (session persistence)
- **URL**: https://ai-quize.vercel.app

### Backend (Your Machine Currently)
- **Framework**: Express.js
- **Port**: 5000
- **API**: REST endpoints for quizzes
- **Status**: Running locally (can be deployed to Railway)

### Database (Supabase)
- **Service**: PostgreSQL-based
- **Tables**: users (id, username, password, name, role, created_at)
- **Security**: Service role key in .env
- **Backup**: Automatic Supabase backups

### AI Provider (OpenRouter)
- **Service**: OpenRouter API
- **Model**: openai/gpt-4o-mini
- **Billing**: Pay-per-use (very cheap)
- **Alternative**: Can use other models

---

## 🔐 Credentials

### Admin Account (Pre-created)
```
Role: Admin
Username: admin
Password: admin123
Can: Create/delete students, manage accounts
```

### Student Accounts
- **Created by**: Admin
- **Format**: Any username/password combo
- **Permissions**: Take quizzes, view results
- **Storage**: All in Supabase

### Environment Variables (.env)
```env
PORT=5000
SUPABASE_URL=https://kqgjokbdvgkcnledgkw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_****  # From Supabase dashboard
OPENROUTER_API_KEY=sk-or-****             # From OpenRouter.ai
OPENROUTER_MODEL=openai/gpt-4o-mini
```

---

## 🐛 Troubleshooting

### Problem: Login not working
**Solution:**
- Clear browser cookies/cache
- Try incognito/private window
- Make sure you're using correct credentials

### Problem: Quiz questions not loading
**Solution:**
- Check internet connection
- Verify OpenRouter API key is valid
- Make sure backend is running (if local)

### Problem: Student data not saving
**Solution:**
- Verify Supabase connection
- Check network tab in DevTools
- Ensure service role key is correct

### Problem: Slow quiz generation
**Solution:**
- AI takes 2-5 seconds to generate
- Network latency affects speed
- Try a simpler topic

---

## 🚀 Next Steps for Production

### Option 1: Keep Running Locally (Current)
- ✅ Fully functional
- ✅ Free forever
- ⚠️ Only works when your machine is on
- ⚠️ Need to keep terminal running

### Option 2: Deploy Backend to Railway (Recommended)
**Cost**: FREE  
**Setup time**: 5 minutes  
**Steps**:
1. Go to https://railway.app
2. Connect GitHub account
3. Select AI_QUIZE repository
4. Add environment variables
5. Deploy (automatic)
6. Get permanent backend URL
7. Update frontend with new URL
8. Done! ✅

**See**: `RAILWAY_DEPLOYMENT.md` for detailed steps

### Option 3: Add Custom Domain
- Railway supports custom domains
- Connect your own domain
- Make it look professional

---

## 📊 System Status

✅ **Frontend**: Deployed on Vercel (always online)
✅ **Database**: Running on Supabase (always online)  
⚠️ **Backend**: Running locally (needs your machine on)

**Recommendation**: Deploy backend to Railway for complete 24/7 uptime!

---

## 💡 Tips & Tricks

### For Best Results
1. **Use modern browsers**: Chrome, Firefox, Safari, Edge
2. **Keep credentials private**: Don't share admin password
3. **Regular backups**: Supabase auto-backs up
4. **Monitor usage**: Check student progress regularly

### Customizations You Can Make
1. **Change colors**: Edit `src/App.css`
2. **Add more topics**: Edit topic array in `src/App.jsx`
3. **Change AI model**: Update `OPENROUTER_MODEL` in `.env`
4. **Customize questions**: Modify system prompt in backend

---

## 📞 Support

### Issues with Quiz Generation
- Verify OpenRouter API key
- Check account has credits
- Try simpler topic

### Issues with Login/Data
- Verify Supabase credentials
- Check .env file
- Review browser console errors

### Performance Issues
- Clear browser cache
- Check internet connection
- Verify backend is running

---

## 📦 Files & Folders

```
Quize/
├── src/                  # React source code
│   ├── App.jsx          # Main app logic
│   ├── App.css          # Styling
│   └── assets/          # Images/media
├── server.js            # Express backend
├── .env                 # Environment variables
├── package.json         # Dependencies
├── vite.config.js       # Vite config
├── vercel.json          # Vercel deployment config
├── index.html           # Entry point
├── netlify.toml         # Netlify config
└── supabase.sql         # Database schema
```

---

## 🎉 You're All Set!

**Your app is production-ready!**

Share this URL with your students:
```
🌐 https://ai-quize.vercel.app
```

They can:
- ✅ Login with their credentials
- ✅ Take AI-generated quizzes
- ✅ Get instant feedback
- ✅ Track their progress

**Happy learning! 🚀**
