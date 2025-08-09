# Python LLM Microservice

A simple Flask service that proxies requests to Azure OpenAI Chat Completions.

## Endpoints

- POST `/generate` — body: `{ "prompt": "..." }` → response: `{ "response": "..." }`
- GET `/health` — health check

## Environment

Required:
- `AZURE_OPENAI_ENDPOINT` — e.g. `https://your-resource-name.openai.azure.com`
- `AZURE_OPENAI_KEY` — your Azure OpenAI API key

Optional:
- `AZURE_OPENAI_DEPLOYMENT` — your deployment name (default: `gpt-4o`)
- `AZURE_OPENAI_API_VERSION` — default: `2024-02-15-preview`
- `ALLOWED_ORIGIN` — CORS allowed origin (default: `http://localhost:8080`)
- `PORT` — Flask port (default: `5000`)

Create a `.env` file (optional) with the above keys, or set them in your shell.

## Setup

```bash
cd python-llm-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Run
export FLASK_ENV=development
python app.py
# or
# gunicorn -w 2 -b 0.0.0.0:5000 app:app
```

## Test

```bash
curl -X POST http://localhost:5000/generate \
  -H 'Content-Type: application/json' \
  -d '{"prompt": "Hello!"}'
```