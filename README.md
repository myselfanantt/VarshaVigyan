# RainSense AI
### Regime-Aware AI Post-Processing of Monsoon Rainfall Forecasts

**Smart India Hackathon 2026 | Problem ID: 26080**  
Ministry of Earth Sciences (MoES) / National Centre for Medium Range Weather Forecasting (NCMRWF)

## Architecture

```
rainsense-ai/
├── backend/    FastAPI + PostgreSQL + Redis
└── frontend/   React + Vite + Tailwind + Recharts + Leaflet
```

## Quick Start

Prerequisites: Docker and Docker Compose installed.

```bash
git clone https://github.com/your-team/rainsense-ai.git
cd rainsense-ai
docker-compose up --build
```

Services:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- pgAdmin: http://localhost:5050 (admin@rainsense.gov.in / admin123)
- Redis: localhost:6379

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Charts | Recharts |
| Maps | Leaflet.js + react-leaflet |
| State | Zustand |
| API Client | Axios + TanStack React Query |
| Backend | FastAPI Python 3.11 |
| Database | PostgreSQL 15 + pgAdmin 4 |
| Cache | Redis 7 |
| DevOps | Docker + Docker Compose |

## Features
- Weather regime classifier (rule-based, 6 regimes)
- Bias correction engine with regime-specific methods
- District-level forecast map with Leaflet
- Verification report with RMSE, ETS, CSI, POD, FAR, FSS
- Real-time model run status dashboard
- Export CSV and PDF reports

## Team
[Add team member names here]

## License
MIT
