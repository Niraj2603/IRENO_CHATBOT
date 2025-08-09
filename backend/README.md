# IRENO Advisor Backend

🚀 **Spring Boot backend for IRENO Advisor Chatbot** - AI-driven utility grid management and monitoring platform.

## 🏗️ Architecture

```
React Frontend (WebSocket) ↔ Spring Boot Backend ↔ Flask AI Server (REST)
     :3000                         :8080                  :5000
```

The backend acts as a bridge between your React chat UI and the Python Flask server that handles GPT queries.

## 🔧 Technologies Used

- **Java 17+**
- **Spring Boot 3.2.1**
- **Spring WebSocket** - Real-time communication
- **Spring Web** - REST API endpoints
- **Jackson** - JSON serialization
- **Lombok** - Reduced boilerplate code
- **Maven** - Dependency management

## 📁 Project Structure

```
backend/
├── src/main/java/com/cognizant/ireno/
│   ├── IrenoAdvisorBackendApplication.java    # Main application
│   ├── config/
│   │   └── WebSocketConfig.java               # WebSocket configuration
│   ├── controller/
│   │   ├── ChatWebSocketHandler.java          # WebSocket message handler
│   │   └── TestController.java                # REST endpoints for testing
│   ├── dto/
│   │   ├── ChatMessage.java                   # Chat message DTO
│   │   ├── FlaskRequest.java                  # Flask request DTO
│   │   └── FlaskResponse.java                 # Flask response DTO
│   └── service/
│       └── FlaskQueryService.java             # Flask AI communication
├── src/main/resources/
│   └── application.properties                 # Configuration
├── pom.xml                                    # Maven dependencies
└── README.md                                  # This file
```

## 🚀 Quick Start

### Prerequisites

1. **Java 17 or higher** installed
2. **Maven 3.6+** installed
3. **Flask AI server** running on port 5000 (separate project)
4. **React frontend** running on port 3000

### Installation & Running

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   mvn clean install
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

4. **Verify it's running:**
   ```
   🚀 IRENO Advisor Backend is running!
   📡 WebSocket endpoint: ws://localhost:8080/chat
   🔗 Test endpoint: http://localhost:8080/api/test?query=your_question
   ⚡ Ready to process utility grid queries!
   ```

## 🔗 API Endpoints

### WebSocket Endpoint
- **URL:** `ws://localhost:8080/chat`
- **Protocol:** WebSocket with SockJS fallback
- **Usage:** Real-time chat communication with React frontend

### REST Endpoints

#### 1. Health Check
```bash
GET /api/health
```
**Response:**
```json
{
  "status": "UP",
  "backend": "Spring Boot - Online",
  "flaskServer": "Flask AI Server: Online (http://localhost:5000)",
  "flaskOnline": true,
  "timestamp": "2024-01-15T10:30:00",
  "version": "1.0.0"
}
```

#### 2. Test Flask Query
```bash
GET /api/test?query=Show me critical alerts in Brooklyn
```
**Response:**
```json
{
  "status": "success",
  "query": "Show me critical alerts in Brooklyn",
  "response": "Brooklyn grid status: 3 critical alerts found...",
  "processingTimeMs": 1250,
  "timestamp": "2024-01-15T10:30:00"
}
```

#### 3. System Status
```bash
GET /api/status
```
**Response:**
```json
{
  "application": "IRENO Advisor Backend",
  "version": "1.0.0",
  "springBootVersion": "3.2.1",
  "javaVersion": "17.0.1",
  "endpoints": {
    "websocket": "/chat",
    "health": "/api/health",
    "test": "/api/test?query=your_question"
  }
}
```

## 📡 WebSocket Communication

### Message Format (Frontend → Backend)
```json
{
  "type": "user",
  "message": "What are the current outages in Manhattan?",
  "timestamp": "10:30",
  "sessionId": "session-123"
}
```

### Response Format (Backend → Frontend)
```json
{
  "type": "bot",
  "message": "Manhattan outage status: No major outages currently...",
  "timestamp": "10:31",
  "sessionId": "session-123"
}
```

### Typing Indicator
```json
{
  "type": "typing",
  "isTyping": true
}
```

## ⚙️ Configuration

### Flask Server Settings
```properties
# application.properties
flask.server.url=http://localhost:5000
flask.server.endpoint=/llm-query
flask.server.timeout=30000
```

### CORS Settings
```properties
spring.web.cors.allowed-origins=http://localhost:3000,http://127.0.0.1:3000
```

## 🛠️ Development

### Running in Development Mode
```bash
mvn spring-boot:run -Dspring.profiles.active=development
```

### Building for Production
```bash
mvn clean package
java -jar target/ireno-advisor-backend-1.0.0.jar
```

## 🔍 Testing

### Test Flask Connection
```bash
curl "http://localhost:8080/api/test?query=Hello"
```

### Test WebSocket (using wscat)
```bash
npm install -g wscat
wscat -c ws://localhost:8080/chat
```

## 🚨 Error Handling

The backend includes comprehensive error handling:

- **Connection errors** to Flask server
- **Timeout errors** for long-running queries
- **Invalid message formats**
- **WebSocket connection issues**

Fallback responses are provided when the Flask AI server is unavailable.

## 📊 Monitoring

### Actuator Endpoints
- `/actuator/health` - Application health
- `/actuator/info` - Application information
- `/actuator/metrics` - Application metrics

## 🔧 Troubleshooting

### Common Issues

1. **Flask server not connecting:**
   ```bash
   # Check if Flask is running
   curl http://localhost:5000/health
   ```

2. **WebSocket connection fails:**
   - Verify CORS settings in `application.properties`
   - Check if port 8080 is available

3. **Build failures:**
   ```bash
   # Clean and rebuild
   mvn clean install -DskipTests
   ```

## 🔄 Integration with Other Components

### Frontend Integration
The React frontend connects via WebSocket:
```javascript
const socket = new WebSocket('ws://localhost:8080/chat');
```

### Flask AI Server Integration
Expected Flask endpoint format:
```python
@app.route('/llm-query', methods=['POST'])
def process_query():
    data = request.get_json()
    user_input = data['input']
    # Process with GPT...
    return {'response': ai_response, 'status': 'success'}
```

## 📝 Logs

Logs are configured to show:
- WebSocket connection events
- Flask API calls and responses
- Error details and stack traces
- Performance metrics

## 🚀 Next Steps

1. **Add authentication** (Spring Security)
2. **Add database integration** (chat history)
3. **Add caching** (Redis for common queries)
4. **Add monitoring** (Prometheus/Grafana)
5. **Add rate limiting** (prevent API abuse)

## 👥 Team

Built by **Cognizant Interns** for the IRENO Advisor project.

## 📞 Support

For issues or questions:
1. Check the logs in the console
2. Test individual endpoints using the REST API
3. Verify Flask server connectivity
4. Contact the development team

---

**Happy Coding!** 🎉⚡📊 