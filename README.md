# D&D World Manager

Three-tier campaign manager for NPCs, locations, and time-based NPC movement.

## Stack
- React + TypeScript + Vite + Tailwind CSS
- FastAPI + SQLAlchemy 2 + Alembic
- PostgreSQL
- Docker Compose for local PostgreSQL

## Architecture

React UI -> FastAPI JSON API -> PostgreSQL

The intended deployment is behind your Tailscale network, so this skeleton does not implement application authentication.

## Local startup

```bash
docker compose up -d db

cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

API docs: http://localhost:8000/docs

## Scheduling concept

An NPC has one or more schedule rules. Each rule points at a location and contains:
- start/end time
- optional day of week
- priority
- probability
- optional condition text
- enabled flag

This is intentionally the foundation for a later `world_clock`/scheduler service that can evaluate rules, apply randomness, and determine who is present at a location at any moment.
