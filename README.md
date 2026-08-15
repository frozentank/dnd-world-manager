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

Requirements:
* make
* [Bun](https://bun.sh/docs/installation)
* [uv](https://docs.astral.sh/uv/getting-started/installation/)
* [docker-ce](https://docs.docker.com/engine/install/) or [podman](https://podman.io/docs/installation) (Preferred)

### Installing 

Technically, `make setup` will execute all of this but `sudo` can cause problems)

```bash
## Prepare the DB

# Optional: Docker perform this pull this when run but this will prepare the environment
# Also, I'm not using user space docker, sudo would be unnecessary if you non-root docker access
sudo docker compose pull db


## Prepare the backend
cd backend
# Optional: uv will actually create the venv and sync dependencies at runtime
uv sync --locked

# Configure the DB tables
uv run alembic upgrade head

## Prepare the frontend
cd ../frontend
bun install
```

### Running

Simpliest: `make run_dev`

Running each component separately:
```bash
# In the first terminal 
# Database (not much is logged here you could add -d)
sudo docker compose up

# In the second terminal
# Backend
cd backend
uv run uvicorn app.main:app --reload --port 8000

# In the third terminal
# Frontend
cd frontend
bun dev
```

Bun should spit out the URL the app is running at.

## Importing NPC spreadsheet data

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
