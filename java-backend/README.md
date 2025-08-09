# Java Spring Boot Backend

Endpoints (JWT protected unless noted):
- POST `/login` (no auth) → body `{ "username": "test", "password": "password123" }` returns `{ "token": "..." }`
- POST `/chat` → body `{ "query": "..." }` calls Python service and returns `{ "query": "...", "response": "..." }`
- GET `/history` → returns chat history list
- GET `/assets` → returns mock or proxies to IRENO API if configured
- GET `/outages` → returns mock or proxies to IRENO API if configured

## Configuration

Environment variables (optional):
- `PYTHON_SERVICE_URL` (default `http://localhost:5000`)
- `CORS_ALLOWED_ORIGINS` (default `http://localhost:3000`)
- `JWT_SECRET` (default `dev-secret-please-change`)
- `IRENO_API_BASE_URL` and `IRENO_API_TOKEN` for proxying

## Run

```bash
cd java-backend
./mvnw spring-boot:run || mvn spring-boot:run
```

Or build a jar:

```bash
mvn -DskipTests package
java -jar target/chat-backend-0.0.1-SNAPSHOT.jar
```

## Test flow

```bash
# 1) Login
TOKEN=$(curl -s -X POST http://localhost:8080/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"test","password":"password123"}' | jq -r .token)

# 2) Call /chat (Python service must be running on :5000)
curl -s -X POST http://localhost:8080/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"query":"Hello"}' | jq

# 3) History
curl -s http://localhost:8080/history -H "Authorization: Bearer $TOKEN" | jq
```