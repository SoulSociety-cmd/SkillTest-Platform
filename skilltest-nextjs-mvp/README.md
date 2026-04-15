# SkillTest Next.js MVP 🚀

## Quick Start (5min)

1. **Clone & Install**
```bash
cd f:/HireBySkill/skilltest-nextjs-mvp
npm install
```

2. **MongoDB Atlas** (Free)
- Create free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
- Get connection string → paste to `.env.local`
```
MONGODB_URI="mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/skilltest"
```

3. **NextAuth** (Optional Google)
```
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
# Google Console → add to .env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

4. **Run Dev**
```bash
npm run dev
```
Open http://localhost:3000

## Features
✅ Landing + Auth (Email/Google)  
✅ Dashboard + JS Calculator Test (Monaco Editor)  
✅ Auto-grading 3 test cases + 15min timer  
✅ Results + Job matching badges  
✅ Vercel-ready  

## Test Flow
1. Login (email: test@test.com / pass: test123 or Google)
2. Dashboard → Take Calculator Test
3. Build `calculate(a, op, b)` → Run Tests
4. Get score → See matching!

## Deploy to Vercel (2min)
```
npm i -g vercel
vercel --prod
```
Add env vars in Vercel dashboard.

## Test Cases (Calculator)
```
calculate(2, '+', 2) → 4    (33%)
calculate(5, '-', 3) → 2    (33%) 
calculate(4, '*', 3) → 12   (34%)
```

Perfect for Junior JS roles!
