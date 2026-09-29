# 🚀 VarshaVigyan — Deployment Guide

> **Stack:** React (Vite) → **Vercel** | FastAPI → **Railway** | PostgreSQL → **Neon** | Redis → **Upstash**

---

## 🗺️ Architecture Overview

```
Browser
  │
  ▼
Vercel (Frontend — React/Vite)
  │  VITE_API_URL
  ▼
Railway (Backend — FastAPI/Uvicorn)
  │  DATABASE_URL          REDIS_URL
  ▼                          ▼
Neon (PostgreSQL)        Upstash (Redis)
```

---

## Why These Platforms?

| Service | Platform | Why |
|---------|----------|-----|
| Frontend | **Vercel** | Zero-config Vite/React deploy, free tier, global CDN |
| Backend | **Railway** | Easiest FastAPI deploy, $5 free credit/month, one-click GitHub deploy |
| PostgreSQL | **Neon** | Free 512 MB serverless Postgres, works perfectly with SQLAlchemy |
| Redis | **Upstash** | Free 10K commands/day serverless Redis, HTTP-compatible |

> **Why not Render for backend?** Railway is faster to set up and has better free tier cold-start times for FastAPI. Render free tier sleeps after 15 min of inactivity (painful for demos). Railway keeps it warm.

---

## PART 1 — Cloud Database Setup

### Step 1.1 — PostgreSQL on Neon (Free)

