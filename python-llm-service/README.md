# IRENO Azure OpenAI LLM Microservice

Python Flask microservice that handles Azure OpenAI integration for the IRENO chatbot system.

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Environment Variables
```bash
export AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
export AZURE_OPENAI_KEY="your-api-key"
export AZURE_OPENAI_DEPLOYMENT="gpt-4o"
export AZURE_OPENAI_API_VERSION="2024-02-15-preview"
```

### 3. Run the Service
```bash
python app.py
```

The service will start on `http://localhost:5000`

## Endpoints

### POST /generate
Generate AI response from user prompt
```bash
curl -X POST http://localhost:5000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Show me grid status for Manhattan"}'
```

**Response:**
```json
{
  "response": "AI generated response...",
  "processing_time": 1.25
}
```

### GET /health
Health check endpoint
```bash
curl http://localhost:5000/health
```

### GET /info
Service information
```bash
curl http://localhost:5000/info
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| AZURE_OPENAI_ENDPOINT | Your Azure OpenAI endpoint URL | Yes |
| AZURE_OPENAI_KEY | Your Azure OpenAI API key | Yes |
| AZURE_OPENAI_DEPLOYMENT | Model deployment name (default: gpt-4o) | No |
| AZURE_OPENAI_API_VERSION | API version (default: 2024-02-15-preview) | No |

## Production Deployment

### Using Gunicorn
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Using Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

## Integration with Java Backend

The Java backend calls this service via:
- **URL:** `http://localhost:5000/generate`
- **Method:** POST
- **Content-Type:** application/json
- **Body:** `{"prompt": "user query"}`

The service returns the AI response that the Java backend forwards to the React frontend.