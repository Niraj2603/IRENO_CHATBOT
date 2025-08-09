# IRENO Chatbot System - Complete Architecture Setup

This project implements a scalable chatbot system with Java Spring Boot backend, Python Flask LLM microservice, and React frontend integration.

## 🏗️ Architecture Overview

```
React Frontend (http://localhost:3000)
        ↓ REST API calls with JWT
Java Backend (http://localhost:8080)
    - /api/chat → calls Python LLM microservice
    - /api/history → in-memory chat history
    - /api/assets → calls IRENO API (mock)
    - /api/outages → calls IRENO API (mock)
    - /api/login → JWT authentication
        ↓ HTTP calls
Python Microservice (http://localhost:5000)
    - /generate → Azure OpenAI API integration
        ↓ API calls
Azure OpenAI Service
```

## 🚀 Quick Start Guide

### Prerequisites

1. **Java 17+** installed
2. **Maven 3.6+** installed  
3. **Python 3.9+** installed
4. **Azure OpenAI Service** account and API key

### Step 1: Setup Python LLM Microservice

```bash
# Navigate to Python service directory
cd python-llm-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com"
export AZURE_OPENAI_KEY="your-api-key"
export AZURE_OPENAI_DEPLOYMENT="gpt-4o"

# Run the service
python app.py
```

The Python service will start on `http://localhost:5000`

### Step 2: Setup Java Backend

```bash
# Navigate to Java backend directory
cd backend

# Install dependencies and compile
mvn clean install

# Run the application
mvn spring-boot:run
```

The Java backend will start on `http://localhost:8080`

### Step 3: Test the Integration

1. **Test Python Service:**
```bash
curl -X POST http://localhost:5000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, test the grid status"}'
```

2. **Login to get JWT token:**
```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'
```

3. **Test Chat Endpoint:**
```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"query": "Show me the grid status for Manhattan"}'
```

## 📁 Project Structure

```
/
├── python-llm-service/           # Python Flask microservice
│   ├── app.py                    # Main Flask application
│   ├── requirements.txt          # Python dependencies
│   ├── README.md                 # Python service documentation
│   └── .env.example              # Environment variables template
│
├── backend/                      # Java Spring Boot backend
│   ├── src/main/java/com/cognizant/ireno/
│   │   ├── IrenoAdvisorBackendApplication.java    # Main application
│   │   ├── controller/
│   │   │   ├── IrenoApiController.java             # Main API controller
│   │   │   ├── TestController.java                 # Testing endpoints
│   │   │   └── ChatWebSocketHandler.java           # WebSocket handler
│   │   ├── service/
│   │   │   ├── FlaskQueryService.java              # Python service integration
│   │   │   ├── ChatHistoryService.java             # Chat history management
│   │   │   └── IrenoApiService.java                # IRENO API integration
│   │   ├── dto/                                    # Data transfer objects
│   │   ├── util/
│   │   │   └── JwtUtil.java                        # JWT utilities
│   │   └── config/
│   │       ├── SecurityConfig.java                 # Security configuration
│   │       └── WebSocketConfig.java                # WebSocket configuration
│   ├── src/main/resources/
│   │   └── application.properties                  # Configuration
│   ├── pom.xml                                     # Maven dependencies
│   └── README.md                                   # Java backend documentation
│
└── PROJECT_SETUP.md                                # This file
```

## 🔗 API Endpoints

### Java Backend Endpoints (http://localhost:8080)

#### Authentication
- **POST** `/api/login` - Get JWT token
  - Body: `{"username": "admin", "password": "password"}`
  - Returns: `{"token": "jwt_token", "username": "admin", "message": "Login successful"}`

#### Chat Functionality
- **POST** `/api/chat` - Send chat message (requires JWT)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{"query": "Your question"}`
  - Returns: Chat response with AI-generated answer

- **GET** `/api/history?limit=50` - Get chat history (requires JWT)
  - Headers: `Authorization: Bearer <token>`
  - Returns: List of previous conversations

- **DELETE** `/api/history` - Clear chat history (requires JWT)
  - Headers: `Authorization: Bearer <token>`

#### IRENO Data
- **GET** `/api/assets` - Get grid assets data (requires JWT)
  - Headers: `Authorization: Bearer <token>`
  - Returns: Mock assets data (transformers, lines, etc.)

- **GET** `/api/outages` - Get outages data (requires JWT)
  - Headers: `Authorization: Bearer <token>`
  - Returns: Mock outages data

#### System Endpoints
- **GET** `/api/health` - Health check
- **GET** `/api/status` - System status
- **GET** `/api/test?query=test` - Test Flask integration

### Python Service Endpoints (http://localhost:5000)

- **POST** `/generate` - Generate AI response
  - Body: `{"prompt": "Your prompt"}`
  - Returns: `{"response": "AI response", "processing_time": 1.25}`

- **GET** `/health` - Health check
- **GET** `/info` - Service information

## 🔧 Configuration

### Java Backend Configuration (`backend/src/main/resources/application.properties`)

```properties
# Server Configuration
server.port=8080

