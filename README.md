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

Importing NPC spreadsheet data

1. Make sure your region and location records already exist in the app.
2. Use the CSV header names from the example file in `examples/npc_imports.csv`:
   - ID
   - Name
   - Profession
   - Race
   - Gender
   - Appearance
   - Quirk
   - Secrets
   - Notes
   - Location
   - Region
3. The app matches the `Location` and `Region` values against existing database entries by name.
4. Upload the CSV via the API endpoint `POST /api/npcs/import` with a multipart form field named `file`.

Example:

```bash
curl -X POST http://localhost:8000/api/npcs/import \
  -F "file=@examples/npc_imports.csv"
```

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