1. Go to **[neon.tech](https://neon.tech)** → Sign up (GitHub login works)
2. Click **"Create Project"**
   - Name: `varshavigyan`
   - Region: `Asia Pacific (Singapore)` ← closest to India
3. After creation, go to **Dashboard → Connection Details**
4. Select **"Connection string"** tab → copy the URL, it looks like:
   ```
   postgresql://varshavigyan_owner:XXXX@ep-something.ap-southeast-1.aws.neon.tech/varshavigyan?sslmode=require
   ```
5. **Save this** — this is your `DATABASE_URL`

> [!IMPORTANT]
> Neon requires `?sslmode=require` at the end of the URL. Don't remove it.

---

### Step 1.2 — Redis on Upstash (Free)

1. Go to **[upstash.com](https://upstash.com)** → Sign up (GitHub login works)
2. Click **"Create Database"**
   - Name: `varshavigyan-redis`
   - Type: **Regional**
   - Region: `ap-southeast-1` (Singapore)
   - Enable **TLS** ✅
3. After creation, go to **Details** tab
4. Copy the **Redis URL**, it looks like:
   ```
   rediss://default:XXXX@ap1-something.upstash.io:6379
   ```
   Note: `rediss://` (with double `s`) = TLS-enabled Redis
5. **Save this** — this is your `REDIS_URL`

---

## PART 2 — Backend on Railway

### Step 2.1 — Prepare backend for deploy

Before pushing, make one small change to `backend/main.py` — update the CORS allowed origins to include your future Vercel URL:

```python
# In main.py, update the allow_origins list:
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://*.vercel.app",          # ← add this
        "https://varshavigyan.vercel.app", # ← add your actual domain later
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Also make sure `backend/requirements.txt` has all packages (double-check it matches exactly):
```
fastapi==0.111.0
uvicorn[standard]==0.29.0
sqlalchemy==2.0.30
psycopg2-binary==2.9.9
alembic==1.13.1
pydantic==2.7.1
pydantic-settings==2.2.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9
redis==5.0.4
httpx==0.27.0
python-dotenv==1.0.1
```

Create `backend/Procfile` (Railway uses this to know how to start):
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

> [!NOTE]
> Railway injects `$PORT` automatically — do NOT hardcode `8000` here.

Push all these changes to GitHub before proceeding.

---

### Step 2.2 — Deploy to Railway

1. Go to **[railway.app](https://railway.app)** → Sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repo → Railway will auto-detect it
4. Railway will try to deploy the root — **set the Root Directory to `backend`**:
   - Click your service → **Settings** → **Root Directory** → type `backend`
5. Go to **Variables** tab → Add these one by one:

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | Your Neon connection string |
   | `REDIS_URL` | Your Upstash Redis URL |
   | `SECRET_KEY` | Any long random string (e.g. `varshavigyan-prod-secret-2026-sih`) |
   | `ALGORITHM` | `HS256` |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` |

6. Click **Deploy** — Railway will install requirements and start the server
7. Once deployed, go to **Settings → Networking → Generate Domain**
   - You'll get a URL like: `https://varshavigyan-backend.up.railway.app`
   - **Save this** — needed for frontend

> [!TIP]
> Check **Deploy Logs** in Railway if anything fails. Common issue: missing package in requirements.txt.

---

### Step 2.3 — Run database migrations on Railway

Your tables need to be created in Neon. Do this from your **local machine** using the Neon connection string:

```bash
# From your local backend/ folder
cd backend

# Set the DATABASE_URL to your Neon URL temporarily
$env:DATABASE_URL = "postgresql://varshavigyan_owner:XXXX@ep-something.neon.tech/varshavigyan?sslmode=require"

# Run this Python script to create all tables
python -c "
from app.database import engine
from app import models
models.Base.metadata.create_all(bind=engine)
print('All tables created successfully!')
"
```

> [!NOTE]
> This uses SQLAlchemy's `create_all` which reads all your ORM models and creates the tables. You don't need Alembic for the initial deploy.

---

## PART 3 — Frontend on Vercel

### Step 3.1 — Prepare frontend for deploy

The frontend already uses `VITE_API_URL` in `src/api/axios.js` — perfect.

Create `frontend/.env.production` (**do NOT commit this to GitHub**):
```
VITE_API_URL=https://varshavigyan-backend.up.railway.app/api/v1
```

Add it to `.gitignore` if not already there:
```
frontend/.env.production
frontend/.env.local
```

Instead, you'll set this in the Vercel dashboard (next step).

---

### Step 3.2 — Deploy to Vercel

1. Go to **[vercel.com](https://vercel.com)** → Sign up with GitHub
2. Click **"Add New Project"** → Import your GitHub repo
3. Vercel will auto-detect Vite — but set these settings manually:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Expand **"Environment Variables"** section → Add:

   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | `https://varshavigyan-backend.up.railway.app/api/v1` |

5. Click **"Deploy"**
6. After deploy, you'll get a URL like: `https://varshavigyan.vercel.app`

---

### Step 3.3 — Fix React Router on Vercel

Vercel needs a config file to handle client-side routing (otherwise refreshing any page gives a 404).

Create `frontend/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Commit and push — Vercel will auto-redeploy.

---

### Step 3.4 — Update CORS on backend

Now that you have your actual Vercel URL, go back to **Railway → Variables** and also update your `main.py`:

```python
allow_origins=[
    "http://localhost:5173",
    "https://varshavigyan.vercel.app",  # ← your exact Vercel URL
]
```

Push to GitHub → Railway will auto-redeploy.

---

## PART 4 — Verification Checklist

After both are deployed, verify each step:

- [ ] Open `https://your-railway-url.up.railway.app/` → should return JSON with service info
- [ ] Open `https://your-railway-url.up.railway.app/docs` → FastAPI Swagger UI loads
- [ ] Open `https://your-railway-url.up.railway.app/health` → check DB and Redis status
- [ ] Open `https://varshavigyan.vercel.app` → frontend loads
- [ ] On frontend, navigate to Bias Correction → Export CSV works
- [ ] On frontend, navigate to Forecast Map → map shows India

---

## PART 5 — Ongoing Workflow

Every time you push to GitHub:
- **Railway** auto-redeploys the backend ✅
- **Vercel** auto-redeploys the frontend ✅

No manual steps needed after initial setup.

---

## Troubleshooting

### Backend not starting on Railway
```
Check: Deploy Logs in Railway dashboard
Common fix: Make sure Procfile exists in backend/ folder
```

### Frontend shows "Backend unreachable — using demo data"
```
Check: VITE_API_URL is set correctly in Vercel environment variables
Check: CORS in main.py includes your Vercel domain exactly
Check: Railway service is running (not sleeping)
```

### Database connection error in Railway
```
Check: DATABASE_URL variable is set in Railway and ends with ?sslmode=require
Check: Neon project is not paused (free tier auto-pauses after 5 days of inactivity)
To wake Neon: just visit neon.tech dashboard and click your project
```

### Redis connection error
```
Check: REDIS_URL starts with rediss:// (double s = TLS)
Check: Upstash database region matches — some regions have different URLs
```

---

## Cost Summary (Free Tier)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| Vercel | ✅ Free forever | 100 GB bandwidth/month |
| Railway | ✅ $5 credit/month | ~500 hours runtime |
| Neon | ✅ Free forever | 512 MB storage, 1 project |
| Upstash Redis | ✅ Free forever | 10,000 commands/day |

> For a hackathon demo, all of these free tiers are more than sufficient. 🎉