# Flask Server Configuration
flask.server.url=http://localhost:5000
flask.server.endpoint=/generate

# JWT Configuration
jwt.secret=ireno-advisor-secret-key-2024-please-change-in-production
jwt.expiration=86400000

# IRENO API Configuration (mock)
ireno.api.base-url=https://api.ireno.example.com
ireno.api.token=mock-ireno-api-token

# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:3000,http://127.0.0.1:3000
```

### Python Service Configuration (Environment Variables)

```bash
# Required
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_KEY=your-api-key

# Optional (with defaults)
AZURE_OPENAI_DEPLOYMENT=gpt-4o
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

## 🔐 Authentication Flow

1. **Frontend** sends login request to `/api/login`
2. **Java Backend** validates credentials (hardcoded: admin/password)
3. **Java Backend** generates JWT token and returns it
4. **Frontend** stores token and includes it in subsequent requests
5. **Java Backend** validates token on protected endpoints

## 📊 Data Flow for Chat

1. **Frontend** → **Java Backend** (`POST /api/chat` with JWT)
2. **Java Backend** → **Python Service** (`POST /generate`)
3. **Python Service** → **Azure OpenAI** (Chat Completions API)
4. **Azure OpenAI** → **Python Service** (AI response)
5. **Python Service** → **Java Backend** (formatted response)
6. **Java Backend** → **Chat History Service** (save conversation)
7. **Java Backend** → **Frontend** (final response)

## 🚨 Error Handling

### Java Backend
- **401 Unauthorized** - Invalid or missing JWT token
- **500 Internal Server Error** - Python service unavailable
- **Graceful degradation** - Fallback responses when services are down

### Python Service
- **400 Bad Request** - Invalid request format
- **500 Internal Server Error** - Azure OpenAI API issues
- **Timeout handling** - 30-second timeout for AI calls

## 🧪 Testing

### Test Python Service
```bash
# Health check
curl http://localhost:5000/health

# Test AI generation
curl -X POST http://localhost:5000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test prompt"}'
```

### Test Java Backend
```bash
# Health check
curl http://localhost:8080/api/health

# Test login
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'

# Test chat (replace TOKEN with actual JWT)
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"query": "Show grid status"}'
```

## 🔄 Frontend Integration

Your React frontend should:

1. **Login flow:**
```javascript
const response = await fetch('http://localhost:8080/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'password' })
});
const { token } = await response.json();
localStorage.setItem('jwt_token', token);
```

2. **Chat requests:**
```javascript
const response = await fetch('http://localhost:8080/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
  },
  body: JSON.stringify({ query: userMessage })
});
const chatResponse = await response.json();
```

## 🚀 Production Deployment

### Python Service
```bash
# Using Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Using Docker
docker build -t ireno-llm-service .
docker run -p 5000:5000 --env-file .env ireno-llm-service
```

### Java Backend
```bash
# Build JAR
mvn clean package

# Run JAR
java -jar target/ireno-advisor-backend-1.0.0.jar

# Using Docker
docker build -t ireno-backend .
docker run -p 8080:8080 ireno-backend
```

## 🔧 Troubleshooting

### Common Issues

1. **Python service not connecting:**
   - Check Azure OpenAI credentials
   - Verify service is running on port 5000
   - Check firewall settings

2. **JWT token errors:**
   - Check token expiration (24 hours default)
   - Verify token format in Authorization header
   - Use correct login credentials (admin/password)

3. **CORS issues:**
   - Verify frontend URL in CORS configuration
   - Check browser console for CORS errors

4. **Build failures:**
   - Ensure Java 17+ is installed
   - Run `mvn clean install` to refresh dependencies
   - Check Maven version (3.6+ required)

## 📈 Next Steps

1. **Database Integration** - Replace in-memory chat history with persistent storage
2. **User Management** - Implement proper user authentication and authorization
3. **Real IRENO API** - Replace mock data with actual IRENO API integration
4. **Monitoring** - Add application monitoring and logging
5. **Rate Limiting** - Implement API rate limiting for production
6. **Caching** - Add Redis for caching frequent queries
7. **Load Balancing** - Deploy multiple instances for high availability

---

**Built with ❤️ for IRENO Grid Management Platform**