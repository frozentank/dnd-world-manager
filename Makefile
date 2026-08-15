.PHONY: setup run_dev

BACKEND_PORT=8000

setup:
	sudo docker compose pull db
	cd backend; uv sync --locked; uv run alembic upgrade head
	cd frontend; bun install

run_dev:
	sudo docker compose up -d db
	uv run uvicorn app.main:app --reload --port ${BACKEND_PORT} &
	cd frontend; bun dev