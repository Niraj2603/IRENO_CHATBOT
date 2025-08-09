#!/bin/bash

echo "🚀 Starting IRENO Chatbot Services..."

# Set colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to wait for service to start
wait_for_service() {
    local port=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}Waiting for $service_name to start on port $port...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if check_port $port; then
            echo -e "${GREEN}✅ $service_name is running on port $port${NC}"
            return 0
        fi
        echo -e "${YELLOW}Attempt $attempt/$max_attempts - waiting...${NC}"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $service_name failed to start within expected time${NC}"
    return 1
}

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

# Check Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java is not installed. Please install Java 17+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Java found: $(java -version 2>&1 | head -n 1)${NC}"

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Maven is not installed. Please install Maven 3.6+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Maven found: $(mvn -version | head -n 1)${NC}"

# Check Python
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo -e "${RED}❌ Python is not installed. Please install Python 3.9+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python found${NC}"

# Check for required environment variables
echo -e "${BLUE}🔑 Checking Azure OpenAI configuration...${NC}"
if [ -z "$AZURE_OPENAI_ENDPOINT" ] || [ -z "$AZURE_OPENAI_KEY" ]; then
    echo -e "${YELLOW}⚠️  Azure OpenAI environment variables not set.${NC}"
    echo -e "${YELLOW}Please set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY${NC}"
    echo ""
    echo "Example:"
    echo "export AZURE_OPENAI_ENDPOINT=\"https://your-resource.openai.azure.com\""
    echo "export AZURE_OPENAI_KEY=\"your-api-key\""
    echo ""
    echo -e "${YELLOW}Continue anyway? (y/n)${NC}"
    read -r response
    if [[ ! $response =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ Azure OpenAI configuration found${NC}"
fi

# Check if ports are already in use
if check_port 5000; then
    echo -e "${YELLOW}⚠️  Port 5000 is already in use. Stopping existing service...${NC}"
    pkill -f "python.*app.py" 2>/dev/null || true
    sleep 2
fi

if check_port 8080; then
    echo -e "${YELLOW}⚠️  Port 8080 is already in use. Stopping existing service...${NC}"
    pkill -f "spring-boot:run" 2>/dev/null || true
    sleep 2
fi

# Start Python LLM service
echo -e "${BLUE}🐍 Starting Python LLM Microservice...${NC}"
cd python-llm-service

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}📦 Creating Python virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo -e "${YELLOW}📦 Installing Python dependencies...${NC}"
source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1

# Start Python service in background
echo -e "${YELLOW}🚀 Starting Python service on port 5000...${NC}"
nohup python app.py > ../python-service.log 2>&1 &
PYTHON_PID=$!
cd ..

# Wait for Python service to start
if wait_for_service 5000 "Python LLM Service"; then
    echo -e "${GREEN}✅ Python LLM Service started successfully (PID: $PYTHON_PID)${NC}"
else
    echo -e "${RED}❌ Failed to start Python service. Check python-service.log for errors.${NC}"
    exit 1
fi

# Start Java backend
echo -e "${BLUE}☕ Starting Java Backend...${NC}"
cd backend

# Build the project
echo -e "${YELLOW}🔨 Building Java project...${NC}"
mvn clean install -q -DskipTests

# Start Java service in background
echo -e "${YELLOW}🚀 Starting Java backend on port 8080...${NC}"
nohup mvn spring-boot:run > ../java-backend.log 2>&1 &
JAVA_PID=$!
cd ..

# Wait for Java service to start
if wait_for_service 8080 "Java Backend"; then
    echo -e "${GREEN}✅ Java Backend started successfully (PID: $JAVA_PID)${NC}"
else
    echo -e "${RED}❌ Failed to start Java backend. Check java-backend.log for errors.${NC}"
    echo -e "${YELLOW}Stopping Python service...${NC}"
    kill $PYTHON_PID 2>/dev/null || true
    exit 1
fi

# Service status
echo ""
echo -e "${GREEN}🎉 All services are running!${NC}"
echo ""
echo -e "${BLUE}📊 Service Status:${NC}"
echo -e "${GREEN}  ✅ Python LLM Service: http://localhost:5000${NC}"
echo -e "${GREEN}  ✅ Java Backend: http://localhost:8080${NC}"
echo ""
echo -e "${BLUE}🔗 Quick Test Commands:${NC}"
echo "  # Test Python service:"
echo "  curl http://localhost:5000/health"
echo ""
echo "  # Test Java backend:"
echo "  curl http://localhost:8080/api/health"
echo ""
echo "  # Login and get JWT token:"
echo "  curl -X POST http://localhost:8080/api/login -H \"Content-Type: application/json\" -d '{\"username\": \"admin\", \"password\": \"password\"}'"
echo ""
echo -e "${BLUE}📝 Logs:${NC}"
echo "  Python service: tail -f python-service.log"
echo "  Java backend: tail -f java-backend.log"
echo ""
echo -e "${BLUE}🛑 To stop services:${NC}"
echo "  ./stop-services.sh"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop monitoring, services will continue running in background${NC}"

# Monitor services
while true; do
    sleep 5
    if ! check_port 5000; then
        echo -e "${RED}❌ Python service stopped unexpectedly${NC}"
        break
    fi
    if ! check_port 8080; then
        echo -e "${RED}❌ Java backend stopped unexpectedly${NC}"
        break
    fi
done