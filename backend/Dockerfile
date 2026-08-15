FROM ghcr.io/astral-sh/uv:python3.12-alpine

COPY . /app

ENV UV_NO_DEV=1

WORKDIR /app
RUN uv sync --locaked

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
